type Prices = {
  [priceType: string]: {
    [priceDate: string]: {
      price_base: number
      price_final: number
    }
  }
}

type Seat = [string, number] //["A",1]

type SeatMap = {
  [zone: string]: {
    // Mezzanine
    [priceType: string]: {
      //P1
      [row: string]: string[] // "A": ["14, 2, -2", "101, 112", "1, 13, 2"]
    }
  }
}

const seatrangesToValues = (ranges: string[]): number[] => {
  // Inicializar la lista de valores que se devolverá
  const values: number[] = []

  // Iterar sobre cada string en la lista de rangos
  ranges.forEach((r) => {
    const parsedNumber = parseInt(r, 10)

    if (!isNaN(parsedNumber)) {
      values.push(parsedNumber)
    } else {
      try {
        let param = r.split(',', 3).map((s) => parseInt(s, 10))

        if (param.length === 2) {
          param.push(1)
        }
        const [start, end, step] = param

        const sgn = Math.sign(end - start)

        for (let i = start; i !== end + sgn; i += step) {
          values.push(i)
        }
      } catch (e) {
        console.error(`Error ${r}`, e)
      }
    }
  })
  return values
}
export { seatrangesToValues }

// precios y sus correspondientes zonas
const zone_prices_file = (data: any): { prices: Prices; seatmap: SeatMap } => {
  if (!('prices' in data) || !('zones' in data)) {
    throw new Error('info incomplete')
  }
  return {
    prices: data.prices,
    seatmap: data.zones
  }
}
export { zone_prices_file }

// dada la zona y asiento, se regresa un precio"
const zoneseatToPrice = (seatmap: SeatMap, zone: string, seat: Seat): string => {
  for (const [priceType, rows] of Object.entries(seatmap[zone])) {
    const rowMap: Record<string, string[]> = rows as Record<string, string[]>
    try {
      const row = rowMap[seat[0]]
      if (seatrangesToValues(row).includes(seat[1])) {
        return priceType
      }
    } catch (error) {
      continue
    }
  }
  throw new Error('Seat out of range')
}

export { zoneseatToPrice }

//dado un tipo de precio, se regresa el monto
const pricetypeToAmount = (prices: Prices, priceType: string): number => {
  const priceHistory = prices[priceType]
  const dateObjs = Object.keys(priceHistory).map((date) => new Date(date))
  dateObjs.sort((a, b) => a.getTime() - b.getTime())

  const dateTs = dateObjs.filter((date) => date < new Date()).pop()
  if (!dateTs) {
    throw new Error('No valid date found')
  }

  const formattedDate = dateTs.toISOString().split('T')[0] //formato correcto según la funcionalidad YYYmmdd
  return priceHistory[formattedDate]['price_base']
}

export { pricetypeToAmount }

const find_price = (data: any, zone: string, seat: Seat): number => {
  const { prices, seatmap } = zone_prices_file(data)
  const priceType = zoneseatToPrice(seatmap, zone, seat)
  return pricetypeToAmount(prices, priceType)
}
export { find_price }
