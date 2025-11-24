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
    seatTypeLabel: 'Pink',
    seatCssClass: 'Pink',

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
  },
  // Para añadir al array COPERNICUS_SECTIONS:

  {
    id: '21',
    title: 'Balcony Left 1',
    name: 'Pink',
    shape: 'poly',
    seatTypeLabel: 'Pink',
    seatCssClass: 'Pink',
    coords: [449.05, 1109.29, 146.67, 1110.25, 147.14, 1181.67, 449.05, 1182.63],
    polygon: [
      [449.05, 1109.29],
      [146.67, 1110.25],
      [147.14, 1181.67],
      [449.05, 1182.63]
    ],

    disabledSeats: [],

    // A..C, 1..10
    layout: [
      { rowLabel: 'A', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { rowLabel: 'B', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { rowLabel: 'C', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
    ]
  },

  {
    id: '22',
    title: 'Balcony Left 2',
    name: 'Green',
    shape: 'poly',
    seatTypeLabel: 'Green',
    seatCssClass: 'Green',
    coords: [146.19, 1182.15, 145.24, 1275.48, 448.57, 1275.01, 448.57, 1180.72],
    polygon: [
      [146.19, 1182.15],
      [145.24, 1275.48],
      [448.57, 1275.01],
      [448.57, 1180.72]
    ],

    disabledSeats: [],

    // D..G, 1..10
    layout: [
      { rowLabel: 'D', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { rowLabel: 'E', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { rowLabel: 'F', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { rowLabel: 'G', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
    ]
  },

  {
    id: '23',
    title: 'Balcony Left 3',
    name: 'Purple',
    shape: 'poly',
    seatTypeLabel: 'Purple',
    seatCssClass: 'Purple',
    coords: [
      146.25, 1275.79, 146.25, 1304.85, 177.81, 1304.22, 178.44, 1332.66, 235.94, 1332.35, 235.63,
      1361.72, 353.75, 1362.04, 354.38, 1333.6, 448.75, 1333.29, 449.06, 1275.79
    ],
    polygon: [
      [146.25, 1275.79],
      [146.25, 1304.85],
      [177.81, 1304.22],
      [178.44, 1332.66],
      [235.94, 1332.35],
      [235.63, 1361.72],
      [353.75, 1362.04],
      [354.38, 1333.6],
      [448.75, 1333.29],
      [449.06, 1275.79]
    ],

    disabledSeats: [
      { row: 1, col: 0 }, // I0
      { row: 2, col: 0 }, // J-1
      { row: 2, col: 1 }, // J0
      { row: 2, col: 2 }, // J1
      { row: 2, col: 7 }, // J6
      { row: 2, col: 8 }, // J7
      { row: 2, col: 9 } // J8
    ],

    layout: [
      { rowLabel: 'H', seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { rowLabel: 'I', seats: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
      { rowLabel: 'J', seats: [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8] }
    ]
  },
  {
    id: '24',
    title: 'Balcony Middle-Left 1',
    name: 'Blue',
    shape: 'poly',
    seatTypeLabel: 'Blue',
    seatCssClass: 'Blue',
    coords: [478.89, 1109.82, 478.89, 1180.93, 831.11, 1181.3, 830, 1109.45],
    polygon: [
      [478.89, 1109.82],
      [478.89, 1180.93],
      [831.11, 1181.3],
      [830, 1109.45]
    ],

    disabledSeats: [],

    // A..C, 11..20
    layout: [
      { rowLabel: 'A', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'B', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'C', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] }
    ]
  },

  {
    id: '25',
    title: 'Balcony Middle-Left 2',
    name: 'Pink',
    shape: 'poly',
    seatTypeLabel: 'Pink',
    seatCssClass: 'Pink',
    coords: [478.89, 1180.56, 478.15, 1275.01, 830, 1275.01, 830.74, 1181.3],
    polygon: [
      [478.89, 1180.56],
      [478.15, 1275.01],
      [830, 1275.01],
      [830.74, 1181.3]
    ],

    disabledSeats: [],

    // D..G, 11..20
    layout: [
      { rowLabel: 'D', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'E', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'F', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'G', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] }
    ]
  },

  {
    id: '26',
    title: 'Balcony Middle-Left 3',
    name: 'Green',
    shape: 'poly',
    seatTypeLabel: 'Green',
    seatCssClass: 'Green',
    coords: [
      479.63, 1275.75, 479.63, 1332.78, 543.33, 1333.52, 543.33, 1362.41, 752.59, 1362.41, 752.59,
      1333.52, 790, 1333.15, 788.89, 1305.01, 830.37, 1303.89, 830.37, 1275.38
    ],
    polygon: [
      [479.63, 1275.75],
      [479.63, 1332.78],
      [543.33, 1333.52],
      [543.33, 1362.41],
      [752.59, 1362.41],
      [752.59, 1333.52],
      [790, 1333.15],
      [788.89, 1305.01],
      [830.37, 1303.89],
      [830.37, 1275.38]
    ],

    disabledSeats: [
      { row: 1, col: 9 }, // I20
      { row: 2, col: 0 }, // J9
      { row: 2, col: 1 }, // J10
      { row: 2, col: 8 }, // J17
      { row: 2, col: 9 } // J18
    ],

    layout: [
      { rowLabel: 'H', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'I', seats: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      { rowLabel: 'J', seats: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18] }
    ]
  },
  {
    id: '27',
    title: 'Balcony Middle 1',
    name: 'Orange',
    shape: 'poly',
    seatTypeLabel: 'Orange',
    seatCssClass: 'Orange',
    coords: [866.3, 1109.82, 866.3, 1181.3, 1191.11, 1180.93, 1190.37, 1109.45],
    polygon: [
      [866.3, 1109.82],
      [866.3, 1181.3],
      [1191.11, 1180.93],
      [1190.37, 1109.45]
    ],

    disabledSeats: [],

    layout: [
      { rowLabel: 'A', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'B', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'C', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] }
    ]
  },
  {
    id: '28',
    title: 'Balcony Middle 2',
    name: 'Blue',
    shape: 'poly',
    seatTypeLabel: 'Blue',
    seatCssClass: 'Blue',
    coords: [866.3, 1181.3, 865.93, 1275.01, 1191.48, 1275.01, 1191.11, 1181.3],
    polygon: [
      [866.3, 1181.3],
      [865.93, 1275.01],
      [1191.48, 1275.01],
      [1191.11, 1181.3]
    ],

    disabledSeats: [],

    // D..G, 21..30
    layout: [
      { rowLabel: 'D', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'E', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'F', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'G', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] }
    ]
  },
  {
    id: '29',
    title: 'Balcony Middle 3',
    name: 'Pink',
    shape: 'poly',
    seatTypeLabel: 'Pink',
    seatCssClass: 'Pink',
    coords: [
      866.3, 1276.12, 866.3, 1333.15, 930.37, 1334.27, 930, 1362.04, 1159.26, 1362.78, 1159.26,
      1333.89, 1191.48, 1333.15, 1191.48, 1276.49
    ],
    polygon: [
      [866.3, 1276.12],
      [866.3, 1333.15],
      [930.37, 1334.27],
      [930, 1362.04],
      [1159.26, 1362.78],
      [1159.26, 1333.89],
      [1191.48, 1333.15],
      [1191.48, 1276.49]
    ],

    disabledSeats: [
      { row: 2, col: 0 }, // J19
      { row: 2, col: 1 }, // J20
      { row: 2, col: 9 } // J28
    ],

    layout: [
      { rowLabel: 'H', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'I', seats: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
      { rowLabel: 'J', seats: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28] }
    ]
  },
  {
    id: '30',
    title: 'Balcony Middle-Right 1',
    name: 'Blue',
    shape: 'poly',
    seatTypeLabel: 'Blue',
    seatCssClass: 'Blue',
    coords: [1234.07, 1109.82, 1234.45, 1180.93, 1543.33, 1181.3, 1543.33, 1109.82],
    polygon: [
      [1234.07, 1109.82],
      [1234.45, 1180.93],
      [1543.33, 1181.3],
      [1543.33, 1109.82]
    ],

    disabledSeats: [],

    // A..C, 31..40
    layout: [
      { rowLabel: 'A', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'B', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'C', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] }
    ]
  },
  {
    id: '31',
    title: 'Balcony Middle-Right 2',
    name: 'Pink',
    shape: 'poly',
    seatTypeLabel: 'Pink',
    seatCssClass: 'Pink',
    coords: [1234.45, 1181.3, 1234.82, 1276.12, 1543.7, 1275.75, 1543.33, 1181.67],
    polygon: [
      [1234.45, 1181.3],
      [1234.82, 1276.12],
      [1543.7, 1275.75],
      [1543.33, 1181.67]
    ],

    disabledSeats: [],

    // D..G, 31..40
    layout: [
      { rowLabel: 'D', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'E', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'F', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'G', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] }
    ]
  },
  {
    id: '32',
    title: 'Balcony Middle-Right 3',
    name: 'Green',
    shape: 'poly',
    seatTypeLabel: 'Green',
    seatCssClass: 'Green',
    coords: [
      1234.82, 1276.12, 1233.7, 1333.89, 1297.04, 1333.52, 1296.67, 1362.04, 1483.7, 1362.78,
      1482.59, 1333.89, 1514.45, 1333.15, 1514.07, 1305.38, 1544.07, 1304.64, 1543.7, 1275.75
    ],
    polygon: [
      [1234.82, 1276.12],
      [1233.7, 1333.89],
      [1297.04, 1333.52],
      [1296.67, 1362.04],
      [1483.7, 1362.78],
      [1482.59, 1333.89],
      [1514.45, 1333.15],
      [1514.07, 1305.38],
      [1544.07, 1304.64],
      [1543.7, 1275.75]
    ],

    disabledSeats: [
      { row: 1, col: 9 }, // I40
      { row: 2, col: 0 }, // J29
      { row: 2, col: 1 }, // J30
      { row: 2, col: 8 }, // J37
      { row: 2, col: 9 } // J38
    ],

    layout: [
      { rowLabel: 'H', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'I', seats: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
      { rowLabel: 'J', seats: [29, 30, 31, 32, 33, 34, 35, 36, 37, 38] }
    ]
  },
  {
    id: '33',
    title: 'Balcony Right 1',
    name: 'Pink',
    shape: 'poly',
    seatTypeLabel: 'Pink',
    seatCssClass: 'Pink',
    coords: [1580.8, 1108.61, 1580.4, 1181.41, 1904, 1181.81, 1903.2, 1109.41],
    polygon: [
      [1580.8, 1108.61],
      [1580.4, 1181.41],
      [1904, 1181.81],
      [1903.2, 1109.41]
    ],

    // A..C, 41..50
    disabledSeats: [],
    layout: [
      { rowLabel: 'A', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'B', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'C', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] }
    ]
  },
  {
    id: '34',
    title: 'Balcony Right 2',
    name: 'Green',
    shape: 'poly',
    seatTypeLabel: 'Green',
    seatCssClass: 'Green',
    coords: [1580, 1181.41, 1580.4, 1274.61, 1902.8, 1274.21, 1903.2, 1181.81],
    polygon: [
      [1580, 1181.41],
      [1580.4, 1274.61],
      [1902.8, 1274.21],
      [1903.2, 1181.81]
    ],

    // D..G, 41..50
    disabledSeats: [],
    layout: [
      { rowLabel: 'D', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'E', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'F', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'G', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] }
    ]
  },
  {
    id: '35',
    title: 'Balcony Right 3',
    name: 'Purple',
    shape: 'poly',
    seatTypeLabel: 'Purple',
    seatCssClass: 'Purple',
    coords: [
      1580.4, 1275.01, 1580, 1333.41, 1677.2, 1333.41, 1677.2, 1361.81, 1839.6, 1362.21, 1839.6,
      1333.81, 1903.2, 1334.21, 1903.6, 1275.81
    ],
    polygon: [
      [1580.4, 1275.01],
      [1580, 1333.41],
      [1677.2, 1333.41],
      [1677.2, 1361.81],
      [1839.6, 1362.21],
      [1839.6, 1333.81],
      [1903.2, 1334.21],
      [1903.6, 1275.81]
    ],

    // H, I: 41..50
    // J: 38..47 con hidden J38,J39,J40,J46,J47
    disabledSeats: [
      { row: 2, col: 0 }, // J38
      { row: 2, col: 1 }, // J39
      { row: 2, col: 2 }, // J40
      { row: 2, col: 8 }, // J46
      { row: 2, col: 9 } // J47
    ],
    layout: [
      { rowLabel: 'H', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'I', seats: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
      { rowLabel: 'J', seats: [38, 39, 40, 41, 42, 43, 44, 45, 46, 47] }
    ]
  }
]
