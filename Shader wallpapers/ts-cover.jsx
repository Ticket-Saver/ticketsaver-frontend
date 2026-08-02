// ts-cover.jsx — Procedural event cover art (no external images)
// Renders a stylish gradient + typography poster from event.cover key.

function TSCover({ event, height = 200, big = false, focus = 'auto' }){
  const c = window.TS_COVERS[event.cover] || window.TS_COVERS.nebula;
  const id = `cover-${event.id}-${big?'b':'s'}`;
  const accentSize = big ? 60 : 36;
  return (
    <div style={{
      position: 'relative',
      width: '100%', height,
      overflow: 'hidden',
      borderRadius: 'inherit',
      background: `linear-gradient(135deg, ${c.a} 0%, ${c.b} 60%, ${c.c} 100%)`,
    }}>
      {/* Soft blob accent */}
      <div style={{
        position: 'absolute',
        width: '80%', height: '80%',
        left: '-20%', top: '20%',
        background: `radial-gradient(circle, ${c.accent}80 0%, transparent 60%)`,
        filter: 'blur(30px)',
      }}/>
      <div style={{
        position: 'absolute',
        width: '60%', height: '60%',
        right: '-10%', top: '-15%',
        background: `radial-gradient(circle, ${c.b}c0 0%, transparent 60%)`,
        filter: 'blur(24px)',
        mixBlendMode: 'screen',
      }}/>
      {/* Texture noise */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.22, mixBlendMode: 'overlay' }}>
        <filter id={`n-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0"/>
        </filter>
        <rect width="100%" height="100%" filter={`url(#n-${id})`}/>
      </svg>

      {/* category chip top-left */}
      <div style={{
        position: 'absolute', top: 12, left: 12,
        padding: '4px 9px', borderRadius: 999,
        background: 'rgba(0,0,0,0.32)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '0.5px solid rgba(255,255,255,0.2)',
        color: '#fff',
        fontSize: 9.5, fontWeight: 500,
        letterSpacing: '0.12em', textTransform: 'uppercase',
      }}>{event.category}</div>

      {/* Big title */}
      <div style={{
        position: 'absolute', bottom: big ? 22 : 12, left: 14, right: 14,
        color: '#fff',
      }}>
        <div style={{
          fontFamily: '"Space Grotesk", "Geist", system-ui',
          fontSize: big ? 36 : (event.title.length > 14 ? 16 : 22),
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 0.95,
          textShadow: '0 2px 16px rgba(0,0,0,0.4)',
        }}>{event.title}</div>
        {big && (
          <div style={{
            marginTop: 6,
            fontSize: 12, fontWeight: 400, opacity: 0.85,
            letterSpacing: '0.04em',
          }}>{event.subtitle}</div>
        )}
      </div>

      {/* date badge top-right */}
      <div style={{
        position: 'absolute', top: 10, right: 10,
        background: 'rgba(255,255,255,0.95)',
        color: '#180826',
        padding: '5px 8px',
        borderRadius: 8,
        textAlign: 'center',
        fontFamily: '"Space Grotesk", system-ui',
        lineHeight: 1,
        minWidth: 38,
      }}>
        <div style={{ fontSize: 8.5, fontWeight: 600, letterSpacing: '0.1em', opacity: 0.7 }}>{event.month}</div>
        <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>{String(event.date).padStart(2,'0')}</div>
      </div>
    </div>
  );
}

// Card variants — switchable via Tweaks
function EventCardPoster({ event, onTap }){
  return (
    <div onClick={onTap} style={{
      width: '100%',
      borderRadius: 18,
      overflow: 'hidden',
      background: 'rgba(255,255,255,0.06)',
      backdropFilter: 'blur(20px) saturate(160%)',
      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      border: '0.5px solid rgba(255,255,255,0.12)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
      cursor: 'pointer',
    }}>
      <TSCover event={event} height={180}/>
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>{event.subtitle}</div>
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{event.venue} · {event.city}</div>
          </div>
          <div style={{ flexShrink: 0, textAlign: 'right' }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>From</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>${event.priceFrom}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCardCinema({ event, onTap }){
  return (
    <div onClick={onTap} style={{
      width: '100%',
      borderRadius: 16,
      background: 'rgba(255,255,255,0.06)',
      backdropFilter: 'blur(18px) saturate(160%)',
      WebkitBackdropFilter: 'blur(18px) saturate(160%)',
      border: '0.5px solid rgba(255,255,255,0.12)',
      boxShadow: '0 8px 26px rgba(0,0,0,0.3)',
      padding: 10,
      display: 'flex', gap: 12, alignItems: 'stretch',
      cursor: 'pointer',
    }}>
      {/* date column */}
      <div style={{
        width: 64, flexShrink: 0,
        background: 'rgba(255,255,255,0.04)',
        border: '0.5px solid rgba(255,255,255,0.10)',
        borderRadius: 10,
        padding: '10px 6px',
        textAlign: 'center',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        fontFamily: '"Space Grotesk", system-ui',
      }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.16em' }}>{event.day}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 1, margin: '4px 0' }}>{String(event.date).padStart(2,'0')}</div>
        <div style={{ fontSize: 9.5, fontWeight: 600, color: 'rgba(212,168,240,0.95)', letterSpacing: '0.18em' }}>{event.month}</div>
      </div>
      {/* mini cover */}
      <div style={{ width: 60, flexShrink: 0, borderRadius: 10, overflow: 'hidden' }}>
        <TSCover event={event} height={84}/>
      </div>
      {/* info */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{event.title}</div>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)', marginTop: 2, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{event.venue} · {event.time}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            fontSize: 9, padding: '2px 6px',
            borderRadius: 4,
            background: 'rgba(212,168,240,0.18)',
            color: '#E0C0FF',
            letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600,
          }}>{event.availability}</div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>${event.priceFrom}+</div>
        </div>
      </div>
    </div>
  );
}

function EventCardTicket({ event, onTap }){
  // Ticket cut — semicircle bite between cover and info zones
  return (
    <div onClick={onTap} style={{
      width: '100%',
      cursor: 'pointer',
      position: 'relative',
      filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.35))',
    }}>
      {/* ticket shape with mask */}
      <div style={{
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        border: '0.5px solid rgba(255,255,255,0.14)',
        WebkitMaskImage: 'radial-gradient(circle 12px at 0 188px, transparent 12px, #000 12.5px), radial-gradient(circle 12px at 100% 188px, transparent 12px, #000 12.5px)',
        WebkitMaskComposite: 'source-in',
        maskComposite: 'intersect',
        borderRadius: 18,
        overflow: 'hidden',
      }}>
        <TSCover event={event} height={180}/>
        {/* perforation dashed line */}
        <div style={{
          height: 1,
          background: 'linear-gradient(to right, transparent 4px, rgba(255,255,255,0.25) 4px, rgba(255,255,255,0.25) 10px, transparent 10px) 0 0/14px 1px repeat-x',
        }}/>
        <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 4 }}>Admit one</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{event.subtitle}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{event.venue} · {event.day} {event.date} {event.month}</div>
          </div>
          <div style={{ marginLeft: 12, textAlign: 'right' }}>
            <div style={{ fontSize: 9, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>Price</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>${event.priceFrom}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCardMinimal({ event, onTap }){
  const c = window.TS_COVERS[event.cover] || window.TS_COVERS.nebula;
  return (
    <div onClick={onTap} style={{
      width: '100%',
      borderRadius: 14,
      padding: 16,
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(16px) saturate(150%)',
      WebkitBackdropFilter: 'blur(16px) saturate(150%)',
      border: '0.5px solid rgba(255,255,255,0.10)',
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: `linear-gradient(135deg, ${c.a}, ${c.b})`,
        boxShadow: `0 4px 16px ${c.a}40`,
      }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>{event.day} {String(event.date).padStart(2,'0')} {event.month}</div>
          <div style={{ height: 2, width: 2, borderRadius: 2, background: 'rgba(255,255,255,0.3)' }}/>
          <div style={{ fontSize: 9, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>{event.time}</div>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginTop: 4, letterSpacing: '-0.01em' }}>{event.title}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{event.venue} · {event.city}</div>
      </div>
      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>${event.priceFrom}</div>
      </div>
    </div>
  );
}

function EventCard(props){
  const variant = props.variant || 'poster';
  if (variant === 'cinema')  return <EventCardCinema {...props}/>;
  if (variant === 'ticket')  return <EventCardTicket {...props}/>;
  if (variant === 'minimal') return <EventCardMinimal {...props}/>;
  return <EventCardPoster {...props}/>;
}

Object.assign(window, {
  TSCover, EventCard,
  EventCardPoster, EventCardCinema, EventCardTicket, EventCardMinimal,
});
