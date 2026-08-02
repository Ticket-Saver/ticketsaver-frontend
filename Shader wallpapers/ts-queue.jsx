// ts-queue.jsx — Virtual waiting room / queue screens (mobile + desktop)
// States: far | close | next | released

const STATES = {
  far:      { position: 4287, total: 12480, eta: '~14 min', label: 'In line',      color: '#D4A8F0', pct: 0.18 },
  close:    { position:  127, total: 12480, eta: '~2 min',  label: 'Almost there', color: '#FFB1C8', pct: 0.78 },
  next:     { position:    3, total: 12480, eta: '< 30 s',  label: 'You\'re next',  color: '#7DFFB0', pct: 0.97 },
  released: { position:    0, total: 12480, eta: 'Go!',     label: 'You\'re in',   color: '#7DFFB0', pct: 1.0  },
};

// ─────────── Queue visualization: a stream of dots with YOU marker ───────────
function QueueStream({ pct, color, compact }){
  const total = compact ? 28 : 44;
  const youIdx = Math.max(1, Math.min(total - 2, Math.round(pct * total)));
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap: compact ? 5 : 7, padding:'0 4px' }}>
      {Array.from({ length: total }).map((_, i) => {
        const isYou = i === youIdx;
        const dist = Math.abs(i - youIdx);
        const opacity = isYou ? 1 : Math.max(0.18, 0.7 - dist * 0.025);
        const size = isYou ? (compact ? 14 : 18) : (compact ? 5 : 7);
        return (
          <div key={i} style={{
            position:'relative',
            width: size, height: size,
            borderRadius: 99,
            background: isYou ? color : 'rgba(255,255,255,0.5)',
            opacity,
            boxShadow: isYou ? `0 0 14px ${color}, 0 0 28px ${color}88` : 'none',
            transform: isYou ? 'scale(1.0)' : 'none',
            animation: isYou ? 'pulse 1.4s ease-in-out infinite' : 'none',
            flexShrink: 0,
          }}>
            {isYou && <div style={{ position:'absolute', top: compact ? -14 : -18, left:'50%', transform:'translateX(-50%)', fontSize: compact ? 8 : 9, color, fontWeight:700, letterSpacing:'0.18em', whiteSpace:'nowrap' }}>YOU</div>}
          </div>
        );
      })}
    </div>
  );
}

const QUEUE_TIPS = [
  'Don\'t refresh — you\'ll lose your spot.',
  'We hold your spot if your wifi blinks.',
  'Have a payment method ready to be quick at checkout.',
  'You\'ll have 5 minutes to pick seats once you\'re in.',
];

function TipRotator({ small }){
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setI(x => (x + 1) % QUEUE_TIPS.length), 3200);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ fontSize: small ? 12 : 14, color:'rgba(255,255,255,0.78)', lineHeight:1.45, textWrap:'pretty' }}>
      <span style={{ color: small ? '#D4A8F0' : '#D4A8F0', fontWeight:600 }}>Tip ·</span> {QUEUE_TIPS[i]}
    </div>
  );
}

function StatePicker({ state, setState }){
  return (
    <div style={{ display:'flex', gap:4, padding:3, borderRadius:99, background:'rgba(0,0,0,0.5)', border:'0.5px solid rgba(255,255,255,0.14)', backdropFilter:'blur(14px)' }}>
      {Object.keys(STATES).map(k => (
        <div key={k} onClick={() => setState(k)} style={{
          padding:'5px 11px', borderRadius:99,
          background: state === k ? '#fff' : 'transparent',
          color: state === k ? '#1A0F33' : 'rgba(255,255,255,0.7)',
          fontSize:10.5, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer',
        }}>{k}</div>
      ))}
    </div>
  );
}

