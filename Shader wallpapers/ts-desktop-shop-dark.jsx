// ts-desktop-shop.jsx — Cinematic Disney+/A24 desktop screens for purchase + ticket flow

const D = { bg: '#0A0A0C', purple: { hi:'#D4A8F0', mid:'#525258', lo:'#3D3D43' } };

function DesktopChrome({ active, onNav, cartCount = 2, children }){
  const tabs = [
    ['home','Home'],
    ['events','Events'],
    ['about','About'],
    ['faqs','FAQs'],
  ];
  return (
    <div style={{ position:'relative', width:'100%', height:'100%', overflow:'hidden', background:D.bg, color:'#fff', fontFamily:'Inter, system-ui' }}>
      <MeshBg seed={0}/>
      {/* Top nav */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, zIndex:20,
        padding:'22px 56px',
        display:'flex', alignItems:'center', gap:32,
        background:'linear-gradient(180deg, rgba(10,10,12,0.7), transparent)',
      }}>
        <div onClick={() => onNav('home')} style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
          <div style={{ width:34, height:34, borderRadius:9, background:`linear-gradient(135deg, ${D.purple.hi}, ${D.purple.mid})`, display:'grid', placeItems:'center', boxShadow:`0 4px 14px ${D.purple.mid}80` }}>
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M3 4 L7 2 L11 4 L11 10 L7 12 L3 10 Z" stroke="#0F0F12" strokeWidth="1.6" strokeLinejoin="round"/>
              <circle cx="7" cy="7" r="1.5" fill="#0F0F12"/>
            </svg>
          </div>
          <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:18, fontWeight:600, letterSpacing:'-0.02em' }}>ticketsaver</div>
        </div>
        <div style={{ flex:1, display:'flex', gap:6, marginLeft:24 }}>
          {tabs.map(([id, label]) => (
            <div key={id} onClick={() => onNav(id === 'home' ? 'home' : id)} style={{
              padding:'8px 14px', borderRadius:99,
              background: id === active ? 'rgba(255,255,255,0.10)' : 'transparent',
              color: id === active ? '#fff' : 'rgba(255,255,255,0.65)',
              fontSize:13, fontWeight:500, cursor:'pointer',
            }}>{label}</div>
          ))}
        </div>
        {/* Search bar */}
        <div style={{
          width:260, padding:'9px 14px', borderRadius:99,
          background:'rgba(255,255,255,0.06)',
          border:'0.5px solid rgba(255,255,255,0.10)',
          display:'flex', alignItems:'center', gap:10,
          color:'rgba(255,255,255,0.5)',
          backdropFilter:'blur(14px)',
        }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6"/><path d="m11 11 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          <div style={{ fontSize:12.5 }}>Search artists, venues…</div>
          <div style={{ marginLeft:'auto', padding:'1px 6px', borderRadius:5, background:'rgba(255,255,255,0.08)', fontSize:10, color:'rgba(255,255,255,0.5)' }}>⌘K</div>
        </div>
        <div onClick={() => onNav('cart')} style={{ position:'relative', cursor:'pointer' }}>
          <div style={{ width:40, height:40, borderRadius:12, background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.10)', display:'grid', placeItems:'center' }}>
            <CartIcon/>
          </div>
          {cartCount > 0 && (
            <div style={{ position:'absolute', top:-3, right:-3, minWidth:18, height:18, padding:'0 5px', borderRadius:10, background:'linear-gradient(135deg,#FF5E9E,#9090A0)', color:'#fff', fontSize:10, fontWeight:700, display:'grid', placeItems:'center', border:'2px solid #0A0A0C' }}>{cartCount}</div>
          )}
        </div>
        <div onClick={() => onNav('mytickets')} style={{ width:40, height:40, borderRadius:99, background:`linear-gradient(135deg, ${D.purple.hi}, ${D.purple.mid})`, display:'grid', placeItems:'center', fontFamily:'"Space Grotesk", system-ui', fontWeight:700, fontSize:13, cursor:'pointer', border:'1px solid rgba(255,255,255,0.2)' }}>DP</div>
      </div>
      <div style={{ position:'absolute', inset:0, zIndex:2, overflowY:'auto' }}>
        {children}
      </div>
    </div>
  );
}

