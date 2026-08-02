// ts-home.jsx — Mobile home screens for TicketSaver redesign
// All screens go inside an <IOSDevice> via Babel.

const PURPLE = {
  hi:  '#D4A8F0',
  mid: '#B57BE8',
  lo:  '#8A5BC7',
  ink: '#0E0820',
};

// Reusable mesh bg behind a screen — fills parent
function MeshBg({ seed = 0, intensity = 1 }){
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current) return;
    const m = new window.TSMesh(ref.current, { seed, intensity });
    m.start();
    return () => m.stop();
  }, [seed]);
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 0,
      borderRadius: 'inherit', overflow: 'hidden',
      background: PURPLE.ink,
    }}>
      <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }}/>
    </div>
  );
}

// ─────────── Header / nav ───────────
function HomeHeader({ cartCount = 2 }){
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '6px 18px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Logo mark */}
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: `linear-gradient(135deg, ${PURPLE.hi} 0%, ${PURPLE.mid} 100%)`,
          display: 'grid', placeItems: 'center',
          boxShadow: `0 4px 14px ${PURPLE.mid}80`,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 4 L7 2 L11 4 L11 10 L7 12 L3 10 Z" stroke="#0E0820" strokeWidth="1.4" strokeLinejoin="round"/>
            <circle cx="7" cy="7" r="1.4" fill="#0E0820"/>
          </svg>
        </div>
        <div style={{
          fontFamily: '"Space Grotesk", system-ui',
          fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', color: '#fff',
        }}>ticketsaver</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ position: 'relative' }}>
          <GlassIcon><CartIcon/></GlassIcon>
          {cartCount > 0 && (
            <div style={{
              position: 'absolute', top: -3, right: -3,
              minWidth: 17, height: 17, padding: '0 4px',
              borderRadius: 10,
              background: `linear-gradient(135deg, #FF5E9E, #B57BE8)`,
              color: '#fff', fontSize: 9.5, fontWeight: 700,
              display: 'grid', placeItems: 'center',
              border: '1.5px solid #0E0820',
              fontVariantNumeric: 'tabular-nums',
            }}>{cartCount}</div>
          )}
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 99,
          background: `linear-gradient(135deg, ${PURPLE.hi}, ${PURPLE.mid})`,
          border: '0.5px solid rgba(255,255,255,0.18)',
          display: 'grid', placeItems: 'center',
          color: '#fff',
          fontFamily: '"Space Grotesk", system-ui',
          fontSize: 13, fontWeight: 700, letterSpacing: '0.01em',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(124,91,196,0.4)',
        }}>DP</div>
      </div>
    </div>
  );
}

function GlassIcon({ children, onClick }){
  return (
    <div onClick={onClick} style={{
      width: 38, height: 38, borderRadius: 12,
      background: 'rgba(255,255,255,0.08)',
      backdropFilter: 'blur(14px) saturate(160%)',
      WebkitBackdropFilter: 'blur(14px) saturate(160%)',
      border: '0.5px solid rgba(255,255,255,0.14)',
      display: 'grid', placeItems: 'center',
      color: '#fff', cursor: 'pointer',
    }}>{children}</div>
  );
}

function SearchIcon(){ return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6"/><path d="m11 11 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>; }
function CartIcon(){  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3h2l1.5 8.5a1 1 0 0 0 1 .8h5.7a1 1 0 0 0 1-.78L14.5 6H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6.5" cy="14" r="1" fill="currentColor"/><circle cx="11.5" cy="14" r="1" fill="currentColor"/></svg>; }
function ChevRight(){ return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="m4.5 2.5 3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function PinIcon(){   return <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1.5C4 1.5 2.5 3 2.5 5c0 2.5 3.5 5.5 3.5 5.5S9.5 7.5 9.5 5c0-2-1.5-3.5-3.5-3.5Z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6" cy="5" r="1.3" fill="currentColor"/></svg>; }
function ClockIcon(){ return <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/><path d="M6 3.5V6l1.6 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>; }
function HeartIcon(){ return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 12s-5-3-5-7a3 3 0 0 1 5-2 3 3 0 0 1 5 2c0 4-5 7-5 7Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>; }

// ─────────── 1. Hero carousel ───────────
function HeroCarousel({ events, active = 0 }){
  const cur = events[active];
  const w = 354;
  return (
    <div style={{ padding: '0 18px' }}>
      <div style={{
        position: 'relative',
        height: 410,
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
        border: '0.5px solid rgba(255,255,255,0.12)',
      }}>
        {/* full-bleed cover */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <TSCover event={cur} height={410} big/>
        </div>
        {/* bottom darken */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: '60%',
          background: 'linear-gradient(to top, rgba(8,4,20,0.92) 0%, rgba(8,4,20,0.5) 50%, transparent 100%)',
        }}/>

        {/* heart top-right */}
        <div style={{ position: 'absolute', top: 14, right: 14 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 11,
            background: 'rgba(0,0,0,0.36)',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            border: '0.5px solid rgba(255,255,255,0.2)',
            display: 'grid', placeItems: 'center', color: '#fff',
          }}><HeartIcon/></div>
        </div>

        {/* meta */}
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: 14, color: '#fff' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '4px 10px',
            borderRadius: 999,
            background: 'rgba(212,168,240,0.18)',
            border: '0.5px solid rgba(212,168,240,0.3)',
            color: '#E0C0FF',
            fontSize: 9.5, fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: 3, background: '#E0C0FF', boxShadow: '0 0 8px #E0C0FF' }}/>
            Featured · {cur.availability}
          </div>
          <div style={{
            fontFamily: '"Space Grotesk", system-ui',
            fontSize: 32, fontWeight: 700, letterSpacing: '-0.025em',
            lineHeight: 1, marginBottom: 8,
            textShadow: '0 2px 18px rgba(0,0,0,0.45)',
          }}>{cur.title}</div>
          <div style={{ fontSize: 12.5, opacity: 0.86, marginBottom: 14, letterSpacing: '0.02em' }}>
            <span style={{ opacity: 0.65 }}>{cur.day} {cur.date} {cur.month}, {cur.time} · </span>{cur.venue}, {cur.city}
          </div>
          <button style={{
            appearance: 'none', border: 0, cursor: 'pointer',
            width: '100%',
            padding: '13px 16px',
            borderRadius: 14,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
            color: '#1A0F33',
            fontFamily: '"Space Grotesk", system-ui',
            fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.01em',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 6px 20px rgba(255,255,255,0.18)',
          }}>
            <span>Get tickets · from ${cur.priceFrom}</span>
            <ChevRight/>
          </button>
        </div>
      </div>

      {/* dots */}
      <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginTop: 14 }}>
        {events.map((_, i) => (
          <div key={i} style={{
            height: 5,
            width: i === active ? 22 : 5,
            borderRadius: 4,
            background: i === active ? '#fff' : 'rgba(255,255,255,0.3)',
            transition: 'all .25s',
          }}/>
        ))}
      </div>
    </div>
  );
}

