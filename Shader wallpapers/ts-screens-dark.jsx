// ts-screens.jsx — Full mobile artboard compositions

const TS_W = 390, TS_H = 844;

// Scrollable phone screen with fixed mesh bg behind it
function PhoneScreen({ seed = 0, children, scrollHeight }){
  return (
    <div style={{
      position: 'relative',
      width: '100%', height: '100%',
      overflow: 'hidden',
      background: '#0A0A0C',
    }}>
      <MeshBg seed={seed}/>
      {/* scrollable column */}
      <div style={{
        position: 'absolute', inset: 0,
        overflowY: 'auto',
        zIndex: 2,
        paddingTop: 54,           // status bar room
        paddingBottom: 24,
        WebkitOverflowScrolling: 'touch',
      }}>
        <div style={{ minHeight: scrollHeight, position: 'relative' }}>
          {children}
        </div>
      </div>
      {/* Status bar - rendered by IOSDevice itself */}
    </div>
  );
}

function TabBar({ active = 'home' }){
  const tabs = [
    { id: 'home',    label: 'Home',     icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 8 9 3l6 5v6.5a1 1 0 0 1-1 1h-3.5v-4h-3v4H4a1 1 0 0 1-1-1V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg> },
    { id: 'search',  label: 'Discover', icon: <SearchIcon/> },
    { id: 'tickets', label: 'Tickets',  icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 6.5a1.5 1.5 0 0 0 0 3v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5a1.5 1.5 0 0 0 0-3V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2.5Z" stroke="currentColor" strokeWidth="1.4"/><path d="M9 4v9" stroke="currentColor" strokeWidth="1.4" strokeDasharray="1.5 1.5"/></svg> },
    { id: 'profile', label: 'Profile',  icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M3 15c1-3 3.5-4 6-4s5 1 6 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  ];
  return (
    <div style={{
      position: 'absolute', left: 12, right: 12, bottom: 14,
      zIndex: 30,
      padding: 6,
      borderRadius: 22,
      background: 'rgba(12,12,14,0.55)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      border: '0.5px solid rgba(255,255,255,0.10)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
      display: 'flex',
    }}>
      {tabs.map(t => (
        <div key={t.id} style={{
          flex: 1,
          padding: '8px 4px 6px',
          borderRadius: 16,
          background: t.id === active ? 'rgba(212,168,240,0.16)' : 'transparent',
          color: t.id === active ? '#fff' : 'rgba(255,255,255,0.55)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        }}>
          {t.icon}
          <div style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.02em' }}>{t.label}</div>
        </div>
      ))}
    </div>
  );
}

// ───────────────────────────── ARTBOARDS ─────────────────────────────

// 1. Full Home — tall scroll showing the whole experience
function HomeFull({ cardVariant }){
  const evs = window.TS_EVENTS;
  const heroSet = evs.filter(e => e.hero);
  const electronic = evs.filter(e => e.category === 'Electronic');
  const popular = [evs[1], evs[5], evs[7], evs[4]];
  const thisWeek = [evs[0], evs[2], evs[3], evs[6]];
  return (
    <PhoneScreen seed={0} scrollHeight={2400}>
      <HomeHeader cartCount={2}/>

      {/* Greeting */}
      <div style={{ padding: '0 18px 14px' }}>
        <div style={{ fontSize: 11, color: 'rgba(212,168,240,0.95)', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}>Mon, 12 May</div>
        <div style={{
          fontFamily: '"Space Grotesk", system-ui',
          fontSize: 26, fontWeight: 600, letterSpacing: '-0.028em',
          color: '#fff', marginTop: 4, lineHeight: 1.1,
        }}>
          Tonight's a <span style={{
            background: 'linear-gradient(90deg, #F5F5FA, #9090A0)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>good night</span><br/>for a show.
        </div>
      </div>

      <CategoryChips active="All"/>

      <div style={{ height: 18 }}/>
      <HeroCarousel events={heroSet} active={0}/>

      <div style={{ height: 28 }}/>
      <SectionTitle hint="Tap a cover to glimpse the venue & seats">Closer look</SectionTitle>
      <CoverFlow3D events={evs} active={2}/>

      <div style={{ height: 22 }}/>
      <NetflixRow
        title="This week"
        subtitle="Within 7 days · all categories"
        events={thisWeek}
        variant={cardVariant}
      />

      <div style={{ height: 22 }}/>
      <NetflixRow
        title="Popular near you"
        subtitle="Trending in Buenos Aires & CDMX"
        events={popular}
        variant={cardVariant}
      />

      <div style={{ height: 22 }}/>
      <NetflixRow
        title="Electronic nights"
        subtitle="When the city won't sleep"
        events={electronic}
        variant={cardVariant}
      />

      <div style={{ height: 22 }}/>
      <NewToolPanel/>
      <div style={{ height: 60 }}/>
    </PhoneScreen>
  );
}

// Better event-visualization tool — a "vibe radar" + 3D venue preview
function NewToolPanel(){
  return (
    <div style={{ padding: '0 18px' }}>
      <div style={{
        borderRadius: 22,
        padding: 18,
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(22px) saturate(160%)',
        WebkitBackdropFilter: 'blur(22px) saturate(160%)',
        border: '0.5px solid rgba(255,255,255,0.10)',
      }}>
        <div style={{ fontSize: 9.5, letterSpacing: '0.18em', color: '#D4A8F0', textTransform: 'uppercase', fontWeight: 600 }}>New</div>
        <div style={{
          fontFamily: '"Space Grotesk", system-ui',
          fontSize: 19, fontWeight: 600, color: '#fff',
          letterSpacing: '-0.02em', marginTop: 6,
        }}>Vibe Radar</div>
        <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)', marginTop: 4, lineHeight: 1.4 }}>
          See how each event matches your taste. Tap to filter the home feed.
        </div>

        {/* radar viz */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16 }}>
          <RadarSvg/>
          <div style={{ flex: 1, minWidth: 0 }}>
            {[
              { label: 'Energy',    value: 0.82 },
              { label: 'Intimacy',  value: 0.45 },
              { label: 'Visuals',   value: 0.91 },
              { label: 'Bass',      value: 0.7  },
            ].map(r => (
              <div key={r.label} style={{ marginBottom: 7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'rgba(255,255,255,0.6)' }}>
                  <span>{r.label}</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums', color: '#fff' }}>{Math.round(r.value*100)}</span>
                </div>
                <div style={{ height: 3, marginTop: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${r.value*100}%`,
                    background: 'linear-gradient(90deg, #9090A0, #FFB1C8)',
                  }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RadarSvg(){
  // 5-axis radar with sample shape
  const cx = 56, cy = 56, R = 46;
  const axes = 5;
  const values = [0.9, 0.5, 0.85, 0.6, 0.75];
  const pts = values.map((v, i) => {
    const a = -Math.PI/2 + (i / axes) * Math.PI * 2;
    return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v];
  });
  const path = 'M ' + pts.map(p => p.join(',')).join(' L ') + ' Z';
  const ringPath = (r) => {
    const p = [];
    for (let i = 0; i < axes; i++){
      const a = -Math.PI/2 + (i / axes) * Math.PI * 2;
      p.push([cx + Math.cos(a)*R*r, cy + Math.sin(a)*R*r]);
    }
    return 'M ' + p.map(x => x.join(',')).join(' L ') + ' Z';
  };
  return (
    <svg width="112" height="112" viewBox="0 0 112 112">
      {[0.25, 0.5, 0.75, 1].map(r => (
        <path key={r} d={ringPath(r)} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.5"/>
      ))}
      {Array.from({ length: axes }).map((_, i) => {
        const a = -Math.PI/2 + (i / axes) * Math.PI * 2;
        return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a)*R} y2={cy + Math.sin(a)*R} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>;
      })}
      <defs>
        <linearGradient id="r-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9090A0" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#FFB1C8" stopOpacity="0.5"/>
        </linearGradient>
      </defs>
      <path d={path} fill="url(#r-fill)" stroke="#FFB1C8" strokeWidth="1.4"/>
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="2" fill="#fff"/>)}
    </svg>
  );
}

// 2. Hero carousel close-up — three states stacked
function HeroCloseup(){
  const evs = window.TS_EVENTS.filter(e => e.hero);
  return (
    <PhoneScreen seed={1} scrollHeight={1600}>
      <HomeHeader cartCount={2}/>
      <SectionTitle hint="Full-bleed featured · swipe horizontally">Hero carousel · slide 1</SectionTitle>
      <HeroCarousel events={evs} active={0}/>
      <div style={{ height: 24 }}/>
      <SectionTitle>Slide 2 — preview</SectionTitle>
      <HeroCarousel events={evs} active={1}/>
      <div style={{ height: 24 }}/>
      <SectionTitle>Slide 3 — preview</SectionTitle>
      <HeroCarousel events={evs} active={2}/>
      <div style={{ height: 40 }}/>
    </PhoneScreen>
  );
}

// 3. Cover-flow 3D detail
function CoverFlowDetail(){
  const evs = window.TS_EVENTS;
  return (
    <PhoneScreen seed={2} scrollHeight={1400}>
      <HomeHeader cartCount={2}/>
      <SectionTitle hint="Tilt-card carousel with cinematic depth">Cover-flow · perspective</SectionTitle>
      <div style={{ height: 14 }}/>
      <CoverFlow3D events={evs} active={1} height={260}/>
      <div style={{ height: 20 }}/>
      <CoverFlow3D events={evs} active={3} height={260}/>
      <div style={{ height: 20 }}/>
      <CoverFlow3D events={evs} active={5} height={260}/>
      <div style={{ height: 40 }}/>
    </PhoneScreen>
  );
}

// 4. Netflix scroll detail — shows all 4 card variants
function NetflixDetail(){
  const evs = window.TS_EVENTS;
  return (
    <PhoneScreen seed={3} scrollHeight={1800}>
      <HomeHeader cartCount={2}/>
      <SectionTitle hint="Horizontal scroll · all four card variants stacked here">Card variants</SectionTitle>
      <div style={{ height: 6 }}/>
      <NetflixRow title="Poster" events={evs.slice(0,4)} variant="poster"/>
      <div style={{ height: 18 }}/>
      <NetflixRow title="Cinema" events={evs.slice(2,6)} variant="cinema"/>
      <div style={{ height: 18 }}/>
      <NetflixRow title="Ticket cut" events={evs.slice(4,8)} variant="ticket"/>
      <div style={{ height: 18 }}/>
      <NetflixRow title="Minimal" events={evs.slice(0,4)} variant="minimal"/>
      <div style={{ height: 40 }}/>
    </PhoneScreen>
  );
}

// 5. Quick-view overlay — "better event visualization tool"
function QuickView(){
  const ev = window.TS_EVENTS[0];
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#0A0A0C' }}>
      <MeshBg seed={4}/>
      {/* dimmed home behind */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(8,8,10,0.55)', backdropFilter: 'blur(6px)' }}/>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 3 }}>
        <QuickViewSheet event={ev}/>
      </div>
      <div style={{
        position: 'absolute', top: 60, left: 0, right: 0,
        textAlign: 'center', color: 'rgba(255,255,255,0.55)',
        fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', zIndex: 2,
      }}>
        Tap card · quick view
      </div>
    </div>
  );
}

function QuickViewSheet({ event }){
  return (
    <div style={{
      borderTopLeftRadius: 28, borderTopRightRadius: 28,
      padding: '14px 0 28px',
      background: 'rgba(12,12,14,0.78)',
      backdropFilter: 'blur(40px) saturate(180%)',
      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      border: '0.5px solid rgba(255,255,255,0.10)',
      boxShadow: '0 -10px 50px rgba(0,0,0,0.5)',
    }}>
      <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.25)', margin: '0 auto 14px' }}/>
      <div style={{ padding: '0 18px' }}>
        <div style={{ borderRadius: 18, overflow: 'hidden', height: 170, marginBottom: 14 }}>
          <TSCover event={event} height={170} big/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div>
            <div style={{
              fontFamily: '"Space Grotesk", system-ui',
              fontSize: 22, fontWeight: 600, color: '#fff',
              letterSpacing: '-0.022em', lineHeight: 1.05,
            }}>{event.title}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{event.subtitle}</div>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(255,255,255,0.06)',
            border: '0.5px solid rgba(255,255,255,0.1)',
            display: 'grid', placeItems: 'center', color: '#fff',
            flexShrink: 0,
          }}><HeartIcon/></div>
        </div>

        {/* fact grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
          <FactPill icon={<PinIcon/>}     label="Venue" value={event.venue}/>
          <FactPill icon={<ClockIcon/>}   label="Doors" value={event.time}/>
          <FactPill                       label="Date"  value={`${event.day} ${event.date} ${event.month}`}/>
          <FactPill                       label="Price" value={`$${event.priceFrom}–${event.priceTo}`}/>
        </div>

        {/* venue map mini */}
        <div style={{
          marginTop: 14,
          borderRadius: 14, overflow: 'hidden',
          background: 'rgba(255,255,255,0.04)',
          border: '0.5px solid rgba(255,255,255,0.10)',
        }}>
          <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>Venue layout</div>
              <div style={{ fontSize: 12, color: '#fff', marginTop: 2 }}>{event.venue}</div>
            </div>
            <div style={{ fontSize: 10.5, color: '#D4A8F0', display: 'flex', alignItems: 'center', gap: 4 }}>Open map <ChevRight/></div>
          </div>
          <MiniVenueMap/>
          <div style={{ display: 'flex', gap: 6, padding: '10px 14px 12px', flexWrap: 'wrap' }}>
            {[
              ['#9BFFB1', 'Available'],
              ['#FFD06A', '$$$'],
              ['#FFB1C8', 'Few left'],
              ['#7E6DFF', 'Sold out'],
            ].map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9.5, color: 'rgba(255,255,255,0.65)' }}>
                <div style={{ width: 7, height: 7, borderRadius: 4, background: c }}/>
                {l}
              </div>
            ))}
          </div>
        </div>

        {/* tags */}
        <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
          {event.tags.map(t => (
            <div key={t} style={{
              padding: '5px 10px',
              borderRadius: 999,
              background: 'rgba(212,168,240,0.10)',
              border: '0.5px solid rgba(212,168,240,0.25)',
              color: '#E5E5EA',
              fontSize: 10.5, fontWeight: 500,
            }}>{t}</div>
          ))}
        </div>

        {/* CTA */}
        <button style={{
          appearance: 'none', border: 0, cursor: 'pointer',
          width: '100%', marginTop: 16,
          padding: '14px 16px',
          borderRadius: 16,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
          color: '#141416',
          fontFamily: '"Space Grotesk", system-ui',
          fontSize: 14, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>Choose seats</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>from ${event.priceFrom} <ChevRight/></span>
        </button>
      </div>
    </div>
  );
}

function FactPill({ icon, label, value }){
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '0.5px solid rgba(255,255,255,0.10)',
      borderRadius: 12, padding: '9px 12px',
    }}>
      <div style={{ fontSize: 9, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 12.5, color: '#fff', marginTop: 4, fontWeight: 500, letterSpacing: '-0.01em' }}>{value}</div>
    </div>
  );
}

function MiniVenueMap(){
  // Mini SVG of a stage + arc seating with colored zones
  return (
    <svg viewBox="0 0 320 160" style={{ width: '100%', display: 'block' }}>
      <defs>
        <radialGradient id="stagev" cx="50%" cy="100%" r="60%">
          <stop offset="0%" stopColor="#F5F5FA"/>
          <stop offset="100%" stopColor="#9090A0" stopOpacity="0"/>
        </radialGradient>
      </defs>
      {/* stage */}
      <rect x="120" y="130" width="80" height="14" rx="3" fill="url(#stagev)" stroke="#fff" strokeOpacity="0.5"/>
      <text x="160" y="141" textAnchor="middle" fontSize="7" fill="#fff" fontFamily="Space Grotesk" letterSpacing="2">STAGE</text>
      {/* concentric arcs */}
      {[
        { r: 60,  c: '#7E6DFF' },
        { r: 75,  c: '#FFB1C8' },
        { r: 90,  c: '#FFD06A' },
        { r: 105, c: '#9BFFB1' },
        { r: 120, c: '#9BFFB1' },
      ].map((a, i) => (
        <path key={i} d={`M ${160 - a.r} 130 A ${a.r} ${a.r} 0 0 1 ${160 + a.r} 130`} stroke={a.c} strokeWidth="6" fill="none" strokeOpacity="0.55"/>
      ))}
      {/* dots */}
      {Array.from({ length: 100 }).map((_, i) => {
        const ang = Math.PI + (i / 99) * Math.PI;
        const r = 60 + (i % 5) * 15;
        return <circle key={i} cx={160 + Math.cos(ang)*r} cy={130 + Math.sin(ang)*r} r="0.9" fill="#fff" opacity="0.7"/>;
      })}
    </svg>
  );
}

// 6. Cart drawer
function CartDrawer(){
  const evs = window.TS_EVENTS;
  const items = [
    { event: evs[0], seat: 'Pista · GA', qty: 2, unit: 65 },
    { event: evs[1], seat: 'Section C · Row 8', qty: 1, unit: 96 },
  ];
  const subtotal = items.reduce((s, i) => s + i.qty * i.unit, 0);
  const fees = Math.round(subtotal * 0.085);
  const total = subtotal + fees;
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#0A0A0C' }}>
      <MeshBg seed={5}/>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(8,8,10,0.55)', backdropFilter: 'blur(6px)' }}/>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 3 }}>
        {/* status bar room */}
        <div style={{ height: 54 }}/>
        <div style={{ padding: '14px 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              fontFamily: '"Space Grotesk", system-ui',
              fontSize: 22, fontWeight: 600, color: '#fff',
              letterSpacing: '-0.022em',
            }}>Your cart</div>
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>3 tickets · 2 events</div>
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: 12,
            background: 'rgba(255,255,255,0.08)',
            border: '0.5px solid rgba(255,255,255,0.12)',
            color: '#fff', display: 'grid', placeItems: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="m3 3 6 6m0-6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </div>
        </div>

        {/* Hold timer */}
        <div style={{ padding: '14px 18px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px',
            borderRadius: 14,
            background: 'rgba(255,177,200,0.12)',
            border: '0.5px solid rgba(255,177,200,0.30)',
            color: '#FFD6E2',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 14,
              background: 'rgba(255,177,200,0.20)',
              display: 'grid', placeItems: 'center',
              flexShrink: 0,
            }}><ClockIcon/></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11.5, fontWeight: 600 }}>Seats held for you</div>
              <div style={{ fontSize: 10.5, opacity: 0.85, marginTop: 1 }}>Complete in <b style={{ color: '#fff', fontVariantNumeric: 'tabular-nums' }}>07:42</b> or they release</div>
            </div>
          </div>
        </div>

        {/* items */}
        <div style={{ padding: '14px 18px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((it, idx) => (
            <CartItem key={idx} item={it}/>
          ))}
        </div>

        {/* promo */}
        <div style={{ padding: '14px 18px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '11px 14px',
            borderRadius: 14,
            background: 'rgba(255,255,255,0.04)',
            border: '0.5px dashed rgba(255,255,255,0.18)',
            color: 'rgba(255,255,255,0.7)',
            fontSize: 12,
          }}>
            <span style={{ flex: 1 }}>Promo code</span>
            <span style={{ color: '#D4A8F0', fontWeight: 600 }}>Apply</span>
          </div>
        </div>
      </div>

      {/* bottom checkout panel */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 4 }}>
        <div style={{
          padding: '14px 18px 26px',
          background: 'rgba(12,12,14,0.85)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
          borderTop: '0.5px solid rgba(255,255,255,0.10)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'rgba(255,255,255,0.6)' }}>
            <span>Subtotal</span><span style={{ fontVariantNumeric: 'tabular-nums', color: '#fff' }}>${subtotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
            <span>Service fees</span><span style={{ fontVariantNumeric: 'tabular-nums', color: '#fff' }}>${fees}</span>
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '10px 0' }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{
              fontFamily: '"Space Grotesk", system-ui',
              fontSize: 14, color: '#fff', fontWeight: 600,
            }}>Total</span>
            <span style={{
              fontFamily: '"Space Grotesk", system-ui',
              fontSize: 22, color: '#fff', fontWeight: 700,
              fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em',
            }}>${total}</span>
          </div>
          <button style={{
            appearance: 'none', border: 0, cursor: 'pointer',
            width: '100%', marginTop: 12,
            padding: '14px 16px',
            borderRadius: 16,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
            color: '#141416',
            fontFamily: '"Space Grotesk", system-ui',
            fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            Checkout · ${total} <ChevRight/>
          </button>
        </div>
      </div>
    </div>
  );
}

function CartItem({ item }){
  const c = window.TS_COVERS[item.event.cover];
  return (
    <div style={{
      display: 'flex', gap: 12,
      padding: 10,
      borderRadius: 16,
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(18px) saturate(160%)',
      WebkitBackdropFilter: 'blur(18px) saturate(160%)',
      border: '0.5px solid rgba(255,255,255,0.10)',
    }}>
      <div style={{ width: 64, height: 84, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
        <TSCover event={item.event} height={84}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>{item.event.title}</div>
        <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{item.event.day} {item.event.date} {item.event.month} · {item.event.venue}</div>
        <div style={{ fontSize: 10.5, color: 'rgba(212,168,240,0.95)', marginTop: 6, fontWeight: 500 }}>{item.seat}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          {/* qty stepper */}
          <div style={{
            display: 'flex', alignItems: 'center',
            background: 'rgba(255,255,255,0.06)',
            border: '0.5px solid rgba(255,255,255,0.10)',
            borderRadius: 10,
            overflow: 'hidden',
          }}>
            <div style={{ width: 26, height: 26, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 14 }}>−</div>
            <div style={{ width: 22, textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{item.qty}</div>
            <div style={{ width: 26, height: 26, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 14 }}>+</div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>${item.qty * item.unit}</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  HomeFull, HeroCloseup, CoverFlowDetail, NetflixDetail, QuickView, CartDrawer,
  TS_W, TS_H,
});
