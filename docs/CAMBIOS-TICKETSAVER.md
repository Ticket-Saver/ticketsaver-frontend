# TicketSaver — Cambios de copy solicitados por el cliente

> **Contexto para Claude:** este documento es la fuente de verdad de una tanda de
> correcciones de texto en el front-end de TicketSaver. Aplicar **todos** los cambios
> de una sola pasada. Son cambios de copy y de eliminación de bloques: **no** modificar
> layout, estilos, componentes ni lógica salvo que la eliminación de un bloque lo exija.
>
> Reglas generales:
> - Respetar mayúsculas/minúsculas y puntuación exactas de los textos nuevos.
> - Usar comillas tipográficas rectas o las que ya use el proyecto, de forma consistente.
> - Si un texto aparece duplicado en varios archivos (ej. i18n + componente), cambiarlo en todos.
> - Los ítems marcados con ⚠️ requieren confirmación antes de tocar nada.

---

## 1. Home — Hero

**Pantalla:** encabezado del home ("Today's a good day for a show.")

| | |
|---|---|
| **Buscar** | `Browse what's coming up — face value, tickets are yours.` |
| **Reemplazar por** | `Browse what's coming up — tickets are almost yours` |

- El título `Today's a good day for a show.` **no se toca**.
- Mantener el guion largo (—) tal como está en el original.

---

## 2. Home — Sección "Why TicketSaver" (3 tarjetas)

**Pantalla:** fila de 3 cards numeradas 01 / 02 / 03 bajo el label `WHY TICKETSAVER`.
El cliente las llama "Nube #1, #2, #3".

### Card 01
| | Actual | Nuevo |
|---|---|---|
| Título | `Face value, always` | `Lower fees, always.` |
| Texto | `No dynamic pricing. The price you see is the one the artist asked for.` | `We believe clients shouldn't pay abusive fees` |

### Card 02
| | Actual | Nuevo |
|---|---|---|
| Título | `Tickets are yours` | `Easy to use site` |
| Texto | `Every ticket lives in your wallet as an NFT. Yours forever, no platform lock-in.` | `Our platform is user friendly, less hassle.` |

### Card 03
| | Actual | Nuevo |
|---|---|---|
| Título | `No scalpers` | `No third party resellers.` |
| Texto | `Resale capped at face value. Built so fans win.` | `If reselling tickets it must be done through our platform. No scams.` |

- La numeración `01 / 02 / 03` y el label `WHY TICKETSAVER` se mantienen.
- En el home son **3** cards (a diferencia de About, que lleva 4 — ver §4).

---

## 3. Footer

**Pantalla:** footer con logo `ticketsaver` y columnas Discover / Account / Company / Legal.

**Eliminar:**
1. La bajada debajo del logo: `Face-value tickets, NFTs on Base, no scalpers.`
   - ⚠️ La línea siguiente, `Made with care.`, no fue mencionada por el cliente.
     Por defecto **conservarla**; confirmar si también debe irse.
2. El badge `BUILT ON BASE` completo (chip azul, no solo el texto).

**No tocar:** newsletter "Stay in tune", íconos sociales, ni las 4 columnas de links.

---

## 4. Página About

**Pantalla:** `OUR STORY` → "Live music, without the gatekeepers."

### 4.1 Título
| | |
|---|---|
| **Actual** | `Live music, without the gatekeepers.` |
| **Nuevo** | `Live events, smooth experience` |

> Nota: el título actual tiene un degradado que parte la frase en dos tramos
> (`Live music,` en blanco + `without the gatekeepers.` en violeta). Mantener el mismo
> tratamiento visual repartiendo el texto nuevo: `Live events,` + `smooth experience`.

### 4.2 Párrafo introductorio
| | |
|---|---|
| **Actual** | `TicketSaver is a ticketing platform built by fans, for fans. We sell tickets at face value, mint them as NFTs on Base so they can't be faked, and let resales happen only at fair prices.` |
| **Nuevo** | `TicketSaver is a ticketing platform built by promoters who understand better than anyone that ticketing fees should not be excessive for customers` |

### 4.3 Barra de métricas
Pasa de **3 métricas a 2**:

| Actual | Nuevo |
|---|---|
| `1.2K` — `EVENTS` | `250+` — `EVENTS` |
| `84K` — `FANS` | `35,000+` — `FANS` |
| `$2.1M` — `SAVED IN FEES` | **eliminar la tercera métrica completa** |

