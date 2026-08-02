// ts-legal-pages.jsx — FAQs, Terms & Conditions, Privacy Policy

function FaqsPage(){
  const [open, setOpen] = React.useState(0);
  const [cat, setCat]   = React.useState(0);

  const cats = ['All', 'Buying', 'Wallet & NFT', 'Refunds', 'At the door', 'Selling'];

  const faqs = [
    { cat: 1, q: '¿Cómo compro una entrada?',                       a: 'Elegís el evento, seleccionás sección y asientos, pagás con tarjeta o Apple Pay. Tu ticket aparece al instante en "My tickets" y, como NFT, en tu wallet de Base.' },
    { cat: 1, q: '¿Cuánto tiempo tengo para completar la compra?',  a: 'Reservamos tus asientos por 5 minutos desde que entrás al seat picker. Si el timer expira, los asientos vuelven a estar disponibles para todos.' },
    { cat: 2, q: '¿Qué es un ticket NFT?',                          a: 'Cada entrada que vendemos también se acuña como NFT en la red Base. Es una versión coleccionable e imposible de falsificar — la podés guardar para siempre, aún después del show.' },
    { cat: 2, q: 'No tengo wallet, ¿puedo comprar igual?',          a: 'Sí. Te creamos una wallet automáticamente al hacer tu primera compra. Si más adelante querés moverla a MetaMask u otra, te damos la opción de exportarla.' },
    { cat: 3, q: '¿Hacen reembolsos?',                              a: 'Si el evento se cancela o reprograma, devolvemos el 100% en menos de 7 días, al mismo método de pago. Por arrepentimiento ofrecemos crédito en plataforma dentro de las primeras 48hs.' },
    { cat: 4, q: '¿Necesito imprimir mi entrada?',                  a: 'No. En la puerta escaneamos el QR desde tu app o desde Apple Wallet. Te recomendamos guardar el ticket en Apple Wallet por si no tenés señal.' },
    { cat: 5, q: '¿Puedo revender mi entrada?',                     a: 'Sí. Desde "My tickets" → "Sell ticket". Solo permitimos reventas a face value o por debajo. Cuando alguien la compra, transferimos el NFT y te devolvemos el dinero al instante.' },
    { cat: 4, q: 'Olvidé mi teléfono, ¿qué hago?',                  a: 'Vení a la puerta con tu documento. Verificamos tu identidad contra el wallet y te dejamos entrar. También podemos re-acuñar el ticket si fuera necesario.' },
  ];

  const visible = cat === 0 ? faqs : faqs.filter(f => f.cat === cat);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#0A0418' }}>
      <MeshBg seed={5}/>
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, overflowY: 'auto', paddingBottom: 32 }}>
        <div style={{ paddingTop: 60, padding: '60px 14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BackButton/>
          <div style={{ fontSize: 13, color: '#fff', fontWeight: 600, fontFamily: '"Space Grotesk", system-ui' }}>Help center</div>
          <div style={{ width: 38 }}/>
        </div>

        <div style={{ padding: '28px 22px 0' }}>
          <div style={{ fontSize: 10.5, letterSpacing: '0.18em', color: '#D4A8F0', fontWeight: 700, textTransform: 'uppercase' }}>FAQs</div>
          <div style={{
            fontFamily: '"Space Grotesk", system-ui',
            fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.0,
            marginTop: 8,
          }}>Answers, fast.</div>
        </div>

        {/* Search */}
        <div style={{ padding: '20px 22px 0' }}>
          <div style={{
            padding: '12px 14px', borderRadius: 14,
            background: 'rgba(255,255,255,0.05)',
            border: '0.5px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(14px) saturate(160%)', WebkitBackdropFilter: 'blur(14px) saturate(160%)',
            display: 'flex', alignItems: 'center', gap: 10,
            color: 'rgba(255,255,255,0.55)',
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6"/><path d="m11 11 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            <div style={{ fontSize: 13 }}>Search "refund", "Apple Wallet"…</div>
          </div>
        </div>

        {/* Categories */}
        <div style={{ padding: '14px 14px 0', display: 'flex', gap: 6, overflowX: 'auto' }}>
          {cats.map((c, i) => (
            <div key={c} onClick={() => setCat(i)} style={{
              padding: '7px 12px', borderRadius: 999,
              background: i === cat ? '#fff' : 'rgba(255,255,255,0.05)',
              color: i === cat ? '#1A0F33' : '#fff',
              border: '0.5px solid ' + (i === cat ? 'transparent' : 'rgba(255,255,255,0.10)'),
              fontSize: 11.5, fontWeight: 600, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
            }}>{c}</div>
          ))}
        </div>

        {/* Accordion */}
        <div style={{ padding: '16px 18px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visible.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} onClick={() => setOpen(isOpen ? -1 : i)} style={{
                padding: '14px 14px', borderRadius: 16,
                background: 'rgba(255,255,255,0.04)',
                border: '0.5px solid ' + (isOpen ? 'rgba(212,168,240,0.30)' : 'rgba(255,255,255,0.10)'),
                cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, fontSize: 13.5, color: '#fff', fontWeight: 600, letterSpacing: '-0.015em' }}>{f.q}</div>
                  <div style={{
                    width: 22, height: 22, borderRadius: 99,
                    background: isOpen ? '#D4A8F0' : 'rgba(255,255,255,0.06)',
                    border: '0.5px solid rgba(255,255,255,0.12)',
                    display: 'grid', placeItems: 'center',
                    color: isOpen ? '#1A0F33' : '#fff',
                    transition: 'all 0.2s',
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>
                      <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
                {isOpen && (
                  <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.7)', marginTop: 10, lineHeight: 1.55, textWrap: 'pretty' }}>{f.a}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still need help */}
        <div style={{ padding: '24px 18px 0' }}>
          <div style={{
            padding: 16, borderRadius: 18,
            background: 'linear-gradient(135deg, rgba(124,91,196,0.22), rgba(255,177,200,0.10))',
            border: '0.5px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(14px) saturate(160%)', WebkitBackdropFilter: 'blur(14px) saturate(160%)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(212,168,240,0.22)',
              border: '0.5px solid rgba(212,168,240,0.30)',
              display: 'grid', placeItems: 'center',
              color: '#E0C0FF', flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H6l-3 3v-3H4a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.4"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>Can't find what you need?</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Live chat · 3 min response</div>
            </div>
            <div style={{
              padding: '8px 12px', borderRadius: 99,
              background: '#fff', color: '#1A0F33',
              fontSize: 11.5, fontWeight: 600,
            }}>Open chat</div>
          </div>
        </div>

        <Footer/>
      </div>
    </div>
  );
}

/* ──────────────── LEGAL DOC SHELL ──────────────── */

function LegalShell({ kind, title, eyebrow, updated, intro, sections, footerLinks }){
  const [active, setActive] = React.useState(0);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#0A0418' }}>
      <MeshBg seed={kind === 'terms' ? 7 : 9}/>
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, overflowY: 'auto', paddingBottom: 32 }}>
        <div style={{ paddingTop: 60, padding: '60px 14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BackButton/>
          <div style={{ fontSize: 13, color: '#fff', fontWeight: 600, fontFamily: '"Space Grotesk", system-ui' }}>Legal</div>
          <div style={{
            width: 38, height: 38, borderRadius: 99,
            background: 'rgba(255,255,255,0.05)',
            border: '0.5px solid rgba(255,255,255,0.10)',
            display: 'grid', placeItems: 'center', color: '#fff',
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M3 8h7M3 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          </div>
        </div>

        {/* Header */}
        <div style={{ padding: '28px 22px 0' }}>
          <div style={{ fontSize: 10.5, letterSpacing: '0.18em', color: '#D4A8F0', fontWeight: 700, textTransform: 'uppercase' }}>{eyebrow}</div>
          <div style={{
            fontFamily: '"Space Grotesk", system-ui',
            fontSize: 30, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.05,
            marginTop: 8, textWrap: 'pretty',
          }}>{title}</div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div style={{
              padding: '5px 10px', borderRadius: 99,
              background: 'rgba(255,255,255,0.06)',
              border: '0.5px solid rgba(255,255,255,0.12)',
              fontSize: 10.5, color: 'rgba(255,255,255,0.75)', fontWeight: 600,
            }}>Last updated · {updated}</div>
            <div style={{
              padding: '5px 10px', borderRadius: 99,
              background: 'rgba(255,255,255,0.06)',
              border: '0.5px solid rgba(255,255,255,0.12)',
              fontSize: 10.5, color: 'rgba(255,255,255,0.75)', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/><path d="M6 3.5V6l1.6 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              4 min read
            </div>
          </div>
        </div>

        {/* Plain-language intro */}
        <div style={{ padding: '22px 18px 0' }}>
          <div style={{
            padding: 16, borderRadius: 18,
            background: 'rgba(255,255,255,0.04)',
            border: '0.5px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(14px) saturate(160%)', WebkitBackdropFilter: 'blur(14px) saturate(160%)',
          }}>
            <div style={{
              fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#D4A8F0', fontWeight: 700,
            }}>The short version</div>
            <div style={{
              fontSize: 13.5, color: 'rgba(255,255,255,0.85)',
              marginTop: 8, lineHeight: 1.55, textWrap: 'pretty',
            }}>{intro}</div>
          </div>
        </div>

        {/* Section index */}
        <div style={{ padding: '20px 22px 0' }}>
          <div style={{ fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>Contents</div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {sections.map((s, i) => (
              <div key={i} onClick={() => setActive(i)} style={{
                padding: '8px 10px', borderRadius: 10,
                background: i === active ? 'rgba(212,168,240,0.12)' : 'transparent',
                border: '0.5px solid ' + (i === active ? 'rgba(212,168,240,0.25)' : 'transparent'),
                display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
              }}>
                <div style={{ fontSize: 10, color: '#D4A8F0', fontWeight: 700, letterSpacing: '0.10em', minWidth: 22 }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ fontSize: 12.5, color: i === active ? '#fff' : 'rgba(255,255,255,0.7)', fontWeight: i === active ? 600 : 500 }}>{s.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active section body */}
        <div style={{ padding: '20px 22px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10,
          }}>
            <div style={{ fontFamily: '"Space Grotesk", system-ui', fontSize: 11, color: '#D4A8F0', fontWeight: 700, letterSpacing: '0.14em' }}>{String(active + 1).padStart(2, '0')}</div>
            <div style={{ fontFamily: '"Space Grotesk", system-ui', fontSize: 19, color: '#fff', fontWeight: 600, letterSpacing: '-0.02em' }}>{sections[active].title}</div>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)', lineHeight: 1.65, textWrap: 'pretty', whiteSpace: 'pre-wrap' }}>
            {sections[active].body}
          </div>
          {sections[active].bullets && (
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sections[active].bullets.map((b, j) => (
                <div key={j} style={{
                  display: 'flex', gap: 10,
                  padding: '10px 12px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.03)',
                  border: '0.5px solid rgba(255,255,255,0.08)',
                }}>
                  <div style={{
                    width: 4, alignSelf: 'stretch', borderRadius: 99,
                    background: 'linear-gradient(180deg, #FFB1C8, #7C5BC4)',
                  }}/>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.78)', lineHeight: 1.5, flex: 1 }}>{b}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{
            marginTop: 18, padding: '10px 12px', borderRadius: 12,
            background: 'rgba(255,255,255,0.04)',
            border: '0.5px solid rgba(255,255,255,0.10)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ flex: 1, fontSize: 11.5, color: 'rgba(255,255,255,0.55)' }}>Was this section clear?</div>
            <div style={{
              padding: '5px 10px', borderRadius: 99,
              background: 'rgba(255,255,255,0.06)',
              border: '0.5px solid rgba(255,255,255,0.10)',
              fontSize: 10.5, color: '#fff', fontWeight: 600,
            }}>Yes</div>
            <div style={{
              padding: '5px 10px', borderRadius: 99,
              background: 'rgba(255,255,255,0.06)',
              border: '0.5px solid rgba(255,255,255,0.10)',
              fontSize: 10.5, color: '#fff', fontWeight: 600,
            }}>Confusing</div>
          </div>
        </div>

        {/* Bottom nav */}
        <div style={{ padding: '20px 22px 0', display: 'flex', gap: 8 }}>
          {active > 0 && (
            <div onClick={() => setActive(active - 1)} style={{
              flex: 1, padding: '12px', borderRadius: 14,
              background: 'rgba(255,255,255,0.05)',
              border: '0.5px solid rgba(255,255,255,0.10)',
              cursor: 'pointer',
            }}>
              <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.45)', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>← Previous</div>
              <div style={{ fontSize: 12, color: '#fff', fontWeight: 600, marginTop: 4 }}>{sections[active - 1].title}</div>
            </div>
          )}
          {active < sections.length - 1 && (
            <div onClick={() => setActive(active + 1)} style={{
              flex: 1, padding: '12px', borderRadius: 14,
              background: 'rgba(255,255,255,0.05)',
              border: '0.5px solid rgba(255,255,255,0.10)',
              cursor: 'pointer', textAlign: 'right',
            }}>
              <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.45)', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Next →</div>
              <div style={{ fontSize: 12, color: '#fff', fontWeight: 600, marginTop: 4 }}>{sections[active + 1].title}</div>
            </div>
          )}
        </div>

        {/* Cross-links */}
        <div style={{ padding: '24px 22px 0' }}>
          <div style={{ fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>Related</div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {footerLinks.map((l, i) => (
              <div key={i} style={{
                padding: '10px 12px', borderRadius: 12,
                background: 'rgba(255,255,255,0.04)',
                border: '0.5px solid rgba(255,255,255,0.10)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{ flex: 1, fontSize: 12.5, color: '#fff', fontWeight: 500 }}>{l}</div>
                <ChevRight/>
              </div>
            ))}
          </div>
        </div>

        <Footer/>
      </div>
    </div>
  );
}

/* ──────────────── TERMS ──────────────── */

function TermsPage(){
  return (
    <LegalShell
      kind="terms"
      eyebrow="Terms & conditions"
      title="The rules of using TicketSaver."
      updated="Oct 14, 2025"
      intro="Comprás entradas a precio fijo, recibís un NFT que prueba que el ticket es tuyo, y aceptás algunas reglas básicas para que el sistema funcione para todos. Si no aceptás algo de esto, no podemos venderte la entrada."
      sections={[
        {
          title: 'Who we are',
          body: 'TicketSaver Inc. ("nosotros") opera la plataforma ticketsaver.io. No somos los organizadores de los eventos: actuamos como intermediarios entre productores autorizados y vos como comprador. Toda comunicación oficial va a la dirección que registraste en tu cuenta.',
        },
        {
          title: 'Your account',
          body: 'Para comprar tickets necesitás una cuenta con tu email real y, si querés, una wallet conectada. Una sola cuenta por persona; usar múltiples cuentas para evadir límites o acumular tickets para reventa es motivo de cierre.',
          bullets: [
            'Mantené tu contraseña y wallet seguras — no podemos recuperar tickets robados de un wallet comprometido.',
            'Sos responsable de toda compra hecha desde tu cuenta.',
          ],
        },
        {
          title: 'Buying tickets',
          body: 'El precio que ves al momento de la compra es el final, salvo el "service fee" detallado por separado antes del pago. Reservamos los asientos por 5 minutos durante el checkout. Una vez confirmada la compra, recibís dos cosas: un ticket digital con QR y un NFT en la red Base.',
        },
        {
          title: 'NFTs & wallets',
          body: 'Cada ticket se acuña como NFT en Base. Si comprás sin wallet, te creamos una custodial (la guardamos por vos) y la podés exportar cuando quieras. El NFT prueba que el ticket es tuyo: transferirlo equivale a transferir el ticket. Como tal, las transferencias hechas fuera de TicketSaver no son rastreables por nosotros y no garantizamos el ingreso al evento.',
        },
        {
          title: 'Refunds & cancellations',
          body: 'Si el evento se cancela, devolvemos el 100% del valor en menos de 7 días al método original de pago, sin importar dónde esté el NFT. Si se reprograma, podés elegir entre canjear tu ticket por la nueva fecha o pedir reembolso. Por arrepentimiento dentro de las 48hs, ofrecemos crédito en plataforma.',
        },
        {
          title: 'Resales',
          body: 'Permitimos reventas entre usuarios pero solo a face value o por debajo. Cualquier intento de vender por encima — incluso fuera de la plataforma — bloquea el NFT y anula el ticket. Cobramos un fee del 5% del precio de reventa para cubrir el procesamiento.',
        },
        {
          title: 'At the venue',
          body: 'Presentá el QR desde la app o Apple Wallet. Llegá a tiempo: una vez empezado el show, el ingreso queda a discreción del organizador. Las reglas específicas de cada venue (edad, vestimenta, bolsos) están en la página del evento.',
        },
        {
          title: 'Liability',
          body: 'No respondemos por la calidad del show, retrasos del artista, ni daños sufridos en el venue. Esa responsabilidad es del organizador, cuyos datos aparecen en cada evento.',
        },
      ]}
      footerLinks={['Privacy policy →', 'Refund policy →', 'Cookies →']}
    />
  );
}

/* ──────────────── PRIVACY ──────────────── */

function PrivacyPage(){
  return (
    <LegalShell
      kind="privacy"
      eyebrow="Privacy policy"
      title="What we collect, and why."
      updated="Oct 14, 2025"
      intro="Recolectamos lo mínimo necesario para venderte una entrada, mantenerte logueado, y prevenir fraude. No vendemos tus datos. Nunca. Si te vamos a usar para algo más que eso, te preguntamos primero."
      sections={[
        {
          title: 'What we collect',
          body: 'Cuando creás una cuenta: email, nombre, y un hash de tu contraseña. Cuando comprás: dirección de wallet (creada o conectada), método de pago (procesado por Stripe — nosotros nunca vemos tu tarjeta), y los eventos a los que vas. También guardamos logs técnicos: IP, user-agent y timestamps de tus acciones para detectar fraude.',
          bullets: [
            'Lo que NO recolectamos: ubicación precisa, contactos, micrófono, cámara.',
            'Datos de pago los procesa Stripe bajo PCI-DSS Level 1.',
          ],
        },
        {
          title: 'Why we use it',
          body: 'Email y contraseña para autenticarte. Wallet para acuñar tu ticket NFT. Datos de pago para procesar la compra y emitir reembolsos. Historial de eventos para que veas tus tickets pasados, hacerte recomendaciones, y para los conteos agregados que les damos a los organizadores.',
        },
        {
          title: 'Who we share it with',
          body: 'Compartimos lo justo: el organizador del evento recibe tu nombre y email para enviarte info logística (no tu dirección, ni tu historial de compras). Stripe procesa tu pago. Base es una red pública, así que tu wallet y el NFT son visibles on-chain por diseño, pero no están vinculados a tu identidad real desde TicketSaver.',
        },
        {
          title: 'Your rights',
          body: 'Bajo GDPR, CCPA y la Ley 25.326 de Argentina podés: ver todos los datos que tenemos sobre vos, pedir su corrección, pedir su borrado (excepto lo necesario por obligación fiscal), y pedir una copia portable. Pedidos a privacy@ticketsaver.io — respondemos en menos de 30 días.',
          bullets: [
            'Acceso · ver qué datos tenemos.',
            'Rectificación · corregir lo que esté mal.',
            'Borrado · "right to be forgotten".',
            'Portabilidad · llevarte tus datos en JSON.',
            'Oposición · negarte a usos específicos.',
          ],
        },
        {
          title: 'Cookies',
          body: 'Usamos cookies estrictamente necesarias para mantenerte logueado y recordar tu carrito. Cookies analíticas (Plausible, sin cookies de tracking) son anónimas. No usamos pixels de Meta, Google Ads ni similares.',
        },
        {
          title: 'Data retention',
          body: 'Datos de cuenta los guardamos mientras la cuenta esté activa. Si la cerrás, borramos todo en 30 días excepto registros contables que la ley nos obliga a conservar por 5 años. Logs técnicos se borran a los 90 días.',
        },
        {
          title: 'Children',
          body: 'TicketSaver no es para menores de 13. Si descubrimos una cuenta de un menor, la cerramos y borramos los datos.',
        },
        {
          title: 'Contact us',
          body: 'Preguntas sobre privacidad: privacy@ticketsaver.io. Si querés contactar a nuestro Data Protection Officer directamente, escribí a dpo@ticketsaver.io. Para reclamos formales en Argentina, podés acudir a la Agencia de Acceso a la Información Pública.',
        },
      ]}
      footerLinks={['Terms & conditions →', 'Cookies →', 'Refund policy →']}
    />
  );
}

window.FaqsPage    = FaqsPage;
window.TermsPage   = TermsPage;
window.PrivacyPage = PrivacyPage;