// ─────────── 2. Cover-flow 3D ───────────
function CoverFlow3D({ events, active = 1, height = 230 }){
  const cardW = 158, cardH = height;
  return (
    <div style={{ position: 'relative', height: cardH + 36 }}>
      <div style={{
        position: 'absolute', left: '50%', top: 0, height: cardH,
        perspective: 1100, transformStyle: 'preserve-3d',
        width: 0,
      }}>
        {events.map((e, i) => {
          const offset = i - active;
          const abs = Math.abs(offset);
          const tx = offset * 80;
          const rotY = offset * -32;
          const scale = abs === 0 ? 1 : 0.85 - Math.min(abs-1, 1)*0.06;
          const z = -abs * 50;
          const opacity = abs > 2 ? 0 : 1 - abs*0.18;
          return (
            <div key={e.id} style={{
              position: 'absolute',
              left: -cardW/2, top: 0,
              width: cardW, height: cardH,
              transform: `translateX(${tx}px) translateZ(${z}px) rotateY(${rotY}deg) scale(${scale})`,
              transformOrigin: 'center center',
              opacity,
              transition: 'transform .35s cubic-bezier(.3,.7,.3,1), opacity .25s',
              zIndex: 10 - abs,
            }}>
              <div style={{
                width: '100%', height: '100%',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: abs === 0
                  ? '0 22px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.18) inset'
                  : '0 12px 30px rgba(0,0,0,0.45)',
                border: '0.5px solid rgba(255,255,255,0.10)',
              }}>
                <TSCover event={e} height={cardH}/>
              </div>
            </div>
          );
        })}
      </div>
      {/* current label below */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        textAlign: 'center', color: '#fff',
      }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '-0.01em' }}>{events[active].title}</div>
        <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{events[active].day} {events[active].date} {events[active].month} · {events[active].city}</div>
      </div>
    </div>
  );
}

// ─────────── 3. Netflix-style horizontal row ───────────
function NetflixRow({ title, subtitle, events, variant }){
  return (
    <div>
      <div style={{ padding: '0 18px 10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            fontFamily: '"Space Grotesk", system-ui',
            fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', color: '#fff',
          }}>{title}</div>
          {subtitle && (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{subtitle}</div>
          )}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(212,168,240,0.95)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
          See all <ChevRight/>
        </div>
      </div>
      <div style={{
        display: 'flex', gap: 12,
        overflowX: 'auto', padding: '4px 18px 4px',
        scrollSnapType: 'x mandatory',
      }}>
        {events.map(e => (
          <div key={e.id} style={{ flexShrink: 0, width: 240, scrollSnapAlign: 'start' }}>
            <EventCard event={e} variant={variant}/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────── 4. Categories / quick chips ───────────
function CategoryChips({ active = 'All' }){
  const cats = ['All', 'Music', 'Theatre', 'Comedy', 'Sports', 'Family'];
  return (
    <div style={{
      display: 'flex', gap: 8, padding: '0 18px',
      overflowX: 'auto',
    }}>
      {cats.map(c => (
        <div key={c} style={{
          flexShrink: 0,
          padding: '8px 14px',
          borderRadius: 999,
          background: c === active ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.07)',
          color: c === active ? '#1A0F33' : 'rgba(255,255,255,0.85)',
          border: '0.5px solid ' + (c === active ? 'transparent' : 'rgba(255,255,255,0.12)'),
          backdropFilter: c === active ? 'none' : 'blur(14px)',
          WebkitBackdropFilter: c === active ? 'none' : 'blur(14px)',
          fontSize: 12, fontWeight: c === active ? 600 : 500,
          letterSpacing: '-0.005em',
        }}>{c}</div>
      ))}
    </div>
  );
}

// ─────────── Section title ───────────
function SectionTitle({ children, hint }){
  return (
    <div style={{ padding: '0 18px 10px' }}>
      <div style={{
        fontFamily: '"Space Grotesk", system-ui',
        fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', color: '#fff',
      }}>{children}</div>
      {hint && (
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{hint}</div>
      )}
    </div>
  );
}

Object.assign(window, {
  MeshBg, HomeHeader, HeroCarousel, CoverFlow3D, NetflixRow, CategoryChips, SectionTitle,
  GlassIcon, SearchIcon, CartIcon, ChevRight, PinIcon, ClockIcon, HeartIcon,
});