- Ajustar el grid del contenedor de 3 a 2 columnas para que no quede un hueco.

### 4.4 Sección "What we believe" (4 tarjetas)
El título de sección `What we believe` se mantiene.

#### Card 01
| | Actual | Nuevo |
|---|---|---|
| Título | `Face value, always` | `Lower fees, always.` |
| Texto | `No dynamic pricing. No mystery fees. The price you see is what artists asked for.` | `We believe clients shouldn't pay abusive fees` |

#### Card 02
| | Actual | Nuevo |
|---|---|---|
| Título | `Tickets are yours` | `Easy to use site` |
| Texto | `Every ticket is an NFT in your wallet. You own it, control it, and keep it after the show.` | `Our platform is user friendly, less hassle.` |

#### Card 03
| | Actual | Nuevo |
|---|---|---|
| Título | `Resales without scalpers` | `No third party resellers.` |
| Texto | `Resell at face value or below. We cap markups so bots can't profit at your expense.` | `If reselling tickets it must be done through our platform. No scams.` |

#### Card 04
| | Actual | Nuevo |
|---|---|---|
| Título | `Built for the night` | `Built for the night` *(sin cambios)* |
| Texto | `Wallet QR at the door, Apple Wallet for the train, a collectible after — designed for real life.` | `Wallet QR at the door, easy to use and add to your phone's wallet` |

### 4.5 Sección "The team"
**Eliminar por completo:** el título `The team` y las 6 tarjetas de miembros
(Dani / Luca / Mara / Theo / Inés / Bruno), incluidos avatares y roles.

---

## 5. Página Contact

> El .docx la rotula como "Pestaña About", pero la captura corresponde a
> **Contact** (`GET IN TOUCH` → "How can we help?").

**Estado:** el cliente indica que todo está OK y que solo hay que cambiar el número
de contacto a **956-445-9793**.

⚠️ **Verificar antes de editar:** en la captura el número ya figura como
`+1-956-445-9793`. Posibilidades:
- El número correcto ya está en Contact y el pedido apunta a **otro lugar** donde
  aparece un número viejo (footer, FAQs, Terms, metadata, `tel:` href, i18n).
- O el cliente quiere el formato sin prefijo: `956-445-9793`.

**Acción:** buscar en todo el proyecto cualquier número telefónico y normalizarlo a
`+1-956-445-9793` (con `href="tel:+19564459793"`). Reportar dónde se encontraron
variantes distintas.

**No tocar:** emails (`support@ticketsaver.net`, `ticketing@ticketsaver.net`),
dirección corporativa, formulario "Write us" ni sus chips de topic.

---

## 6. Página FAQs

**Pantalla:** `FAQS` → "Answers, fast." — acordeón de 8 preguntas.

### 6.1 `How do I buy a ticket?`
Reemplazar la respuesta por:
```
Create an account, pick an event, choose a section and seats, pay with card or Apple Pay. Your tickets will show instantly in "My tickets".
```

### 6.2 `How long do I have to complete a purchase?`
Sin cambios.

### 6.3 `I don't have a wallet, can I still buy?`
**Eliminar la pregunta completa** (item del acordeón + respuesta).

### 6.4 `Do you offer refunds?`
Reemplazar la respuesta por:
```
No, all sales are final. If an event is cancelled or rescheduled we will refund 100% to the original method of payment. For rescheduled events some policies might apply.
```

### 6.5 `Do I need to print my ticket?`
Sin cambios.

### 6.6 `Can I resell my ticket?`
Reemplazar la respuesta por:
```
Yes. From "My tickets" click on "Sell ticket". Set the resale price. When someone buys it we will transfer the ticket to the purchaser and provide you payment for the ticket minus applicable fees.
```

### 6.7 `I forgot my phone, what do I do?`
Reemplazar la respuesta por:
```
Come to the door with your ID. We verify your identity and let you in. We can also email your tickets again if needed.
```

### 6.8 ⚠️ Pendientes de confirmación en esta página
- La pregunta `What is an NFT ticket?` **no fue mencionada** por el cliente, pero es la
  única que queda con temática NFT/wallet después de eliminar 6.3. Dejarla por defecto;
  consultar si también debe eliminarse.
- El chip de filtro `Wallet & NFT`: al eliminar 6.3 puede quedar con 0 o 1 resultado.
  Verificar que el filtro no quede vacío; si queda sin preguntas asociadas, ocultarlo.
- Título, buscador y bloque final "Can't find what you need? / Contact us": sin cambios.

