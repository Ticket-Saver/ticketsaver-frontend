type Prices = { 
  [priceType: string]: {
    [priceDate: string]: {
      "price_base": number,
      "price_final": number
    }
   } 
  }; 

type Seat = [string, number]; //["A",1]

type SeatMap = {
  [zone: string]: {   // Mezzanine
    [priceType: string]: string[] // P1 -> "A","B","C" 
  }
};


// precios y sus correspondientes zonas
const zone_prices_file = (data: any): { prices: Prices, seatmap: SeatMap } => {

  if (!('prices' in data) || !('zones' in data)) {
    throw new Error('info incomplete');
  }
  return {
    prices: data.prices,
    seatmap: data.zones
  };
};
export {zone_prices_file}



// dada la zona y asiento, se regresa un precio"
const zoneseat_to_price = (seatmap: SeatMap, zone: string, seat: Seat): string => {
  for (const [priceType, rows] of Object.entries(seatmap[zone])) {
    if (rows.includes(seat[0])) {
      return priceType;
    }
  }
  throw new Error("Seat out of range");
};

export { zoneseat_to_price };


//dado un tipo de precio, se regresa el monto
const pricetypeToAmount = (prices: Prices, priceType: string): number => {
  const priceHistory = prices[priceType];
  const dateObjs = Object.keys(priceHistory).map(date => new Date(date));
  dateObjs.sort((a, b) => a.getTime() - b.getTime());

  const dateTs = dateObjs.filter(date => date < new Date()).pop();
  if (!dateTs) {
    throw new Error('No valid date found');
  }

  const formattedDate = dateTs.toISOString().split('T')[0];  //formato correcto según la funcionalidad YYYmmdd
  return priceHistory[formattedDate]['price_base'];
};

export { pricetypeToAmount };


const find_price = (data: any, zone: string, seat:Seat): number => {
  const { prices, seatmap } = zone_prices_file(data);
  const priceType = zoneseat_to_price(seatmap, zone, seat);
  return pricetypeToAmount(prices, priceType);
}
export {find_price};
