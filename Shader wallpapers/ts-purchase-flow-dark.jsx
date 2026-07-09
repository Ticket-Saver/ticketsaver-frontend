// ts-purchase-flow.jsx — Seat picker, checkout, ticket-received (NFT), my tickets

/* ────────────────────────────── 1. SEAT PICKER ──────────────────────────────
   Two-step flow matching the existing TicketSaver tool:
     · Step 1: Venue map — selectable SVG sections (102, 103, 201, etc.)
     · Step 2: Seat grid for selected section, with status legend
   The Stripe checkout that follows is intentionally NOT modified.
─────────────────────────────────────────────────────────────────────────────── */

/* Status palette aligns with the existing legend
   Disponible · Ocupado · Tu selección · Acompañante · Silla de Ruedas · Movilidad Reducida */
const SEAT_STATUS = {
  available:   { color: '#3B82F6', label: 'Disponible'        },
  occupied:    { color: '#9CA3AF', label: 'Ocupado'           },
  selected:    { color: '#F6C84A', label: 'Tu selección'      },
  companion:   { color: '#C084FC', label: 'Acompañante'       },
  wheelchair:  { color: '#1E3A8A', label: 'Silla de Ruedas'   },
  reduced:     { color: '#10B981', label: 'Movilidad Reducida'},
};

const VENUE_SECTIONS = [
  // tier: orchestra (front) — premium, center fan
  { id: '105', label: '105', tier: 'orch', x:  88, y: 60, w: 64, h: 70 },
  { id: '106', label: '106', tier: 'orch', x:  22, y: 70, w: 62, h: 68 },
  { id: '104', label: '104', tier: 'orch', x: 156, y: 70, w: 62, h: 68 },
  // tier: front orchestra (small wings)
  { id: '101', label: '101', tier: 'front', x: 226, y: 14, w: 38, h: 44 },
  { id: '102', label: '102 Green', tier: 'front', x: 92, y: 14, w: 56, h: 40 },
  { id: '103', label: '103', tier: 'front', x:  -22, y: 14, w: 38, h: 44 },
  // tier: mezzanine — middle ring
  { id: '201', label: '201', tier: 'mezz', x: 218, y: 64, w: 38, h: 70 },
  { id: '202', label: '202', tier: 'mezz', x: 218, y: 142, w: 38, h: 50 },
  { id: '203', label: '203', tier: 'mezz', x: 192, y: 196, w: 50, h: 32 },
  { id: '204', label: '204', tier: 'mezz', x: 124, y: 196, w: 64, h: 30 },
  { id: '205', label: '205', tier: 'mezz', x:  52, y: 196, w: 64, h: 30 },
  { id: '206', label: '206', tier: 'mezz', x:  -2, y: 196, w: 50, h: 32 },
  { id: '207', label: '207', tier: 'mezz', x: -16, y: 142, w: 38, h: 50 },
  { id: '208', label: '208', tier: 'mezz', x: -16, y: 64, w: 38, h: 70 },
  // tier: balcony — outer
  { id: '301', label: '301', tier: 'bal', x: 268, y: 50, w: 28, h: 70 },
  { id: '302', label: '302', tier: 'bal', x: 268, y: 124, w: 28, h: 60 },
  { id: '303', label: '303', tier: 'bal', x: 260, y: 188, w: 36, h: 38 },
  { id: '304', label: '304', tier: 'bal', x: 188, y: 232, w: 60, h: 28 },
  { id: '305', label: '305', tier: 'bal', x:  60, y: 232, w: 60, h: 28 },
  { id: '306', label: '306', tier: 'bal', x:  -8, y: 232, w: 60, h: 28 },
  { id: '307', label: '307', tier: 'bal', x: -56, y: 188, w: 36, h: 38 },
  { id: '308', label: '308', tier: 'bal', x: -56, y: 124, w: 28, h: 60 },
];
const TIER_COLOR = {
  front: '#F6C84A', // golden — premium
  orch:  '#E879F9', // magenta — orchestra
  mezz:  '#F97A4A', // orange — mezzanine
  bal:   '#3B82F6', // blue — balcony
};
const TIER_PRICE = { front: 240, orch: 173.60, mezz: 110, bal: 65 };
const TIER_FEE   = { front:  46, orch:  33.60, mezz:  21, bal: 12 };

function SeatPicker(){
  const [step, setStep] = React.useState('venue'); // 'venue' | 'seats'
  const [section, setSection] = React.useState(null);
  const [secs, setSecs] = React.useState(5 * 60 + 32); // 5:32 hold

  React.useEffect(() => {
    if (secs <= 0) return;
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#0A0A0C' }}>
      <MeshBg seed={7}/>
      {step === 'venue'
        ? <VenuePickerStep onPick={(s) => { setSection(s); setStep('seats'); }} secs={secs}/>
        : <SeatGridStep section={section} onBack={() => setStep('venue')} secs={secs}/>
      }
    </div>
  );
}

function HoldTimer({ secs, large }){
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  const warn = secs <= 60;
  const expired = secs <= 0;
  return (
    <div title="Time left to complete your purchase" style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: large ? '7px 12px' : '6px 10px',
      borderRadius: 999,
      background: expired
        ? 'rgba(255,90,110,0.18)'
        : warn
          ? 'rgba(255,177,200,0.22)'
          : 'rgba(255,255,255,0.08)',
      border: '0.5px solid ' + (warn ? 'rgba(255,177,200,0.35)' : 'rgba(255,255,255,0.12)'),
      color: expired ? '#FFB3BD' : warn ? '#FFD6E2' : '#fff',
      fontFamily: '"Space Grotesk", system-ui',
      fontSize: large ? 12 : 10.5, fontWeight: 700,
      letterSpacing: '0.06em',
      fontVariantNumeric: 'tabular-nums',
      animation: warn && !expired ? 'tsTickPulse 1s ease-in-out infinite' : 'none',
    }}>
      <svg width={large ? 12 : 11} height={large ? 12 : 11} viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7.6" r="5.4" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M7 5v3l2 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M5 1.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
      {expired ? 'TIME UP' : `${mm}:${ss}`}
      <style>{`@keyframes tsTickPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }`}</style>
    </div>
  );
}

