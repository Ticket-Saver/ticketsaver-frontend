// ts-info-pages.jsx — About, Contact, Footer for TicketSaver

function AboutPage(){
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#0A0A0C' }}>
      <MeshBg seed={11}/>
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, overflowY: 'auto', paddingBottom: 32 }}>
        {/* Header */}
        <div style={{ paddingTop: 60, padding: '60px 14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BackButton/>
          <div style={{ fontSize: 13, color: '#fff', fontWeight: 600, fontFamily: '"Space Grotesk", system-ui' }}>About</div>
          <div style={{ width: 38 }}/>
        </div>

        {/* Hero */}
        <div style={{ padding: '32px 22px 0' }}>
          <div style={{ fontSize: 10.5, letterSpacing: '0.18em', color: '#D4A8F0', fontWeight: 700, textTransform: 'uppercase' }}>Our story</div>
          <div style={{
            fontFamily: '"Space Grotesk", system-ui',
            fontSize: 36, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.0,
            marginTop: 8, textWrap: 'pretty',
          }}>Live music, without the gatekeepers.</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)', marginTop: 14, lineHeight: 1.55, textWrap: 'pretty' }}>
            TicketSaver is a ticketing platform built by fans, for fans. We sell tickets at face value, mint them as NFTs on Base so they can't be faked, and let resales happen only at fair prices.
          </div>
        </div>

        {/* Stats */}
        <div style={{ padding: '26px 18px 0' }}>
          <div style={{
            padding: 16, borderRadius: 18,
            background: 'rgba(255,255,255,0.04)',
            border: '0.5px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(18px) saturate(160%)', WebkitBackdropFilter: 'blur(18px) saturate(160%)',
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
          }}>
            <StatBig label="Events" value="1.2K"/>
            <StatBig label="Fans" value="84K"/>
            <StatBig label="Saved in fees" value="$2.1M"/>
          </div>
        </div>

        {/* Values */}
        <div style={{ padding: '28px 22px 0' }}>
          <div style={{ fontFamily: '"Space Grotesk", system-ui', fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>What we believe</div>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Belief n="01" title="Face value, always" body="No dynamic pricing. No mystery fees. The price you see is what artists asked for."/>
            <Belief n="02" title="Tickets are yours" body="Every ticket is an NFT in your wallet. You own it, you control it, you keep it after the show."/>
            <Belief n="03" title="Resales without scalpers" body="Resell at face value or below. We cap markups so bots can't profit at your expense."/>
            <Belief n="04" title="Built for the night" body="Wallet QR at the door, Apple Wallet for the train, a collectible after — designed for real life."/>
          </div>
        </div>

        {/* Team */}
        <div style={{ padding: '28px 22px 0' }}>
          <div style={{ fontFamily: '"Space Grotesk", system-ui', fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>The team</div>
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[['Dani','Founder','#FFB1C8'],['Luca','Eng','#D4A8F0'],['Mara','Design','#525258']].map(([n, r, c]) => (
              <div key={n} style={{
                padding: 12, borderRadius: 14,
                background: 'rgba(255,255,255,0.04)',
                border: '0.5px solid rgba(255,255,255,0.10)',
                textAlign: 'center',
              }}>
                <div style={{ width: 48, height: 48, borderRadius: 99, margin: '0 auto', background: `linear-gradient(135deg, ${c}, #3D3D43)`, display: 'grid', placeItems: 'center', color: '#fff', fontFamily: '"Space Grotesk", system-ui', fontSize: 17, fontWeight: 700, border: '1.5px solid rgba(255,255,255,0.2)' }}>{n[0]}</div>
                <div style={{ marginTop: 8, fontSize: 12, color: '#fff', fontWeight: 600 }}>{n}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>{r}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: '26px 22px 0' }}>
          <button style={{
            appearance: 'none', border: 0, cursor: 'pointer',
            width: '100%', padding: '14px 16px', borderRadius: 16,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.86))',
            color: '#141416',
            fontFamily: '"Space Grotesk", system-ui',
            fontSize: 14, fontWeight: 600,
            boxShadow: '0 10px 30px rgba(212,168,240,0.2)',
          }}>Browse events</button>
        </div>

        <Footer/>
      </div>
    </div>
  );
}

function StatBig({ label, value }){
  return (
    <div>
      <div style={{ fontFamily: '"Space Grotesk", system-ui', fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginTop: 6 }}>{label}</div>
    </div>
  );
}

function Belief({ n, title, body }){
  return (
    <div style={{
      padding: '14px 14px', borderRadius: 16,
      background: 'rgba(255,255,255,0.04)',
      border: '0.5px solid rgba(255,255,255,0.10)',
      display: 'flex', gap: 12,
    }}>
      <div style={{
        flexShrink: 0, fontFamily: '"Space Grotesk", system-ui',
        fontSize: 11, color: '#D4A8F0', fontWeight: 700, letterSpacing: '0.14em',
      }}>{n}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13.5, color: '#fff', fontWeight: 600, letterSpacing: '-0.015em' }}>{title}</div>
        <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.65)', marginTop: 4, lineHeight: 1.45 }}>{body}</div>
      </div>
    </div>
  );
}

