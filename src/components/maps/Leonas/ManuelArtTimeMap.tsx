import { SeatIndex } from 'seatchart'
import { SeatIndex } from 'seatchart'

const getDefaultMap = () => ({
  name: 'ManuelArtTime-map',

  areas: [
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(72 - index.row)}${String.fromCharCode(72 - index.row)}${1 + index.col}`
          },
          rows: 5,
          columns: 10,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col + 1}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(72 - row)}${String.fromCharCode(72 - row)}`
          },
          seatTypes: {
            default: {
              label: 'Green',
              cssClass: 'Green'
            }
          },
          disabledSeats: [
            { row: 1, col: 0 },
            { row: 2, col: 0 },
            { row: 3, col: 0 },
            { row: 4, col: 0 },
            { row: 2, col: 7 },
            { row: 2, col: 8 },
            { row: 2, col: 9 },
            { row: 3, col: 7 },
            { row: 3, col: 8 },
            { row: 3, col: 9 },
            { row: 4, col: 7 },
            { row: 4, col: 8 },
            { row: 4, col: 9 }
          ]
        }
      },
      id: '1',
      title: 'Balcony Section 1 Green',
      shape: 'poly',
      name: 'Green',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        34.7, 12.0, 34.7, 43.3, 88.0, 42.7, 90.0, 199.3, 236.7, 200.0, 236.7, 86.0, 309.3, 87.3,
        311.3, 11.3
      ],
      polygon: [
        [34.7, 12.0],
        [34.7, 43.3],
        [88.0, 42.7],
        [90.0, 199.3],
        [236.7, 200.0],
        [236.7, 86.0],
        [309.3, 87.3],
        [311.3, 11.3]
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
            return `${String.fromCharCode(71 - index.row)}${String.fromCharCode(71 - index.row)}${11 + index.col}`
          },
          rows: 4,
          columns: 6,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col + 11}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(71 - row)}${String.fromCharCode(71 - row)}`
          },
          seatTypes: {
            default: {
              label: 'Green',
              cssClass: 'Green'
            }
          },
          disabledSeats: [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 2, col: 2 }
          ]
        }
      },
      id: '2',
      title: 'Balcony Section 2 Green',
      shape: 'poly',
      name: 'Green',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [380.0, 49.3, 377.3, 166.7, 298.7, 166.0, 298.0, 201.3, 462.7, 200, 462.0, 49.3],
      polygon: [
        [380.0, 49.3],
        [377.3, 166.7],
        [298.7, 166.0],
        [298.0, 201.3],
        [462.7, 200.0],
        [462.0, 49.3]
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
            return `${String.fromCharCode(70 - index.row)}${String.fromCharCode(70 - index.row)}${17 + index.col}`
          },
          rows: 3,
          columns: 10,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col + 17}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(70 - row)}${String.fromCharCode(70 - row)}`
          },
          seatTypes: {
            default: {
              label: 'Green',
              cssClass: 'Green'
            }
          },
          disabledSeats: [
            { row: 2, col: 0 },
            { row: 2, col: 9 }
          ]
        }
      },
      id: '3',
      title: 'Balcony Section 3 Green',
      shape: 'poly',
      name: 'Green',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        534.0, 89.0, 531.5, 161.5, 563.0, 161.5, 564.5, 198.5, 780.0, 198.5, 780.0, 162.0, 808.0,
        161.0, 808.5, 89.0
      ],
      polygon: [
        [534.0, 89.0],
        [531.5, 161.5],
        [563.0, 161.5],
        [564.5, 198.5],
        [780.0, 198.5],
        [780.0, 162.0],
        [808.0, 161.0],
        [808.5, 89.0]
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
              return `${String.fromCharCode(71 - index.row)}${String.fromCharCode(71 - index.row)}${27 + index.col}`
            }
          },
          rows: 4,
          columns: 6,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col + 27}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(71 - row)}${String.fromCharCode(71 - row)}`
          },
          seatTypes: {
            default: {
              label: 'Green',
              cssClass: 'Green'
            }
          },
          disabledSeats: [
            { row: 0, col: 3 },
            { row: 0, col: 4 },
            { row: 0, col: 5 },
            { row: 1, col: 3 },
            { row: 1, col: 4 },
            { row: 1, col: 5 },
            { row: 2, col: 3 },
            { row: 2, col: 4 },
            { row: 2, col: 5 }
          ]
        }
      },
      id: '4',
      title: 'Balcony Section 4 Green',
      shape: 'poly',
      name: 'Green',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [875.5, 51.5, 874.5, 199.5, 1040.5, 197.5, 1039.0, 163.5, 959.0, 165.0, 959.5, 51.5],
      polygon: [
        [875.5, 51.5],
        [874.5, 199.5],
        [1040.5, 197.5],
        [1039.0, 163.5],
        [959.0, 165.0],
        [959.5, 51.5]
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
              return `${String.fromCharCode(71 - index.row)}${String.fromCharCode(71 - index.row)}${33 + index.col}`
            }
          },
          rows: 4,
          columns: 8,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col + 33}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(71 - row)}${String.fromCharCode(71 - row)}`
          },
          seatTypes: {
            default: {
              label: 'Green',
              cssClass: 'Green'
            }
          },
          disabledSeats: [
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
            { row: 3, col: 0 },
            { row: 3, col: 1 },
            { row: 3, col: 2 }
          ]
        }
      },
      id: '5',
      title: 'Balcony Section 5 Green',
      shape: 'poly',
      name: 'Green',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        1034.5, 48.0, 1033.0, 83.0, 1118.5, 84.0, 1115.0, 200.0, 1251.5, 202.0, 1252.5, 47.5
      ],
      polygon: [
        [1034.5, 48.0],
        [1033.0, 83.0],
        [1118.5, 84.0],
        [1115.0, 200.0],
        [1251.5, 202.0],
        [1252.5, 47.5]
      ]
    },
    // ///////////////// Balcony next section
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(67 - index.row)}${String.fromCharCode(67 - index.row)}${1 + index.col}`
          },
          rows: 3,
          columns: 15,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col + 1}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(67 - row)}${String.fromCharCode(67 - row)}`
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
      id: '6',
      title: 'Balcony section 6 Blue',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [47.3, 824.7, 48.7, 1299.3, 178.0, 1299.3, 177.3, 824.7],
      polygon: [
        [47.3, 824.7],
        [48.7, 1299.3],
        [178.0, 1299.3],
        [177.3, 824.7]
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
            return `${String.fromCharCode(67 - index.row)}${String.fromCharCode(67 - index.row)}${16 + index.col}`
          },
          rows: 3,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col + 16}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(67 - row)}${String.fromCharCode(67 - row)}`
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: [
            { row: 1, col: 12 },
            { row: 1, col: 11 },
            { row: 2, col: 12 },
            { row: 2, col: 11 },
            { row: 2, col: 10 }
          ]
        }
      },
      id: '7',
      title: 'Balcony section 7 Orange',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        94.0, 394.5, 55.0, 452.0, 44.5, 521.5, 43.5, 806.0, 178.5, 806.0, 176.0, 515.5, 183.5,
        481.5, 142.0, 471.5, 147.0, 456.5, 107.0, 443.5, 122.5, 417.0
      ],
      polygon: [
        [94.0, 394.5],
        [55.0, 452.0],
        [44.5, 521.5],
        [43.5, 806.0],
        [178.5, 806.0],
        [176.0, 515.5],
        [183.5, 481.5],
        [142.0, 471.5],
        [147.0, 456.5],
        [107.0, 443.5],
        [122.5, 417.0]
      ]
    },
    // Orange section
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (index.row == 0) {
              return `${String.fromCharCode(67)}${String.fromCharCode(67)}${29 + index.col}`
            } else if (index.row == 1) {
              return `${String.fromCharCode(66)}${String.fromCharCode(66)}${27 + index.col}` // desplazado
            }
          },
          rows: 2,
          columns: 10,
          indexerColumns: {
            visible: false,
            label: (col: number) => {
              if (col == 0) {
                return `${29 + col}`
              } else {
                return `${27 + col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(67 - row)}${String.fromCharCode(67 - row)}`
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: [{ row: 1, col: 9 }]
        }
      },
      id: '8',
      title: 'Balcony section 8 Orange',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        115.7, 356.7, 174.7, 414.0, 218.3, 373.0, 277.0, 347.3, 334.7, 343.7, 429.0, 345.0, 430.7,
        265.0, 289.7, 264.3, 199.0, 290.0, 144.3, 325.3
      ],
      polygon: [
        [115.7, 356.7],
        [174.7, 414.0],
        [218.3, 373.0],
        [277.0, 347.3],
        [334.7, 343.7],
        [429.0, 345.0],
        [430.7, 265.0],
        [289.7, 264.3],
        [199.0, 290.0],
        [144.3, 325.3]
      ]
    },

    // parte azul de la seccion 8
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(65)}${String.fromCharCode(65)}${26 + index.col}` // desplazado
          },
          rows: 1,
          columns: 8,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${26 + col}`
            }
          },
          indexerRows: {
            visible: true,
            label: () => `${String.fromCharCode(65)}${String.fromCharCode(65)}`
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
      id: '9',
      title: 'Balcony section 8 Blue',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        182.0, 418.0, 207.0, 446.0, 233.0, 416.5, 281.0, 393.0, 315.5, 387.6, 431.0, 386.5, 430.0,
        354.0, 303.5, 354.5, 271.0, 361.5, 234.5, 376.0, 209.0, 391.0
      ],
      polygon: [
        [182.0, 418.0],
        [207.0, 446.0],
        [233.0, 416.5],
        [281.0, 393.0],
        [315.5, 387.6],
        [431.0, 386.5],
        [430.0, 354.0],
        [303.5, 354.5],
        [271.0, 361.5],
        [234.5, 376.0],
        [209.0, 391.0]
      ]
    },

    // zona naranja sección 9
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (index.row == 0) {
              return `${String.fromCharCode(67 - index.row)}${String.fromCharCode(67 - index.row)}${39 + index.col}`
            } else if (index.row == 1) {
              return `${String.fromCharCode(67 - index.row)}${String.fromCharCode(67 - index.row)}${36 + index.col}`
            }
          },
          rows: 2,
          columns: 12,
          indexerColumns: {
            visible: false,
            label: (col: number) => {
              if (col == 0) {
                return `${39 + col}`
              } else if (col == 1) {
                return `${36 + col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(67 - row)}${String.fromCharCode(67 - row)}`
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
      id: '10',
      title: 'Balcony section 9 Orange',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [468.0, 269.0, 469.0, 347.0, 852.0, 345.0, 852.0, 264.0],
      polygon: [
        [468.0, 264.0],
        [469.0, 347.0],
        [852.0, 345.0],
        [852.0, 264.0]
      ]
    },
    // zona azul Zona 11

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(65)}${String.fromCharCode(65)}${34 + index.col}`
          },
          rows: 1,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${34 + col}`
            }
          },
          indexerRows: {
            visible: true,
            label: () => `${String.fromCharCode(65)}${String.fromCharCode(65)}`
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
      id: '11',
      title: 'Balcony section 9 Blue',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [470.0, 354.3, 469.7, 389.3, 847.3, 388.7, 847.3, 354.3],
      polygon: [
        [470.0, 354.3],
        [469.7, 389.3],
        [847.3, 388.7],
        [847.3, 354.3]
      ]
    },

    //Zona 10 Orange
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (index.row == 0) {
              return `${String.fromCharCode(67 - index.row)}${String.fromCharCode(67 - index.row)}${51 + index.col}`
            } else if (index.row == 1) {
              return `${String.fromCharCode(67 - index.row)}${String.fromCharCode(67 - index.row)}${48 + index.col}`
            } else {
              return `${String.fromCharCode(67 - index.row)}${String.fromCharCode(67 - index.row)}${46 + index.col}`
            }
          },
          rows: 2,
          columns: 10,
          indexerColumns: {
            visible: false,
            label: (col: number) => {
              if (col == 0) {
                return `${51 + col}`
              } else if (col == 1) {
                return `${48 + col}`
              } else {
                return `${46 + col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(67 - row)}${String.fromCharCode(67 - row)}`
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: [{ row: 1, col: 9 }]
        }
      },
      id: '12',
      title: 'Balcony section 10 Orange',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        891.5, 264.5, 892.2, 346.0, 1011.0, 346.5, 1051.0, 350.5, 1090.5, 366.5, 1152.5, 417.5,
        1213.0, 360.5, 1136.5, 291.0, 1072.5, 270.5, 996.5, 263.0
      ],
      polygon: [
        [891.5, 264.5],
        [892.2, 346.0],
        [1011.0, 346.5],
        [1051.0, 350.5],
        [1090.5, 366.5],
        [1152.5, 417.5],
        [1213.0, 360.5],
        [1136.5, 291.0],
        [1072.5, 270.5],
        [996.5, 263.0]
      ]
    },
    // Zona Azul
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(65)}${String.fromCharCode(65)}${46 + index.col}`
          },
          rows: 1,
          columns: 8,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${46 + col}`
            }
          },
          indexerRows: {
            visible: true,
            label: () => `${String.fromCharCode(65)}${String.fromCharCode(65)}`
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
      id: '13',
      title: 'Balcony section 10 Blue',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        892.0, 356.3, 892.3, 391.3, 1012.0, 391.0, 1048.3, 398.3, 1082.0, 414.7, 1113.7, 448.3,
        1143.3, 422.7, 1097.3, 380.0, 1059.3, 361.0, 1007.0, 354.0
      ],
      polygon: [
        [892.0, 356.3],
        [892.3, 391.3],
        [1012.0, 391.0],
        [1048.3, 398.3],
        [1082.0, 414.7],
        [1113.7, 448.3],
        [1143.3, 422.7],
        [1097.3, 380.0],
        [1059.3, 361.0],
        [1007.0, 354.0]
      ]
    },

    // parte derecha
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            if (index.row == 0) {
              return `${String.fromCharCode(67 - index.row)}${String.fromCharCode(67 - index.row)}${61 + index.col}`
            } else if (index.row == 1) {
              return `${String.fromCharCode(67 - index.row)}${String.fromCharCode(67 - index.row)}${56 + index.col}`
            } else {
              return `${String.fromCharCode(67 - index.row)}${String.fromCharCode(67 - index.row)}${52 + index.col}`
            }
          },
          rows: 3,
          columns: 12,
          indexerColumns: {
            visible: false,
            label: (col: number) => {
              if (col == 0) {
                return `${61 + col}`
              } else if (col == 1) {
                return `${56 + col}`
              } else {
                return `${54 + col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(67 - row)}${String.fromCharCode(67 - row)}`
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: [
            { row: 1, col: 0 },
            { row: 2, col: 0 },
            { row: 2, col: 1 }
          ]
        }
      },
      id: '14',
      title: 'Balcony section 11 Orange',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        1140.7, 480.7, 1144.7, 514.0, 1142.7, 796.0, 1274.0, 796.7, 1273.3, 510.7, 1263.3, 443.3,
        1251.3, 406.7, 1208.0, 425.3, 1216.0, 445.3, 1172.7, 456.0, 1176.7, 471.3
      ],
      polygon: [
        [1140.7, 480.7],
        [1144.7, 514.0],
        [1142.7, 796.0],
        [1274.0, 796.7],
        [1273.3, 510.7],
        [1263.3, 443.3],
        [1251.3, 406.7],
        [1208.0, 425.3],
        [1216.0, 445.3],
        [1172.7, 456.0],
        [1176.7, 471.3]
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
            if (index.row == 0) {
              return `${String.fromCharCode(67 - index.row)}${String.fromCharCode(67 - index.row)}${73 + index.col}`
            } else if (index.row == 1) {
              return `${String.fromCharCode(67 - index.row)}${String.fromCharCode(67 - index.row)}${68 + index.col}`
            } else {
              return `${String.fromCharCode(67 - index.row)}${String.fromCharCode(67 - index.row)}${64 + index.col}`
            }
          },
          rows: 3,
          columns: 15,
          indexerColumns: {
            visible: false,
            label: (col: number) => {
              if (col == 0) {
                return `${73 + col}`
              } else if (col == 1) {
                return `${68 + col}`
              } else {
                return `${64 + col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(67 - row)}${String.fromCharCode(67 - row)}`
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
      id: '15',
      title: 'Balcony section 12 Blue',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [1138.7, 825.3, 1138.7, 1298.0, 1276.7, 1302.0, 1279.3, 822.7],
      polygon: [
        [1138.7, 825.3],
        [1138.7, 1298.0],
        [1276.7, 1302.0],
        [1279.3, 822.7]
      ]
    },
    // Orchestra

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(79 - index.row)}${23 - (index.col * 2 + 1)}`
          },
          rows: 6,
          columns: 11,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${23 - 2 * col - 1}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(79 - row)}`
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: [
            { row: 0, col: 3 },
            { row: 0, col: 4 },
            { row: 0, col: 5 },
            { row: 0, col: 6 },
            { row: 0, col: 7 },
            { row: 0, col: 8 },
            { row: 0, col: 9 },
            { row: 0, col: 10 },
            { row: 0, col: 11 }
          ]
        }
      },
      id: '16',
      title: 'Orchestra Orange left',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [196.7, 564.0, 198.7, 774.7, 428.0, 730.7, 428.0, 558.7, 265.3, 586.0, 261.5, 554.0],
      polygon: [
        [196.7, 564.0],
        [198.7, 774.7],
        [428.0, 730.7],
        [428.0, 558.7],
        [265.3, 586.0],
        [261.5, 554.0]
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
            return `${String.fromCharCode(73 - index.row)}${23 - (index.col * 2 + 1)}`
          },
          rows: 6,
          columns: 11,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${23 - 2 * col - 1}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(73 - row)}`
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
      id: '17',
      title: 'Orchestra Blue left',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [200.7, 779.3, 206.0, 985.3, 433.3, 946.7, 430.0, 741.3],
      polygon: [
        [200.7, 779.3],
        [206.0, 985.3],
        [433.3, 946.7],
        [430.0, 741.3]
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
            const specialCasesObj = {
              '2,3': '♿',
              '2,9': '♿',
              '2,2': '♿',
              '2,10': '♿',
              '2,6': '♿'
            }
            const specialCases = new Map(Object.entries(specialCasesObj))
            const baseString = `${String.fromCharCode(67 - index.row)}${23 - (index.col * 2 + 1)}`

            const key = `${index.row},${index.col}`
            const prefix = specialCases.get(key) || ''

            return prefix + baseString
          },
          rows: 3,
          columns: 11,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${23 - 2 * col - 1}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(67 - row)}`
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
      id: '18',
      title: 'Orchestra Yellow left',
      shape: 'poly',
      name: 'Yellow',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [200.7, 996.0, 203.3, 1095.3, 430.0, 1056.0, 430.0, 956.0],
      polygon: [
        [200.7, 996.0],
        [203.3, 1095.3],
        [430.0, 1056.0],
        [430.0, 956.0]
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
            return `${String.fromCharCode(77 - index.row)}${index.col + 101}`
          },
          rows: 2,
          columns: 15,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${col + 101}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(77 - row)}`
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
      id: '19',
      title: 'Orchestra Orange center',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [504.5, 630.5, 505.0, 690.5, 819.0, 692.0, 817.0, 631.0],
      polygon: [
        [504.5, 630.5],
        [505.0, 690.5],
        [819.0, 692.0],
        [817.0, 631.0]
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
            return `${String.fromCharCode(75 - index.row)}${index.col + 101}`
          },
          rows: 5,
          columns: 15,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${col + 101}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(75 - row)}`
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
      id: '20',
      title: 'Orchestra Blue center',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [506.7, 703.3, 506.7, 873.3, 816.7, 875.3, 814.7, 702.0],
      polygon: [
        [506.7, 703.3],
        [506.7, 873.3],
        [816.7, 875.3],
        [814.7, 702.0]
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
            return `${String.fromCharCode(70 - index.row)}${index.col + 101}`
          },
          rows: 6,
          columns: 15,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${col + 101}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(70 - row)}`
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
      id: '21',
      title: 'Orchestra Yellow center',
      shape: 'poly',
      name: 'Yellow',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [506.0, 883.5, 504.5, 1093.0, 816.0, 1091.5, 816.0, 883.0],
      polygon: [
        [506.0, 883.5],
        [504.5, 1093.0],
        [816.0, 1091.5],
        [816.0, 883.0]
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
            return `${String.fromCharCode(79 - index.row)}${index.col * 2 + 1}`
          },
          rows: 6,
          columns: 11,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${2 * col + 1}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(79 - row)}`
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
            { row: 0, col: 4 },
            { row: 0, col: 5 },
            { row: 0, col: 6 },
            { row: 0, col: 7 }
          ]
        }
      },
      id: '22',
      title: 'Orchestra Orange right',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        1061.3, 549.3, 1052.0, 584.7, 890.0, 558.0, 890.7, 734.7, 1120.0, 768.7, 1120.0, 566.0
      ],
      polygon: [
        [1061.3, 549.3],
        [1052.0, 584.7],
        [890.0, 558.0],
        [890.7, 734.7],
        [1120.0, 768.7],
        [1120.0, 566.0]
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
            return `${String.fromCharCode(73 - index.row)}${index.col * 2 + 1}`
          },
          rows: 6,
          columns: 11,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${2 * col + 1}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(73 - row)}`
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
      id: '23',
      title: 'Orchestra Blue right',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [889.3, 740.0, 894.0, 946.7, 1118.0, 991.3, 1119.3, 783.3],
      polygon: [
        [889.3, 740.0],
        [894.0, 946.7],
        [1118.0, 991.3],
        [1119.3, 783.3]
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
            const specialCasesObj = {
              '2,0': '♿',
              '2,3': '♿',
              '2,4': '♿',
              '2,7': '♿',
              '2,8': '♿'
            }
            const specialCases = new Map(Object.entries(specialCasesObj))
            const baseString = `${String.fromCharCode(67 - index.row)}${index.col * 2 + 1}`
            const key = `${index.row},${index.col}`
            const prefix = specialCases.get(key) || ''

            return prefix + baseString
          },
          rows: 3,
          columns: 11,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${2 * col + 1}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(67 - row)}`
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
      id: '24',
      title: 'Orchestra Yellow right',
      shape: 'poly',
      name: 'Yellow',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [890.7, 959.3, 890.0, 1053.3, 1115.3, 1098.0, 1118.7, 998.7],
      polygon: [
        [890.7, 959.3],
        [890.0, 1053.3],
        [1115.3, 1098.0],
        [1118.7, 998.7]
      ]
    }
  ]
})

export default getDefaultMap