/* ── Step 1 — venue map ── */
function VenuePickerStep({ onPick, secs }){
  const [hover, setHover] = React.useState(null);
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 2, overflowY: 'auto', paddingBottom: 90 }}>
      {/* Top bar */}
      <div style={{ paddingTop: 60, padding: '60px 14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <BackButton/>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: 13, color: '#fff', fontWeight: 600, fontFamily: '"Space Grotesk", system-ui' }}>Select a section</div>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>Sat, Jun 22 · Greek Theatre</div>
        </div>
        <HoldTimer secs={secs}/>
      </div>

      {/* Hold banner */}
      <div style={{ padding: '12px 14px 0' }}>
        <div style={{
          padding: '8px 12px', borderRadius: 12,
          background: 'rgba(212,168,240,0.10)',
          border: '0.5px solid rgba(212,168,240,0.22)',
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 11, color: 'rgba(255,255,255,0.75)',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: 99, background: '#FFB1C8', boxShadow: '0 0 8px #FFB1C8' }}/>
          <span><strong style={{ color: '#fff', fontWeight: 600 }}>Seats held for you.</strong> Complete your purchase before the timer runs out.</span>
        </div>
      </div>

      {/* Map */}
      <div style={{ padding: '16px 14px 0' }}>
        <div style={{
          borderRadius: 20,
          background: 'rgba(255,255,255,0.04)',
          border: '0.5px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(18px) saturate(160%)', WebkitBackdropFilter: 'blur(18px) saturate(160%)',
          padding: '12px 10px',
        }}>
          {/* Stage label */}
          <div style={{ textAlign: 'center', fontSize: 9.5, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.55)', fontWeight: 700, textTransform: 'uppercase', paddingBottom: 6 }}>STAGE</div>
          <div style={{ position: 'relative', height: 4, margin: '0 30px', borderRadius: 99, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)', marginBottom: 8 }}/>

          <svg viewBox="0 0 280 270" style={{ width: '100%', display: 'block' }}>
            <defs>
              <radialGradient id="stageGlow" cx="50%" cy="-5%" r="80%">
                <stop offset="0%" stopColor="#FFE6F2" stopOpacity="0.35"/>
                <stop offset="100%" stopColor="#FFE6F2" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <rect x="0" y="0" width="280" height="270" fill="url(#stageGlow)"/>
            {VENUE_SECTIONS.map(s => {
              const c = TIER_COLOR[s.tier];
              const isHover = hover === s.id;
              return (
                <g key={s.id}
                   onClick={() => onPick(s)}
                   onMouseEnter={() => setHover(s.id)}
                   onMouseLeave={() => setHover(null)}
                   style={{ cursor: 'pointer' }}>
                  <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={6}
                    fill={c} fillOpacity={isHover ? 0.95 : 0.65}
                    stroke={c} strokeWidth={isHover ? 1.4 : 0.6} strokeOpacity={isHover ? 1 : 0.5}
                    style={{ transition: 'all .15s' }}/>
                  {/* tiny seat dots pattern */}
                  <SeatDots x={s.x} y={s.y} w={s.w} h={s.h}/>
                  <text x={s.x + s.w / 2} y={s.y + s.h / 2 + 3} textAnchor="middle"
                    fontSize={s.w > 50 ? 10.5 : 8.5} fontWeight="700"
                    fill="#141416"
                    style={{ fontFamily: '"Space Grotesk", system-ui', pointerEvents: 'none' }}>
                    {s.label.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Tier legend */}
        <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[
            ['front','Premium',  TIER_PRICE.front],
            ['orch', 'Orchestra', TIER_PRICE.orch],
            ['mezz', 'Mezzanine', TIER_PRICE.mezz],
            ['bal',  'Balcony',   TIER_PRICE.bal],
          ].map(([k, lbl, price]) => (
            <div key={k} style={{
              flex: '1 1 calc(50% - 6px)',
              padding: '10px 12px', borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '0.5px solid rgba(255,255,255,0.10)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: TIER_COLOR[k] }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: '#fff', fontWeight: 600, letterSpacing: '-0.01em' }}>{lbl}</div>
                <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.55)', marginTop: 1, fontVariantNumeric: 'tabular-nums' }}>From ${Math.round(price)}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '0.5px dashed rgba(255,255,255,0.10)', fontSize: 11, color: 'rgba(255,255,255,0.55)', textAlign: 'center' }}>
          Tap a section to view its seats
        </div>
      </div>
    </div>
  );
}

function SeatDots({ x, y, w, h }){
  // Procedural tiny seat dots to add texture to each section
  const cols = Math.max(3, Math.floor(w / 7));
  const rows = Math.max(2, Math.floor(h / 7));
  const dx = w / (cols + 1), dy = h / (rows + 1);
  const dots = [];
  for (let r = 1; r <= rows; r++) for (let c = 1; c <= cols; c++) dots.push([x + c * dx, y + r * dy]);
  return <g pointerEvents="none">{dots.map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={0.7} fill="rgba(20,20,22,0.35)"/>)}</g>;
}

/* ── Step 2 — seat grid for the picked section ── */
function SeatGridStep({ section, onBack, secs }){
  const rows = ['I','J','K','L','M','N','O'];
  const seatsPerRow = 14;

  // Deterministic occupancy + accessibility seats per section
  const seed = section.id.charCodeAt(0) + section.id.charCodeAt(2 % section.id.length);
  function cellStatus(r, c, init){
    if (init) return 'selected';
    const h = (r * 31 + c * 17 + seed * 7) % 100;
    if (h < 6)  return 'wheelchair';
    if (h < 12) return 'companion';
    if (h < 18) return 'reduced';
    if (h < 48) return 'occupied';
    return 'available';
  }

  const [selected, setSelected] = React.useState(() => new Set(['K-7','K-8']));
  const price = TIER_PRICE[section.tier];
  const fee   = TIER_FEE[section.tier];
  const count = selected.size;

  function toggle(key, status){
    if (status === 'occupied' || status === 'wheelchair' || status === 'companion' || status === 'reduced') return;
    const next = new Set(selected);
    if (next.has(key)) next.delete(key); else next.add(key);
    setSelected(next);
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ paddingTop: 60, padding: '60px 14px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div onClick={onBack} style={{ cursor: 'pointer' }}><BackButton/></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, color: '#fff', fontWeight: 600, fontFamily: '"Space Grotesk", system-ui' }}>Select Seats — {section.label}</div>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>Click on available seats to select them</div>
        </div>
        <HoldTimer secs={secs}/>
      </div>

      {/* STAGE */}
      <div style={{ padding: '20px 18px 8px' }}>
        <div style={{
          textAlign: 'center', fontSize: 9.5, letterSpacing: '0.22em',
          color: 'rgba(255,255,255,0.65)', fontWeight: 700, textTransform: 'uppercase', paddingBottom: 8,
        }}>STAGE</div>
        <div style={{ height: 3, margin: '0 24px', borderRadius: 99, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }}/>
      </div>

      {/* Seat grid — scrollable horizontally + vertically if needed */}
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 14px 0' }}>
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 6,
          padding: '12px 12px',
          borderRadius: 16,
          background: 'rgba(255,255,255,0.04)',
          border: '0.5px solid rgba(255,255,255,0.10)',
        }}>
          {rows.map((r, ri) => (
            <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 14, fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.75)',
                fontFamily: '"Space Grotesk", system-ui',
              }}>{r}</div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: `repeat(${seatsPerRow}, 1fr)`, gap: 3 }}>
                {Array.from({ length: seatsPerRow }).map((_, ci) => {
                  const seatNum = seatsPerRow - ci;
                  const key = `${r}-${seatNum}`;
                  const init = selected.has(key);
                  const status = cellStatus(ri, ci, init);
                  return (
                    <Seat key={key}
                      status={status}
                      num={seatNum}
                      onClick={() => toggle(key, status)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: '12px 14px 4px' }}>
        <div style={{
          padding: '10px 12px', borderRadius: 14,
          background: 'rgba(255,255,255,0.04)',
          border: '0.5px solid rgba(255,255,255,0.10)',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6,
        }}>
          {Object.entries(SEAT_STATUS).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Seat status={k} mini/>
              <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.1 }}>{v.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky footer */}
      <div style={{
        padding: '10px 14px 24px',
        background: 'linear-gradient(to top, rgba(10,10,12,0.96) 60%, rgba(10,10,12,0))',
      }}>
        <div style={{
          padding: '10px 14px', borderRadius: 16,
          background: 'rgba(255,255,255,0.05)',
          border: '0.5px solid rgba(255,255,255,0.10)',
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 8,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)' }}>Selected seats: <span style={{ color: '#fff', fontWeight: 600 }}>{count}</span></div>
            <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.45)', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
              Price per seat: ${price.toFixed(2)} · Fee per seat: ${fee.toFixed(2)}
            </div>
          </div>
          <div style={{
            padding: '6px 10px', borderRadius: 10,
            background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.10)',
            fontSize: 11.5, color: '#fff', fontWeight: 600,
            fontFamily: '"Space Grotesk", system-ui',
            fontVariantNumeric: 'tabular-nums',
          }}>${(count * (price + fee)).toFixed(2)}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onBack} style={{
            appearance: 'none', cursor: 'pointer', flex: '0 0 38%',
            padding: '12px 14px', borderRadius: 16,
            background: 'rgba(255,255,255,0.06)',
            border: '0.5px solid rgba(255,255,255,0.12)',
            color: '#fff', fontFamily: '"Space Grotesk", system-ui',
            fontSize: 13, fontWeight: 600,
          }}>Cancel</button>
          <button disabled={count === 0} style={{
            appearance: 'none', border: 0, cursor: count ? 'pointer' : 'not-allowed', flex: 1,
            padding: '12px 14px', borderRadius: 16,
            background: count
              ? 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.86))'
              : 'rgba(255,255,255,0.10)',
            color: count ? '#141416' : 'rgba(255,255,255,0.45)',
            fontFamily: '"Space Grotesk", system-ui',
            fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            boxShadow: count ? '0 10px 30px rgba(212,168,240,0.2)' : 'none',
          }}>Continue ({count}) <ChevRight/></button>
        </div>
      </div>
    </div>
  );
}

function Seat({ status, num, onClick, mini }){
  const s = SEAT_STATUS[status] || SEAT_STATUS.available;
  const isSel  = status === 'selected';
  const isWC   = status === 'wheelchair';
  const isOcc  = status === 'occupied';
  const size = mini ? 14 : null;
  return (
    <div onClick={onClick} style={{
      position: 'relative',
      width: size, height: size,
      aspectRatio: mini ? undefined : '1 / 1',
      borderRadius: 4,
      background: s.color,
      opacity: isOcc ? 0.55 : 1,
      cursor: onClick && !isOcc ? 'pointer' : 'default',
      display: 'grid', placeItems: 'center',
      color: '#fff',
      fontSize: mini ? 0 : 7,
      fontWeight: 700,
      fontFamily: '"Space Grotesk", system-ui',
      boxShadow: isSel ? '0 0 0 1.5px #fff, 0 0 8px rgba(246,200,74,0.5)' : 'none',
      transition: 'transform .12s',
    }}>
      {isWC && !mini ? (
        <svg width="7" height="7" viewBox="0 0 10 10" fill="#fff">
          <circle cx="5" cy="2" r="1.1"/>
          <path d="M4 4v3l2 1v1.5h1.5V8L5.5 7V5h2V4z"/>
        </svg>
      ) : !mini ? num : null}
    </div>
  );
}

/* ────────────────────────────── 2. CHECKOUT ────────────────────────────── */

function Checkout(){
  const [pay, setPay] = React.useState('apple');
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#0A0A0C' }}>
      <MeshBg seed={9}/>
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, overflowY: 'auto', paddingBottom: 130 }}>
        {/* Top bar */}
        <div style={{ paddingTop: 60, padding: '60px 14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BackButton/>
          <div style={{ fontSize: 13, color: '#fff', fontWeight: 600, fontFamily: '"Space Grotesk", system-ui' }}>Checkout</div>
          <div style={{
            padding: '6px 10px', borderRadius: 999,
            background: 'rgba(255,177,200,0.18)', color: '#FFD6E2',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.10em',
            fontVariantNumeric: 'tabular-nums',
          }}>04:12</div>
        </div>

        {/* Order summary card */}
        <div style={{ padding: '20px 18px 0' }}>
          <div style={{
            padding: 14, borderRadius: 18,
            background: 'rgba(255,255,255,0.05)',
            border: '0.5px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(18px) saturate(160%)',
            WebkitBackdropFilter: 'blur(18px) saturate(160%)',
            display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <div style={{ width: 64, height: 80, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
              <TSCover event={window.TS_EVENTS[1]} height={80} aspect="3/4"/>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 14, color: '#fff', fontWeight: 600, fontFamily: '"Space Grotesk", system-ui', letterSpacing: '-0.015em' }}>Mitski</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Sat, Jun 22 · 20:30</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Greek Theatre, Berkeley</div>
              <div style={{
                marginTop: 8, display: 'flex', gap: 5,
              }}>
                <Tag>Rear · A12</Tag>
                <Tag>Rear · A13</Tag>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div style={{ padding: '20px 18px 0' }}>
          <SectionLabel>Contact</SectionLabel>
          <Field label="Email" value="dani@gmail.com"/>
        </div>

        {/* Payment */}
        <div style={{ padding: '18px 18px 0' }}>
          <SectionLabel>Payment</SectionLabel>

          {/* Apple Pay button */}
          <div onClick={() => setPay('apple')} style={{
            padding: '14px 16px', borderRadius: 14,
            background: pay === 'apple' ? '#000' : 'rgba(255,255,255,0.06)',
            border: '0.5px solid ' + (pay === 'apple' ? '#000' : 'rgba(255,255,255,0.10)'),
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            cursor: 'pointer',
            color: '#fff',
            fontWeight: 600, fontSize: 14,
          }}>
            <svg width="13" height="16" viewBox="0 0 13 16" fill="currentColor">
              <path d="M10.7 8.5c0-1.6 1.3-2.4 1.3-2.4-.7-1-1.8-1.2-2.2-1.2-1-.1-1.9.6-2.4.6-.5 0-1.2-.6-2-.6-1 0-2 .6-2.5 1.5-1.1 1.8-.3 4.6.7 6.1.5.7 1.1 1.6 1.9 1.5.7 0 1-.5 2-.5.9 0 1.2.5 2 .5.8 0 1.3-.7 1.8-1.5.6-.8.8-1.6.8-1.7 0 0-1.4-.5-1.4-2.3zM9 3.8c.4-.5.7-1.2.6-1.9-.6 0-1.3.4-1.7.9-.4.4-.7 1.1-.6 1.8.7.1 1.3-.3 1.7-.8z"/>
            </svg>
            Pay
          </div>

          {/* Or card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.10)' }}/>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>or pay with card</div>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.10)' }}/>
          </div>

          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10,
            padding: 14, borderRadius: 16,
            background: 'rgba(255,255,255,0.04)',
            border: '0.5px solid rgba(255,255,255,0.10)',
          }}>
            <Field label="Card number" value="4242 4242 4242 4242" trailing={<CardLogos/>}/>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Field label="Expiry" value="04 / 27"/>
              <Field label="CVC" value="•••"/>
            </div>
            <Field label="ZIP" value="94704"/>
          </div>

          {/* Stripe badge */}
          <div style={{
            marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 500,
          }}>
            <svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 1a3.5 3.5 0 0 0-3 5.3v1.4A1.3 1.3 0 0 0 3.3 9h3.4a1.3 1.3 0 0 0 1.3-1.3V6.3A3.5 3.5 0 0 0 5 1zm0 1.3a2.2 2.2 0 0 1 2.2 2.2V6H2.8V4.5a2.2 2.2 0 0 1 2.2-2.2z" fill="currentColor"/></svg>
            Secured by Stripe · 256-bit encryption
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ padding: '20px 18px 0' }}>
          <div style={{
            padding: 14, borderRadius: 16,
            background: 'rgba(255,255,255,0.04)',
            border: '0.5px solid rgba(255,255,255,0.10)',
          }}>
            <LineItem label="2 × Rear $65" value="$130.00"/>
            <LineItem label="Service fee" value="$15.60"/>
            <LineItem label="NFT mint (Base)" value="$0.40"/>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.10)', margin: '10px 0' }}/>
            <LineItem label="Total" value="$146.00" bold/>
          </div>
        </div>

        <div style={{ height: 20 }}/>
      </div>

      {/* Sticky pay button */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 5,
        padding: '14px 14px 24px',
        background: 'linear-gradient(to top, rgba(10,10,12,0.96) 60%, rgba(10,10,12,0))',
      }}>
        <button style={{
          appearance: 'none', border: 0, cursor: 'pointer',
          width: '100%', padding: '14px 16px', borderRadius: 18,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.86))',
          color: '#141416',
          fontFamily: '"Space Grotesk", system-ui',
          fontSize: 14, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          boxShadow: '0 10px 30px rgba(212,168,240,0.2)',
        }}>
          Pay $146.00
        </button>
        <div style={{ marginTop: 8, textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
          Your tickets mint as NFTs on Base — you keep them forever.
        </div>
      </div>
    </div>
  );
}

