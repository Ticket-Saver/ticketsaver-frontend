/**
 * Helpers de pricing — desglose de subtotal + service fee + taxes + total.
 *
 * Los porcentajes son placeholders consistentes con el legacy (`fees =
 * subtotal * 0.085`). Cuando el cliente confirme la matriz fiscal real
 * (por estado / por categoría de evento), se reemplazan aquí sin tocar
 * la UI.
 */

export const SERVICE_FEE_PCT = 0.085 // 8.5%
export const TAX_PCT = 0.06 // 6%

export interface PricingBreakdown {
  subtotal: number
  serviceFee: number
  taxes: number
  total: number
}

const round2 = (n: number) => Math.round(n * 100) / 100

export const computePricing = (subtotal: number): PricingBreakdown => {
  const safeSub = Number.isFinite(subtotal) && subtotal > 0 ? subtotal : 0
  const serviceFee = round2(safeSub * SERVICE_FEE_PCT)
  const taxes = round2(safeSub * TAX_PCT)
  const total = round2(safeSub + serviceFee + taxes)
  return { subtotal: round2(safeSub), serviceFee, taxes, total }
}
