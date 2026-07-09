// ts-desktop-info.jsx — Cinematic desktop versions of About, Contact, FAQs, Terms, Privacy

function DesktopAbout({ onNav }){
  return (
    <DesktopChrome active="about" onNav={onNav}>
      <div style={{ padding:'140px 56px 60px', maxWidth:1200, margin:'0 auto' }}>
        <div style={{ fontSize:12, color:'#D4A8F0', fontWeight:700, letterSpacing:'0.20em', textTransform:'uppercase' }}>Our story</div>
        <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:96, fontWeight:700, letterSpacing:'-0.04em', lineHeight:0.95, marginTop:18, maxWidth:1000, textWrap:'pretty' }}>Live music, without the gatekeepers.</div>
        <div style={{ fontSize:18, color:'rgba(255,255,255,0.72)', marginTop:24, maxWidth:760, lineHeight:1.55 }}>
          TicketSaver is a ticketing platform built by fans, for fans. We sell tickets at face value, mint them as NFTs on Base so they can't be faked, and let resales happen only at fair prices.
        </div>
      </div>

      <div style={{ padding:'40px 56px', display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:18, maxWidth:1200, margin:'0 auto' }}>
        {[['1.2K','Events'],['84K','Fans'],['$2.1M','Saved in fees']].map(([v, l]) => (
          <div key={l} style={{ padding:'30px 28px', borderRadius:18, background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.10)' }}>
            <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:60, fontWeight:700, letterSpacing:'-0.03em', lineHeight:1 }}>{v}</div>
            <div style={{ fontSize:11, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)', fontWeight:700, marginTop:14 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ padding:'60px 56px', maxWidth:1200, margin:'0 auto' }}>
        <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:36, fontWeight:600, letterSpacing:'-0.025em', marginBottom:32 }}>What we believe</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:16 }}>
          {[
            ['01','Face value, always','No dynamic pricing. No mystery fees. The price you see is what artists asked for.'],
            ['02','Tickets are yours','Every ticket is an NFT in your wallet. You own it, you control it, you keep it after the show.'],
            ['03','Resales without scalpers','Resell at face value or below. We cap markups so bots can\'t profit at your expense.'],
            ['04','Built for the night','Wallet QR at the door, Apple Wallet for the train, a collectible after — designed for real life.'],
          ].map(([n, t, b]) => (
            <div key={n} style={{ padding:'28px 26px', borderRadius:18, background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.10)' }}>
              <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:13, color:'#D4A8F0', fontWeight:700, letterSpacing:'0.18em' }}>{n}</div>
              <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:22, fontWeight:600, letterSpacing:'-0.02em', marginTop:8 }}>{t}</div>
              <div style={{ fontSize:14, color:'rgba(255,255,255,0.65)', marginTop:10, lineHeight:1.55 }}>{b}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:'40px 56px 80px', maxWidth:1200, margin:'0 auto' }}>
        <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:36, fontWeight:600, letterSpacing:'-0.025em', marginBottom:32 }}>The team</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:18 }}>
          {[['Dani','Founder','#FFB1C8'],['Luca','Engineering','#D4A8F0'],['Mara','Design','#7C5BC4'],['Tomás','Ops','#FF5E9E']].map(([n, r, c]) => (
            <div key={n} style={{ padding:28, borderRadius:18, background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.10)', textAlign:'center' }}>
              <div style={{ width:84, height:84, borderRadius:99, margin:'0 auto', background:`linear-gradient(135deg, ${c}, #5B3FA8)`, display:'grid', placeItems:'center', color:'#fff', fontFamily:'"Space Grotesk", system-ui', fontSize:30, fontWeight:700, border:'1.5px solid rgba(255,255,255,0.2)' }}>{n[0]}</div>
              <div style={{ marginTop:14, fontSize:16, fontWeight:600 }}>{n}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.55)', marginTop:2 }}>{r}</div>
            </div>
          ))}
        </div>
      </div>
      <DesktopFooter onNav={onNav}/>
    </DesktopChrome>
  );
}