function Tag({ children }){
  return (
    <div style={{
      padding: '4px 8px', borderRadius: 999,
      background: 'rgba(212,168,240,0.18)',
      border: '0.5px solid rgba(212,168,240,0.30)',
      color: '#E5E5EA',
      fontSize: 9.5, fontWeight: 600, letterSpacing: '0.04em',
    }}>{children}</div>
  );
}

function Field({ label, value, trailing }){
  return (
    <div style={{
      padding: '10px 14px', borderRadius: 12,
      background: 'rgba(255,255,255,0.05)',
      border: '0.5px solid rgba(255,255,255,0.10)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 13.5, color: '#fff', marginTop: 2, fontVariantNumeric: 'tabular-nums', fontFamily: label === 'Card number' || label === 'Expiry' || label === 'CVC' || label === 'ZIP' ? '"Space Grotesk", system-ui' : 'inherit' }}>{value}</div>
      </div>
      {trailing}
    </div>
  );
}

function CardLogos(){
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      <div style={{ width: 22, height: 14, borderRadius: 3, background: '#1A1F71', color: '#fff', fontSize: 7, display: 'grid', placeItems: 'center', fontWeight: 700, letterSpacing: '0.04em' }}>VISA</div>
      <div style={{ width: 22, height: 14, borderRadius: 3, background: 'rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <div style={{ width: 6, height: 6, borderRadius: 99, background: '#EB001B' }}/>
        <div style={{ width: 6, height: 6, borderRadius: 99, background: '#F79E1B', marginLeft: -3, mixBlendMode: 'normal' }}/>
      </div>
    </div>
  );
}

function LineItem({ label, value, bold }){
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '5px 0',
    }}>
      <div style={{ fontSize: bold ? 14 : 12, color: bold ? '#fff' : 'rgba(255,255,255,0.7)', fontWeight: bold ? 600 : 400 }}>{label}</div>
      <div style={{
        fontSize: bold ? 16 : 12.5, color: '#fff', fontWeight: bold ? 700 : 500,
        fontFamily: '"Space Grotesk", system-ui', fontVariantNumeric: 'tabular-nums',
        letterSpacing: bold ? '-0.01em' : 'normal',
      }}>{value}</div>
    </div>
  );
}