/* ─────── 1. HOME — cinematic ─────── */
function DesktopHome({ onNav }){
  const evs = window.TS_EVENTS;
  const hero = evs.filter(e => e.hero)[0];
  const [active, setActive] = React.useState(0);
  const heroSet = evs.filter(e => e.hero);
  const cur = heroSet[active];

  return (
    <DesktopChrome active="home" onNav={onNav}>
      {/* HERO full-bleed */}
      <div style={{ position:'relative', height:720, overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0 }}><TSCover event={cur} height={720} big/></div>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg, rgba(10,10,12,0.85) 0%, rgba(10,10,12,0.4) 40%, transparent 70%)' }}/>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(0deg, rgba(10,10,12,0.95) 0%, transparent 50%)' }}/>
        <div style={{ position:'absolute', left:56, right:56, bottom:80, maxWidth:680 }}>
          <div style={{ fontSize:11.5, letterSpacing:'0.20em', color:D.purple.hi, fontWeight:700, textTransform:'uppercase' }}>Featured · {cur.category}</div>
          <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:84, fontWeight:700, letterSpacing:'-0.035em', lineHeight:0.95, marginTop:16, textWrap:'pretty' }}>{cur.title}</div>
          <div style={{ fontSize:18, color:'rgba(255,255,255,0.78)', marginTop:14, maxWidth:560 }}>{cur.artist} · {cur.venue} · {cur.city}</div>
          <div style={{ marginTop:32, display:'flex', alignItems:'center', gap:14 }}>
            <button onClick={() => onNav('event')} style={{ appearance:'none', border:0, cursor:'pointer', padding:'15px 28px', borderRadius:99, background:'#fff', color:'#141416', fontFamily:'"Space Grotesk", system-ui', fontSize:15, fontWeight:600, boxShadow:'0 12px 30px rgba(255,255,255,0.15)' }}>Get tickets · From ${cur.priceFrom}</button>
            <button style={{ appearance:'none', cursor:'pointer', padding:'14px 22px', borderRadius:99, background:'rgba(255,255,255,0.10)', border:'0.5px solid rgba(255,255,255,0.18)', color:'#fff', fontSize:14, fontWeight:500 }}>+ My list</button>
            <div style={{ marginLeft:14, display:'flex', alignItems:'center', gap:8, color:'rgba(255,255,255,0.55)', fontSize:12.5 }}>
              <ClockIcon/> Doors 8pm · 21+
            </div>
          </div>
        </div>
        {/* hero dots */}
        <div style={{ position:'absolute', right:56, bottom:80, display:'flex', flexDirection:'column', gap:10 }}>
          {heroSet.map((_, i) => (
            <div key={i} onClick={() => setActive(i)} style={{ width:i===active?28:8, height:3, borderRadius:99, background: i===active?'#fff':'rgba(255,255,255,0.3)', cursor:'pointer', transition:'all 0.3s' }}/>
          ))}
        </div>
      </div>

      {/* Section rows */}
      <DesktopRow title="Trending tonight" events={[evs[1], evs[5], evs[7], evs[4], evs[0]]} onPick={() => onNav('event')}/>
      <DesktopRow title="This week in Brooklyn" events={[evs[0], evs[2], evs[3], evs[6]]} onPick={() => onNav('event')}/>
      <DesktopRow title="Electronic" events={evs.filter(e => e.category === 'Electronic').concat([evs[0]])} variant="poster" onPick={() => onNav('event')}/>

      <div style={{ padding:'40px 56px 80px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:18 }}>
        {[
          ['Face value, always','No dynamic pricing. The price you see is the price artists asked for.'],
          ['Tickets are yours','Every ticket lives as an NFT in your wallet. Yours forever.'],
          ['No scalpers','Resale capped at face value. Built so fans win.'],
        ].map(([t, b]) => (
          <div key={t} style={{ padding:24, borderRadius:18, background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.10)', backdropFilter:'blur(14px) saturate(160%)' }}>
            <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:19, fontWeight:600, letterSpacing:'-0.02em' }}>{t}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.65)', marginTop:8, lineHeight:1.5 }}>{b}</div>
          </div>
        ))}
      </div>

      <DesktopFooter onNav={onNav}/>
    </DesktopChrome>
  );
}

function DesktopRow({ title, events, variant = 'wide', onPick }){
  return (
    <div style={{ padding:'42px 56px 4px' }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:18 }}>
        <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:24, fontWeight:600, letterSpacing:'-0.025em' }}>{title}</div>
        <div style={{ fontSize:12.5, color:'rgba(255,255,255,0.55)', cursor:'pointer' }}>See all →</div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns: variant === 'poster' ? 'repeat(5, 1fr)' : 'repeat(4, 1fr)', gap:16 }}>
        {events.slice(0, variant === 'poster' ? 5 : 4).map(e => (
          <div key={e.id} onClick={onPick} style={{ cursor:'pointer' }}>
            <div style={{ position:'relative', height: variant === 'poster' ? 340 : 240, borderRadius:14, overflow:'hidden', border:'0.5px solid rgba(255,255,255,0.10)' }}>
              <TSCover event={e} height={variant === 'poster' ? 340 : 240}/>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.85))' }}/>
              <div style={{ position:'absolute', left:14, right:14, bottom:12 }}>
                <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:16, fontWeight:600, letterSpacing:'-0.015em', textWrap:'pretty' }}>{e.title}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.7)', marginTop:3 }}>{e.month.toUpperCase()} {e.date} · {e.venue}</div>
              </div>
              <div style={{ position:'absolute', top:10, right:10, padding:'4px 9px', borderRadius:99, background:'rgba(0,0,0,0.55)', border:'0.5px solid rgba(255,255,255,0.18)', fontSize:10.5, fontWeight:600, backdropFilter:'blur(10px)' }}>From ${e.priceFrom}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────── 2. EVENT DETAIL — cinematic ─────── */