function DesktopContact({ onNav }){
  return (
    <DesktopChrome active="contact" onNav={onNav}>
      <div style={{ padding:'140px 56px 80px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ fontSize:12, color:'#D4A8F0', fontWeight:700, letterSpacing:'0.20em', textTransform:'uppercase' }}>Get in touch</div>
        <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:84, fontWeight:700, letterSpacing:'-0.035em', lineHeight:0.95, marginTop:18 }}>How can we help?</div>
        <div style={{ fontSize:16, color:'rgba(255,255,255,0.65)', marginTop:18, maxWidth:580, lineHeight:1.5 }}>
          We answer within a few hours — usually in minutes during business hours.
        </div>

        <div style={{ marginTop:48, display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14 }}>
          <DContactCard icon="chat" title="Live chat" sub="Avg. 3 min response · open 24/7" cta="Start chat"/>
          <DContactCard icon="mail" title="hi@ticketsaver.io" sub="Support, partnerships, press" cta="Compose"/>
        </div>

        <div style={{ marginTop:60, display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:48 }}>
          <div>
            <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:30, fontWeight:600, letterSpacing:'-0.025em' }}>Write us</div>
            <div style={{ fontSize:13.5, color:'rgba(255,255,255,0.6)', marginTop:10, lineHeight:1.6 }}>
              Choose a topic so we can route your message to the right person.
            </div>
            <div style={{ marginTop:20, display:'flex', flexWrap:'wrap', gap:6 }}>
              {['Buying','Refunds','Wallet','Press','Promote','Other'].map((t, i) => (
                <div key={t} style={{ padding:'8px 13px', borderRadius:99, background: i === 0 ? '#fff' : 'rgba(255,255,255,0.05)', color: i === 0 ? '#1A0F33' : '#fff', border:'0.5px solid ' + (i === 0 ? 'transparent' : 'rgba(255,255,255,0.10)'), fontSize:12, fontWeight:600, cursor:'pointer' }}>{t}</div>
              ))}
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <DField label="Your name" value="Daniela Pérez"/>
            <DField label="Email" value="dani@gmail.com"/>
            <DField label="Message" value={"My ticket QR didn't scan at the door — luckily my wallet worked but I want to make sure for next time…"} multi/>
            <button style={{ appearance:'none', border:0, cursor:'pointer', marginTop:8, padding:'16px', borderRadius:14, background:'#fff', color:'#1A0F33', fontFamily:'"Space Grotesk", system-ui', fontSize:14, fontWeight:600 }}>Send message →</button>
          </div>
        </div>
      </div>
      <DesktopFooter onNav={onNav}/>
    </DesktopChrome>
  );
}

function DContactCard({ icon, title, sub, cta }){
  return (
    <div style={{ padding:'22px 24px', borderRadius:18, background:'rgba(255,255,255,0.05)', border:'0.5px solid rgba(255,255,255,0.10)', backdropFilter:'blur(14px) saturate(160%)', display:'flex', alignItems:'center', gap:16 }}>
      <div style={{ width:48, height:48, borderRadius:14, background:'rgba(212,168,240,0.18)', border:'0.5px solid rgba(212,168,240,0.30)', display:'grid', placeItems:'center', color:'#E0C0FF', flexShrink:0 }}>
        {icon === 'chat' && <svg width="20" height="20" viewBox="0 0 16 16" fill="none"><path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H6l-3 3v-3H4a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.4"/></svg>}
        {icon === 'mail' && <svg width="20" height="20" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M2 5l6 4 6-4" stroke="currentColor" strokeWidth="1.4"/></svg>}
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:16, fontWeight:600 }}>{title}</div>
        <div style={{ fontSize:12.5, color:'rgba(255,255,255,0.55)', marginTop:3 }}>{sub}</div>
      </div>
      <div style={{ padding:'9px 14px', borderRadius:99, background:'rgba(255,255,255,0.10)', border:'0.5px solid rgba(255,255,255,0.14)', fontSize:12.5, fontWeight:600 }}>{cta} →</div>
    </div>
  );
}