// ────────────────────────── MOBILE ──────────────────────────
function QueueMobile(){
  const [state, setState] = React.useState('far');
  const s = STATES[state];
  const event = (window.TS_EVENTS && window.TS_EVENTS[0]) || { title:'ARCA · Niteglow', venue:'Niceto Club', date:'Sat · Nov 8 · 22:30', cover:null };
  const showQueueViz = state !== 'released';

  return (
    <div style={{ width:'100%', height:'100%', position:'relative', background:'#0A0418', overflow:'hidden', color:'#fff', fontFamily:'Inter, system-ui' }}>

      {/* Event cover background, heavily blurred */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage: event.cover ? `url(${event.cover})` : 'linear-gradient(135deg, #2A1554, #5B3FA8)',
        backgroundSize:'cover', backgroundPosition:'center',
        filter:'blur(40px) saturate(140%) brightness(0.45)',
        transform:'scale(1.2)',
      }}/>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(10,4,24,0.20) 0%, rgba(10,4,24,0.85) 100%)' }}/>

      {/* Top status bar */}
      <div style={{ position:'relative', padding:'56px 20px 0', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 13px', borderRadius:99, background:'rgba(0,0,0,0.5)', border:'0.5px solid ' + s.color + '55', backdropFilter:'blur(14px)' }}>
          <div style={{ width:7, height:7, borderRadius:99, background:s.color, animation:'pulse 1.2s ease-in-out infinite', boxShadow:`0 0 10px ${s.color}` }}/>
          <div style={{ fontSize:11.5, fontWeight:600, color:s.color, letterSpacing:'0.04em' }}>{s.label}</div>
        </div>
        <div style={{ flex:1 }}/>
        <StatePicker state={state} setState={setState}/>
      </div>

      {/* Event card pill */}
      <div style={{ position:'relative', margin:'14px 20px 0', padding:'10px 12px', display:'flex', alignItems:'center', gap:11, borderRadius:14, background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.10)', backdropFilter:'blur(20px)' }}>
        <div style={{ width:42, height:42, borderRadius:10, backgroundImage: event.cover ? `url(${event.cover})` : 'linear-gradient(135deg, #D4A8F0, #7C5BC4)', backgroundSize:'cover', flexShrink:0 }}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{event.title}</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)', marginTop:1 }}>{event.venue} · {event.date}</div>
        </div>
      </div>

      {/* Big position counter */}
      {state !== 'released' ? (
        <div style={{ position:'relative', padding:'56px 20px 0', textAlign:'center' }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', letterSpacing:'0.20em', textTransform:'uppercase', fontWeight:700 }}>Your place in line</div>
          <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize: state === 'next' ? 180 : 120, fontWeight:700, lineHeight:0.9, letterSpacing:'-0.05em', marginTop:14, color:'#fff', textShadow:`0 0 60px ${s.color}40` }}>
            <span style={{ fontSize:'0.4em', color:'rgba(255,255,255,0.45)', verticalAlign:'top', marginRight:6 }}>#</span>{s.position.toLocaleString()}
          </div>
          <div style={{ marginTop:18, display:'inline-flex', alignItems:'center', gap:10, padding:'10px 16px', borderRadius:99, background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.10)', backdropFilter:'blur(14px)' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/><path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            <div style={{ fontSize:13, fontWeight:600 }}>Est. wait <span style={{ color: s.color }}>{s.eta}</span></div>
          </div>
        </div>
      ) : (
        <div style={{ position:'relative', padding:'80px 20px 0', textAlign:'center' }}>
          <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:120, fontWeight:700, letterSpacing:'-0.04em', lineHeight:0.95, background:`linear-gradient(135deg, #7DFFB0, #D4A8F0)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>You're in.</div>
          <div style={{ fontSize:15, color:'rgba(255,255,255,0.7)', marginTop:14 }}>Redirecting to seat picker…</div>
          <div style={{ marginTop:32, width:80, height:80, margin:'32px auto 0', borderRadius:99, border:'3px solid rgba(125,255,176,0.18)', borderTopColor:'#7DFFB0', animation:'spin 1s linear infinite' }}/>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {/* Queue stream visualization */}
      {showQueueViz && (
        <div style={{ position:'relative', marginTop:48, padding:'0 12px' }}>
          <QueueStream pct={s.pct} color={s.color} compact/>
          <div style={{ marginTop:18, display:'flex', justifyContent:'space-between', padding:'0 12px' }}>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', letterSpacing:'0.16em', textTransform:'uppercase', fontWeight:700 }}>Door</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', letterSpacing:'0.16em', textTransform:'uppercase', fontWeight:700 }}>{s.total.toLocaleString()} in line</div>
          </div>
        </div>
      )}

      {/* Tips card */}
      {state !== 'released' && (
        <div style={{ position:'absolute', left:16, right:16, bottom:24, padding:'14px 16px', borderRadius:16, background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.10)', backdropFilter:'blur(20px) saturate(160%)' }}>
          <TipRotator small/>
        </div>
      )}

      {state === 'next' && (
        <div style={{ position:'absolute', left:16, right:16, bottom:96, padding:'18px', borderRadius:16, background:'linear-gradient(135deg, rgba(125,255,176,0.15), rgba(212,168,240,0.10))', border:'0.5px solid rgba(125,255,176,0.35)', textAlign:'center' }}>
          <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:15, fontWeight:600 }}>Get ready ✨</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.65)', marginTop:4 }}>Door opens in seconds — payment method ready?</div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────── DESKTOP ──────────────────────────
function QueueDesktop({ onNav }){
  const [state, setState] = React.useState('far');
  const s = STATES[state];
  const event = (window.TS_EVENTS && window.TS_EVENTS[0]) || { title:'ARCA · Niteglow', venue:'Niceto Club, Buenos Aires', date:'Saturday, November 8 · 22:30', cover:null };

  return (
    <div style={{ width:'100%', height:'100%', minHeight:900, position:'relative', background:'#0A0418', overflow:'hidden', color:'#fff', fontFamily:'Inter, system-ui' }}>
      {/* Event cover background */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage: event.cover ? `url(${event.cover})` : 'linear-gradient(135deg, #2A1554, #5B3FA8)',
        backgroundSize:'cover', backgroundPosition:'center',
        filter:'blur(60px) saturate(140%) brightness(0.4)',
        transform:'scale(1.15)',
      }}/>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(10,4,24,0.30) 0%, rgba(10,4,24,0.92) 100%)' }}/>

      {/* Minimal top bar — no full chrome during a queue */}
      <div style={{ position:'relative', height:72, padding:'0 56px', display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:26, height:26, borderRadius:7, background:'linear-gradient(135deg,#D4A8F0,#7C5BC4)' }}/>
          <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:15, fontWeight:600 }}>ticketsaver</div>
        </div>
        <div style={{ flex:1 }}/>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', borderRadius:99, background:'rgba(0,0,0,0.5)', border:'0.5px solid ' + s.color + '55', backdropFilter:'blur(14px)' }}>
          <div style={{ width:8, height:8, borderRadius:99, background:s.color, animation:'pulse 1.2s ease-in-out infinite', boxShadow:`0 0 12px ${s.color}` }}/>
          <div style={{ fontSize:13, fontWeight:600, color:s.color }}>{s.label}</div>
        </div>
        <StatePicker state={state} setState={setState}/>
      </div>

      {/* Main split: left event card, right queue */}
      <div style={{ position:'relative', padding:'40px 56px 56px', display:'grid', gridTemplateColumns:'440px 1fr', gap:48, alignItems:'start' }}>

        {/* Left — event preview */}
        <div style={{ borderRadius:24, overflow:'hidden', background:'rgba(255,255,255,0.05)', border:'0.5px solid rgba(255,255,255,0.10)', backdropFilter:'blur(20px) saturate(160%)' }}>
          <div style={{ height:300, backgroundImage: event.cover ? `url(${event.cover})` : 'linear-gradient(135deg, #FFB1C8 0%, #7C5BC4 50%, #2A1554 100%)', backgroundSize:'cover', backgroundPosition:'center' }}/>
          <div style={{ padding:'24px 26px 26px' }}>
            <div style={{ fontSize:10.5, color:'#D4A8F0', fontWeight:700, letterSpacing:'0.20em', textTransform:'uppercase' }}>You're queuing for</div>
            <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:30, fontWeight:600, letterSpacing:'-0.02em', marginTop:8, lineHeight:1.1 }}>{event.title}</div>
            <div style={{ fontSize:13.5, color:'rgba(255,255,255,0.65)', marginTop:8 }}>{event.venue}</div>
            <div style={{ fontSize:13.5, color:'rgba(255,255,255,0.65)', marginTop:2 }}>{event.date}</div>

            <div style={{ marginTop:20, padding:14, borderRadius:14, background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.10)' }}>
              <TipRotator/>
            </div>
          </div>
        </div>

        {/* Right — queue */}
        {state !== 'released' ? (
          <div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', letterSpacing:'0.20em', textTransform:'uppercase', fontWeight:700 }}>Your place in line</div>
            <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize: state === 'next' ? 320 : 220, fontWeight:700, lineHeight:0.85, letterSpacing:'-0.055em', marginTop:18, textShadow:`0 0 80px ${s.color}30` }}>
              <span style={{ fontSize:'0.35em', color:'rgba(255,255,255,0.4)', verticalAlign:'top', marginRight:14 }}>#</span>{s.position.toLocaleString()}
            </div>
            <div style={{ marginTop:24, display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:12, padding:'13px 22px', borderRadius:99, background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.10)', backdropFilter:'blur(14px)' }}>
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/><path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                <div style={{ fontSize:15, fontWeight:600 }}>Est. wait <span style={{ color:s.color }}>{s.eta}</span></div>
              </div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'13px 22px', borderRadius:99, background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.10)', backdropFilter:'blur(14px)' }}>
                <div style={{ width:8, height:8, borderRadius:99, background:'#fff', opacity:0.6 }}/>
                <div style={{ fontSize:15, fontWeight:600, color:'rgba(255,255,255,0.85)' }}>{s.total.toLocaleString()} in queue</div>
              </div>
            </div>

            {/* Big stream viz */}
            <div style={{ marginTop:60 }}>
              <QueueStream pct={s.pct} color={s.color}/>
              <div style={{ marginTop:24, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:24, height:24, borderRadius:8, background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.10)', display:'grid', placeItems:'center' }}>
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M3 6l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                  </div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', letterSpacing:'0.16em', textTransform:'uppercase', fontWeight:700 }}>Door (here)</div>
                </div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', letterSpacing:'0.16em', textTransform:'uppercase', fontWeight:700 }}>Back of queue →</div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ marginTop:40, padding:20, borderRadius:16, background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.10)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10 }}>
                <div style={{ fontSize:12, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)', fontWeight:700 }}>Queue progress</div>
                <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:17, fontWeight:600 }}>{Math.round(s.pct * 100)}%</div>
              </div>
              <div style={{ height:6, borderRadius:99, background:'rgba(255,255,255,0.08)', overflow:'hidden' }}>
                <div style={{ width:`${s.pct * 100}%`, height:'100%', background:`linear-gradient(90deg, #7C5BC4, ${s.color})`, transition:'width 0.6s' }}/>
              </div>
            </div>

            {state === 'next' && (
              <div style={{ marginTop:24, padding:'20px 24px', borderRadius:16, background:'linear-gradient(135deg, rgba(125,255,176,0.18), rgba(212,168,240,0.10))', border:'0.5px solid rgba(125,255,176,0.35)', display:'flex', alignItems:'center', gap:18 }}>
                <div style={{ fontSize:32 }}>✨</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:20, fontWeight:600 }}>Get ready — door opens in seconds</div>
                  <div style={{ fontSize:13.5, color:'rgba(255,255,255,0.7)', marginTop:4 }}>You'll have 5 minutes to pick seats once you're inside.</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:600, textAlign:'center' }}>
            <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:200, fontWeight:700, letterSpacing:'-0.045em', lineHeight:0.95, background:`linear-gradient(135deg, #7DFFB0, #D4A8F0)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>You're in.</div>
            <div style={{ fontSize:20, color:'rgba(255,255,255,0.72)', marginTop:24 }}>Redirecting to seat picker…</div>
            <div style={{ marginTop:48, width:100, height:100, borderRadius:99, border:'4px solid rgba(125,255,176,0.18)', borderTopColor:'#7DFFB0', animation:'spin 1s linear infinite' }}/>
            <div onClick={() => onNav && onNav('seats')} style={{ marginTop:40, padding:'16px 28px', borderRadius:99, background:'#fff', color:'#1A0F33', fontFamily:'"Space Grotesk", system-ui', fontSize:14, fontWeight:600, cursor:'pointer' }}>Skip to seat picker →</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { QueueMobile, QueueDesktop });