/* ──────────────────────────── 3. TICKET RECEIVED (NFT) ──────────────────────────── */

function TicketReceived(){
  const event = window.TS_EVENTS.find(e => e.id === 'mitski-laurel') || window.TS_EVENTS[1];
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#0A0A0C' }}>
      <MeshBg seed={4}/>
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, overflowY: 'auto', paddingBottom: 32 }}>
        {/* Confirmation hero */}
        <div style={{ padding: '74px 18px 0', textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 28, margin: '0 auto',
            background: 'radial-gradient(circle at 30% 30%, #E5E5EA, #525258)',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 10px 40px rgba(60,60,68,0.50)',
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M5 11.5 9 15.5 17 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{
            marginTop: 14,
            fontFamily: '"Space Grotesk", system-ui',
            fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.025em',
          }}>You're in.</div>
          <div style={{ marginTop: 6, fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>2 tickets minted to your wallet</div>
        </div>

        {/* NFT ticket card */}
        <div style={{ padding: '28px 24px 0' }}>
          <NFTTicketCard event={event}/>
        </div>

        {/* Wallet row */}
        <div style={{ padding: '18px 24px 0' }}>
          <div style={{
            padding: 12, borderRadius: 14,
            background: 'rgba(255,255,255,0.04)',
            border: '0.5px solid rgba(255,255,255,0.10)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg,#0052FF,#6E8FFF)',
              display: 'grid', placeItems: 'center',
              color: '#fff', fontSize: 11, fontWeight: 700,
              fontFamily: '"Space Grotesk", system-ui',
            }}>B</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11.5, color: '#fff', fontWeight: 500 }}>Minted on Base</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 1, fontFamily: '"Space Grotesk", system-ui', fontVariantNumeric: 'tabular-nums' }}>0x3f2a…b91d</div>
            </div>
            <div style={{ fontSize: 10.5, color: '#D4A8F0', fontWeight: 600 }}>View on Zora ↗</div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ padding: '14px 24px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button style={{
            appearance: 'none', border: 0, cursor: 'pointer',
            width: '100%', padding: '12px 14px', borderRadius: 14,
            background: '#000', color: '#fff',
            fontFamily: '"Space Grotesk", system-ui',
            fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
             Add to Apple Wallet
          </button>
          <button style={{
            appearance: 'none', cursor: 'pointer',
            width: '100%', padding: '12px 14px', borderRadius: 14,
            background: 'rgba(255,255,255,0.06)',
            border: '0.5px solid rgba(255,255,255,0.12)',
            color: '#fff',
            fontFamily: '"Space Grotesk", system-ui',
            fontSize: 13, fontWeight: 600,
          }}>Share · Save image</button>
        </div>
      </div>
    </div>
  );
}