function DesktopEventDetail({ onNav }){
  const ev = window.TS_EVENTS.find(e => e.id === 'mitski-laurel') || window.TS_EVENTS[1];
  const dates = [
    { city:'Brooklyn',  venue:'Brooklyn Steel',     date:'Jun 6',  day:'Fri', price:79,  status:'few-left' },
    { city:'Brooklyn',  venue:'Brooklyn Steel',     date:'Jun 7',  day:'Sat', price:89,  status:'selling-fast' },
    { city:'Manhattan', venue:'Webster Hall',       date:'Jun 12', day:'Thu', price:75,  status:'on-sale' },
    { city:'Queens',    venue:'Knockdown Center',   date:'Jun 14', day:'Sat', price:69,  status:'on-sale' },
  ];
  const [sel, setSel] = React.useState(0);
  const cur = dates[sel];

  return (
    <DesktopChrome active="events" onNav={onNav}>
      {/* Hero banner */}
      <div style={{ position:'relative', height:560, overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0 }}><TSCover event={ev} height={560} big/></div>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(10,10,12,0.6) 0%, rgba(10,10,12,0.2) 40%, rgba(10,10,12,0.98) 100%)' }}/>
        <div style={{ position:'absolute', left:56, right:56, bottom:60, display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
          <div style={{ maxWidth:760 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
              <div style={{ padding:'5px 12px', borderRadius:99, background:'rgba(255,255,255,0.10)', border:'0.5px solid rgba(255,255,255,0.18)', fontSize:10.5, fontWeight:700, letterSpacing:'0.14em' }}>4 DATES · 3 CITIES</div>
              <div style={{ padding:'5px 12px', borderRadius:99, background:'rgba(212,168,240,0.18)', border:'0.5px solid rgba(212,168,240,0.30)', fontSize:10.5, color:'#E5E5EA', fontWeight:700, letterSpacing:'0.14em' }}>EAST COAST TOUR</div>
            </div>
            <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:96, fontWeight:700, letterSpacing:'-0.04em', lineHeight:0.92, textWrap:'pretty' }}>{ev.title}</div>
            <div style={{ marginTop:16, display:'flex', alignItems:'center', gap:14, fontSize:15, color:'rgba(255,255,255,0.78)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:32, height:32, borderRadius:99, background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.2)', display:'grid', placeItems:'center', fontFamily:'"Space Grotesk", system-ui', fontWeight:700, fontSize:13 }}>{ev.artist[0]}</div>
                {ev.artist}
              </div>
              <div style={{ width:3, height:3, borderRadius:99, background:'rgba(255,255,255,0.3)' }}/>
              <div>84K following</div>
              <div style={{ marginLeft:14, padding:'7px 14px', borderRadius:99, background:'rgba(255,255,255,0.10)', border:'0.5px solid rgba(255,255,255,0.18)', fontSize:12, fontWeight:500, cursor:'pointer' }}>+ Follow</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main split */}
      <div style={{ padding:'40px 56px 80px', display:'grid', gridTemplateColumns:'1fr 380px', gap:48 }}>
        {/* Left content */}
        <div>
          {/* Dates */}
          <div style={{ marginBottom:36 }}>
            <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:22, fontWeight:600, letterSpacing:'-0.025em', marginBottom:14 }}>Select date</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10 }}>
              {dates.map((d, i) => (
                <div key={i} onClick={() => setSel(i)} style={{
                  padding:'16px 14px', borderRadius:14, cursor:'pointer',
                  background: i === sel ? 'rgba(212,168,240,0.18)' : 'rgba(255,255,255,0.04)',
                  border: '0.5px solid ' + (i === sel ? 'rgba(212,168,240,0.40)' : 'rgba(255,255,255,0.10)'),
                  transition:'all 0.2s',
                }}>
                  <div style={{ fontSize:10.5, color:i===sel?'#E5E5EA':'rgba(255,255,255,0.55)', fontWeight:700, letterSpacing:'0.10em' }}>{d.day.toUpperCase()} · JUN</div>
                  <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:30, fontWeight:700, letterSpacing:'-0.025em', marginTop:6 }}>{d.date.split(' ')[1]}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.75)', marginTop:8, fontWeight:500 }}>{d.venue}</div>
                  <div style={{ fontSize:10.5, color:'rgba(255,255,255,0.5)', marginTop:1 }}>{d.city}</div>
                  <div style={{ marginTop:10, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ fontSize:11, fontWeight:600 }}>From ${d.price}</div>
                    <div style={{ width:6, height:6, borderRadius:99, background: d.status==='few-left'?'#FF5E9E': d.status==='selling-fast'?'#FFB84D':'#42E29B' }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div style={{ marginBottom:36 }}>
            <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:22, fontWeight:600, letterSpacing:'-0.025em', marginBottom:12 }}>About the show</div>
            <div style={{ fontSize:14.5, color:'rgba(255,255,255,0.78)', lineHeight:1.65, maxWidth:680, textWrap:'pretty' }}>
              Mitski returns to the East Coast with her most ambitious staging yet — a four-night residency moving across Brooklyn, Manhattan and Queens. Each night opens with a new orchestration of "Laurel Hell," followed by selections from the latest album and a finale that's never the same twice. Expect: lights, smoke, drums you feel in your chest, and a quiet moment near the end where she sits at the edge of the stage and just talks for a while.
            </div>
          </div>

          {/* Gallery */}
          <div style={{ marginBottom:36 }}>
            <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:22, fontWeight:600, letterSpacing:'-0.025em', marginBottom:14 }}>Gallery</div>
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gridTemplateRows:'repeat(2, 180px)', gap:10 }}>
              <div style={{ gridRow:'span 2', position:'relative', borderRadius:14, overflow:'hidden', background:`linear-gradient(135deg, ${D.purple.lo}, #141416)` }}>
                <div style={{ position:'absolute', inset:0, opacity:0.6 }}><TSCover event={ev} height={370}/></div>
                <div style={{ position:'absolute', inset:0, display:'grid', placeItems:'center' }}>
                  <div style={{ width:60, height:60, borderRadius:99, background:'rgba(255,255,255,0.95)', display:'grid', placeItems:'center' }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="#141416"><path d="M6 4l10 6-10 6V4Z"/></svg>
                  </div>
                </div>
                <div style={{ position:'absolute', bottom:14, left:14, fontSize:11.5, color:'#fff', fontWeight:600 }}>Live · Brooklyn Steel · 2024</div>
              </div>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ borderRadius:14, background:`linear-gradient(${i*60}deg, ${D.purple.hi}40, ${D.purple.lo})`, position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', inset:0, background: `radial-gradient(circle at ${i*23}% ${i*15}%, rgba(255,177,200,0.5), transparent 60%)` }}/>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:22, fontWeight:600, letterSpacing:'-0.025em', marginBottom:14 }}>Location · {cur.venue}</div>
            <div style={{ position:'relative', height:300, borderRadius:18, overflow:'hidden', border:'0.5px solid rgba(255,255,255,0.12)' }}>
              <iframe
                title="map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(cur.venue + ', ' + cur.city)}&output=embed&z=14`}
                style={{ width:'100%', height:'100%', border:0, filter:'invert(0.92) hue-rotate(180deg) saturate(0.4)' }}
              />
              <div style={{ position:'absolute', top:14, left:14, padding:'8px 12px', borderRadius:12, background:'rgba(10,10,12,0.85)', border:'0.5px solid rgba(255,255,255,0.12)', backdropFilter:'blur(14px)' }}>
                <div style={{ fontSize:12, fontWeight:600 }}>{cur.venue}</div>
                <div style={{ fontSize:10.5, color:'rgba(255,255,255,0.55)', marginTop:2 }}>{cur.city}</div>
              </div>
            </div>
            <div style={{ marginTop:16, display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10 }}>
              {[['Doors','7:00 pm'],['Show','8:30 pm'],['Age','18+'],['Bag','No bags']].map(([l, v]) => (
                <div key={l} style={{ padding:'12px 14px', borderRadius:12, background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.10)' }}>
                  <div style={{ fontSize:10, letterSpacing:'0.14em', color:'rgba(255,255,255,0.5)', fontWeight:600, textTransform:'uppercase' }}>{l}</div>
                  <div style={{ fontSize:13, fontWeight:600, marginTop:4 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sticky card */}
        <div>
          <div style={{
            position:'sticky', top:90,
            padding:24, borderRadius:20,
            background:'rgba(255,255,255,0.04)',
            border:'0.5px solid rgba(255,255,255,0.12)',
            backdropFilter:'blur(18px) saturate(160%)',
          }}>
            <div style={{ fontSize:10.5, letterSpacing:'0.18em', textTransform:'uppercase', color:D.purple.hi, fontWeight:700 }}>Your selection</div>
            <div style={{ marginTop:10, fontFamily:'"Space Grotesk", system-ui', fontSize:26, fontWeight:700, letterSpacing:'-0.025em' }}>{cur.day}, {cur.date}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', marginTop:6 }}>{cur.venue} · {cur.city}</div>
            <div style={{ marginTop:18, padding:'12px 14px', borderRadius:12, background:'rgba(0,0,0,0.30)', border:'0.5px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontSize:11.5, color:'rgba(255,255,255,0.65)' }}>Starting from</div>
              <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:24, fontWeight:700 }}>${cur.price}</div>
            </div>
            <button onClick={() => onNav('section')} style={{ marginTop:18, width:'100%', appearance:'none', border:0, cursor:'pointer', padding:'15px', borderRadius:14, background:'#fff', color:'#141416', fontFamily:'"Space Grotesk", system-ui', fontSize:14, fontWeight:600 }}>Choose seats →</button>
            <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:6, fontSize:11, color:'rgba(255,255,255,0.5)' }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1l1.5 3 3.3.4-2.4 2.3.6 3.3L6 8.5 3 10l.6-3.3L1.2 4.4l3.3-.4L6 1Z" stroke="currentColor" strokeWidth="1.2"/></svg>
              Your ticket comes as an NFT on Base
            </div>
          </div>
        </div>
      </div>

      <DesktopFooter onNav={onNav}/>
    </DesktopChrome>
  );
}

/* ─────── 3. SECTION SELECT — cinematic ─────── */
function DesktopSectionSelect({ onNav }){
  const [hover, setHover] = React.useState(null);
  const tiers = [
    { id:'premium', name:'Premium', color:'#FFC857', range:'150-220', from:150 },
    { id:'orch',    name:'Orchestra', color:'#FF5E9E', range:'95-130',  from:95  },
    { id:'mezz',    name:'Mezzanine', color:'#FFA15C', range:'65-85',   from:65  },
    { id:'balc',    name:'Balcony', color:'#5BB8FF', range:'40-55',     from:40  },
  ];
  const sections = [
    { id:'101', tier:0, label:'101' }, { id:'102', tier:0, label:'102' }, { id:'103', tier:0, label:'103' },
    { id:'104', tier:1, label:'104' }, { id:'105', tier:1, label:'105' }, { id:'106', tier:1, label:'106' },
    { id:'201', tier:2, label:'201' }, { id:'202', tier:2, label:'202' }, { id:'203', tier:2, label:'203' }, { id:'204', tier:2, label:'204' },
    { id:'301', tier:3, label:'301' }, { id:'302', tier:3, label:'302' }, { id:'303', tier:3, label:'303' }, { id:'304', tier:3, label:'304' },
  ];

  return (
    <DesktopChrome active="events" onNav={onNav}>
      <div style={{ padding:'120px 56px 60px', display:'grid', gridTemplateColumns:'1fr 360px', gap:48 }}>
        {/* Left — venue map */}
        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
            <div>
              <div style={{ fontSize:11, color:D.purple.hi, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase' }}>Step 1 of 2</div>
              <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:42, fontWeight:700, letterSpacing:'-0.03em', marginTop:6 }}>Select a section</div>
              <div style={{ fontSize:14, color:'rgba(255,255,255,0.6)', marginTop:8 }}>Brooklyn Steel · Sat, Jun 7 · 8:30 pm</div>
            </div>
            <DesktopTimer/>
          </div>

          {/* Venue SVG */}
          <div style={{ position:'relative', height:560, borderRadius:24, overflow:'hidden', background:'radial-gradient(ellipse at top, rgba(212,168,240,0.10), rgba(10,10,12,0.6))', border:'0.5px solid rgba(255,255,255,0.10)' }}>
            <div style={{ position:'absolute', top:24, left:'50%', transform:'translateX(-50%)', width:280, height:24, background:'linear-gradient(180deg, rgba(255,255,255,0.18), transparent)', borderRadius:'140px 140px 0 0', display:'grid', placeItems:'center', color:'rgba(255,255,255,0.85)', fontSize:11, fontWeight:700, letterSpacing:'0.30em' }}>STAGE</div>

            <svg viewBox="0 0 900 540" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
              {/* concentric arcs of sections */}
              {sections.map((s, i) => {
                const tier = tiers[s.tier];
                const ringRow = Math.floor(i / 6);
                const inRow = i % 6;
                const cols = s.tier === 2 ? 4 : s.tier === 3 ? 4 : 3;
                const y = 100 + s.tier * 100;
                const totalCols = s.tier === 2 || s.tier === 3 ? 4 : 3;
                const cIdx = sections.filter(x => x.tier === s.tier).indexOf(s);
                const x = 450 + (cIdx - (totalCols - 1) / 2) * 180;
                const isHover = hover === s.id;
                return (
                  <g key={s.id} onMouseEnter={() => setHover(s.id)} onMouseLeave={() => setHover(null)} onClick={() => onNav('seats')} style={{ cursor:'pointer' }}>
                    <rect x={x-75} y={y} width={150} height={70} rx={12}
                      fill={tier.color} opacity={isHover ? 1 : 0.55}
                      stroke="rgba(255,255,255,0.3)" strokeWidth={isHover ? 2 : 0.5}
                    />
                    <text x={x} y={y+30} fill="#141416" fontSize="14" fontWeight="700" textAnchor="middle" fontFamily='"Space Grotesk"'>SEC {s.label}</text>
                    <text x={x} y={y+50} fill="#141416" fontSize="11" fontWeight="600" textAnchor="middle" opacity={0.7}>{tier.name}</text>
                  </g>
                );
              })}
            </svg>

            {hover && (
              <div style={{ position:'absolute', bottom:20, left:'50%', transform:'translateX(-50%)', padding:'10px 16px', borderRadius:99, background:'rgba(10,10,12,0.92)', border:'0.5px solid rgba(255,255,255,0.18)', backdropFilter:'blur(14px)', fontSize:13, fontWeight:500 }}>
                Section {hover} · {tiers[sections.find(s => s.id === hover).tier].name} · From ${tiers[sections.find(s => s.id === hover).tier].from}
              </div>
            )}
          </div>
        </div>

        {/* Right — tiers */}
        <div>
          <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:18, fontWeight:600, letterSpacing:'-0.02em', marginBottom:14 }}>Price tiers</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {tiers.map(t => (
              <div key={t.id} style={{ padding:'16px 16px', borderRadius:14, background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.10)', display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:14, height:42, borderRadius:6, background:t.color }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:600 }}>{t.name}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)', marginTop:2 }}>${t.range}</div>
                </div>
                <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:18, fontWeight:700 }}>${t.from}+</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop:24, padding:16, borderRadius:14, background:'rgba(255,94,158,0.10)', border:'0.5px solid rgba(255,94,158,0.20)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:30, height:30, borderRadius:99, background:'rgba(255,94,158,0.25)', display:'grid', placeItems:'center' }}>
                <ClockIcon/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12.5, fontWeight:600 }}>Seats held for you</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)', marginTop:2 }}>Complete checkout before the timer runs out</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DesktopChrome>
  );
}

