// ts-event-detail.jsx — Event detail screen (replaces old QuickView)
// Includes: banner, multi-date selector, gallery, description,
// date/time block, Google Maps iframe, sticky "Choose seats from" CTA.

function EventDetail(){
  // Demo event has multiple dates — to show multi-date capability
  const base = window.TS_EVENTS.find(e => e.id === 'mitski-laurel') || window.TS_EVENTS[1];
  const dates = [
    { id: 'd1', day: 'SAT', date: 22, month: 'JUN', time: '20:30', city: 'Berkeley, CA',  venue: 'Greek Theatre',  priceFrom: 58,  status: 'Selling fast' },
    { id: 'd2', day: 'SUN', date: 23, month: 'JUN', time: '20:30', city: 'Berkeley, CA',  venue: 'Greek Theatre',  priceFrom: 58,  status: 'Few left' },
    { id: 'd3', day: 'FRI', date: 28, month: 'JUN', time: '21:00', city: 'Los Angeles',   venue: 'Hollywood Bowl',  priceFrom: 72,  status: 'On sale' },
    { id: 'd4', day: 'SAT', date: 6, month: 'JUL', time: '20:00', city: 'San Diego, CA', venue: 'The Rady Shell',  priceFrom: 65,  status: 'On sale' },
  ];

  const [sel, setSel] = React.useState(0);
  const cur = dates[sel];

  // gallery — procedural posters from other event covers, themed
  const galleryKeys = ['rose','midnight','sunset','nebula','mono'];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#0A0A0C' }}>
      <MeshBg seed={6}/>
      {/* scrollable */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        overflowY: 'auto', WebkitOverflowScrolling: 'touch',
        paddingBottom: 110,
      }}>
        {/* ── Banner ── */}
        <Banner event={base}/>

        {/* Header overlay (floats on top) — handled in Banner */}

        {/* Title block under banner */}
        <div style={{ padding: '18px 18px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 10.5, color: '#E5E5EA', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}>{base.category} · Tour</div>
              <div style={{
                fontFamily: '"Space Grotesk", system-ui',
                fontSize: 28, fontWeight: 700,
                color: '#fff', letterSpacing: '-0.028em', lineHeight: 1.0,
                marginTop: 6,
              }}>{base.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 6, letterSpacing: '-0.005em' }}>{base.subtitle}</div>
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(255,255,255,0.06)',
              border: '0.5px solid rgba(255,255,255,0.12)',
              display: 'grid', placeItems: 'center', color: '#fff',
              flexShrink: 0,
            }}><HeartIcon/></div>
          </div>

          {/* artist quick row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
            <ArtistAvatar event={base}/>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>{base.artist}</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)', marginTop: 1 }}>1.2M followers · 4 upcoming</div>
            </div>
            <div style={{ flex: 1 }}/>
            <div style={{
              padding: '6px 12px', borderRadius: 999,
              background: 'rgba(212,168,240,0.16)',
              border: '0.5px solid rgba(212,168,240,0.3)',
              color: '#E5E5EA',
              fontSize: 11, fontWeight: 600,
            }}>Follow</div>
          </div>

          {/* tags */}
          <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
            {base.tags.map(t => (
              <div key={t} style={{
                padding: '5px 10px', borderRadius: 999,
                background: 'rgba(255,255,255,0.05)',
                border: '0.5px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.78)',
                fontSize: 10.5, fontWeight: 500,
              }}>{t}</div>
            ))}
          </div>
        </div>

        {/* ── Multi-date selector ── */}
        <div style={{ padding: '22px 0 0' }}>
          <div style={{ padding: '0 18px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{
                fontFamily: '"Space Grotesk", system-ui',
                fontSize: 15, fontWeight: 600, color: '#fff', letterSpacing: '-0.015em',
              }}>Pick your date</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>4 shows · different cities</div>
            </div>
            <div style={{ fontSize: 10.5, color: '#D4A8F0', fontWeight: 500 }}>View calendar</div>
          </div>
          <div style={{
            display: 'flex', gap: 10, overflowX: 'auto',
            padding: '4px 18px 4px', scrollSnapType: 'x mandatory',
          }}>
            {dates.map((d, i) => (
              <DateCard key={d.id} date={d} active={i === sel} onClick={() => setSel(i)}/>
            ))}
          </div>
        </div>

        {/* ── Selected date highlight ── */}
        <div style={{ padding: '18px 18px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 14px',
            borderRadius: 16,
            background: 'rgba(212,168,240,0.12)',
            border: '0.5px solid rgba(212,168,240,0.30)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'rgba(255,255,255,0.95)',
              color: '#141416',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              fontFamily: '"Space Grotesk", system-ui',
              flexShrink: 0,
            }}>
              <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.16em', opacity: 0.7 }}>{cur.month}</div>
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, marginTop: 2 }}>{String(cur.date).padStart(2,'0')}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, color: '#fff', fontWeight: 600, letterSpacing: '-0.01em' }}>{cur.day}, {cur.month} {cur.date} · {cur.time}</div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.65)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
                <PinIcon/> {cur.venue}, {cur.city}
              </div>
            </div>
            <div style={{
              padding: '4px 10px', borderRadius: 8,
              background: 'rgba(255,177,200,0.20)',
              color: '#FFD6E2',
              fontSize: 9.5, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase',
              flexShrink: 0,
            }}>{cur.status}</div>
          </div>
        </div>

        {/* ── Description ── */}
        <div style={{ padding: '22px 18px 0' }}>
          <SectionLabel>About the show</SectionLabel>
          <div style={{ fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,0.78)', textWrap: 'pretty' }}>
            Mitski returns with <i>The Land Is Inhospitable</i>, a record about American loneliness and the
            longing for connection. Expect a stripped-down stage, a string quartet, and a setlist that pulls
            from her entire catalog — from <i>Bury Me at Makeout Creek</i> to <i>Laurel Hell</i>.
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: '#D4A8F0', fontWeight: 500 }}>Read more</div>
        </div>

        {/* ── Gallery ── */}
        <div style={{ padding: '22px 0 0' }}>
          <div style={{ padding: '0 18px 10px' }}>
            <SectionLabel>Gallery</SectionLabel>
          </div>
          <div style={{
            display: 'flex', gap: 10, overflowX: 'auto',
            padding: '0 18px', scrollSnapType: 'x mandatory',
          }}>
            {galleryKeys.map((k, i) => (
              <div key={i} style={{
                flexShrink: 0,
                width: i === 0 ? 200 : 140,
                height: i === 0 ? 200 : 140,
                borderRadius: 14, overflow: 'hidden',
                border: '0.5px solid rgba(255,255,255,0.12)',
                background: `linear-gradient(135deg, ${window.TS_COVERS[k].a}, ${window.TS_COVERS[k].b}, ${window.TS_COVERS[k].c})`,
                position: 'relative',
                scrollSnapAlign: 'start',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `radial-gradient(circle at 30% 70%, ${window.TS_COVERS[k].accent}40 0%, transparent 60%)`,
                }}/>
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.25, mixBlendMode: 'overlay' }}>
                  <filter id={`gn-${i}`}>
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/>
                    <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
                  </filter>
                  <rect width="100%" height="100%" filter={`url(#gn-${i})`}/>
                </svg>
                {i === 0 && (
                  <div style={{ position: 'absolute', left: 12, bottom: 10, color: '#fff' }}>
                    <div style={{ fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.85, fontWeight: 600 }}>Live · 2024</div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginTop: 3, letterSpacing: '-0.01em' }}>Brooklyn Steel</div>
                  </div>
                )}
                {i === 0 && (
                  <div style={{
                    position: 'absolute', top: 10, right: 10,
                    width: 30, height: 30, borderRadius: 99,
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                    display: 'grid', placeItems: 'center', color: '#fff',
                  }}>
                    <svg width="10" height="10" viewBox="0 0 12 12"><path d="M3 2v8l7-4z" fill="currentColor"/></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Location ── */}
        <div style={{ padding: '22px 18px 0' }}>
          <SectionLabel>Location</SectionLabel>
          <div style={{
            borderRadius: 16, overflow: 'hidden',
            border: '0.5px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.04)',
          }}>
            <div style={{ position: 'relative', height: 200, background: '#1a1230' }}>
              <iframe
                title="Venue location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(cur.venue + ', ' + cur.city)}&z=14&output=embed`}
                width="100%"
                height="200"
                style={{ border: 0, filter: 'invert(0.92) hue-rotate(180deg) saturate(0.6) brightness(0.95)', display: 'block' }}
                loading="lazy"
              />
              {/* glassy badge floats on map */}
              <div style={{
                position: 'absolute', left: 12, top: 12,
                padding: '7px 10px', borderRadius: 12,
                background: 'rgba(12,12,14,0.75)',
                backdropFilter: 'blur(14px) saturate(180%)',
                WebkitBackdropFilter: 'blur(14px) saturate(180%)',
                border: '0.5px solid rgba(255,255,255,0.14)',
                color: '#fff', display: 'flex', alignItems: 'center', gap: 7,
                fontSize: 11.5, fontWeight: 500,
              }}>
                <PinIcon/> {cur.venue}
              </div>
            </div>
            <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 12.5, color: '#fff', fontWeight: 500 }}>{cur.venue}</div>
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{cur.city} · 2.4 mi · 12 min</div>
              </div>
              <div style={{
                padding: '7px 11px', borderRadius: 999,
                background: 'rgba(212,168,240,0.18)',
                border: '0.5px solid rgba(212,168,240,0.30)',
                color: '#E5E5EA',
                fontSize: 10.5, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>Directions <ChevRight/></div>
            </div>
          </div>
        </div>

        {/* ── Info row ── */}
        <div style={{ padding: '18px 18px 0' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 8,
          }}>
            <FactPill label="Doors"        value={cur.time}/>
            <FactPill label="Duration"     value="2h 15m"/>
            <FactPill label="Age"          value="All ages"/>
            <FactPill label="Bag policy"   value="Clear bags only"/>
          </div>
        </div>

        <div style={{ height: 28 }}/>
      </div>

      {/* Sticky bottom CTA */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 5,
        padding: '12px 14px 24px',
        background: 'linear-gradient(to top, rgba(10,10,12,0.95) 60%, rgba(10,10,12,0))',
      }}>
        <button style={{
          appearance: 'none', border: 0, cursor: 'pointer',
          width: '100%',
          padding: '14px 16px',
          borderRadius: 18,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.86))',
          color: '#141416',
          fontFamily: '"Space Grotesk", system-ui',
          fontSize: 14, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 10px 30px rgba(212,168,240,0.2)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>Choose seats</span>
            <span style={{ fontSize: 10, opacity: 0.5, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{cur.day} {cur.date}</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            From ${cur.priceFrom} <ChevRight/>
          </span>
        </button>
      </div>
    </div>
  );
}

function Banner({ event }){
  // Full-bleed banner with back button + share + heart over a cover image
  return (
    <div style={{ position: 'relative', height: 320, width: '100%' }}>
      <TSCover event={event} height={320} big/>
      {/* darken bottom */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '60%',
        background: 'linear-gradient(to top, rgba(10,10,12,1) 0%, rgba(10,10,12,0.5) 50%, transparent 100%)',
      }}/>
      {/* Top nav (over status bar room) */}
      <div style={{
        position: 'absolute', top: 54, left: 14, right: 14,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 4,
      }}>
        <BackButton/>
        <div style={{ display: 'flex', gap: 8 }}>
          <CircleBtn><ShareIcon/></CircleBtn>
          <CircleBtn><MoreIcon/></CircleBtn>
        </div>
      </div>
      {/* tour name & dates count */}
      <div style={{
        position: 'absolute', left: 18, bottom: 18, right: 18,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{
          padding: '5px 10px', borderRadius: 999,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          border: '0.5px solid rgba(255,255,255,0.2)',
          color: '#fff', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600,
        }}>4 dates · 3 cities</div>
        <div style={{
          color: '#fff', fontSize: 10.5, letterSpacing: '0.1em',
          textTransform: 'uppercase', fontWeight: 500, opacity: 0.7,
        }}>The Land Is Inhospitable Tour ’25</div>
      </div>
    </div>
  );
}

function BackButton(){
  return (
    <div style={{
      width: 38, height: 38, borderRadius: 12,
      background: 'rgba(0,0,0,0.45)',
      backdropFilter: 'blur(14px) saturate(160%)',
      WebkitBackdropFilter: 'blur(14px) saturate(160%)',
      border: '0.5px solid rgba(255,255,255,0.18)',
      display: 'grid', placeItems: 'center', color: '#fff',
    }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2 4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>
  );
}
function CircleBtn({ children }){
  return (
    <div style={{
      width: 38, height: 38, borderRadius: 12,
      background: 'rgba(0,0,0,0.45)',
      backdropFilter: 'blur(14px) saturate(160%)',
      WebkitBackdropFilter: 'blur(14px) saturate(160%)',
      border: '0.5px solid rgba(255,255,255,0.18)',
      display: 'grid', placeItems: 'center', color: '#fff',
    }}>{children}</div>
  );
}
function ShareIcon(){ return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M4 4l3-3 3 3M2 9v3a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function MoreIcon(){  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="3" cy="7" r="1.2" fill="currentColor"/><circle cx="7" cy="7" r="1.2" fill="currentColor"/><circle cx="11" cy="7" r="1.2" fill="currentColor"/></svg>; }

function ArtistAvatar({ event }){
  const c = window.TS_COVERS[event.cover];
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 18,
      background: `linear-gradient(135deg, ${c.a}, ${c.b})`,
      border: '1.5px solid rgba(255,255,255,0.18)',
      display: 'grid', placeItems: 'center',
      color: '#fff',
      fontFamily: '"Space Grotesk", system-ui',
      fontSize: 13, fontWeight: 700,
      flexShrink: 0,
    }}>{event.artist[0]}</div>
  );
}