function NFTTicketCard({ event }){
  const c = window.TS_COVERS[event.cover];
  return (
    <div style={{
      position: 'relative',
      borderRadius: 24,
      overflow: 'hidden',
      background: `linear-gradient(135deg, ${c.a}, ${c.b}, ${c.c})`,
      boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.15) inset',
      transform: 'perspective(900px) rotateX(2deg)',
    }}>
      {/* Animated gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 75% 20%, ${c.accent}66, transparent 60%), radial-gradient(circle at 20% 80%, #FFB1C866, transparent 50%)`,
        animation: 'tsShine 6s linear infinite',
      }}/>
      {/* Noise */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.2, mixBlendMode: 'overlay' }}>
        <filter id="nftN"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2"/></filter>
        <rect width="100%" height="100%" filter="url(#nftN)"/>
      </svg>

      {/* Top */}
      <div style={{ position: 'relative', padding: '16px 18px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 9.5, letterSpacing: '0.20em', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', fontWeight: 700 }}>TicketSaver · No. 042</div>
          <div style={{
            marginTop: 6,
            fontFamily: '"Space Grotesk", system-ui',
            fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1,
          }}>{event.artist}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.78)', marginTop: 3 }}>{event.subtitle}</div>
        </div>
        <div style={{
          padding: '5px 8px', borderRadius: 99,
          background: 'rgba(0,0,0,0.40)',
          border: '0.5px solid rgba(255,255,255,0.20)',
          color: '#fff',
          fontSize: 9, letterSpacing: '0.14em', fontWeight: 700, textTransform: 'uppercase',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        }}>NFT · Base</div>
      </div>

      {/* Big date */}
      <div style={{ position: 'relative', padding: '38px 18px 18px', textAlign: 'center', color: '#fff' }}>
        <div style={{ fontSize: 9.5, letterSpacing: '0.20em', opacity: 0.7, fontWeight: 700 }}>SAT · JUN</div>
        <div style={{
          fontFamily: '"Space Grotesk", system-ui',
          fontSize: 96, fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.04em',
          marginTop: 2,
        }}>22</div>
        <div style={{ fontSize: 11.5, opacity: 0.8, marginTop: 4, letterSpacing: '0.04em' }}>20:30 · Greek Theatre, Berkeley</div>
      </div>

      {/* Perforation */}
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: -8, top: -8, width: 16, height: 16, borderRadius: 99,
          background: '#0A0A0C',
        }}/>
        <div style={{
          position: 'absolute', right: -8, top: -8, width: 16, height: 16, borderRadius: 99,
          background: '#0A0A0C',
        }}/>
        <div style={{
          height: 1, margin: '0 18px',
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.5) 50%, transparent 50%)',
          backgroundSize: '6px 1px',
        }}/>
      </div>

      {/* Seat row */}
      <div style={{
        position: 'relative',
        padding: '14px 18px 16px',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
      }}>
        <SeatField label="Section" value="Rear"/>
        <SeatField label="Row" value="A"/>
        <SeatField label="Seat" value="12-13"/>
      </div>

      {/* QR */}
      <div style={{ position: 'relative', padding: '0 18px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <FakeQR/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9.5, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', fontWeight: 700 }}>Scan at entry</div>
          <div style={{ marginTop: 4, fontSize: 11, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>
            Your ticket is bound to your wallet — only you can use it. After the show it lives on as a collectible.
          </div>
        </div>
      </div>
      <style>{`@keyframes tsShine { from { transform: translateX(-10%); } to { transform: translateX(10%); } }`}</style>
    </div>
  );
}

