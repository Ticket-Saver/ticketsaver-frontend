export type RGB = [number, number, number]

export interface TSMeshOptions {
  seed?: number
  intensity?: number
  palette?: RGB[]
}

const VERT = `attribute vec2 a_pos; void main(){ gl_Position=vec4(a_pos,0.,1.); }`

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
}`

const hex = (h: string): RGB => {
  const v = parseInt(h.slice(1), 16)
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255]
}

// Default — dark-first: brand.ink dominates, the brightest anchors are
// pulled down to mid-violet so the mesh feels like ambient lighting
// over the dark surface, not a saturated aurora.
export const DARK_VIOLET_PALETTE: RGB[] = [
  hex('#0E0820'), // brand.ink — base
  hex('#1A0F33'), // deep indigo
  hex('#3D2566'), // plum shadow (replaces bright lavender anchor)
  hex('#1A0F33'), // deep indigo again
  hex('#5B3A8C'), // royal violet (mid)
  hex('#3D2566')  // plum (replaces soft mauve anchor)
]

// Vivid — the original redesign mesh. Use it for hero sections,
// auth screens or moments that need drama. Too bright for full-bleed
// dashboards.
export const VIVID_VIOLET_PALETTE: RGB[] = [
  hex('#1A0F33'),
  hex('#3D2566'),
  hex('#B57BE8'),
  hex('#5B3A8C'),
  hex('#8A5BC7'),
  hex('#D4A8F0')
]

// Backward-compatible alias — points to the dark-first default.
export const VIOLET_PALETTE = DARK_VIOLET_PALETTE

export const CHARCOAL_PALETTE: RGB[] = [
  hex('#0A0A0C'),
  hex('#15151A'),
  hex('#3A3A42'),
  hex('#1E1E22'),
  hex('#26262C'),
  hex('#2E2E36')
]

interface Anchor {
  baseX: number
  baseY: number
  ampX: number
  ampY: number
  spdX: number
  spdY: number
  phaseX: number
  phaseY: number
  color: RGB
  radius: number
  x: number
  y: number
}

interface Uniforms {
  res: WebGLUniformLocation | null
  time: WebGLUniformLocation | null
  aspect: WebGLUniformLocation | null
  points: WebGLUniformLocation | null
  colors: WebGLUniformLocation | null
  radii: WebGLUniformLocation | null
}

export class TSMesh {
  private canvas: HTMLCanvasElement
  private seed: number
  private palette: RGB[]
  private intensity: number
  private gl: WebGLRenderingContext | null
  private running = false
  private prog: WebGLProgram | null = null
  private aPos = 0
  private U: Uniforms | null = null
  private anchors: Anchor[] = []
  private t0 = 0
  private raf = 0
  private onResize: () => void
  private ro: ResizeObserver | null = null

  constructor(canvas: HTMLCanvasElement, opts: TSMeshOptions = {}) {
    this.canvas = canvas
    this.seed = opts.seed ?? 0
    this.palette = opts.palette ?? VIOLET_PALETTE
    this.intensity = opts.intensity ?? 1.0
    this.gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: true,
      premultipliedAlpha: false
    })
    this.onResize = this.resize.bind(this)

    if (!this.gl) return
    this.build()
    this.initAnchors()
    this.resize()
    window.addEventListener('resize', this.onResize)
    if (typeof ResizeObserver !== 'undefined') {
      this.ro = new ResizeObserver(() => this.resize())
      this.ro.observe(canvas)
    }
  }

  isSupported(): boolean {
    return this.gl !== null
  }

  setIntensity(v: number): void {
    this.intensity = v
  }

  start(): void {
    if (this.running || !this.gl) return
    this.running = true
    this.t0 = performance.now()
    const loop = () => {
      if (!this.running) return
      this.frame()
      this.raf = requestAnimationFrame(loop)
    }
    loop()
  }

  stop(): void {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  destroy(): void {
    this.stop()
    window.removeEventListener('resize', this.onResize)
    this.ro?.disconnect()
    this.ro = null
  }

  private build(): void {
    const gl = this.gl!
    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      return sh
    }
    const p = gl.createProgram()!
    gl.attachShader(p, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(p)
    this.prog = p

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    )
    this.aPos = gl.getAttribLocation(p, 'a_pos')
    this.U = {
      res: gl.getUniformLocation(p, 'u_res'),
      time: gl.getUniformLocation(p, 'u_time'),
      aspect: gl.getUniformLocation(p, 'u_aspect'),
      points: gl.getUniformLocation(p, 'u_points'),
      colors: gl.getUniformLocation(p, 'u_colors'),
      radii: gl.getUniformLocation(p, 'u_radii')
    }
  }

  private initAnchors(): void {
    const s = this.seed
    const rand = (i: number) => {
      const x = Math.sin((s + 1) * 131.7 + i * 43.21) * 43758.5453
      return x - Math.floor(x)
    }
    const positions: [number, number][] = [
      [0.18, 0.22],
      [0.82, 0.16],
      [0.88, 0.78],
      [0.2, 0.8],
      [0.5, 0.5],
      [0.45, 0.3]
    ]
    const radii = [0.55, 0.5, 0.55, 0.55, 0.7, 0.4]
    this.anchors = []
    for (let i = 0; i < 6; i++) {
      const [bx, by] = positions[i]
      this.anchors.push({
        baseX: bx + (rand(i) - 0.5) * 0.05,
        baseY: by + (rand(i + 9) - 0.5) * 0.05,
        ampX: 0.08 + rand(i + 1) * 0.08,
        ampY: 0.06 + rand(i + 2) * 0.08,
        spdX: 0.03 + rand(i + 3) * 0.05,
        spdY: 0.03 + rand(i + 4) * 0.05,
        phaseX: rand(i + 5) * 6.28,
        phaseY: rand(i + 6) * 6.28,
        color: this.palette[i],
        radius: radii[i],
        x: bx,
        y: by
      })
    }
  }

  private resize(): void {
    if (!this.gl) return
    const c = this.canvas
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.max(1, Math.floor(c.clientWidth * dpr))
    const h = Math.max(1, Math.floor(c.clientHeight * dpr))
    if (c.width !== w || c.height !== h) {
      c.width = w
      c.height = h
    }
    this.gl.viewport(0, 0, w, h)
  }

  private frame(): void {
    const gl = this.gl
    const c = this.canvas
    if (!gl || !this.prog || !this.U || c.width === 0) return

    const t = ((performance.now() - this.t0) / 1000) * this.intensity
    for (const a of this.anchors) {
      a.x = a.baseX + Math.sin(t * a.spdX * 6.283 + a.phaseX) * a.ampX
      a.y = a.baseY + Math.cos(t * a.spdY * 6.283 + a.phaseY) * a.ampY
    }
    const N = 6
    const pts = new Float32Array(N * 2)
    const cols = new Float32Array(N * 3)
    const rads = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      const a = this.anchors[i]
      pts[i * 2] = a.x
      pts[i * 2 + 1] = a.y
      cols[i * 3] = a.color[0]
      cols[i * 3 + 1] = a.color[1]
      cols[i * 3 + 2] = a.color[2]
      rads[i] = a.radius
    }
    gl.useProgram(this.prog)
    gl.enableVertexAttribArray(this.aPos)
    gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0)
    gl.uniform2f(this.U.res, c.width, c.height)
    gl.uniform1f(this.U.time, t)
    gl.uniform1f(this.U.aspect, c.width / c.height)
    gl.uniform2fv(this.U.points, pts)
    gl.uniform3fv(this.U.colors, cols)
    gl.uniform1fv(this.U.radii, rads)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }
}