/* ──────────────── CONTACT ──────────────── */

function ContactPage(){
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#0A0A0C' }}>
      <MeshBg seed={2}/>
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, overflowY: 'auto', paddingBottom: 32 }}>
        <div style={{ paddingTop: 60, padding: '60px 14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BackButton/>
          <div style={{ fontSize: 13, color: '#fff', fontWeight: 600, fontFamily: '"Space Grotesk", system-ui' }}>Contact</div>
          <div style={{ width: 38 }}/>
        </div>

        <div style={{ padding: '28px 22px 0' }}>
          <div style={{ fontSize: 10.5, letterSpacing: '0.18em', color: '#D4A8F0', fontWeight: 700, textTransform: 'uppercase' }}>Get in touch</div>
          <div style={{
            fontFamily: '"Space Grotesk", system-ui',
            fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.0,
            marginTop: 8,
          }}>How can we help?</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 8, lineHeight: 1.5 }}>
            We answer within a few hours — usually in minutes during business hours.
          </div>
        </div>

        {/* Quick channels */}
        <div style={{ padding: '20px 18px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ChannelRow icon="chat"  title="Live chat"        sub="Avg. 3 min response · open 24/7"            cta="Start chat"/>
          <ChannelRow icon="mail"  title="hi@ticketsaver.io" sub="Support, partnerships, press"               cta="Compose"/>
        </div>

        {/* Topic picker */}
        <div style={{ padding: '24px 22px 0' }}>
          <div style={{ fontFamily: '"Space Grotesk", system-ui', fontSize: 15, fontWeight: 600, color: '#fff', letterSpacing: '-0.015em' }}>Write us</div>
          <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['Buying','Refunds','Wallet','Press','Promote a show','Other'].map((t, i) => (
              <div key={t} style={{
                padding: '7px 11px', borderRadius: 999,
                background: i === 0 ? '#fff' : 'rgba(255,255,255,0.05)',
                color: i === 0 ? '#141416' : '#fff',
                border: '0.5px solid ' + (i === 0 ? 'transparent' : 'rgba(255,255,255,0.10)'),
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
              }}>{t}</div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: '14px 22px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <FormField label="Your name" value="Daniela Pérez"/>
          <FormField label="Email" value="dani@gmail.com"/>
          <FormField label="Message" value="My ticket QR didn't scan at the door — luckily my wallet worked but I want to make sure for next time…" multi/>
          <button style={{
            appearance: 'none', border: 0, cursor: 'pointer',
            marginTop: 6, padding: '14px 16px', borderRadius: 16,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.86))',
            color: '#141416',
            fontFamily: '"Space Grotesk", system-ui',
            fontSize: 14, fontWeight: 600,
            boxShadow: '0 10px 30px rgba(212,168,240,0.2)',
          }}>Send message</button>
        </div>

        <Footer/>
      </div>
    </div>
  );
}