---

## 7. Página Terms & Conditions

**Pantalla:** `LEGAL` → "Terms & Conditions", con `THE SHORT VERSION` y contenido 01–05.

### 7.1 "The short version"
| | |
|---|---|
| **Actual** | `All sales are final unless an event is cancelled or rescheduled. Tickets live in your wallet as NFTs, can only be resold at face value through us, and you assume normal event-going risks. We just provide the ticketing rails.` |
| **Nuevo** | `All sales are final, no refunds allowed. If an event is cancelled or rescheduled we will provide refunds, terms might vary per event.` |

### 7.2 Sección `01 · Purchases & sales`
- Primer párrafo: **sin cambios**.
- Segundo párrafo: eliminar únicamente el fragmento `and in your wallet as an NFT`.

| | |
|---|---|
| **Actual** | `All tickets are issued to the account used at checkout and appear instantly in "My tickets" and in your wallet as an NFT. Please also check your spam folder for confirmation emails.` |
| **Nuevo** | `All tickets are issued to the account used at checkout and appear instantly in "My tickets". Please also check your spam folder for confirmation emails.` |

> Cuidar la puntuación: el punto queda después de `"My tickets"`.

### 7.3 Sección `02 · Refunds & rescheduling`
- Todo el resto queda igual.
- **Eliminar el punto #3, "Change of mind"** (ítem completo, no solo el título).

### 7.4 Sección `03 · Transfers & resale`
Reemplazar el cuerpo por:
```
Unlawful sale or attempted sale is prohibited. Resale is only allowed through TicketSaver. Tickets sold outside the platform may be invalidated, cancelled.
```
Y **eliminar la última línea**:
```
When you resell through us, the NFT is transferred to the buyer and your refund is issued instantly
```

### 7.5 Secciones `04 · Liability` y `05 · Account & fraud`
Sin cambios.

---

## 8. Observaciones transversales (requieren confirmación) ⚠️

No están pedidas explícitamente, pero se desprenden del conjunto de cambios.
**No aplicar sin aprobación del cliente.**

1. **Salida de la narrativa NFT / Base.** Los cambios eliminan sistemáticamente las
   menciones a NFT, wallet cripto y Base (home, footer, About, FAQs, Terms). Conviene
   hacer un `grep` global de `NFT`, `Base`, `wallet`, `mint`, `scalper`, `face value`
   y listar las apariciones restantes para decidirlas en bloque. Candidatos probables:
   página de Reventa, checkout, emails transaccionales, meta tags / OG description.
2. **"Face value" como concepto.** Deja de ser el argumento central (ahora es "lower
   fees"). Revisar si sigue apareciendo en copy no cubierto por este documento.
3. **Nav en español.** El item `Reventa` convive con `Home / Events / About / FAQs` en
   inglés. Fuera del alcance de este pedido, pero vale señalarlo.
4. **Footer → Legal → `PCI`.** No mencionado; se mantiene.
5. **`Last updated · May 2026` en Terms.** Al modificar el texto legal, evaluar si
   corresponde actualizar la fecha.

---

## 9. Checklist de aplicación

- [ ] §1 Hero home — subtítulo
- [ ] §2 Home — 3 cards "Why TicketSaver" (títulos + textos)
- [ ] §3 Footer — quitar bajada NFT + badge "Built on Base"
- [ ] §4.1 About — título
- [ ] §4.2 About — párrafo intro
- [ ] §4.3 About — métricas 250+ / 35,000+ y quitar la tercera (grid a 2 col.)
- [ ] §4.4 About — 4 cards "What we believe"
- [ ] §4.5 About — eliminar sección "The team"
- [ ] §5 Contact — normalizar teléfono (+ reportar hallazgos)
- [ ] §6.1 FAQ — respuesta "How do I buy a ticket?"
- [ ] §6.3 FAQ — eliminar "I don't have a wallet…"
- [ ] §6.4 FAQ — respuesta "Do you offer refunds?"
- [ ] §6.6 FAQ — respuesta "Can I resell my ticket?"
- [ ] §6.7 FAQ — respuesta "I forgot my phone…"
- [ ] §7.1 Terms — "The short version"
- [ ] §7.2 Terms — 01, quitar "and in your wallet as an NFT"
- [ ] §7.3 Terms — 02, eliminar punto #3 "Change of mind"
- [ ] §7.4 Terms — 03, texto nuevo + quitar última línea
- [ ] Revisar §8 con el cliente antes de cerrar