function DesktopTimer(){
  const [t, setT] = React.useState(332);
  React.useEffect(() => { const id = setInterval(() => setT(v => Math.max(0, v-1)), 1000); return () => clearInterval(id); }, []);
  const mins = String(Math.floor(t/60)).padStart(1, '0');
  const secs = String(t%60).padStart(2, '0');
  const warn = t <= 60;
  return (
    <div style={{
      padding:'10px 16px', borderRadius:99,
      background: warn ? 'rgba(255,94,158,0.18)' : 'rgba(255,255,255,0.06)',
      border: '0.5px solid ' + (warn ? 'rgba(255,94,158,0.40)' : 'rgba(255,255,255,0.12)'),
      backdropFilter:'blur(14px)',
      display:'flex', alignItems:'center', gap:10,
      color: warn ? '#FFB1C8' : '#fff',
      animation: warn ? 'pulse 1s infinite' : 'none',
    }}>
      <ClockIcon/>
      <div style={{ fontFamily:'"Space Grotesk", system-ui', fontWeight:700, fontSize:14, fontVariantNumeric:'tabular-nums' }}>{mins}:{secs}</div>
      <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)' }}>· Seats held</div>
    </div>
  );
}

/* ─────── 4. SEAT SELECT ─────── */
function DesktopSeatSelect({ onNav }){
  const rows = ['I','J','K','L','M','N','O'];
  const [picked, setPicked] = React.useState(new Set(['K-7','K-8']));
  const toggle = (id) => setPicked(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const taken = new Set(['I-12','I-10','I-9','J-14','J-13','J-11','J-10','K-12','K-9','L-14','L-13','L-12','L-11','L-10','L-9','L-8','M-14','M-13','M-11','M-9','N-9','N-8','O-14','O-12','O-10']);
  const wheelchair = new Set(['I-4','M-4']);
  const reduced = new Set(['N-2','N-3']);
  const companion = new Set(['I-5','M-5']);

  const price = 173.60, fee = 33.60;
  const total = picked.size * (price + fee);

  return (
    <DesktopChrome active="events" onNav={onNav}>
      <div style={{ padding:'120px 56px 60px', display:'grid', gridTemplateColumns:'1fr 380px', gap:48 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
            <div>
              <div style={{ fontSize:11, color:D.purple.hi, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase' }}>Step 2 of 2</div>
              <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:42, fontWeight:700, letterSpacing:'-0.03em', marginTop:6 }}>Select Seats · 102 Green</div>
              <div style={{ fontSize:14, color:'rgba(255,255,255,0.6)', marginTop:8 }}>Click on available seats to select them</div>
            </div>
            <DesktopTimer/>
          </div>

          <div style={{ padding:'32px 32px 28px', borderRadius:24, background:'rgba(255,255,255,0.03)', border:'0.5px solid rgba(255,255,255,0.10)' }}>
            <div style={{ textAlign:'center', fontSize:11, color:'rgba(255,255,255,0.5)', letterSpacing:'0.30em', fontWeight:600, marginBottom:24 }}>STAGE</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'center' }}>
              {rows.map(r => (
                <div key={r} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:18, fontSize:11, color:'rgba(255,255,255,0.6)', fontWeight:600 }}>{r}</div>
                  {Array.from({ length:14 }, (_, i) => 14 - i).map(n => {
                    const id = `${r}-${n}`;
                    const isWheel = wheelchair.has(id);
                    const isReduced = reduced.has(id);
                    const isComp = companion.has(id);
                    const isTaken = taken.has(id);
                    const isPicked = picked.has(id);
                    let bg = '#3F7BEC'; // available
                    if (isTaken) bg = 'rgba(255,255,255,0.15)';
                    else if (isPicked) bg = '#FFC857';
                    else if (isComp) bg = '#C77FFF';
                    else if (isWheel) bg = '#2F5BD6';
                    else if (isReduced) bg = '#3DD68C';
                    return (
                      <div key={n} onClick={() => !isTaken && toggle(id)} style={{
                        width:30, height:30, borderRadius:6,
                        background:bg,
                        display:'grid', placeItems:'center',
                        fontSize:9.5, fontWeight:700,
                        color: isTaken ? 'rgba(255,255,255,0.4)' : isPicked ? '#141416' : '#fff',
                        cursor: isTaken ? 'not-allowed' : 'pointer',
                        border: isPicked ? '2px solid #fff' : '0.5px solid rgba(255,255,255,0.10)',
                        position:'relative',
                      }}>
                        {n}
                        {isWheel && !isTaken && !isPicked && <div style={{ position:'absolute', top:-3, right:-3, fontSize:7 }}>♿</div>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div style={{ marginTop:28, display:'flex', flexWrap:'wrap', gap:16, justifyContent:'center', fontSize:11.5, color:'rgba(255,255,255,0.75)' }}>
              {[
                ['Disponible', '#3F7BEC'],
                ['Ocupado', 'rgba(255,255,255,0.15)'],
                ['Tu selección', '#FFC857'],
                ['Acompañante', '#C77FFF'],
                ['Silla de Ruedas ♿', '#2F5BD6'],
                ['Movilidad Reducida', '#3DD68C'],
              ].map(([l, c]) => (
                <div key={l} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:13, height:13, borderRadius:4, background:c }}/>
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div style={{ position:'sticky', top:90, padding:24, borderRadius:20, background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.12)', backdropFilter:'blur(18px) saturate(160%)' }}>
            <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:18, fontWeight:600, letterSpacing:'-0.02em' }}>Your seats</div>
            <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:6 }}>
              {[...picked].map(id => {
                const [r, n] = id.split('-');
                return (
                  <div key={id} style={{ padding:'10px 12px', borderRadius:10, background:'rgba(255,200,87,0.10)', border:'0.5px solid rgba(255,200,87,0.25)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ fontSize:13 }}>Sec 102 · Row {r} · Seat {n}</div>
                    <div onClick={() => toggle(id)} style={{ color:'rgba(255,255,255,0.5)', fontSize:11, cursor:'pointer' }}>Remove</div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop:18, padding:'14px 0', borderTop:'0.5px solid rgba(255,255,255,0.08)', borderBottom:'0.5px solid rgba(255,255,255,0.08)' }}>
              <Line label={`Price (${picked.size} × $${price.toFixed(2)})`} value={`$${(picked.size * price).toFixed(2)}`}/>
              <Line label={`Service fee`} value={`$${(picked.size * fee).toFixed(2)}`}/>
            </div>
            <div style={{ marginTop:14, display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
              <div style={{ fontSize:12.5, color:'rgba(255,255,255,0.55)' }}>Total</div>
              <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:30, fontWeight:700 }}>${total.toFixed(2)}</div>
            </div>
            <button onClick={() => onNav('ticket')} style={{ marginTop:18, width:'100%', appearance:'none', border:0, cursor:'pointer', padding:'15px', borderRadius:14, background:'#fff', color:'#141416', fontFamily:'"Space Grotesk", system-ui', fontSize:14, fontWeight:600 }}>Continue ({picked.size}) →</button>
            <div style={{ marginTop:10, fontSize:10.5, color:'rgba(255,255,255,0.5)', textAlign:'center' }}>Stripe checkout opens in next step</div>
          </div>
        </div>
      </div>
    </DesktopChrome>
  );
}

function Line({ label, value }){
  return (
    <div style={{ display:'flex', justifyContent:'space-between', padding:'4px 0', fontSize:13, color:'rgba(255,255,255,0.75)' }}>
      <div>{label}</div>
      <div style={{ fontVariantNumeric:'tabular-nums' }}>{value}</div>
    </div>
  );
}

/* ─────── 5. TICKET RECEIVED ─────── */
function DesktopTicketReceived({ onNav }){
  return (
    <DesktopChrome active="events" onNav={onNav}>
      <div style={{ padding:'120px 56px 80px', maxWidth:1100, margin:'0 auto' }}>
        {/* Hero confirmation */}
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ width:72, height:72, borderRadius:99, margin:'0 auto', background:`radial-gradient(circle, ${D.purple.hi}, ${D.purple.mid})`, display:'grid', placeItems:'center', boxShadow:`0 0 60px ${D.purple.mid}80`, marginBottom:24 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:54, fontWeight:700, letterSpacing:'-0.035em' }}>You're going.</div>
          <div style={{ fontSize:16, color:'rgba(255,255,255,0.65)', marginTop:12, maxWidth:520, margin:'12px auto 0', lineHeight:1.5 }}>
            Your ticket has been minted as an NFT on Base — yours to keep, even after the show.
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1.1fr 1fr', gap:48, alignItems:'center' }}>
          {/* NFT card */}
          <div style={{
            position:'relative',
            aspectRatio:'5/7',
            borderRadius:24,
            background:`linear-gradient(135deg, #2A2A2E 0%, #1A0830 50%, #1E1E22 100%)`,
            overflow:'hidden',
            boxShadow:`0 30px 80px rgba(60,60,68,0.4)`,
            border:'0.5px solid rgba(255,255,255,0.18)',
            padding:32,
          }}>
            <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at top right, ${D.purple.hi}40, transparent 60%)` }}/>
            <div style={{ position:'absolute', inset:0, background:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='40' height='40' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`, opacity:0.5 }}/>

            <div style={{ position:'relative', display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.55)', letterSpacing:'0.20em', fontWeight:700 }}>NO. 042 / 12,000</div>
                <div style={{ fontSize:11, marginTop:8, padding:'4px 9px', borderRadius:99, background:'rgba(0,82,255,0.20)', border:'0.5px solid rgba(0,82,255,0.40)', color:'#9CBBFF', fontWeight:700, letterSpacing:'0.14em', display:'inline-block' }}>NFT · BASE</div>
              </div>
              <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:11, color:'rgba(255,255,255,0.55)', textAlign:'right' }}>ticketsaver</div>
            </div>

            <div style={{ position:'relative', marginTop:48 }}>
              <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:96, fontWeight:700, letterSpacing:'-0.05em', lineHeight:0.9 }}>07</div>
              <div style={{ fontSize:14, color:'rgba(255,255,255,0.75)', marginTop:6, letterSpacing:'0.18em', fontWeight:600 }}>SAT · JUN · 8:30 PM</div>
              <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:26, fontWeight:600, marginTop:16, letterSpacing:'-0.015em' }}>Mitski</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginTop:4 }}>Brooklyn Steel · Brooklyn, NY</div>
            </div>

            {/* perforation */}
            <div style={{ position:'absolute', left:32, right:32, bottom:120, height:1, borderBottom:'1.5px dashed rgba(255,255,255,0.25)' }}/>
            <div style={{ position:'absolute', left:-10, bottom:118, width:20, height:20, borderRadius:99, background:'#0A0A0C' }}/>
            <div style={{ position:'absolute', right:-10, bottom:118, width:20, height:20, borderRadius:99, background:'#0A0A0C' }}/>

            <div style={{ position:'absolute', left:32, right:32, bottom:32, display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
              <div>
                <div style={{ display:'flex', gap:22 }}>
                  {[['SEC','102'],['ROW','K'],['SEAT','7']].map(([l, v]) => (
                    <div key={l}>
                      <div style={{ fontSize:9.5, letterSpacing:'0.18em', color:'rgba(255,255,255,0.5)', fontWeight:700 }}>{l}</div>
                      <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:22, fontWeight:700, marginTop:2 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ width:74, height:74, borderRadius:8, background:'#fff', padding:6, display:'grid', placeItems:'center' }}>
                <div style={{ width:'100%', height:'100%', background:`repeating-conic-gradient(#141416 0 25%, #fff 0 50%)`, backgroundSize:'6px 6px', borderRadius:3 }}/>
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div>
            <div style={{ padding:'18px 20px', borderRadius:14, background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.10)', marginBottom:14 }}>
              <div style={{ fontSize:10.5, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)', fontWeight:700 }}>Minted to</div>
              <div style={{ marginTop:6, display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:24, height:24, borderRadius:99, background:`linear-gradient(135deg, ${D.purple.hi}, ${D.purple.mid})` }}/>
                <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:14, fontWeight:600, fontVariantNumeric:'tabular-nums' }}>0x3f2a…b91d</div>
                <div style={{ marginLeft:'auto', fontSize:11, color:D.purple.hi, fontWeight:600, cursor:'pointer' }}>View on Base ↗</div>
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <ActionRow icon="apple" title="Add to Apple Wallet" sub="Quick scan at the door, no signal needed"/>
              <ActionRow icon="share" title="Share to friends" sub="Send them the show, not the ticket"/>
              <ActionRow icon="mail"  title="Email me a backup" sub="dani@gmail.com"/>
              <ActionRow icon="cal"   title="Add to calendar" sub="Sat, Jun 7 · 8:30 pm"/>
            </div>

            <button onClick={() => onNav('mytickets')} style={{ marginTop:18, width:'100%', appearance:'none', border:0, cursor:'pointer', padding:'15px', borderRadius:14, background:'#fff', color:'#141416', fontFamily:'"Space Grotesk", system-ui', fontSize:14, fontWeight:600 }}>View in My Tickets →</button>
          </div>
        </div>
      </div>

      <DesktopFooter onNav={onNav}/>
    </DesktopChrome>
  );
}

function ActionRow({ icon, title, sub }){
  return (
    <div style={{ padding:'14px 16px', borderRadius:14, background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.10)', display:'flex', alignItems:'center', gap:14, cursor:'pointer' }}>
      <div style={{ width:36, height:36, borderRadius:10, background:'rgba(212,168,240,0.18)', border:'0.5px solid rgba(212,168,240,0.30)', display:'grid', placeItems:'center', color:'#E5E5EA' }}>
        {icon === 'apple' && <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M10.5 1c.5 1 0 2.5-.7 3-.7.5-2 .5-2.3-.4-.4-1.2.7-2.4 1.5-2.6.6-.2 1.2 0 1.5 0Zm2.7 4.6c-1.5-.8-3-.7-3.5-.7-1.5 0-2.7.6-3.4.6-.7 0-1.7-.5-2.8-.5-1.4 0-2.5 1.1-2.5 3 0 2 1.5 5.5 3 5.5.7 0 1.5-.5 2.4-.5.9 0 1.7.5 2.5.5 1.5 0 3-3.3 3-5 0-.7-.4-1.7-1.2-2.4-.4-.4 1-1 1.5-1.6.5-.5-.4 1.5-2 1.1Z"/></svg>}
        {icon === 'share' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="3.5" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.4"/><circle cx="12" cy="4" r="1.8" stroke="currentColor" strokeWidth="1.4"/><circle cx="12" cy="12" r="1.8" stroke="currentColor" strokeWidth="1.4"/><path d="M5 7l5.5-2M5 9l5.5 2" stroke="currentColor" strokeWidth="1.4"/></svg>}
        {icon === 'mail'  && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M2 5l6 4 6-4" stroke="currentColor" strokeWidth="1.4"/></svg>}
        {icon === 'cal'   && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M2 6h12M5 1.5v3M11 1.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>}
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14, fontWeight:600 }}>{title}</div>
        <div style={{ fontSize:11.5, color:'rgba(255,255,255,0.55)', marginTop:2 }}>{sub}</div>
      </div>
      <ChevRight/>
    </div>
  );
}

/* ─────── 6. MY TICKETS ─────── */
function DesktopMyTickets({ onNav }){
  const [tab, setTab] = React.useState('upcoming');
  const evs = window.TS_EVENTS;
  const upcoming = [evs[1], evs[3], evs[6]];
  const past = [evs[0], evs[5], evs[2], evs[4]];

  return (
    <DesktopChrome active="mytickets" onNav={onNav}>
      <div style={{ padding:'120px 56px 80px' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:36 }}>
          <div>
            <div style={{ fontSize:11, color:D.purple.hi, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase' }}>Welcome back</div>
            <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:48, fontWeight:700, letterSpacing:'-0.03em', marginTop:6 }}>Daniela's tickets</div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            {[['Upcoming','12'],['Collected','47'],['Rarity','Gold']].map(([l, v]) => (
              <div key={l} style={{ padding:'14px 22px', borderRadius:14, background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.10)' }}>
                <div style={{ fontSize:10, letterSpacing:'0.18em', color:'rgba(255,255,255,0.5)', fontWeight:700, textTransform:'uppercase' }}>{l}</div>
                <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:22, fontWeight:700, marginTop:4 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:6, marginBottom:28 }}>
          {[['upcoming','Upcoming'],['past','Past'],['collection','Collection']].map(([id, l]) => (
            <div key={id} onClick={() => setTab(id)} style={{ padding:'10px 18px', borderRadius:99, background: id === tab ? '#fff' : 'rgba(255,255,255,0.05)', color: id === tab ? '#141416' : '#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>{l}</div>
          ))}
        </div>

        {tab !== 'collection' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:18 }}>
            {(tab === 'upcoming' ? upcoming : past).map(e => (
              <div key={e.id} style={{ display:'flex', borderRadius:18, overflow:'hidden', background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.10)', opacity: tab === 'past' ? 0.65 : 1 }}>
                <div style={{ flexShrink:0, width:170, position:'relative' }}>
                  <TSCover event={e} height={200}/>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg, rgba(0,0,0,0.5), transparent)' }}/>
                  <div style={{ position:'absolute', left:16, top:16, color:'#fff' }}>
                    <div style={{ fontSize:11, letterSpacing:'0.14em', fontWeight:700 }}>{e.month.toUpperCase()}</div>
                    <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:46, fontWeight:700, letterSpacing:'-0.03em', lineHeight:1 }}>{e.date}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.75)' }}>{e.day || 'Sat'}</div>
                  </div>
                </div>
                <div style={{ position:'relative', width:1, background:'rgba(255,255,255,0.10)' }}>
                  <div style={{ position:'absolute', top:-8, left:-8, width:16, height:16, borderRadius:99, background:'#0A0A0C', border:'0.5px solid rgba(255,255,255,0.10)' }}/>
                  <div style={{ position:'absolute', bottom:-8, left:-8, width:16, height:16, borderRadius:99, background:'#0A0A0C', border:'0.5px solid rgba(255,255,255,0.10)' }}/>
                </div>
                <div style={{ flex:1, padding:'20px 24px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                  <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:22, fontWeight:600, letterSpacing:'-0.02em', textWrap:'pretty' }}>{e.title}</div>
                  <div style={{ fontSize:12.5, color:'rgba(255,255,255,0.6)', marginTop:6 }}>{e.venue} · {e.city}</div>
                  <div style={{ marginTop:14, display:'flex', flexWrap:'wrap', gap:6 }}>
                    {['Sec 102','Row K','Seats 7-8'].map(t => (
                      <div key={t} style={{ padding:'4px 10px', borderRadius:99, background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.10)', fontSize:10.5, fontWeight:500 }}>{t}</div>
                    ))}
                  </div>
                  {tab === 'upcoming' && (
                    <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:6, height:6, borderRadius:99, background:'#42E29B', animation:'pulse 1.5s infinite' }}/>
                      <div style={{ fontSize:11.5, color:'#42E29B', fontWeight:600 }}>Doors in 14 days</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'collection' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:18 }}>
            {[...Array(8)].map((_, i) => {
              const e = evs[i % evs.length];
              return (
                <div key={i} style={{ borderRadius:18, overflow:'hidden', background:`linear-gradient(135deg, ${D.purple.lo}, #141416)`, border:'0.5px solid rgba(255,255,255,0.10)', aspectRatio:'1/1', position:'relative' }}>
                  <div style={{ position:'absolute', inset:0, opacity:0.85 }}><TSCover event={e} height={260}/></div>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85))' }}/>
                  <div style={{ position:'absolute', top:10, left:10, padding:'3px 8px', borderRadius:99, background:'rgba(0,0,0,0.65)', border:'0.5px solid rgba(255,255,255,0.18)', backdropFilter:'blur(8px)', fontSize:9.5, fontWeight:700, letterSpacing:'0.12em' }}>NO. {String(i * 31 + 42).padStart(3, '0')}</div>
                  <div style={{ position:'absolute', bottom:12, left:12, right:12 }}>
                    <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:14, fontWeight:600 }}>{e.artist}</div>
                    <div style={{ fontSize:10.5, color:'rgba(255,255,255,0.65)', marginTop:2 }}>{e.month} {e.date}, 2024</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <DesktopFooter onNav={onNav}/>
    </DesktopChrome>
  );
}

/* ─────── FOOTER ─────── */
function DesktopFooter({ onNav }){
  return (
    <div style={{ padding:'48px 56px 36px', borderTop:'0.5px solid rgba(255,255,255,0.08)', background:'rgba(0,0,0,0.3)' }}>
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', gap:48 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg, ${D.purple.hi}, ${D.purple.mid})` }}/>
            <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:17, fontWeight:600 }}>ticketsaver</div>
          </div>
          <div style={{ fontSize:12.5, color:'rgba(255,255,255,0.55)', lineHeight:1.55, maxWidth:280 }}>Face-value tickets, NFTs on Base, no scalpers. Made in Buenos Aires.</div>
          <div style={{ marginTop:14, padding:'5px 10px', borderRadius:99, background:'rgba(0,82,255,0.18)', border:'0.5px solid rgba(0,82,255,0.32)', color:'#9CBBFF', fontSize:10, fontWeight:700, letterSpacing:'0.10em', display:'inline-block' }}>BUILT ON BASE</div>
        </div>
        <FooterDeskCol title="Discover" items={[['Events','home'],['Artists',null],['Venues',null],['Categories',null]]} onNav={onNav}/>
        <FooterDeskCol title="Account"  items={[['My tickets','mytickets'],['Wallet',null],['Sell tickets',null]]} onNav={onNav}/>
        <FooterDeskCol title="Company"  items={[['About','about'],['Contact','contact'],['FAQs','faqs']]} onNav={onNav}/>
        <FooterDeskCol title="Legal"    items={[['Terms','terms'],['Privacy','privacy'],['Cookies',null]]} onNav={onNav}/>
      </div>
      <div style={{ marginTop:36, paddingTop:18, borderTop:'0.5px solid rgba(255,255,255,0.08)', display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(255,255,255,0.4)' }}>
        <div>© 2025 TicketSaver, Inc.</div>
        <div style={{ display:'flex', gap:14 }}><span>EN</span><span>ES</span><span>USD</span></div>
      </div>
    </div>
  );
}
function FooterDeskCol({ title, items, onNav }){
  return (
    <div>
      <div style={{ fontSize:10, letterSpacing:'0.18em', color:'rgba(255,255,255,0.4)', fontWeight:700, textTransform:'uppercase' }}>{title}</div>
      <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:8 }}>
        {items.map(([l, route]) => (
          <div key={l} onClick={() => route && onNav(route)} style={{ fontSize:13, color:'rgba(255,255,255,0.75)', cursor: route ? 'pointer' : 'default' }}>{l}</div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  DesktopHome, DesktopEventDetail, DesktopSectionSelect, DesktopSeatSelect,
  DesktopTicketReceived, DesktopMyTickets, DesktopChrome, DesktopFooter,
});