function ChannelRow({ icon, title, sub, cta }){
  return (
    <div style={{
      padding: 14, borderRadius: 16,
      background: 'rgba(255,255,255,0.05)',
      border: '0.5px solid rgba(255,255,255,0.10)',
      backdropFilter: 'blur(14px) saturate(160%)', WebkitBackdropFilter: 'blur(14px) saturate(160%)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 12,
        background: 'rgba(212,168,240,0.18)',
        border: '0.5px solid rgba(212,168,240,0.30)',
        display: 'grid', placeItems: 'center', color: '#E5E5EA',
        flexShrink: 0,
      }}>
        {icon === 'chat' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H6l-3 3v-3H4a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.4"/></svg>}
        {icon === 'mail' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M2 5l6 4 6-4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>}
        {icon === 'wallet' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/><circle cx="11" cy="8" r="1.2" fill="currentColor"/></svg>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{
        padding: '7px 11px', borderRadius: 999,
        background: 'rgba(255,255,255,0.10)',
        border: '0.5px solid rgba(255,255,255,0.14)',
        color: '#fff',
        fontSize: 11, fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: 4,
      }}>{cta} <ChevRight/></div>
    </div>
  );
}

function FormField({ label, value, multi }){
  return (
    <div style={{
      padding: '12px 14px', borderRadius: 14,
      background: 'rgba(255,255,255,0.04)',
      border: '0.5px solid rgba(255,255,255,0.10)',
    }}>
      <div style={{ fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{label}</div>
      <div style={{
        fontSize: 13.5, color: '#fff', marginTop: 4,
        lineHeight: multi ? 1.5 : 1,
        whiteSpace: multi ? 'pre-wrap' : 'nowrap',
        overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{value}</div>
    </div>
  );
}

/* ──────────────── FOOTER ──────────────── */

function Footer(){
  return (
    <div style={{
      marginTop: 36, padding: '24px 22px 32px',
      background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.30) 30%)',
      borderTop: '0.5px solid rgba(255,255,255,0.10)',
    }}>
      {/* Logo + tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'linear-gradient(135deg, #FFB1C8, #D4A8F0, #525258)',
          display: 'grid', placeItems: 'center',
          color: '#fff', fontFamily: '"Space Grotesk", system-ui',
          fontSize: 14, fontWeight: 700,
        }}>t</div>
        <div style={{ fontFamily: '"Space Grotesk", system-ui', fontSize: 16, color: '#fff', fontWeight: 600, letterSpacing: '-0.015em' }}>ticketsaver</div>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
        Face-value tickets, NFTs on Base, no scalpers. Made in Buenos Aires.
      </div>

      {/* Columns */}
      <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, gridRowGap: 14 }}>
        <FooterCol title="Discover" items={['Events','Artists','Venues','Categories']}/>
        <FooterCol title="Account"  items={['My tickets','Wallet','Sell tickets','Sign out']}/>
        <FooterCol title="Company"  items={['About','Contact','Promoters','Press kit']}/>
        <FooterCol title="Legal"    items={['Terms','Privacy','Cookies','Refunds']}/>
      </div>

      {/* Newsletter */}
      <div style={{
        marginTop: 22, padding: 14, borderRadius: 16,
        background: 'rgba(255,255,255,0.04)',
        border: '0.5px solid rgba(255,255,255,0.10)',
      }}>
        <div style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>Drops & new shows in your inbox</div>
        <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
          <div style={{
            flex: 1, padding: '10px 12px', borderRadius: 12,
            background: 'rgba(0,0,0,0.30)',
            border: '0.5px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.6)',
            fontSize: 12.5,
          }}>your@email.com</div>
          <button style={{
            appearance: 'none', border: 0, cursor: 'pointer',
            padding: '0 14px', borderRadius: 12,
            background: '#fff', color: '#141416',
            fontFamily: '"Space Grotesk", system-ui',
            fontSize: 12, fontWeight: 600,
          }}>Join</button>
        </div>
      </div>

      {/* Social */}
      <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <SocialDot label="IG"/>
        <SocialDot label="TT"/>
        <SocialDot label="X"/>
        <SocialDot label="YT"/>
        <div style={{ flex: 1 }}/>
        <div style={{
          padding: '5px 10px', borderRadius: 99,
          background: 'rgba(0,82,255,0.18)',
          border: '0.5px solid rgba(0,82,255,0.32)',
          color: '#9CBBFF', fontSize: 10, fontWeight: 700, letterSpacing: '0.10em',
        }}>BUILT ON BASE</div>
      </div>

      {/* Bottom row */}
      <div style={{
        marginTop: 20, paddingTop: 14,
        borderTop: '0.5px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 10, color: 'rgba(255,255,255,0.4)',
      }}>
        <div>© 2025 TicketSaver, Inc.</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <span>EN</span><span>ES</span><span>USD</span>
        </div>
      </div>
    </div>
  );
}

function FooterCol({ title, items }){
  return (
    <div>
      <div style={{
        fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.4)', fontWeight: 700,
      }}>{title}</div>
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map(i => <div key={i} style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.78)' }}>{i}</div>)}
      </div>
    </div>
  );
}

function SocialDot({ label }){
  return (
    <div style={{
      width: 30, height: 30, borderRadius: 99,
      background: 'rgba(255,255,255,0.06)',
      border: '0.5px solid rgba(255,255,255,0.12)',
      display: 'grid', placeItems: 'center',
      color: '#fff',
      fontFamily: '"Space Grotesk", system-ui',
      fontSize: 9.5, fontWeight: 700, letterSpacing: '0.04em',
    }}>{label}</div>
  );
}

window.AboutPage   = AboutPage;
window.ContactPage = ContactPage;
window.Footer      = Footer;
