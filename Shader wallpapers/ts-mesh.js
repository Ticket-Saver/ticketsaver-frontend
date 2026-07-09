// ts-mesh.js — Reusable violet mesh gradient background (WebGL)
// Usage: new TSMesh(canvasEl, { seed: 0 }).start();

(function(global){
  const VERT = `attribute vec2 a_pos; void main(){ gl_Position=vec4(a_pos,0.,1.); }`;
  const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_aspect;
uniform vec2 u_points[6];
uniform vec3 u_colors[6];
uniform float u_radii[6];
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
void main(){
  vec2 uv = gl_FragCoord.xy/u_res.xy;
  vec2 p = uv; p.x *= u_aspect;
  vec3 col = vec3(0.0); float wsum = 0.0;
  for (int i = 0; i < 6; i++){
    vec2 ap = u_points[i]; ap.x *= u_aspect;
    float d = length(p - ap);
    float w = exp(-pow(d/u_radii[i], 2.0));
    col += u_colors[i] * w;
    wsum += w;
  }
  col /= max(wsum, 0.0001);
  col += (hash(gl_FragCoord.xy + u_time)-0.5)*0.010;
  float vg = smoothstep(1.35, 0.35, length(uv - 0.5));
  col *= mix(0.88, 1.02, vg);
  gl_FragColor = vec4(col, 1.0);
}`;

  function hex(h){
    const v = parseInt(h.slice(1),16);
    return [((v>>16)&255)/255, ((v>>8)&255)/255, (v&255)/255];
  }

  // Violet mesh palette
  const PALETTE_DEFAULT = [
    hex('#1A0F33'), // deep indigo base
    hex('#3D2566'), // plum shadow
    hex('#B57BE8'), // bright lavender
    hex('#5B3A8C'), // royal violet
    hex('#8A5BC7'), // amethyst
    hex('#D4A8F0'), // soft mauve
  ];

  class TSMesh {
    constructor(canvas, opts = {}){
      this.canvas = canvas;
      this.seed = opts.seed || 0;
      this.palette = opts.palette || PALETTE_DEFAULT;
      this.intensity = opts.intensity ?? 1.0;
      this.gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: false });
      this.running = false;
      if (!this.gl) return;
      this._build();
      this._initAnchors();
      this._resize();
      this._onResize = this._resize.bind(this);
      window.addEventListener('resize', this._onResize);
      this._ro = new ResizeObserver(() => this._resize());
      this._ro.observe(canvas);
    }
    _build(){
      const gl = this.gl;
      const compile = (t,s) => { const sh = gl.createShader(t); gl.shaderSource(sh,s); gl.compileShader(sh); return sh; };
      const p = gl.createProgram();
      gl.attachShader(p, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(p);
      this.prog = p;
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
      this.aPos = gl.getAttribLocation(p, 'a_pos');
      this.U = {
        res:    gl.getUniformLocation(p,'u_res'),
        time:   gl.getUniformLocation(p,'u_time'),
        aspect: gl.getUniformLocation(p,'u_aspect'),
        points: gl.getUniformLocation(p,'u_points'),
        colors: gl.getUniformLocation(p,'u_colors'),
        radii:  gl.getUniformLocation(p,'u_radii'),
      };
    }
    _initAnchors(){
      const s = this.seed;
      const rand = (i) => {
        const x = Math.sin((s+1)*131.7 + i*43.21)*43758.5453;
        return x - Math.floor(x);
      };
      // 6 anchors, each with base position + drift
      this.anchors = [];
      const positions = [
        [0.18, 0.22], [0.82, 0.16], [0.88, 0.78],
        [0.20, 0.80], [0.50, 0.50], [0.45, 0.30],
      ];
      const radii = [0.55, 0.50, 0.55, 0.55, 0.70, 0.40];
      for (let i = 0; i < 6; i++){
        const [bx, by] = positions[i];
        this.anchors.push({
          baseX: bx + (rand(i)-0.5)*0.05,
          baseY: by + (rand(i+9)-0.5)*0.05,
          ampX:  0.08 + rand(i+1)*0.08,
          ampY:  0.06 + rand(i+2)*0.08,
          spdX:  0.03 + rand(i+3)*0.05,
          spdY:  0.03 + rand(i+4)*0.05,
          phaseX: rand(i+5)*6.28,
          phaseY: rand(i+6)*6.28,
          color: this.palette[i],
          radius: radii[i],
          x: bx, y: by,
        });
      }
    }
    _resize(){
      const c = this.canvas;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(c.clientWidth  * dpr));
      const h = Math.max(1, Math.floor(c.clientHeight * dpr));
      if (c.width !== w || c.height !== h){
        c.width = w; c.height = h;
      }
      this.gl.viewport(0, 0, w, h);
    }
    setIntensity(v){ this.intensity = v; }
    start(){
      if (this.running) return;
      this.running = true;
      this.t0 = performance.now();
      const loop = () => {
        if (!this.running) return;
        this._frame();
        this._raf = requestAnimationFrame(loop);
      };
      loop();
    }
    stop(){
      this.running = false;
      cancelAnimationFrame(this._raf);
      window.removeEventListener('resize', this._onResize);
      this._ro && this._ro.disconnect();
    }
    _frame(){
      const gl = this.gl, c = this.canvas;
      if (!gl || c.width === 0) return;
      const t = (performance.now() - this.t0) / 1000;
      // update anchors
      for (const a of this.anchors){
        a.x = a.baseX + Math.sin(t * a.spdX * 6.283 + a.phaseX) * a.ampX;
        a.y = a.baseY + Math.cos(t * a.spdY * 6.283 + a.phaseY) * a.ampY;
      }
      const N = 6;
      const pts = new Float32Array(N*2);
      const cols = new Float32Array(N*3);
      const rads = new Float32Array(N);
      for (let i = 0; i < N; i++){
        const a = this.anchors[i];
        pts[i*2] = a.x; pts[i*2+1] = a.y;
        cols[i*3] = a.color[0]; cols[i*3+1] = a.color[1]; cols[i*3+2] = a.color[2];
        rads[i] = a.radius;
      }
      gl.useProgram(this.prog);
      gl.enableVertexAttribArray(this.aPos);
      gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(this.U.res, c.width, c.height);
      gl.uniform1f(this.U.time, t);
      gl.uniform1f(this.U.aspect, c.width / c.height);
      gl.uniform2fv(this.U.points, pts);
      gl.uniform3fv(this.U.colors, cols);
      gl.uniform1fv(this.U.radii, rads);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }

  global.TSMesh = TSMesh;
})(window);