function SeatField({ label, value }){
  return (
    <div style={{
      padding: '8px 10px',
      borderRadius: 10,
      background: 'rgba(0,0,0,0.30)',
      border: '0.5px solid rgba(255,255,255,0.16)',
      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
    }}>
      <div style={{ fontSize: 8.5, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontWeight: 700 }}>{label}</div>
      <div style={{
        fontFamily: '"Space Grotesk", system-ui',
        fontSize: 17, fontWeight: 700, color: '#fff', marginTop: 1, letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums',
      }}>{value}</div>
    </div>
  );
}

function FakeQR(){
  // Pseudo-random QR
  const cells = [];
  for (let y = 0; y < 21; y++) {
    for (let x = 0; x < 21; x++) {
      const corner = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      const innerCorner = (x >= 2 && x <= 4 && y >= 2 && y <= 4) || (x >= 16 && x <= 18 && y >= 2 && y <= 4) || (x >= 2 && x <= 4 && y >= 16 && y <= 18);
      const ring = (x === 0 || x === 6 || y === 0 || y === 6) && (x < 7 && y < 7);
      const ring2 = (x === 14 || x === 20 || y === 0 || y === 6) && (x > 13 && y < 7);
      const ring3 = (x === 0 || x === 6 || y === 14 || y === 20) && (x < 7 && y > 13);
      if (corner) {
        if (innerCorner || ring || ring2 || ring3) cells.push([x, y]);
      } else {
        if (((x * 7 + y * 11 + x * y * 3) % 5) < 2) cells.push([x, y]);
      }
    }
  }
  return (
    <div style={{
      width: 80, height: 80, borderRadius: 10, padding: 6,
      background: '#fff',
    }}>
      <svg viewBox="0 0 21 21" style={{ display: 'block' }}>
        {cells.map(([x, y], i) => <rect key={i} x={x} y={y} width={1} height={1} fill="#141416"/>)}
      </svg>
    </div>
  );
}

