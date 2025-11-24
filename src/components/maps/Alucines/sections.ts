import { SeatSectionConfig } from './Helper'
export const COPERNICUS_SECTIONS: SeatSectionConfig[] = [
  {
    id: '1',
    title: 'Stage Left 1',
    name: 'Blue',
    shape: 'poly',
    seatTypeLabel: 'Blue',
    seatCssClass: 'Blue',
    coords: [
      449.13, 215.44, 263.48, 216.31, 262.61, 244.14, 235.65, 244.14, 235.22, 271.96, 210, 271.53,
      210.44, 301.96, 177.83, 301.53, 178.26, 350.66, 146.09, 351.53, 146.52, 380.66, 449.57, 379.79
    ],
    polygon: [
      [449.13, 215.44],
      [263.48, 216.31],
      [262.61, 244.14],
      [235.65, 244.14],
      [235.22, 271.96],
      [210, 271.53],
      [210.44, 301.96],
      [177.83, 301.53],
      [178.26, 350.66],
      [146.09, 351.53],
      [146.52, 380.66],
      [449.57, 379.79]
    ],

    disabledSeats: [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 3, col: 0 },
      { row: 4, col: 0 }
    ],

    layout: [
      { rowLabel: 'E', seats: [0, 0, 0, 0, 1, 2, 3, 4, 5, 6] },
      { rowLabel: 'F', seats: [0, 0, 0, 1, 2, 3, 4, 5, 6, 7] },
      { rowLabel: 'G', seats: [0, 0, 1, 2, 3, 4, 5, 6, 7, 8] },
      { rowLabel: 'H', seats: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
      { rowLabel: 'I', seats: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
      { rowLabel: 'J', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
    ]
  },
  {
    id: '2',
    title: 'Stage Left 2',
    name: 'Pink',
    shape: 'poly',
    seatTypeLabel: 'Pink', // o 'Orange', cambia esto si quieres otro tipo
    seatCssClass: 'Pink', // cssClass asociada
    coords: [448.26, 380.66, 146.09, 380.22, 146.09, 637.18, 448.7, 636.75],
    polygon: [
      [448.26, 380.66],
      [146.09, 380.22],
      [146.09, 637.18],
      [448.7, 636.75]
    ],

    // No hay asientos deshabilitados
    disabledSeats: [],

    // Filas K..T, columnas 1..10, todas llenas
    layout: [
      { rowLabel: 'K', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { rowLabel: 'L', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { rowLabel: 'M', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { rowLabel: 'N', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { rowLabel: 'O', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { rowLabel: 'P', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { rowLabel: 'Q', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { rowLabel: 'R', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { rowLabel: 'S', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { rowLabel: 'T', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
    ]
  },
  {
    id: '3',
    title: 'Stage Left 3',
    name: 'Green',
    shape: 'poly',
    seatTypeLabel: 'Green', // o 'Orange', cambia esto si quieres otro tipo
    seatCssClass: 'Green', // cssClass asociada
    coords: [448.7, 638.49, 177.83, 638.05, 177.83, 786.31, 449.57, 785.88],
    polygon: [
      [448.7, 638.49],
      [177.83, 638.05],
      [177.83, 786.31],
      [449.57, 785.88]
    ],
    disabledSeats: [],

    layout: [
      { rowLabel: 'U', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
      { rowLabel: 'V', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
      { rowLabel: 'W', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
      { rowLabel: 'X', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
      { rowLabel: 'Y', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
      { rowLabel: 'Z', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9] }
    ]
  },
  {
    id: '4',
    title: 'Stage Left 4',
    name: 'Purple',
    shape: 'poly',
    seatTypeLabel: 'Purple',
    seatCssClass: 'Purple',
    coords: [
      449.6, 787.81, 178, 787.01, 178.4, 845.81, 210, 845.41, 210.4, 902.21, 236.8, 901.41, 236,
      931.01, 317.2, 931.41, 316.8, 959.81, 449.2, 959.41
    ],
    polygon: [
      [449.6, 787.81],
      [178, 787.01],
      [178.4, 845.81],
      [210, 845.41],
      [210.4, 902.21],
      [236.8, 901.41],
      [236, 931.01],
      [317.2, 931.41],
      [316.8, 959.81],
      [449.2, 959.41]
    ],

    disabledSeats: [
      { row: 2, col: 0 },
      { row: 3, col: 0 },
      { row: 4, col: 0 },
      { row: 4, col: 1 },
      { row: 5, col: 0 },
      { row: 5, col: 1 },
      { row: 5, col: 2 },
      { row: 5, col: 3 },
      { row: 5, col: 4 }
    ],

    layout: [
      { rowLabel: 'AA', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
      { rowLabel: 'BB', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
      { rowLabel: 'CC', seats: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
      { rowLabel: 'DD', seats: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
      { rowLabel: 'EE', seats: [-1, 0, 1, 2, 3, 4, 5, 6, 7] },
      { rowLabel: 'FF', seats: [-4, -3, -2, -1, 0, 1, 2, 3, 4] }
    ]
  },
  {
    id: '5',
    title: 'Stage Middle-Left 1',
    name: 'Orange',
    shape: 'poly',
    seatTypeLabel: 'Orange',
    seatCssClass: 'Orange',

    coords: [478.33, 155.84, 478.89, 379.18, 829.45, 380.29, 829.45, 155.29],
    polygon: [
      [478.33, 155.84],
      [478.89, 379.18],
      [829.45, 380.29],
      [829.45, 155.29]
    ],

    disabledSeats: [],

    layout: [
      { rowLabel: 'C', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'D', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'E', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'F', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'G', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'H', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'I', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'J', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] }
    ]
  },
  {
    id: '6',
    title: 'Stage Middle-Left 2',
    name: 'Blue',
    shape: 'poly',
    seatTypeLabel: 'Blue',
    seatCssClass: 'Blue',

    coords: [478.64, 380.23, 479.55, 609.33, 830, 609.78, 830, 380.69],
    polygon: [
      [478.64, 380.23],
      [479.55, 609.33],
      [830, 609.78],
      [830, 380.69]
    ],

    disabledSeats: [],

    layout: [
      { rowLabel: 'K', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'L', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'M', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'N', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'O', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'P', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'Q', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'R', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'S', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] }
    ]
  },
  {
    id: '7',
    title: 'Stage Middle-Left 3',
    name: 'Pink',
    shape: 'poly',
    seatTypeLabel: 'Pink',
    seatCssClass: 'Pink',

    coords: [479.55, 609.78, 478.64, 816.14, 830, 815.69, 830, 609.78],
    polygon: [
      [479.55, 609.78],
      [478.64, 816.14],
      [830, 815.69],
      [830, 609.78]
    ],

    disabledSeats: [],

    layout: [
      { rowLabel: 'T', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'U', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'V', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'W', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'X', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'Y', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'Z', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'AA', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] }
    ]
  },
  {
    id: '8',
    title: 'Stage Middle-Left 4',
    name: 'Green',
    shape: 'poly',
    seatTypeLabel: 'Green',
    seatCssClass: 'Green',

    coords: [
      479.09, 817.51, 479.55, 930.69, 509.09, 931.6, 509.55, 958.87, 752.73, 959.33, 752.27, 931.14,
      830.46, 931.6, 830, 817.05
    ],
    polygon: [
      [479.09, 817.51],
      [479.55, 930.69],
      [509.09, 931.6],
      [509.55, 958.87],
      [752.73, 959.33],
      [752.27, 931.14],
      [830.46, 931.6],
      [830, 817.05]
    ],

    disabledSeats: [
      { row: 4, col: 0 },
      { row: 4, col: 8 },
      { row: 4, col: 9 }
    ],

    layout: [
      { rowLabel: 'BB', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'CC', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'DD', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'EE', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'FF', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] }
    ]
  },
  {
    id: '9',
    title: 'Stage Middle 1',
    name: 'Orange',
    shape: 'poly',
    seatTypeLabel: 'Orange',
    seatCssClass: 'Orange',

    coords: [866, 156.21, 866, 433.41, 1191.6, 433.01, 1191.2, 156.61],
    polygon: [
      [866, 156.21],
      [866, 433.41],
      [1191.6, 433.01],
      [1191.2, 156.61]
    ],

    disabledSeats: [],

    layout: [
      { rowLabel: 'C', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'D', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'E', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'F', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'G', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'H', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'I', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'J', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'K', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'L', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] }
    ]
  },
  {
    id: '10',
    title: 'Stage Middle 2',
    name: 'Blue',
    shape: 'poly',
    seatTypeLabel: 'Blue',
    seatCssClass: 'Blue',

    coords: [865.6, 433.81, 866.4, 681.81, 1191.6, 681.81, 1191.2, 432.61],
    polygon: [
      [865.6, 433.81],
      [866.4, 681.81],
      [1191.6, 681.81],
      [1191.2, 432.61]
    ],

    disabledSeats: [],

    layout: [
      { rowLabel: 'M', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'N', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'O', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'P', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'Q', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'R', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'S', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'T', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'U', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'V', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] }
    ]
  },
  {
    id: '11',
    title: 'Stage Middle 3',
    name: 'Pink',
    shape: 'poly',
    seatTypeLabel: 'Pink',
    seatCssClass: 'Pink',

    coords: [866, 681.81, 866, 876.21, 1191.2, 875.81, 1191.6, 683.01],
    polygon: [
      [866, 681.81],
      [866, 876.21],
      [1191.2, 875.81],
      [1191.6, 683.01]
    ],

    disabledSeats: [],

    layout: [
      { rowLabel: 'W', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'X', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'Y', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'Z', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'AA', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'BB', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'CC', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] }
    ]
  },
  {
    id: '12',
    title: 'Stage Middle 4',
    name: 'Purple',
    shape: 'poly',
    seatTypeLabel: 'Purple',
    seatCssClass: 'Purple',

    coords: [865.6, 876.21, 866, 960.21, 1191.6, 960.61, 1190.8, 877.01],
    polygon: [
      [865.6, 876.21],
      [866, 960.21],
      [1191.6, 960.61],
      [1190.8, 877.01]
    ],

    disabledSeats: [],

    layout: [
      { rowLabel: 'DD', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'EE', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'FF', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] }
    ]
  },
  {
    id: '13',
    title: 'Stage Middle-Right 1',
    name: 'Orange',
    shape: 'poly',
    seatTypeLabel: 'Orange',
    seatCssClass: 'Orange',

    coords: [1234.07, 156.12, 1233.33, 379.82, 1543.33, 380.56, 1543.33, 156.12],
    polygon: [
      [1234.07, 156.12],
      [1233.33, 379.82],
      [1543.33, 380.56],
      [1543.33, 156.12]
    ],

    disabledSeats: [],

    layout: [
      { rowLabel: 'C', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'D', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'E', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'F', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'G', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'H', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'I', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'J', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] }
    ]
  },
  {
    id: '14',
    title: 'Stage Middle-Right 2',
    name: 'Blue',
    shape: 'poly',
    seatTypeLabel: 'Blue',
    seatCssClass: 'Blue',

    coords: [1234.45, 380.56, 1233.7, 610.19, 1542.96, 609.82, 1542.96, 380.19],
    polygon: [
      [1234.45, 380.56],
      [1233.7, 610.19],
      [1542.96, 609.82],
      [1542.96, 380.19]
    ],

    disabledSeats: [],

    layout: [
      { rowLabel: 'K', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'L', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'M', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'N', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'O', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'P', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'Q', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'R', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'S', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] }
    ]
  },
  {
    id: '15',
    title: 'Stage Middle-Right 3',
    name: 'Pink',
    shape: 'poly',
    seatTypeLabel: 'Pink',
    seatCssClass: 'Pink',

    coords: [1234.45, 610.19, 1233.7, 816.86, 1542.96, 816.12, 1543.33, 610.56],
    polygon: [
      [1234.45, 610.19],
      [1233.7, 816.86],
      [1542.96, 816.12],
      [1543.33, 610.56]
    ],

    disabledSeats: [],

    layout: [
      { rowLabel: 'T', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'U', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'V', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'W', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'X', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'Y', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'Z', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'AA', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] }
    ]
  },
  {
    id: '16',
    title: 'Stage Middle-Right 4',
    name: 'Green',
    shape: 'poly',
    seatTypeLabel: 'Green',
    seatCssClass: 'Green',

    coords: [
      1233.7, 816.86, 1234.45, 931.3, 1265.56, 930.93, 1265.93, 959.82, 1482.96, 960.56, 1483.7,
      931.67, 1542.96, 930.93, 1542.96, 816.49
    ],
    polygon: [
      [1233.7, 816.86],
      [1234.45, 931.3],
      [1265.56, 930.93],
      [1265.93, 959.82],
      [1482.96, 960.56],
      [1483.7, 931.67],
      [1542.96, 930.93],
      [1542.96, 816.49]
    ],

    // Hidden FF31, FF39, FF40
    disabledSeats: [
      { row: 4, col: 0 }, // FF31
      { row: 4, col: 8 }, // FF39
      { row: 4, col: 9 } // FF40
    ],

    layout: [
      { rowLabel: 'BB', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'CC', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'DD', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'EE', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'FF', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] }
    ]
  },
  {
    id: '17',
    title: 'Stage Right 1',
    name: 'Blue',
    shape: 'poly',
    seatTypeLabel: 'Blue',
    seatCssClass: 'Blue',

    coords: [
      1580.69, 156.38, 1580.35, 380.52, 1903.8, 379.83, 1903.8, 351.21, 1871.38, 350.87, 1871.04,
      301.56, 1839.31, 301.9, 1840, 272.59, 1807.24, 272.25, 1807.59, 244.32, 1776.21, 244.32,
      1776.55, 216.73, 1743.45, 216.73, 1743.45, 186.04, 1710.35, 186.73, 1710.35, 156.04
    ],
    polygon: [
      [1580.69, 156.38],
      [1580.35, 380.52],
      [1903.8, 379.83],
      [1903.8, 351.21],
      [1871.38, 350.87],
      [1871.04, 301.56],
      [1839.31, 301.9],
      [1840, 272.59],
      [1807.24, 272.25],
      [1807.59, 244.32],
      [1776.21, 244.32],
      [1776.55, 216.73],
      [1743.45, 216.73],
      [1743.45, 186.04],
      [1710.35, 186.73],
      [1710.35, 156.04]
    ],

    disabledSeats: [
      { row: 0, col: 4 },
      { row: 0, col: 5 },
      { row: 0, col: 6 },
      { row: 0, col: 7 },
      { row: 0, col: 8 },
      { row: 0, col: 9 },

      { row: 1, col: 5 },
      { row: 1, col: 6 },
      { row: 1, col: 7 },
      { row: 1, col: 8 },
      { row: 1, col: 9 },

      { row: 2, col: 6 },
      { row: 2, col: 7 },
      { row: 2, col: 8 },
      { row: 2, col: 9 },

      { row: 3, col: 7 },
      { row: 3, col: 8 },
      { row: 3, col: 9 },

      { row: 4, col: 8 },
      { row: 4, col: 9 },

      { row: 5, col: 9 },

      { row: 6, col: 9 }
    ],

    layout: [
      { rowLabel: 'C', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'D', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'E', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'F', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'G', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'H', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'I', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'J', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] }
    ]
  },
  {
    id: '18',
    title: 'Stage Right 2',
    name: 'Pink',
    shape: 'poly',
    seatTypeLabel: 'Red',
    seatCssClass: 'Red',

    coords: [1581.04, 380.18, 1580.69, 636.73, 1903.45, 636.04, 1903.8, 380.18],
    polygon: [
      [1581.04, 380.18],
      [1580.69, 636.73],
      [1903.45, 636.04],
      [1903.8, 380.18]
    ],

    disabledSeats: [],

    layout: [
      { rowLabel: 'K', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'L', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'M', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'N', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'O', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'P', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'Q', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'R', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'S', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'T', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] }
    ]
  },
  {
    id: '19',
    title: 'Stage Right 3',
    name: 'Green',
    shape: 'poly',
    seatTypeLabel: 'Green',
    seatCssClass: 'Green',

    coords: [1580.69, 638.8, 1580.35, 786.73, 1871.73, 786.73, 1871.38, 638.8],
    polygon: [
      [1580.69, 638.8],
      [1580.35, 786.73],
      [1871.73, 786.73],
      [1871.38, 638.8]
    ],

    disabledSeats: [],

    layout: [
      { rowLabel: 'U', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49] },
      { rowLabel: 'V', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49] },
      { rowLabel: 'W', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49] },
      { rowLabel: 'X', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49] },
      { rowLabel: 'Y', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49] },
      { rowLabel: 'Z', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49] }
    ]
  },
  {
    id: '20',
    title: 'Stage Right 4',
    name: 'Purple',
    shape: 'poly',
    seatTypeLabel: 'Purple',
    seatCssClass: 'Purple',

    coords: [
      1581.04, 787.42, 1581.04, 960.18, 1710.69, 960.18, 1710.35, 931.9, 1807.24, 930.87, 1807.59,
      901.9, 1839.66, 902.59, 1839.66, 847.07, 1871.73, 846.38, 1871.38, 787.42
    ],
    polygon: [
      [1581.04, 787.42],
      [1581.04, 960.18],
      [1710.69, 960.18],
      [1710.35, 931.9],
      [1807.24, 930.87],
      [1807.59, 901.9],
      [1839.66, 902.59],
      [1839.66, 847.07],
      [1871.73, 846.38],
      [1871.38, 787.42]
    ],

    disabledSeats: [
      { row: 2, col: 8 },
      { row: 3, col: 8 },
      { row: 4, col: 7 },
      { row: 4, col: 8 },
      { row: 5, col: 4 },
      { row: 5, col: 5 },
      { row: 5, col: 6 },
      { row: 5, col: 7 },
      { row: 5, col: 8 }
    ],

    layout: [
      { rowLabel: 'AA', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49] },
      { rowLabel: 'BB', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49] },
      { rowLabel: 'CC', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49] },
      { rowLabel: 'DD', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49] },
      { rowLabel: 'EE', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49] },
      { rowLabel: 'FF', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49] }
    ]
  }
]
