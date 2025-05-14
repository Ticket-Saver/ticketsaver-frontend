import { SeatIndex } from 'seatchart'

const getDefaultMap = () => ({
  name: 'Richmond_CA',
  areas: [
    //Naranjas Izquierda balcony
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 4) {
              return `${String.fromCharCode(72 - index.col)}${6 - index.row}`
            }
          },
          rows: 6,
          columns: 3,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${String.fromCharCode(72 - col)}`
              } else {
                return `${20 - col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${6 - row}`
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: [
            { row: 0, col: 0 },
            { row: 1, col: 0 },
            { row: 0, col: 0 },
            { row: 0, col: 1 }
          ]
        }
      },
      id: '1',
      title: 'Balcony A Orange Rear',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#ff8b2b',
      strokeColor: '#f54242',
      coords: [
        92.9, 92.8, 70.05, 92.8, 69.88, 106.5, 45.89, 106.31, 46.61, 132.6, 21.74, 133.32, 22.01,
        177.55, 92.2, 178.99
      ],
      polygon: [
        [92.9, 92.8],
        [70.05, 92.8],
        [69.88, 106.5],
        [45.89, 106.31],
        [46.61, 132.6],
        [21.74, 133.32],
        [22.01, 177.55],
        [92.2, 178.99]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 10) {
              return `${String.fromCharCode(67 - index.col)}${11 - index.row}`
            }
          },
          rows: 11,
          columns: 3,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(67 - col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${11 - row}`
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: [
            { row: 0, col: 0 },
            { row: 1, col: 0 },
            { row: 0, col: 1 }
          ]
        }
      },
      id: '2',
      title: 'Balcony A Orange Front',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        266.24, 20.7, 241.49, 21.45, 240.43, 36.71, 215.83, 35.69, 216.77, 49.78, 194.33, 50.64,
        194.43, 176.02, 264.84, 176.76
      ],
      polygon: [
        [266.24, 20.7],
        [241.49, 21.45],
        [240.43, 36.71],
        [215.83, 35.69],
        [216.77, 49.78],
        [194.33, 50.64],
        [194.43, 176.02],
        [264.84, 176.76]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(73 - index.col)}${14 - index.row}`
          },
          rows: 14,
          columns: 6,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(73 - col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${14 - row}`
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: []
        }
      },
      id: '3',
      title: 'Balcony B Orange Rear',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [144.79, 202.93, 4.25, 203.21, 4.25, 397.75, 144.98, 398.66],
      polygon: [
        [144.79, 202.93],
        [4.25, 203.21],
        [4.25, 397.75],
        [144.98, 398.66]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (14 - index.col > 10) {
              return `${String.fromCharCode(67 - index.col)}${14 - index.row}`
            }
          },
          rows: 14,
          columns: 3,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(67 - col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${14 - row}`
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: []
        }
      },
      id: '4',
      title: 'Balcony B Orange Front',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [266.36, 203.25, 198.47, 203.63, 198.87, 398.05, 265.93, 398.45],
      polygon: [
        [266.36, 203.25],
        [198.47, 203.63],
        [198.87, 398.05],
        [265.93, 398.45]
      ]
    },
    //Naranjas derecha balcony
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(65 + index.col)}${14 - index.row}`
          },
          rows: 14,
          columns: 3,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(65 + col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${14 - row}`
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: []
        }
      },
      id: '5',
      title: 'Balcony O Orange Front',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [1122.42, 203.45, 1053.97, 203.64, 1053.78, 398.94, 1123.43, 399.64],
      polygon: [
        [1122.42, 203.45],
        [1053.97, 203.64],
        [1053.78, 398.94],
        [1123.43, 399.64]
      ]
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(68 + index.col)}${14 - index.row}`
          },
          rows: 14,
          columns: 6,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(68 + col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${14 - row}`
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: []
        }
      },
      id: '6',
      title: 'Balcony O Orange Rear',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [1321.63, 202.9, 1182.6, 202.64, 1182.5, 398.85, 1321.44, 398.45],
      polygon: [
        [1321.63, 202.9],
        [1182.6, 202.64],
        [1182.5, 398.85],
        [1243.44, 398.45]
      ]
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(65 + index.col)}${11 - index.row}`
          },
          rows: 11,
          columns: 3,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(65 + col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${11 - row}`
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: [
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 1, col: 2 }
          ]
        }
      },
      id: '7',
      title: 'Balcony P Orange Front',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        1120.44, 53.38, 1095.14, 53.15, 1095.37, 39.33, 1071.26, 38.05, 1070.66, 23.41, 1053.4,
        23.43, 1054.6, 173.61, 1121.25, 174.35
      ],
      polygon: [
        [1120.44, 53.38],
        [1095.14, 53.15],
        [1095.37, 39.33],
        [1071.26, 38.05],
        [1070.66, 23.41],
        [1053.4, 23.43],
        [1054.6, 173.61],
        [1121.25, 174.35]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(70 + index.col)}${6 - index.row}`
          },
          rows: 6,
          columns: 3,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(70 + col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${6 - row}`
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: [
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 1, col: 2 },
            { row: 2, col: 2 }
          ]
        }
      },
      id: '8',
      title: 'Balcony P Orange Rear',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        1295.5, 131.8, 1273.3, 131.6, 1271.09, 104.8, 1246.5, 104.9, 1245.6, 93.3, 1228.5, 93.6,
        1228.5, 173.8, 1296.2, 174.0
      ],
      polygon: [
        [1295.5, 131.8],
        [1273.3, 131.6],
        [1271.09, 104.8],
        [1246.5, 104.9],
        [1245.6, 93.3],
        [1228.5, 93.6],
        [1228.5, 173.8],
        [1296.2, 174.0]
      ]
    },
    //Morados Balcony de izq a derecha
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(73 - index.col)}${14 - index.row}`
          },
          rows: 14,
          columns: 4,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(73 - col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${14 - row}`
          },
          seatTypes: {
            default: {
              label: 'Purple',
              cssClass: 'Purple'
            }
          },
          disabledSeats: [{ row: 0, col: 0 }]
        }
      },
      id: '9',
      title: 'Balcony C Purple Rear',
      shape: 'poly',
      name: 'Purple',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        95.34, 417.16, 31.1, 417.75, 31.6, 432.55, 4.49, 432.57, 4.36, 612.21, 95.87, 611.99, 95.32,
        418.0
      ],
      polygon: [
        [95.34, 417.16],
        [31.1, 417.75],
        [31.6, 432.55],
        [4.49, 432.57],
        [4.36, 612.21],
        [95.87, 611.99],
        [95.32, 418.0]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(67 - index.col)}${14 - index.row}`
          },
          rows: 14,
          columns: 3,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(67 - col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${14 - row}`
          },
          seatTypes: {
            default: {
              label: 'Purple',
              cssClass: 'Purple'
            }
          },
          disabledSeats: []
        }
      },
      id: '10',
      title: 'Balcony C Purple Front',
      shape: 'poly',
      name: 'Purple',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [269.07, 432.89, 200.73, 432.89, 200.45, 611.89, 268.25, 612.19],
      polygon: [
        [269.07, 423.38],
        [200.73, 432.89],
        [200.45, 611.89],
        [268.25, 612.19]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(73 - index.col)}${14 - index.row}`
          },
          rows: 14,
          columns: 6,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(73 - col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${14 - row}`
          },
          seatTypes: {
            default: {
              label: 'Purple',
              cssClass: 'Purple'
            }
          },
          disabledSeats: []
        }
      },
      id: '11',
      title: 'Balcony D Purple Rear',
      shape: 'poly',
      name: 'Purple',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [147.4, 641.85, 2.66, 639.81, 3.9, 840.58, 149.5, 839.67],
      polygon: [
        [147.4, 641.85],
        [2.66, 639.81],
        [3.9, 840.58],
        [149.5, 839.67]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,

          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(67 - index.col)}${14 - index.row}`
          },
          rows: 14,
          columns: 3,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(67 - col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${14 - row}`
          },
          seatTypes: {
            default: {
              label: 'Purple',
              cssClass: 'Purple'
            }
          },
          disabledSeats: []
        }
      },
      id: '12',
      title: 'Balcony D Purple Front',
      shape: 'poly',
      name: 'Purple',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [265.96, 638.18, 197.39, 638.13, 198.2, 833.27, 266.08, 832.9],
      polygon: [
        [265.96, 638.18],
        [197.39, 638.13],
        [198.2, 833.27],
        [266.08, 832.9]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (index.col == 0) {
              return `${String.fromCharCode(75 - index.col)}${17 - index.row}`
            }
            return `${String.fromCharCode(74 - index.col)}${17 - index.row}`
          },
          rows: 17,
          columns: 5,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col == 0) {
                return `${String.fromCharCode(75 - col)}`
              }
              return `${String.fromCharCode(74 - col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${17 - row}`
          },
          seatTypes: {
            default: {
              label: 'Purple',
              cssClass: 'Purple'
            }
          },
          disabledSeats: []
        }
      },
      id: '13',
      title: 'Balcony E Purple Rear',
      shape: 'poly',
      name: 'Purple',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        99.6, 878.31, 26.99, 880.65, 27.61, 849.36, 1.8, 849.46, 1.6, 888.94, 9.33, 948.53, 20.9,
        988.16, 1.92, 996.17, 12.29, 1035.27, 33.06, 1073.54, 52.85, 1102.88, 159.24, 1041.81,
        122.81, 975.93
      ],
      polygon: [
        [99.6, 878.31],
        [26.99, 880.65],
        [27.61, 849.36],
        [1.8, 849.46],
        [1.6, 888.94],
        [9.33, 948.53],
        [20.9, 988.16],
        [1.92, 996.17],
        [12.29, 1035.27],
        [33.06, 1073.54],
        [52.85, 1102.88],
        [159.24, 1041.81],
        [122.81, 975.93]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(67 - index.col)}${14 - index.row}`
          },
          rows: 14,
          columns: 3,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(67 - col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${14 - row}`
          },
          seatTypes: {
            default: {
              label: 'Purple',
              cssClass: 'Purple'
            }
          },
          disabledSeats: [
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 1, col: 2 },
            { row: 2, col: 2 }
          ]
        }
      },
      id: '14',
      title: 'Balcony E Purple Front',
      shape: 'poly',
      name: 'Purple',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        276.01, 898.18, 254.74, 901.12, 248.59, 874.45, 222.25, 875.6, 222.16, 864.1, 203.43,
        866.15, 204.8, 915.02, 217.23, 953.9, 240.91, 994.67, 270.22, 1031.68, 311.14, 1065.77,
        353.14, 1007.0, 316.21, 972.74, 316.21, 972.74, 292.06, 938.27
      ],
      polygon: [
        [276.01, 898.18],
        [254.74, 901.12],
        [248.59, 874.45],
        [222.25, 875.6],
        [222.16, 864.1],
        [203.43, 865.15],
        [204.8, 915.02],
        [217.23, 953.9],
        [240.91, 994.67],
        [270.22, 1031.68],
        [311.14, 1065.77],
        [353.14, 1007.0],
        [316.21, 972.74],
        [316.21, 972.74],
        [292.06, 938.27]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (14 - index.row > 10) {
              return `${String.fromCharCode(65 + index.row)}${12 - index.col}`
            }
          },
          rows: 3,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${12 - col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Purple',
              cssClass: 'Purple'
            }
          },
          disabledSeats: []
        }
      },
      id: '15',
      title: 'Balcony G Purple',
      shape: 'poly',
      name: 'Purple',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        541.81, 1047.99, 449.49, 1044.22, 413.49, 1037.27, 373.13, 1021.57, 333.75, 1077.77, 397.79,
        1103.72, 465.97, 1114.15, 541.06, 1114.83
      ],
      polygon: [
        [541.81, 1047.99],
        [449.49, 1044.22],
        [413.49, 1037.27],
        [373.13, 1021.57],
        [333.75, 1077.77],
        [397.79, 1103.72],
        [465.97, 1114.15],
        [541.06, 1114.83]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (14 - index.row > 10) {
              return `${String.fromCharCode(65 + index.row)}${index.col + 1}`
            }
          },
          rows: 3,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${col + 1}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Purple',
              cssClass: 'Purple'
            }
          },
          disabledSeats: []
        }
      },
      id: '16',
      title: 'Balcony H Purple',
      shape: 'poly',
      name: 'Purple',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [783.04, 1051.32, 568.83, 1051.44, 568.34, 1115.23, 782.51, 1115.87],
      polygon: [
        [783.04, 1051.32],
        [568.83, 1051.44],
        [568.34, 1115.23],
        [782.51, 1115.87]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (14 - index.row > 10) {
              return `${String.fromCharCode(65 + index.row)}${index.col + 1}`
            }
          },
          rows: 3,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${col + 1}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Purple',
              cssClass: 'Purple'
            }
          },
          disabledSeats: []
        }
      },
      id: '17',
      title: 'Balcony J Purple',
      shape: 'poly',
      name: 'Purple',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        974.08, 1021.7, 931.73, 1038.18, 868.64, 1046.83, 808.98, 1047.56, 809.0, 1114.55, 894.09,
        1112.12, 949.2, 1102.73, 1013.6, 1077.29
      ],
      polygon: [
        [974.08, 1021.7],
        [931.73, 1038.18],
        [868.64, 1046.83],
        [808.98, 1047.56],
        [809.0, 1114.55],
        [894.09, 1112.12],
        [949.2, 1102.73],
        [1013.6, 1077.29]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (14 - index.row > 10) {
              return `${String.fromCharCode(65 + index.row)}${index.col + 1}`
            }
          },
          rows: 3,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${col + 1}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Purple',
              cssClass: 'Purple'
            }
          },
          disabledSeats: [
            { row: 0, col: 11 },
            { row: 0, col: 12 },
            { row: 0, col: 13 },
            { row: 1, col: 13 }
          ]
        }
      },
      id: '18',
      title: 'Balcony L Purple Front',
      shape: 'poly',
      name: 'Purple',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        1135.25, 863.81, 1112.3, 865.11, 1110.19, 875.99, 1088.85, 874.4, 1082.68, 900.81, 1058.05,
        896.29, 1044.26, 939.36, 1019.09, 976.56, 984.96, 1007.97, 1027.81, 1068.62, 1079.82,
        1018.88, 1118.09, 961.11, 1133.68, 906.1
      ],
      polygon: [
        [1135.25, 863.81],
        [1112.3, 865.11],
        [1110.19, 875.99],
        [1088.85, 874.4],
        [1082.68, 900.81],
        [1058.05, 896.29],
        [1044.26, 939.36],
        [1019.09, 976.56],
        [984.96, 1007.97],
        [1027.81, 1068.62],
        [1079.82, 1018.88],
        [1118.09, 961.11],
        [1133.68, 906.1]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (index.row == 4) {
              return `${String.fromCharCode(71 + index.row)}${index.col + 1}`
            }
            return `${String.fromCharCode(70 + index.row)}${index.col + 1}`
          },
          rows: 5,
          columns: 17,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${col + 1}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              if (row == 4) {
                return `${String.fromCharCode(71 + row)}`
              }
              return `${String.fromCharCode(70 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Purple',
              cssClass: 'Purple'
            }
          },
          disabledSeats: [
            { row: 0, col: 14 },
            { row: 0, col: 15 },
            { row: 0, col: 16 },
            { row: 1, col: 14 },
            { row: 1, col: 15 },
            { row: 1, col: 16 },
            { row: 2, col: 14 },
            { row: 2, col: 15 },
            { row: 2, col: 16 },
            { row: 4, col: 8 },
            { row: 4, col: 9 },
            { row: 4, col: 10 },
            { row: 4, col: 11 },
            { row: 4, col: 12 },
            { row: 4, col: 13 },
            { row: 4, col: 14 },
            { row: 4, col: 15 },
            { row: 4, col: 16 }
          ]
        }
      },
      id: '19',
      title: 'Balcony L Purple Rear',
      shape: 'poly',
      name: 'Purple',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        1325.88, 852.54, 1305.57, 851.19, 1305.15, 882.67, 1231.07, 878.51, 1221.59, 939.04,
        1199.87, 992.79, 1170.96, 1040.26, 1276.12, 1102.49, 1310.01, 1051.43, 1333.02, 994.37,
        1306.66, 988.13, 1325.94, 913.79
      ],
      polygon: [
        [1325.88, 852.54],
        [1305.57, 851.19],
        [1305.15, 882.67],
        [1231.07, 878.51],
        [1221.59, 939.04],
        [1199.87, 992.79],
        [1170.96, 1040.26],
        [1276.12, 1102.49],
        [1310.01, 1051.43],
        [1333.02, 994.37],
        [1306.66, 988.13],
        [1325.94, 913.79]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(65 + index.col)}${14 - index.row}`
          },
          rows: 14,
          columns: 3,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(65 + col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              return `${14 - row}`
            }
          },
          seatTypes: {
            default: {
              label: 'Purple',
              cssClass: 'Purple'
            }
          },
          disabledSeats: []
        }
      },
      id: '20',
      title: 'Balcony M Purple Front',
      shape: 'poly',
      name: 'Purple',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [1122.2, 637.8, 1053.8, 638.0, 1053.6, 833.2, 1122.2, 833.2],
      polygon: [
        [1122.2, 637.8],
        [1053.8, 638.0],
        [1053.6, 833.2],
        [1122.2, 833.2]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(68 + index.col)}${14 - index.row}`
          },
          rows: 14,
          columns: 6,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(68 + col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              return `${14 - row}`
            }
          },
          seatTypes: {
            default: {
              label: 'Purple',
              cssClass: 'Purple'
            }
          },
          disabledSeats: []
        }
      },
      id: '21',
      title: 'Balcony M Purple Rear',
      shape: 'poly',
      name: 'Purple',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [1323.8, 645.5, 1179.8, 645.0, 1180.8, 840.0, 1323.8, 840.0],
      polygon: [
        [1323.8, 645.5],
        [1179.8, 645.0],
        [1180.8, 840.0],
        [1323.8, 840.0]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(65 + index.col)}${13 - index.row}`
          },
          rows: 13,
          columns: 3,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(65 + col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              return `${13 - row}`
            }
          },
          seatTypes: {
            default: {
              label: 'Purple',
              cssClass: 'Purple'
            }
          },
          disabledSeats: []
        }
      },
      id: '22',
      title: 'Balcony N Purple Front',
      shape: 'poly',
      name: 'Purple',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [1124.46, 431.61, 1057.67, 432.98, 1056.73, 611.59, 1125.11, 611.46],
      polygon: [
        [1124.46, 431.61],
        [1057.67, 432.98],
        [1056.73, 611.59],
        [1125.11, 611.46]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(70 + index.col)}${14 - index.row}`
          },
          rows: 14,
          columns: 4,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(70 + col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              return `${14 - row}`
            }
          },
          seatTypes: {
            default: {
              label: 'Purple',
              cssClass: 'Purple'
            }
          },
          disabledSeats: []
        }
      },
      id: '23',
      title: 'Balcony N Purple Rear',
      shape: 'poly',
      name: 'Purple',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [1321.18, 431.73, 1232.49, 430.24, 1233.31, 625.65, 1322.67, 625.97],
      polygon: [
        [1321.18, 431.73],
        [1232.49, 430.24],
        [1233.31, 625.65],
        [1322.67, 625.97]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (index.row == 6) {
              return `${String.fromCharCode(69 + index.row)}${15 - index.col}`
            }
            return `${String.fromCharCode(68 + index.row)}${15 - index.col}`
          },
          rows: 7,
          columns: 15,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${15 - col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              if (row == 6) {
                return `${String.fromCharCode(69 + row)}`
              }
              return `${String.fromCharCode(68 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Gray',
              cssClass: 'Gray'
            }
          },
          disabledSeats: [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 0, col: 3 },
            { row: 0, col: 4 },
            { row: 0, col: 5 },
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 1, col: 3 },
            { row: 1, col: 4 },
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
            { row: 2, col: 3 },
            { row: 3, col: 0 },
            { row: 3, col: 1 },
            { row: 3, col: 2 },
            { row: 4, col: 0 },
            { row: 5, col: 0 }
          ]
        }
      },
      id: '24',
      title: 'Balcony F Gray',
      shape: 'poly',
      name: 'Gray',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [319.2, 1123.2, 214.0, 1035.2, 69.0, 1122.2, 146.0, 1203.5, 267.8, 1285.2],
      polygon: [
        [319.2, 1123.2],
        [214.0, 1035.2],
        [69.0, 1122.2],
        [146.0, 1203.5],
        [267.8, 1285.2]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (index.row == 4) {
              return `${String.fromCharCode(71 + index.row)}${14 - index.col}`
            }
            return `${String.fromCharCode(70 + index.row)}${14 - index.col}`
          },
          rows: 5,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${14 - col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              if (row == 4) {
                return `${String.fromCharCode(71 + row)}`
              }
              return `${String.fromCharCode(70 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Gray',
              cssClass: 'Gray'
            }
          },
          disabledSeats: []
        }
      },
      id: '25',
      title: 'Balcony G Gray',
      shape: 'poly',
      name: 'Gray',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        540.0, 1209.0, 433.2, 1205.2, 330.2, 1181.5, 299.8, 1290.8, 403.2, 1319.5, 532.5, 1324.2
      ],
      polygon: [
        [540.0, 1209.0],
        [433.2, 1205.2],
        [330.2, 1181.5],
        [299.8, 1290.8],
        [403.2, 1319.5],
        [532.5, 1324.2]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (index.row == 6) {
              return `${String.fromCharCode(69 + index.row)}${1 + index.col}`
            }
            return `${String.fromCharCode(68 + index.row)}${1 + index.col}`
          },
          rows: 7,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${1 + col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              if (row == 6) {
                return `${String.fromCharCode(69 + row)}`
              }
              return `${String.fromCharCode(68 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Gray',
              cssClass: 'Gray'
            }
          },
          disabledSeats: []
        }
      },
      id: '26',
      title: 'Balcony H Gray',
      shape: 'poly',
      name: 'Gray',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [785.0, 1160.0, 567.7, 1160.0, 562.7, 1323.7, 785.0, 1324.0],
      polygon: [
        [785.0, 1160.0],
        [567.7, 1160.0],
        [562.7, 1323.7],
        [785.0, 1324.0]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (index.row == 4) {
              return `${String.fromCharCode(71 + index.row)}${1 + index.col}`
            }
            return `${String.fromCharCode(70 + index.row)}${1 + index.col}`
          },
          rows: 5,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${1 + col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              if (row == 4) {
                return `${String.fromCharCode(71 + row)}`
              }
              return `${String.fromCharCode(70 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Gray',
              cssClass: 'Gray'
            }
          },
          disabledSeats: []
        }
      },
      id: '27',
      title: 'Balcony J Gray',
      shape: 'poly',
      name: 'Gray',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        1012.3, 1189.3, 937.7, 1206.7, 884.0, 1213, 801.0, 1213.0, 800.7, 1252.7, 810.0, 1255,
        808.0, 1276.3, 819.7, 1277.7, 820.3, 1325.7, 923.3, 1326.0, 978.0, 1320.3, 1041.0, 1300.3
      ],
      polygon: [
        [1012.3, 1189.3],
        [937.7, 1206.7],
        [884.0, 1213],
        [801.0, 1213.0],
        [800.7, 1252.7],
        [810.0, 1255],
        [808.0, 1276.3],
        [819.7, 1277.7],
        [820.3, 1325.7],
        [923.3, 1326.0],
        [978.0, 1320.3],
        [1041.0, 1300.3]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (index.row == 6) {
              return `${String.fromCharCode(69 + index.row)}${1 + index.col}`
            }
            return `${String.fromCharCode(68 + index.row)}${1 + index.col}`
          },
          rows: 7,
          columns: 15,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${1 + col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              if (row == 6) {
                return `${String.fromCharCode(69 + row)}`
              }
              return `${String.fromCharCode(68 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Gray',
              cssClass: 'Gray'
            }
          },
          disabledSeats: [
            { row: 0, col: 9 },
            { row: 0, col: 10 },
            { row: 0, col: 11 },
            { row: 0, col: 12 },
            { row: 0, col: 13 },
            { row: 0, col: 14 },
            { row: 1, col: 10 },
            { row: 1, col: 11 },
            { row: 1, col: 12 },
            { row: 1, col: 13 },
            { row: 1, col: 14 },
            { row: 2, col: 11 },
            { row: 2, col: 12 },
            { row: 2, col: 13 },
            { row: 2, col: 14 },
            { row: 3, col: 13 },
            { row: 3, col: 12 },
            { row: 3, col: 14 },
            { row: 4, col: 14 },
            { row: 5, col: 14 }
          ]
        }
      },
      id: '28',
      title: 'Balcony K Gray',
      shape: 'poly',
      name: 'Gray',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        1110.3, 1037.3, 1069.0, 1080.0, 1035.3, 1105.7, 1004.3, 1122.3, 1057.3, 1285.0, 1132.7,
        1241.0, 1187.3, 1200.7, 1231.3, 1156.7, 1261.3, 1122.3
      ],
      polygon: [
        [1110.3, 1037.3],
        [1069.0, 1080.0],
        [1035.3, 1105.7],
        [1004.3, 1122.3],
        [1057.3, 1285.0],
        [1132.7, 1241.0],
        [1187.3, 1200.7],
        [1231.3, 1156.7],
        [1261.3, 1122.3]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(67 - index.col)}${5 - index.row}`
          },
          rows: 5,
          columns: 3,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(67 - col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              return `${5 - row}`
            }
          },
          seatTypes: {
            default: {
              label: 'Yellow',
              cssClass: 'Yellow'
            }
          },
          disabledSeats: [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 1, col: 0 }
          ]
        }
      },
      id: '29',
      title: 'Mezzanine A Yellow',
      shape: 'poly',
      name: 'Yellow',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        419.0, 96.0, 398.7, 95.3, 399.0, 109.0, 376.9, 109.7, 374.7, 123.0, 353.3, 123.3, 353.0,
        170.3, 420.0, 169.0
      ],
      polygon: [
        [419.0, 96.0],
        [398.7, 95.3],
        [399.0, 109.0],
        [376.9, 109.7],
        [374.7, 123.0],
        [353.3, 123.3],
        [353.0, 170.3],
        [420.0, 169.0]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(69 - index.col)}${12 - index.row}`
          },
          rows: 12,
          columns: 5,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(69 - col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${12 - row}`
          },
          seatTypes: {
            default: {
              label: 'Yellow',
              cssClass: 'Yellow'
            }
          },
          disabledSeats: []
        }
      },
      id: '30',
      title: 'Mezzanine B Yellow',
      shape: 'poly',
      name: 'Yellow',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [417.3, 185.7, 300.0, 186.3, 298.3, 354.3, 419.0, 353.3],
      polygon: [
        [417.3, 185.7],
        [300.0, 186.3],
        [298.3, 354.3],
        [419.0, 353.3]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(65 + index.col)}${5 - index.row}`
          },
          rows: 5,
          columns: 3,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(65 + col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${5 - row}`
          },
          seatTypes: {
            default: {
              label: 'Yellow',
              cssClass: 'Yellow'
            }
          },
          disabledSeats: [
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 1, col: 2 }
          ]
        }
      },
      id: '31',
      title: 'Mezzanine R Yellow',
      shape: 'poly',
      name: 'Yellow',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        982.7, 124.0, 959.0, 124.0, 959.0, 109.0, 933.0, 108.7, 932.3, 96.7, 911.7, 97.3, 911.7,
        171.0, 982.3, 169.3
      ],
      polygon: [
        [982.7, 124.0],
        [959.0, 124.0],
        [959.0, 109.0],
        [933.0, 108.7],
        [932.3, 96.7],
        [911.7, 97.3],
        [911.7, 171.0],
        [982.3, 169.3]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(65 + index.col)}${12 - index.row}`
          },
          rows: 12,
          columns: 5,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(65 + col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${12 - row}`
          },
          seatTypes: {
            default: {
              label: 'Yellow',
              cssClass: 'Yellow'
            }
          },
          disabledSeats: []
        }
      },
      id: '32',
      title: 'Mezzanine P Yellow',
      shape: 'poly',
      name: 'Yellow',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [1031.8, 185.8, 912.8, 186.8, 912.8, 354.0, 1033.0, 352.5],
      polygon: [
        [1031.8, 185.8],
        [912.8, 186.8],
        [912.8, 354.0],
        [1033.0, 352.5]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(69 - index.col)}${7 - index.row}`
          },
          rows: 7,
          columns: 5,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(69 - col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${7 - row}`
          },
          seatTypes: {
            default: {
              label: 'Blue',
              cssClass: 'Blue'
            }
          },
          disabledSeats: [{ row: 0, col: 0 }]
        }
      },
      id: '33',
      title: 'Mezzanine C Blue',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [417.7, 371.7, 325.7, 372.3, 326.7, 386.7, 303.7, 386.3, 305.7, 471.7, 419.0, 471.7],
      polygon: [
        [417.7, 371.7],
        [325.7, 372.3],
        [326.7, 386.7],
        [303.7, 386.3],
        [305.7, 471.7],
        [419.0, 471.7]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (index.col == 0) {
              return `${String.fromCharCode(69 - index.col)}${6 - index.row}`
            }
            return `${String.fromCharCode(69 - index.col)}${7 - index.row}`
          },
          rows: 7,
          columns: 5,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(69 - col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              if (row == 0) {
                return `${6 - row}`
              }
              return `${7 - row}`
            }
          },
          seatTypes: {
            default: {
              label: 'Blue',
              cssClass: 'Blue'
            }
          },
          disabledSeats: [{ row: 6, col: 0 }]
        }
      },
      id: '34',
      title: 'Mezzanine D Blue',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [418.3, 498.7, 305.0, 498.0, 305.7, 563.0, 326.3, 580.7, 325.7, 598.0, 417.0, 600.7],
      polygon: [
        [418.3, 498.7],
        [305.0, 498.0],
        [305.7, 563.0],
        [326.3, 580.7],
        [325.7, 598.0],
        [417.0, 600.7]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (index.col == 0) {
              return `${String.fromCharCode(69 - index.col)}${6 - index.row}`
            }
            return `${String.fromCharCode(69 - index.col)}${7 - index.row}`
          },
          rows: 7,
          columns: 5,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(69 - col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              if (row == 0) {
                return `${6 - row}`
              }
              return `${7 - row}`
            }
          },
          seatTypes: {
            default: {
              label: 'Blue',
              cssClass: 'Blue'
            }
          },
          disabledSeats: [{ row: 6, col: 0 }]
        }
      },
      id: '35',
      title: 'Mezzanine E Blue',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [415.3, 611.3, 304.3, 610.3, 304.7, 775.3, 415.7, 775.0],
      polygon: [
        [415.3, 611.3],
        [304.3, 610.3],
        [304.7, 775.3],
        [415.7, 775.0]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(65 + index.col)}${7 - index.row}`
          },
          rows: 7,
          columns: 5,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(65 + col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${7 - row}`
          },
          seatTypes: {
            default: {
              label: 'Blue',
              cssClass: 'Blue'
            }
          },
          disabledSeats: [{ row: 0, col: 4 }]
        }
      },
      id: '36',
      title: 'Mezzanine O Blue',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        1031.0, 384.3, 1011.0, 386.7, 1010.0, 370.7, 914.0, 370.7, 913.7, 472.0, 1031.7, 471.3
      ],
      polygon: [
        [1031.0, 384.3],
        [1011.0, 386.7],
        [1010.0, 370.7],
        [914.0, 370.7],
        [913.7, 472.0],
        [1031.7, 471.3]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (index.col == 4) {
              return `${String.fromCharCode(65 + index.col)}${6 - index.row}`
            }
            return `${String.fromCharCode(65 + index.col)}${7 - index.row}`
          },
          rows: 7,
          columns: 5,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(65 + col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              if (row == 0) {
                return `${6 - row}`
              }
              return `${7 - row}`
            }
          },
          seatTypes: {
            default: {
              label: 'Blue',
              cssClass: 'Blue'
            }
          },
          disabledSeats: [{ row: 6, col: 4 }]
        }
      },
      id: '37',
      title: 'Mezzanine N Blue',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        1031.3, 496.7, 912.7, 497.7, 914.7, 597.3, 1005.0, 597.7, 1006.7, 584.3, 1030.3, 582.7
      ],
      polygon: [
        [1031.3, 496.7],
        [912.7, 497.7],
        [914.7, 597.3],
        [1005.0, 597.7],
        [1006.7, 584.3],
        [1030.3, 582.7]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(65 + index.col)}${12 - index.row}`
          },
          rows: 12,
          columns: 5,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${String.fromCharCode(65 + col)}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${12 - row}`
          },
          seatTypes: {
            default: {
              label: 'Blue',
              cssClass: 'Blue'
            }
          },
          disabledSeats: [{ row: 0, col: 4 }]
        }
      },
      id: '38',
      title: 'Mezzanine M Blue',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [1031.0, 609.7, 915.0, 610.3, 914.3, 778.3, 1030.3, 776.3],
      polygon: [
        [1031.0, 609.7],
        [915.0, 610.3],
        [914.3, 778.3],
        [1030.3, 776.3]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(65 + index.row)}${13 - index.col}`
          },
          rows: 5,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${13 - col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              return `${String.fromCharCode(65 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 0, col: 3 },
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 2, col: 0 }
          ]
        }
      },
      id: '39',
      title: 'Mezzanine F Orange',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        417.7, 790.3, 323.0, 788.0, 322.7, 793.7, 295.3, 791.3, 293.3, 832.0, 301.0, 870.0, 316.7,
        906.0, 340.0, 935.7, 361.7, 917.0, 369.0, 923.3, 449.3, 864.3, 435.0, 849.3, 426.0, 832.0,
        420.0, 811.0
      ],
      polygon: [
        [417.7, 790.3],
        [323.0, 788.0],
        [322.7, 793.7],
        [295.3, 791.3],
        [293.3, 832.0],
        [301.0, 870.0],
        [316.7, 906.0],
        [340.0, 935.7],
        [361.7, 917.0],
        [369.0, 923.3],
        [449.3, 864.3],
        [435.0, 849.3],
        [426.0, 832.0],
        [420.0, 811.0]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(65 + index.row)}${13 - index.col}`
          },
          rows: 5,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${13 - col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              return `${String.fromCharCode(65 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 0, col: 3 },
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 2, col: 0 }
          ]
        }
      },
      id: '40',
      title: 'Mezzanine G Orange',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        528.7, 904.4, 492.0, 898.7, 445.1, 875.8, 434.5, 896.0, 430.4, 892.7, 418.7, 909.6, 411.1,
        903.1, 398.2, 919.3, 394.9, 916.5, 368.7, 945.5, 405.3, 972.0, 437.3, 988.0, 498.7, 1002.2,
        523.1, 1001.5, 523.3, 966.4, 528.2, 966.2
      ],
      polygon: [
        [528.7, 904.4],
        [492.0, 898.7],
        [445.1, 875.8],
        [434.5, 896.0],
        [430.4, 892.7],
        [418.7, 909.6],
        [411.1, 903.1],
        [398.2, 919.3],
        [394.9, 916.5],
        [368.7, 945.5],
        [405.3, 972.0],
        [437.3, 988.0],
        [498.7, 1002.2],
        [523.1, 1001.5],
        [523.3, 966.4],
        [528.2, 966.2]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(65 + index.row)}${7 - index.col}`
          },
          rows: 5,
          columns: 7,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${7 - col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              return `${String.fromCharCode(65 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: [{ row: 4, col: 0 }]
        }
      },
      id: '41',
      title: 'Mezzanine H Orange',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        646.9, 904.2, 536.4, 906.5, 535.6, 989.6, 553.5, 989.8, 553.1, 1011.1, 646.5, 1012.7
      ],
      polygon: [
        [646.9, 904.2],
        [536.4, 906.5],
        [535.6, 989.6],
        [553.5, 989.8],
        [553.1, 1011.1],
        [646.5, 1012.7]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(65 + index.row)}${1 + index.col}`
          },
          rows: 5,
          columns: 7,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${1 + col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              return `${String.fromCharCode(65 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: [{ row: 4, col: 6 }]
        }
      },
      id: '42',
      title: 'Mezzanine J Orange',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        788.0, 904.9, 678.2, 905.1, 677.6, 1010.5, 771.6, 1011.8, 771.6, 990.4, 788.4, 990.0
      ],
      polygon: [
        [788.0, 904.9],
        [678.2, 905.1],
        [677.6, 1010.5],
        [771.6, 1011.8],
        [771.6, 990.4],
        [788.4, 990.0]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(65 + index.row)}${1 + index.col}`
          },
          rows: 5,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${1 + col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              return `${String.fromCharCode(65 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: [
            { row: 0, col: 9 },
            { row: 0, col: 10 },
            { row: 0, col: 11 },
            { row: 0, col: 12 },
            { row: 1, col: 10 },
            { row: 1, col: 11 },
            { row: 1, col: 12 },
            { row: 2, col: 12 }
          ]
        }
      },
      id: '43',
      title: 'Mezzanine K Orange',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        887.3, 874.5, 869.6, 884.7, 851.1, 893.1, 830.9, 899.1, 803.8, 900.9, 805.3, 1012.2, 832.0,
        1012.0, 901.6, 991.8, 927.5, 977.5, 956.7, 953.5, 920.5, 909.8, 913.8, 914.2, 901.6, 893.6,
        897.3, 896.9
      ],
      polygon: [
        [887.3, 874.5],
        [869.6, 884.7],
        [851.1, 893.1],
        [830.9, 899.1],
        [803.8, 900.9],
        [805.3, 1012.2],
        [832.0, 1012.0],
        [901.6, 991.8],
        [927.5, 977.5],
        [956.7, 953.5],
        [920.5, 909.8],
        [913.8, 914.2],
        [901.6, 893.6],
        [897.3, 896.9]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(65 + index.row)}${1 + index.col}`
          },
          rows: 5,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${1 + col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              return `${String.fromCharCode(65 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: [
            { row: 0, col: 9 },
            { row: 0, col: 10 },
            { row: 0, col: 11 },
            { row: 0, col: 12 },
            { row: 1, col: 10 },
            { row: 1, col: 11 },
            { row: 1, col: 12 },
            { row: 2, col: 12 }
          ]
        }
      },
      id: '44',
      title: 'Mezzanine L Orange',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        920.4, 796.9, 915.3, 829.3, 906.0, 852.0, 892.0, 873.3, 976.2, 937.3, 1006.2, 894.9, 1023.5,
        851.1, 1031.8, 791.8, 966.4, 791.5, 964.4, 798.9
      ],
      polygon: [
        [920.4, 796.9],
        [915.3, 829.3],
        [906.0, 852.0],
        [892.0, 873.3],
        [976.2, 937.3],
        [1006.2, 894.9],
        [1023.5, 851.1],
        [1031.8, 791.8],
        [966.4, 791.5],
        [964.4, 798.9]
      ]
    },

    //Orchestra
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(81 + index.row)}${1 + index.col}`
          },
          rows: 5,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${1 + col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              return `${String.fromCharCode(81 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: []
        }
      },
      id: '45',
      title: 'Orchestra 4 Orange',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [576.5, 475.2, 446.5, 476.8, 446.4, 578.0, 576.8, 578.8],
      polygon: [
        [576.5, 475.2],
        [446.5, 476.8],
        [446.4, 578.0],
        [576.8, 578.8]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(81 + index.row)}${1 + index.col}`
          },
          rows: 5,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${1 + col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              return `${String.fromCharCode(81 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: []
        }
      },
      id: '46',
      title: 'Orchestra 6 Orange',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [878.2, 476.1, 749.6, 476.4, 749.4, 578.9, 877.6, 580.4],
      polygon: [
        [878.2, 476.1],
        [749.6, 476.4],
        [749.4, 578.9],
        [877.6, 580.4]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(75 + index.row)}${1 + index.col}`
          },
          rows: 3,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${1 + col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              return `${String.fromCharCode(75 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Blue',
              cssClass: 'Blue'
            }
          },
          disabledSeats: []
        }
      },
      id: '47',
      title: 'Orchestra 1 Blue',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [576.2, 324.2, 448.1, 324.5, 447.2, 382.6, 575.2, 381.4],
      polygon: [
        [576.2, 324.2],
        [448.1, 324.5],
        [447.2, 382.6],
        [575.2, 381.4]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(75 + index.row)}${1 + index.col}`
          },
          rows: 3,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${1 + col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              return `${String.fromCharCode(75 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Blue',
              cssClass: 'Blue'
            }
          },
          disabledSeats: []
        }
      },
      id: '48',
      title: 'Orchestra 2 Blue',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [737.4, 321.4, 588.2, 321.5, 588.2, 381.5, 737.4, 381.5],
      polygon: [
        [737.4, 321.4],
        [588.2, 321.5],
        [588.2, 381.5],
        [737.4, 381.5]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(75 + index.row)}${1 + index.col}`
          },
          rows: 3,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${1 + col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              return `${String.fromCharCode(75 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Blue',
              cssClass: 'Blue'
            }
          },
          disabledSeats: []
        }
      },
      id: '49',
      title: 'Orchestra 3 Blue',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [875.9, 323.8, 747.4, 323.6, 747.9, 382.5, 876.9, 381.6],
      polygon: [
        [875.9, 323.8],
        [747.4, 323.6],
        [747.9, 382.5],
        [876.9, 381.6]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(78 + index.row)}${1 + index.col}`
          },
          rows: 3,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${1 + col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              return `${String.fromCharCode(78 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Blue',
              cssClass: 'Blue'
            }
          },
          disabledSeats: []
        }
      },
      id: '50',
      title: 'Orchestra 4 Blue',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [575.4, 409.9, 447.6, 410.5, 447.1, 469.8, 575.4, 468.9],
      polygon: [
        [575.4, 409.9],
        [447.6, 410.5],
        [447.1, 469.8],
        [575.4, 468.9]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(78 + index.row)}${1 + index.col}`
          },
          rows: 8,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${1 + col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              return `${String.fromCharCode(78 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Blue',
              cssClass: 'Blue'
            }
          },
          disabledSeats: []
        }
      },
      id: '51',
      title: 'Orchestra 5 Blue',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [737.1, 410.0, 586.5, 409.5, 588.2, 578.2, 736.7, 578.9],
      polygon: [
        [737.1, 410.0],
        [586.5, 409.5],
        [588.2, 578.2],
        [736.7, 578.9]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(65 + index.row)}${1 + index.col}`
          },
          rows: 5,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${1 + col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              return `${String.fromCharCode(65 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Blue',
              cssClass: 'Blue'
            }
          },
          disabledSeats: []
        }
      },
      id: '52',
      title: 'Orchestra 6 Blue',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [878.0, 409.6, 749.8, 410.5, 749.8, 468.9, 878.9, 468.7],
      polygon: [
        [878.0, 409.6],
        [749.8, 410.5],
        [749.8, 468.9],
        [878.9, 468.7]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (index.row == 8) return `${String.fromCharCode(66 + index.row)}${1 + index.col}`
            return `${String.fromCharCode(65 + index.row)}${1 + index.col}`
          },
          rows: 9,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${1 + col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              if (row == 8) return `${String.fromCharCode(66 + row)}`

              return `${String.fromCharCode(65 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Yellow',
              cssClass: 'Yellow'
            }
          },
          disabledSeats: []
        }
      },
      id: '53',
      title: 'Orchestra 1 Yellow',
      shape: 'poly',
      name: 'Yellow',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [575.6, 124.5, 447.1, 125.5, 447.8, 316.0, 574.9, 315.5],
      polygon: [
        [575.6, 124.5],
        [447.1, 125.5],
        [447.8, 316.0],
        [574.9, 315.5]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (index.row == 8) return `${String.fromCharCode(66 + index.row)}${1 + index.col}`
            return `${String.fromCharCode(65 + index.row)}${1 + index.col}`
          },
          rows: 9,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${1 + col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              if (row == 8) return `${String.fromCharCode(66 + row)}`

              return `${String.fromCharCode(65 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Yellow',
              cssClass: 'Yellow'
            }
          },
          disabledSeats: []
        }
      },
      id: '54',
      title: 'Orchestra 2 Yellow',
      shape: 'poly',
      name: 'Yellow',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [736.5, 126.5, 588.2, 125.3, 588.0, 313.5, 737.5, 312.4],
      polygon: [
        [736.5, 126.5],
        [588.2, 125.3],
        [588.0, 313.5],
        [737.5, 312.4]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (index.row == 8) return `${String.fromCharCode(66 + index.row)}${1 + index.col}`

            return `${String.fromCharCode(65 + index.row)}${1 + index.col}`
          },
          rows: 9,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${1 + col}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              if (row == 8) return `${String.fromCharCode(66 + row)}`

              return `${String.fromCharCode(65 + row)}`
            }
          },
          seatTypes: {
            default: {
              label: 'Yellow',
              cssClass: 'Yellow'
            }
          },
          disabledSeats: []
        }
      },
      id: '55',
      title: 'Orchestra 3 Yellow',
      shape: 'poly',
      name: 'Yellow',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [875.3, 125.5, 747.8, 124.7, 747.5, 316.0, 875.1, 316.2],
      polygon: [
        [875.3, 125.5],
        [747.8, 124.7],
        [747.5, 316.0],
        [875.1, 316.2]
      ]
    }
  ]
})

export default getDefaultMap