function DField({ label, value, multi }){
  return (
    <div style={{ padding:'14px 16px', borderRadius:14, background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.10)' }}>
      <div style={{ fontSize:10.5, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)', fontWeight:600 }}>{label}</div>
      <div style={{ fontSize:14.5, marginTop:6, lineHeight: multi ? 1.5 : 1, whiteSpace: multi ? 'pre-wrap' : 'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{value}</div>
    </div>
  );
}

function DesktopFaqs({ onNav }){
  const [open, setOpen] = React.useState(0);
  const faqs = [
    ['¿Cómo compro una entrada?','Elegís el evento, sección y asientos, pagás con tarjeta o Apple Pay. Tu ticket aparece al instante en "My tickets" y como NFT en tu wallet de Base.'],
    ['¿Cuánto tiempo tengo para completar la compra?','Reservamos tus asientos por 5 minutos desde que entrás al seat picker. Si el timer expira, los asientos vuelven a estar disponibles.'],
    ['¿Qué es un ticket NFT?','Cada entrada que vendemos también se acuña como NFT en Base. Es una versión coleccionable e imposible de falsificar.'],
    ['No tengo wallet, ¿puedo comprar igual?','Sí. Te creamos una wallet automáticamente al hacer tu primera compra. Más adelante la podés exportar a MetaMask.'],
    ['¿Hacen reembolsos?','Si el evento se cancela o reprograma, devolvemos el 100% en menos de 7 días al mismo método de pago.'],
    ['¿Necesito imprimir mi entrada?','No. En la puerta escaneamos el QR desde tu app o desde Apple Wallet.'],
    ['¿Puedo revender mi entrada?','Sí, desde "My tickets" → "Sell ticket". Solo a face value o por debajo.'],
    ['Olvidé mi teléfono, ¿qué hago?','Vení a la puerta con tu documento. Te dejamos entrar tras verificar identidad.'],
  ];
  return (
    <DesktopChrome active="faqs" onNav={onNav}>
      <div style={{ padding:'140px 56px 80px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ fontSize:12, color:'#D4A8F0', fontWeight:700, letterSpacing:'0.20em', textTransform:'uppercase' }}>Help center · FAQs</div>
        <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:84, fontWeight:700, letterSpacing:'-0.035em', lineHeight:0.95, marginTop:18 }}>Answers, fast.</div>

        <div style={{ marginTop:36, padding:'14px 18px', borderRadius:14, background:'rgba(255,255,255,0.05)', border:'0.5px solid rgba(255,255,255,0.10)', display:'flex', alignItems:'center', gap:12, color:'rgba(255,255,255,0.55)', maxWidth:560 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6"/><path d="m11 11 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          <div style={{ fontSize:14 }}>Search "refund", "Apple Wallet"…</div>
          <div style={{ marginLeft:'auto', padding:'2px 7px', borderRadius:6, background:'rgba(255,255,255,0.08)', fontSize:10, color:'rgba(255,255,255,0.5)' }}>⌘K</div>
        </div>

        <div style={{ marginTop:14, display:'flex', flexWrap:'wrap', gap:6 }}>
          {['All','Buying','Wallet & NFT','Refunds','At the door','Selling'].map((c, i) => (
            <div key={c} style={{ padding:'8px 13px', borderRadius:99, background: i === 0 ? '#fff' : 'rgba(255,255,255,0.05)', color: i === 0 ? '#1A0F33' : '#fff', border:'0.5px solid ' + (i === 0 ? 'transparent' : 'rgba(255,255,255,0.10)'), fontSize:12, fontWeight:600, cursor:'pointer' }}>{c}</div>
          ))}
        </div>

        <div style={{ marginTop:32, display:'flex', flexDirection:'column', gap:8 }}>
          {faqs.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={i} onClick={() => setOpen(isOpen ? -1 : i)} style={{ padding:'20px 22px', borderRadius:16, background:'rgba(255,255,255,0.04)', border:'0.5px solid ' + (isOpen ? 'rgba(212,168,240,0.30)' : 'rgba(255,255,255,0.10)'), cursor:'pointer' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ flex:1, fontFamily:'"Space Grotesk", system-ui', fontSize:18, fontWeight:600, letterSpacing:'-0.015em' }}>{q}</div>
                  <div style={{ width:28, height:28, borderRadius:99, background: isOpen ? '#D4A8F0' : 'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.12)', display:'grid', placeItems:'center', color: isOpen ? '#1A0F33' : '#fff', transition:'all 0.2s' }}>
                    <svg width="12" height="12" viewBox="0 0 10 10" fill="none" style={{ transform: isOpen ? 'rotate(45deg)' : 'none', transition:'transform 0.2s' }}><path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </div>
                </div>
                {isOpen && <div style={{ fontSize:14, color:'rgba(255,255,255,0.72)', marginTop:14, lineHeight:1.6, textWrap:'pretty' }}>{a}</div>}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop:48, padding:'28px 32px', borderRadius:20, background:'linear-gradient(135deg, rgba(124,91,196,0.22), rgba(255,177,200,0.10))', border:'0.5px solid rgba(255,255,255,0.12)', display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:22, fontWeight:600, letterSpacing:'-0.02em' }}>Can't find what you need?</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.65)', marginTop:6 }}>Live chat · 3 min response time</div>
          </div>
          <div style={{ padding:'12px 20px', borderRadius:99, background:'#fff', color:'#1A0F33', fontSize:13.5, fontWeight:600, cursor:'pointer' }}>Open chat →</div>
        </div>
      </div>
      <DesktopFooter onNav={onNav}/>
    </DesktopChrome>
  );
}

function DesktopLegal({ kind, onNav }){
  const data = kind === 'terms' ? {
    eyebrow:'Terms & conditions',
    title:'The rules of using TicketSaver.',
    intro:'Comprás entradas a precio fijo, recibís un NFT que prueba que el ticket es tuyo, y aceptás algunas reglas básicas para que el sistema funcione para todos.',
    sections: [
      { t:'Who we are', b:'TicketSaver Inc. opera ticketsaver.io. No somos los organizadores: actuamos como intermediarios entre productores autorizados y vos como comprador.' },
      { t:'Your account', b:'Una sola cuenta por persona; usar múltiples cuentas para evadir límites es motivo de cierre. Sos responsable de toda compra hecha desde tu cuenta.' },
      { t:'Buying tickets', b:'El precio que ves es el final, salvo el service fee detallado por separado. Reservamos asientos por 5 minutos durante el checkout.' },
      { t:'NFTs & wallets', b:'Cada ticket se acuña como NFT en Base. Si comprás sin wallet, te creamos una custodial. El NFT prueba que el ticket es tuyo.' },
      { t:'Refunds', b:'Si el evento se cancela, devolvemos el 100% en menos de 7 días al método original de pago.' },
      { t:'Resales', b:'Permitimos reventas pero solo a face value o por debajo. Cobramos 5% por procesamiento.' },
      { t:'At the venue', b:'Presentá el QR desde la app o Apple Wallet. Las reglas específicas de cada venue están en la página del evento.' },
      { t:'Liability', b:'No respondemos por la calidad del show ni retrasos del artista — esa responsabilidad es del organizador.' },
    ],
  } : {
    eyebrow:'Privacy policy',
    title:'What we collect, and why.',
    intro:'Recolectamos lo mínimo necesario para venderte una entrada, mantenerte logueado, y prevenir fraude. No vendemos tus datos. Nunca.',
    sections: [
      { t:'What we collect', b:'Email, nombre, hash de tu contraseña, dirección de wallet, método de pago (procesado por Stripe — nunca vemos tu tarjeta), eventos a los que vas.' },
      { t:'Why we use it', b:'Para autenticarte, acuñar tu ticket NFT, procesar pagos, mostrarte tu historial, y darle conteos agregados a los organizadores.' },
      { t:'Who we share it with', b:'El organizador recibe tu nombre y email (no historial). Stripe procesa tu pago. Base es pública por diseño.' },
      { t:'Your rights', b:'Bajo GDPR, CCPA y Ley 25.326 de Argentina: acceso, rectificación, borrado, portabilidad. Escribí a privacy@ticketsaver.io.' },
      { t:'Cookies', b:'Solo cookies estrictamente necesarias. Analytics anónimo con Plausible. Sin pixels de Meta/Google.' },
      { t:'Data retention', b:'30 días tras cerrar la cuenta. Logs técnicos a los 90 días. Registros contables 5 años por obligación legal.' },
      { t:'Children', b:'TicketSaver no es para menores de 13.' },
      { t:'Contact', b:'privacy@ticketsaver.io · DPO en dpo@ticketsaver.io.' },
    ],
  };
  const [active, setActive] = React.useState(0);

  return (
    <DesktopChrome active={kind === 'terms' ? 'terms' : 'privacy'} onNav={onNav}>
      <div style={{ padding:'140px 56px 80px', maxWidth:1200, margin:'0 auto' }}>
        <div style={{ fontSize:12, color:'#D4A8F0', fontWeight:700, letterSpacing:'0.20em', textTransform:'uppercase' }}>{data.eyebrow}</div>
        <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:72, fontWeight:700, letterSpacing:'-0.035em', lineHeight:0.95, marginTop:18, maxWidth:900 }}>{data.title}</div>
        <div style={{ marginTop:24, display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ padding:'6px 12px', borderRadius:99, background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.12)', fontSize:11, color:'rgba(255,255,255,0.75)', fontWeight:600 }}>Last updated · Oct 14, 2025</div>
          <div style={{ padding:'6px 12px', borderRadius:99, background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.12)', fontSize:11, color:'rgba(255,255,255,0.75)', fontWeight:600 }}>4 min read</div>
        </div>

        <div style={{ marginTop:32, padding:24, borderRadius:18, background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.10)', maxWidth:900 }}>
          <div style={{ fontSize:10.5, letterSpacing:'0.18em', textTransform:'uppercase', color:'#D4A8F0', fontWeight:700 }}>The short version</div>
          <div style={{ fontSize:15.5, marginTop:10, lineHeight:1.65, color:'rgba(255,255,255,0.85)' }}>{data.intro}</div>
        </div>

        <div style={{ marginTop:48, display:'grid', gridTemplateColumns:'260px 1fr', gap:48 }}>
          <div style={{ position:'sticky', top:90, alignSelf:'start' }}>
            <div style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:14 }}>Contents</div>
            <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
              {data.sections.map((s, i) => (
                <div key={i} onClick={() => setActive(i)} style={{ padding:'10px 12px', borderRadius:10, background: i === active ? 'rgba(212,168,240,0.12)' : 'transparent', border:'0.5px solid ' + (i === active ? 'rgba(212,168,240,0.25)' : 'transparent'), display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
                  <div style={{ fontSize:11, color:'#D4A8F0', fontWeight:700, minWidth:22 }}>{String(i + 1).padStart(2, '0')}</div>
                  <div style={{ fontSize:13, color: i === active ? '#fff' : 'rgba(255,255,255,0.7)', fontWeight: i === active ? 600 : 500 }}>{s.t}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:14 }}>
              <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:13, color:'#D4A8F0', fontWeight:700, letterSpacing:'0.14em' }}>{String(active + 1).padStart(2, '0')}</div>
              <div style={{ fontFamily:'"Space Grotesk", system-ui', fontSize:32, fontWeight:600, letterSpacing:'-0.025em' }}>{data.sections[active].t}</div>
            </div>
            <div style={{ fontSize:15.5, color:'rgba(255,255,255,0.78)', lineHeight:1.7, maxWidth:680, textWrap:'pretty' }}>{data.sections[active].b}</div>
            <div style={{ marginTop:32, display:'flex', gap:10 }}>
              {active > 0 && <div onClick={() => setActive(active - 1)} style={{ padding:'14px 18px', borderRadius:12, background:'rgba(255,255,255,0.05)', border:'0.5px solid rgba(255,255,255,0.10)', cursor:'pointer', fontSize:12.5 }}>← {data.sections[active - 1].t}</div>}
              {active < data.sections.length - 1 && <div onClick={() => setActive(active + 1)} style={{ padding:'14px 18px', borderRadius:12, background:'rgba(255,255,255,0.05)', border:'0.5px solid rgba(255,255,255,0.10)', cursor:'pointer', fontSize:12.5 }}>{data.sections[active + 1].t} →</div>}
            </div>
          </div>
        </div>
      </div>
      <DesktopFooter onNav={onNav}/>
    </DesktopChrome>
  );
}

Object.assign(window, { DesktopAbout, DesktopContact, DesktopFaqs, DesktopLegal });