/* ────────────────────────────── 4. MY TICKETS ────────────────────────────── */

function MyTickets(){
  const [tab, setTab] = React.useState('upcoming');
  const upcoming = [window.TS_EVENTS[1], window.TS_EVENTS[3]].filter(Boolean);
  const past     = [window.TS_EVENTS[0], window.TS_EVENTS[2], window.TS_EVENTS[4]].filter(Boolean);
  const list = tab === 'upcoming' ? upcoming : tab === 'past' ? past : [];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#0A0A0C' }}>
      <MeshBg seed={3}/>
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, overflowY: 'auto', paddingBottom: 32 }}>
        {/* Header */}
        <div style={{ padding: '64px 18px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>Hey, Dani</div>
              <div style={{
                fontFamily: '"Space Grotesk", system-ui',
                fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1,
                marginTop: 2,
              }}>My tickets</div>
            </div>
            <div style={{
              padding: '6px 10px', borderRadius: 999,
              background: 'rgba(255,255,255,0.06)',
              border: '0.5px solid rgba(255,255,255,0.10)',
              display: 'flex', alignItems: 'center', gap: 6,
              color: '#fff', fontSize: 11, fontWeight: 600,
              fontFamily: '"Space Grotesk", system-ui',
            }}>
              <div style={{ width: 14, height: 14, borderRadius: 99, background: 'linear-gradient(135deg, #0052FF, #6E8FFF)' }}/>
              0x3f2a…b91d
            </div>
          </div>

          {/* Wallet summary */}
          <div style={{
            marginTop: 14, padding: 14, borderRadius: 16,
            background: 'rgba(255,255,255,0.04)',
            border: '0.5px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(16px) saturate(160%)', WebkitBackdropFilter: 'blur(16px) saturate(160%)',
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
          }}>
            <Stat label="Upcoming" value="2"/>
            <Stat label="Collected" value="14"/>
            <Stat label="Rarity" value="Gold"/>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ padding: '20px 18px 12px', display: 'flex', gap: 6 }}>
          {[['upcoming','Upcoming'],['past','Past'],['collect','Collection']].map(([k, lbl]) => (
            <div key={k} onClick={() => setTab(k)} style={{
              padding: '8px 14px', borderRadius: 999,
              background: tab === k ? '#fff' : 'rgba(255,255,255,0.05)',
              color: tab === k ? '#141416' : '#fff',
              border: '0.5px solid ' + (tab === k ? 'transparent' : 'rgba(255,255,255,0.10)'),
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>{lbl}</div>
          ))}
        </div>

        {/* List */}
        {tab !== 'collect' ? (
          <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {list.map((e, i) => <UpcomingTicketCard key={e.id} event={e} past={tab === 'past'} idx={i}/>)}
          </div>
        ) : (
          <div style={{ padding: '0 18px' }}>
            <CollectionGrid/>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }){
  return (
    <div>
      <div style={{ fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{label}</div>
      <div style={{ marginTop: 4, fontFamily: '"Space Grotesk", system-ui', fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{value}</div>
    </div>
  );
}

function UpcomingTicketCard({ event, past, idx }){
  const c = window.TS_COVERS[event.cover];
  return (
    <div style={{
      position: 'relative',
      borderRadius: 18,
      overflow: 'hidden',
      background: 'rgba(255,255,255,0.04)',
      border: '0.5px solid rgba(255,255,255,0.10)',
      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      filter: past ? 'saturate(0.6) opacity(0.7)' : 'none',
    }}>
      <div style={{ display: 'flex', gap: 0 }}>
        {/* Cover */}
        <div style={{ width: 96, position: 'relative', flexShrink: 0 }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, ${c.a}, ${c.b}, ${c.c})`,
          }}/>
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(circle at 30% 30%, ${c.accent}55, transparent 60%)`,
          }}/>
          <div style={{
            position: 'absolute', left: 8, top: 10, color: '#fff',
            fontSize: 8.5, letterSpacing: '0.18em', fontWeight: 700, textTransform: 'uppercase',
            opacity: 0.85,
          }}>{event.day || 'SAT'}</div>
          <div style={{
            position: 'absolute', left: 8, top: 22, color: '#fff',
            fontFamily: '"Space Grotesk", system-ui',
            fontSize: 38, fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.03em',
          }}>{event.date || (22 + idx)}</div>
          <div style={{
            position: 'absolute', left: 8, bottom: 8, color: '#fff',
            fontSize: 8.5, letterSpacing: '0.18em', fontWeight: 700, textTransform: 'uppercase',
            opacity: 0.7,
          }}>{event.month || 'JUN'}</div>
        </div>
        {/* perforation strip */}
        <div style={{
          width: 2, position: 'relative',
          backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.25) 50%, transparent 50%)',
          backgroundSize: '2px 6px',
        }}/>
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0, padding: 12, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontFamily: '"Space Grotesk", system-ui',
            fontSize: 15, fontWeight: 600, color: '#fff', letterSpacing: '-0.015em',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{event.title}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{event.venue || 'Greek Theatre'} · {event.location || 'Berkeley'}</div>
          <div style={{ flex: 1 }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <Tag>Rear · A12</Tag>
            <Tag>×2</Tag>
            <div style={{ flex: 1 }}/>
            <div style={{
              padding: '4px 8px', borderRadius: 6,
              background: 'rgba(0,82,255,0.20)',
              color: '#9CBBFF',
              fontSize: 8.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>{past ? 'Past · NFT' : 'NFT · Base'}</div>
          </div>
        </div>
      </div>
      {!past && (
        <div style={{
          padding: '10px 14px',
          borderTop: '0.5px dashed rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 11, color: 'rgba(255,255,255,0.7)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Pulse/> Doors in <strong style={{ color: '#fff', fontWeight: 600, marginLeft: 2 }}>{14 + idx * 7} days</strong>
          </span>
          <span style={{ color: '#D4A8F0', fontWeight: 600 }}>View ticket →</span>
        </div>
      )}
    </div>
  );
}

function Pulse(){
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: 8, height: 8 }}>
      <span style={{ position: 'absolute', inset: 0, borderRadius: 99, background: '#88E07A', animation: 'tsPulse 1.6s ease-out infinite' }}/>
      <span style={{ position: 'absolute', inset: 2, borderRadius: 99, background: '#88E07A' }}/>
      <style>{`@keyframes tsPulse { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.2); opacity: 0; } }`}</style>
    </span>
  );
}

function CollectionGrid(){
  const items = window.TS_EVENTS.slice(0, 9);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {items.map((e, i) => {
        const c = window.TS_COVERS[e.cover];
        return (
          <div key={e.id} style={{
            position: 'relative',
            aspectRatio: '3/4',
            borderRadius: 12,
            overflow: 'hidden',
            background: `linear-gradient(135deg, ${c.a}, ${c.b}, ${c.c})`,
            border: '0.5px solid rgba(255,255,255,0.10)',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 30% 30%, ${c.accent}55, transparent 60%)` }}/>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.25, mixBlendMode: 'overlay' }}>
              <filter id={`coll-n-${i}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/></filter>
              <rect width="100%" height="100%" filter={`url(#coll-n-${i})`}/>
            </svg>
            <div style={{ position: 'absolute', left: 6, top: 6, color: '#fff', fontSize: 7.5, letterSpacing: '0.14em', fontWeight: 700, opacity: 0.85, textTransform: 'uppercase' }}>#{String(i + 1).padStart(3,'0')}</div>
            <div style={{ position: 'absolute', left: 6, right: 6, bottom: 6, color: '#fff' }}>
              <div style={{ fontSize: 9, fontFamily: '"Space Grotesk", system-ui', fontWeight: 600, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.artist}</div>
              <div style={{ fontSize: 7.5, opacity: 0.65, marginTop: 1, letterSpacing: '0.04em' }}>{e.month || 'JUN'} · 2024</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

window.SeatPicker = SeatPicker;
window.Checkout = Checkout;
window.TicketReceived = TicketReceived;
window.MyTickets = MyTickets;