function SectionLabel({ children }){
  return (
    <div style={{
      fontFamily: '"Space Grotesk", system-ui',
      fontSize: 15, fontWeight: 600, color: '#fff',
      letterSpacing: '-0.015em',
      marginBottom: 10,
    }}>{children}</div>
  );
}

function DateCard({ date, active, onClick }){
  return (
    <div onClick={onClick} style={{
      flexShrink: 0,
      scrollSnapAlign: 'start',
      width: 140,
      padding: 12,
      borderRadius: 16,
      cursor: 'pointer',
      background: active ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.05)',
      backdropFilter: active ? 'none' : 'blur(18px) saturate(160%)',
      WebkitBackdropFilter: active ? 'none' : 'blur(18px) saturate(160%)',
      border: '0.5px solid ' + (active ? 'transparent' : 'rgba(255,255,255,0.10)'),
      color: active ? '#141416' : '#fff',
      boxShadow: active ? '0 10px 26px rgba(212,168,240,0.30)' : 'none',
      transition: 'all .2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <div style={{
          fontFamily: '"Space Grotesk", system-ui',
          fontSize: 9.5, fontWeight: 700, letterSpacing: '0.18em',
          opacity: active ? 0.55 : 0.55,
        }}>{date.day}</div>
        <div style={{
          fontFamily: '"Space Grotesk", system-ui',
          fontSize: 9.5, fontWeight: 700, letterSpacing: '0.18em',
          opacity: 0.55,
        }}>{date.month}</div>
      </div>
      <div style={{
        fontFamily: '"Space Grotesk", system-ui',
        fontSize: 32, fontWeight: 700, lineHeight: 1,
        marginTop: 4, letterSpacing: '-0.02em',
      }}>{String(date.date).padStart(2,'0')}</div>
      <div style={{
        marginTop: 8,
        fontSize: 11, fontWeight: 500,
        color: active ? '#26262A' : 'rgba(255,255,255,0.65)',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{date.venue}</div>
      <div style={{
        fontSize: 10, opacity: active ? 0.65 : 0.5, marginTop: 2,
      }}>{date.city} · {date.time}</div>
      <div style={{
        marginTop: 10, paddingTop: 8,
        borderTop: '0.5px solid ' + (active ? 'rgba(20,20,22,0.10)' : 'rgba(255,255,255,0.08)'),
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: active ? '#525258' : '#D4A8F0',
        }}>{date.status}</div>
        <div style={{ fontSize: 11.5, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>${date.priceFrom}+</div>
      </div>
    </div>
  );
}

window.EventDetail = EventDetail;
