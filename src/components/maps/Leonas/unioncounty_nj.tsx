import { SeatIndex } from 'seatchart'

const getDefaultMap = () => ({
  name: 'UnionCountryMap',

  areas: [
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(65 + index.row)}${26 - (index.col * 2 + 1)}`
          },
          rows: 5,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${26 - (col * 2 + 1)}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Pink',
              cssClass: 'Pink'
            }
          },

          disabledSeats: [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 0, col: 3 },
            { row: 0, col: 4 },
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 2, col: 0 },
            { row: 2, col: 1 }
          ]
        }
      },
      id: '1',
      title: 'Orchestra Section 1 Pink',
      shape: 'poly',
      name: 'Pink',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        257.7, 314.3, 257.3, 331.0, 217.3, 330.7, 217.7, 348.3, 198.3, 349.0, 197.7, 367.7, 159.7,
        366.7, 158.3, 402.0, 417.7, 402.0, 417.3, 313.0
      ],
      polygon: [
        [257.7, 314.3],
        [257.3, 331.0],
        [217.3, 330.7],
        [217.7, 348.3],
        [198.3, 349.0],
        [197.7, 367.7],
        [159.7, 366.7],
        [158.3, 402.0],
        [417.7, 402.0],
        [417.3, 313.0]
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
              '10,0': '♿',
              '10,1': '♿',
              '9,0': '♿',
              '9,1': '♿',
              '8,0': '♿',
              '8,1': '♿',
              '7,0': '♿',
              '7,1': '♿',
              '6,0': '♿',
              '6,1': '♿'
            }
            const specialCases = new Map(Object.entries(specialCasesObj))
            let charRow = index.row + 70
            if (charRow >= 73) {
              charRow += 1
            }
            const baseString = `${String.fromCharCode(charRow)}${26 - (index.col * 2 + 1)}`
            const key = `${index.row},${index.col}`
            const prefix = specialCases.get(key) || ''

            return prefix + baseString
          },
          rows: 10,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${26 - (col * 2 + 1)}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              let charRow = row + 70
              if (charRow >= 73) {
                charRow += 1
              }
              return String.fromCharCode(charRow)
            }
          },
          seatTypes: {
            default: {
              label: 'Aqua',
              cssClass: 'Aqua'
            }
          },

          disabledSeats: []
        }
      },
      id: '2',
      title: 'Orchestra Section 1 Aqua',
      shape: 'poly',
      name: 'Aqua',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [158.5, 402.0, 157.0, 590.5, 420.0, 587.0, 419.5, 400.0],
      polygon: [
        [158.5, 402.0],
        [157.0, 590.5],
        [420.0, 587.0],
        [419.5, 400.0]
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
            return `${String.fromCharCode(65 + index.row)}${101 + index.col}`
          },
          rows: 5,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${101 + col}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Pink',
              cssClass: 'Pink'
            }
          },

          disabledSeats: []
        }
      },
      id: '3',
      title: 'Orchestra Section 2 Pink',
      shape: 'poly',
      name: 'Pink',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [443.0, 312.5, 443.0, 400.5, 867.5, 400.5, 867.5, 311.5],
      polygon: [
        [443.0, 312.5],
        [443.0, 400.5],
        [867.5, 400.5],
        [867.5, 311.5]
      ]
    },

    {
      Options: {
        reservedSeats: [
          { row: 5, col: 12 },
          { row: 5, col: 13 }
        ],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            let charRow = index.row + 70
            if (charRow >= 73) {
              charRow += 1
            }

            return `${String.fromCharCode(charRow)}${101 + index.col}`
          },
          rows: 10,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${101 + col}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              let charRow = row + 70
              if (charRow >= 73) {
                charRow += 1
              }
              return String.fromCharCode(charRow)
            }
          },
          seatTypes: {
            default: {
              label: 'Aqua',
              cssClass: 'Aqua'
            }
          },

          disabledSeats: []
        }
      },
      id: '4',
      title: 'Orchestra Section 2 Aqua',
      shape: 'poly',
      name: 'Aqua',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [444.0, 400.7, 444.0, 588.0, 868.0, 588.0, 869.3, 400.7],
      polygon: [
        [444.0, 400.7],
        [444.0, 588.0],
        [868.0, 588.0],
        [869.3, 400.7]
      ]
    },

    {
      Options: {
        reservedSeats: [
          { row: 1, col: 0 },
          { row: 1, col: 1 }
        ],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,

          seatLabel: (index: SeatIndex) => {
            const specialCasesObj = {}
            const specialCases = new Map(Object.entries(specialCasesObj))
            const baseString = `${String.fromCharCode(65 + index.row)}${2 + index.col * 2}`
            const key = `${index.row},${index.col}`
            const prefix = specialCases.get(key) || ''

            return prefix + baseString
          },
          rows: 5,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col * 2 + 2}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Pink',
              cssClass: 'Pink'
            }
          },

          disabledSeats: [
            { row: 0, col: 8 },
            { row: 0, col: 9 },
            { row: 0, col: 10 },
            { row: 0, col: 11 },
            { row: 0, col: 12 },
            { row: 1, col: 9 },
            { row: 1, col: 10 },
            { row: 1, col: 11 },
            { row: 1, col: 12 },
            { row: 2, col: 11 },
            { row: 2, col: 12 }
          ]
        }
      },
      id: '5',
      title: 'Orchestra Section 3 Pink',
      shape: 'poly',
      name: 'Pink',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        892.7, 316.7, 892.7, 401.3, 1164.0, 400.7, 1161.3, 368.7, 1123.3, 367.3, 1123.3, 351.3,
        1082.0, 348.7, 1082.0, 329.3, 1062.0, 330.7, 1063.3, 313.3
      ],
      polygon: [
        [892.7, 316.7],
        [892.7, 401.3],
        [1164.0, 400.7],
        [1161.3, 368.7],
        [1123.3, 367.3],
        [1123.3, 351.3],
        [1082.0, 348.7],
        [1082.0, 329.3],
        [1062.0, 330.7],
        [1063.3, 313.3]
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
              '3,11': '♿',
              '3,12': '♿',
              '4,11': '♿',
              '4,12': '♿'
            }
            const specialCases = new Map(Object.entries(specialCasesObj))
            let charRow = index.row + 70
            if (charRow >= 73) {
              charRow += 1
            }
            const baseString = `${String.fromCharCode(charRow)}${2 + index.col * 2}`
            const key = `${index.row},${index.col}`
            const prefix = specialCases.get(key) || ''

            return prefix + baseString
          },
          rows: 10,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col * 2 + 2}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              let charRow = row + 70
              if (charRow >= 73) {
                charRow += 1
              }

              return String.fromCharCode(charRow)
            }
          },
          seatTypes: {
            default: {
              label: 'Aqua',
              cssClass: 'Aqua'
            }
          },

          disabledSeats: []
        }
      },
      id: '6',
      title: 'Orchestra Section 3 Aqua',
      shape: 'poly',
      name: 'Aqua',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [894.5, 400.5, 894.5, 587.0, 1161.0, 586.0, 1161.0, 401.5],
      polygon: [
        [894.5, 400.5],
        [894.5, 587.0],
        [1161.0, 586.0],
        [1161.0, 401.5]
      ]
    },
    {
      Options: {
        reservedSeats: [
          { row: 1, col: 0 },
          { row: 1, col: 1 },
          { row: 1, col: 2 },
          { row: 1, col: 3 }
        ],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,

          seatLabel: (index: SeatIndex) => {
            const specialCasesObj = {
              '0,0': '♿',
              '0,1': '♿',
              '0,2': '♿',
              '0,3': '♿'
            }
            const specialCases = new Map(Object.entries(specialCasesObj))
            const baseString = `${String.fromCharCode(76 + index.row)}${28 + index.col * 2}`
            const key = `${index.row},${index.col}`
            const prefix = specialCases.get(key) || ''

            return prefix + baseString
          },
          rows: 5,
          columns: 4,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col * 2 + 28}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(76 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Aqua',
              cssClass: 'Aqua'
            }
          },

          disabledSeats: []
        }
      },
      id: '7',
      title: 'Orchestra Section 4 Aqua',
      shape: 'poly',
      name: 'Aqua',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [1190.0, 489.0, 1191.5, 586.5, 1290.5, 586.0, 1292.5, 486.5],
      polygon: [
        [1190.0, 489.0],
        [1191.5, 586.5],
        [1290.5, 586.0],
        [1292.5, 486.5]
      ]
    },

    // Logue //7//////////////
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(82 + index.row)}${34 - (index.col * 2 + 1)}`
          },
          rows: 6,
          columns: 4,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${34 - (2 * +col + 1)}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(82 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Blue',
              cssClass: 'Blue'
            }
          },

          disabledSeats: [
            { row: 1, col: 0 },
            { row: 2, col: 0 }
          ]
        }
      },
      id: '8',
      title: 'Loge Section 1 Blue',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        43.7, 650.7, 45.0, 668.7, 64.3, 669.0, 65.0, 712.3, 44.3, 712.7, 44.3, 775.7, 140.0, 775.7,
        139.0, 651.0
      ],
      polygon: [
        [43.7, 650.7],
        [45.0, 668.7],
        [64.3, 669.0],
        [65.0, 712.3],
        [44.3, 712.7],
        [44.3, 775.7],
        [140.0, 775.7],
        [139.0, 651.0]
      ]
    },

    {
      Options: {
        reservedSeats: [
          { row: 6, col: 0 },
          { row: 6, col: 1 },
          { row: 6, col: 2 },
          { row: 6, col: 3 }
        ],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(82 + index.row)}${26 - (index.col * 2 + 1)}`
          },
          rows: 7,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${26 - (2 * +col + 1)}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(82 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Blue',
              cssClass: 'Blue'
            }
          },

          disabledSeats: [
            { row: 0, col: 4 },
            { row: 0, col: 5 },
            { row: 0, col: 6 },
            { row: 0, col: 7 },
            { row: 0, col: 8 },
            { row: 0, col: 9 },
            { row: 1, col: 4 },
            { row: 1, col: 5 },
            { row: 1, col: 6 },
            { row: 1, col: 7 },
            { row: 1, col: 8 },
            { row: 1, col: 9 },
            { row: 2, col: 4 },
            { row: 2, col: 5 },
            { row: 2, col: 6 },
            { row: 2, col: 7 },
            { row: 2, col: 8 },
            { row: 2, col: 9 },
            { row: 3, col: 4 },
            { row: 3, col: 5 },
            { row: 3, col: 6 },
            { row: 3, col: 7 },
            { row: 3, col: 8 },
            { row: 3, col: 9 }
          ]
        }
      },
      id: '9',
      title: 'Loge Section 2 Blue',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        159.7, 649.0, 158.0, 800.3, 417.7, 801.0, 417.7, 649.7, 357.3, 650.3, 357.3, 734.0, 238.3,
        734.0, 238.7, 650.0
      ],
      polygon: [
        [159.7, 649.0],
        [158.0, 800.3],
        [417.7, 801.0],
        [417.7, 649.7],
        [357.3, 650.3],
        [357.3, 734.0],
        [238.3, 734.0],
        [238.7, 650.0]
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
            return `${String.fromCharCode(82 + index.row)}${index.col + 101}`
          },
          rows: 7,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col + 101}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(82 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Blue',
              cssClass: 'Blue'
            }
          },

          disabledSeats: [
            { row: 5, col: 3 },
            { row: 5, col: 4 },
            { row: 5, col: 5 },
            { row: 5, col: 6 },
            { row: 5, col: 7 },
            { row: 5, col: 8 },
            { row: 5, col: 9 },
            { row: 6, col: 3 },
            { row: 6, col: 4 },
            { row: 6, col: 5 },
            { row: 6, col: 6 },
            { row: 6, col: 7 },
            { row: 6, col: 8 },
            { row: 6, col: 9 }
          ]
        }
      },
      id: '10',
      title: 'Loge Section 3 Blue',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        444.7, 650.3, 443.3, 801.3, 534.0, 800.7, 532.3, 756.0, 750.0, 756.7, 750.3, 800.7, 842.0,
        800.7, 839.7, 649.3
      ],
      polygon: [
        [444.7, 650.3],
        [443.3, 801.3],
        [534.0, 800.7],
        [532.3, 756.0],
        [750.0, 756.7],
        [750.3, 800.7],
        [842.0, 800.7],
        [839.7, 649.3]
      ]
    },

    {
      Options: {
        reservedSeats: [
          { row: 4, col: 9 },
          { row: 4, col: 10 },
          { row: 4, col: 11 },
          { row: 4, col: 12 }
        ],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(82 + index.row)}${index.col * 2 + 2}`
          },
          rows: 7,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${2 * +col + 2}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(82 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Blue',
              cssClass: 'Blue'
            }
          },

          disabledSeats: [
            { row: 0, col: 3 },
            { row: 0, col: 4 },
            { row: 0, col: 5 },
            { row: 0, col: 6 },
            { row: 0, col: 7 },
            { row: 0, col: 8 },
            { row: 1, col: 3 },
            { row: 1, col: 4 },
            { row: 1, col: 5 },
            { row: 1, col: 6 },
            { row: 1, col: 7 },
            { row: 1, col: 8 },
            { row: 2, col: 3 },
            { row: 2, col: 4 },
            { row: 2, col: 5 },
            { row: 2, col: 6 },
            { row: 2, col: 7 },
            { row: 2, col: 8 },
            { row: 3, col: 3 },
            { row: 3, col: 4 },
            { row: 3, col: 5 },
            { row: 3, col: 6 },
            { row: 3, col: 7 },
            { row: 3, col: 8 }
          ]
        }
      },
      id: '11',
      title: 'Loge Section 4 Blue',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        891.7, 651.0, 893.0, 801.7, 1163.0, 801.3, 1162.7, 649.7, 1082.0, 650.0, 1081.3, 734.7,
        962.3, 736.0, 962.3, 650.3
      ],
      polygon: [
        [891.7, 651.0],
        [893.0, 801.7],
        [1163.0, 801.3],
        [1162.7, 649.7],
        [1082.0, 650.0],
        [1081.3, 734.7],
        [962.3, 736.0],
        [962.3, 650.3]
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
            return `${String.fromCharCode(82 + index.row)}${index.col * 2 + 28}`
          },
          rows: 6,
          columns: 4,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${28 * (2 * +col)}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(82 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Blue',
              cssClass: 'Blue'
            }
          },

          disabledSeats: [
            { row: 1, col: 3 },
            { row: 2, col: 3 }
          ]
        }
      },
      id: '12',
      title: 'Loge Section 5 Blue',
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        1191.0, 650.3, 1191.3, 777.3, 1292.3, 778.0, 1291.3, 712.7, 1269.7, 712.0, 1270.3, 669.0,
        1290.7, 668.0, 1290.0, 651.3
      ],
      polygon: [
        [1191.0, 650.3],
        [1191.3, 777.3],
        [1292.3, 778.0],
        [1291.3, 712.7],
        [1269.7, 712.0],
        [1270.3, 669.0],
        [1290.7, 668.0],
        [1290.0, 651.3]
      ]
    },

    //Mezzanine //////////////////////////////////////////////

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(68 + index.row)}${String.fromCharCode(68 + index.row)}${34 - (index.col * 2 + 1)}`
          },
          rows: 2,
          columns: 3,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${34 - (2 * +col + 1)}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(68 + row)}${String.fromCharCode(68 + row)}`
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
      id: '13',
      title: 'Mezzanine Section 1 Gray',
      shape: 'poly',
      name: 'Gray',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [44.0, 922.3, 45.7, 955.3, 108.3, 956.3, 107.7, 924.0],
      polygon: [
        [44.0, 922.3],
        [45.7, 955.3],
        [108.3, 956.3],
        [107.7, 924.0]
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
            return `${String.fromCharCode(70 + index.row)}${String.fromCharCode(70 + index.row)}${36 - (index.col * 2 + 1)}`
          },
          rows: 7,
          columns: 4,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${36 - (2 * +col + 1)}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(70 + row)}${String.fromCharCode(70 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Coral',
              cssClass: 'Coral'
            }
          },

          disabledSeats: [
            { row: 0, col: 0 },
            { row: 1, col: 0 },
            { row: 2, col: 0 },
            { row: 3, col: 0 },
            { row: 4, col: 0 }
          ]
        }
      },
      id: '14',
      title: 'Mezzanine Section 1 Coral',
      shape: 'poly',
      name: 'Coral',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [43.7, 955.3, 44.7, 1023.7, 23.3, 1022.7, 23.0, 1055.7, 109.0, 1057.7, 107.3, 956.7],
      polygon: [
        [43.7, 955.3],
        [44.7, 1023.7],
        [23.3, 1022.7],
        [23.0, 1055.7],
        [109.0, 1057.7],
        [107.3, 956.7]
      ]
    },

    {
      Options: {
        reservedSeats: [
          { row: 2, col: 0 },
          { row: 2, col: 1 }
        ],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(65 + index.row)}${String.fromCharCode(65 + index.row)}${28 - (index.col * 2 + 1)}`
          },
          rows: 5,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${28 - (2 * +col + 1)}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(65 + row)}${String.fromCharCode(65 + row)}`
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
      id: '15',
      title: 'Mezzanine Section 2 Gray',
      shape: 'poly',
      name: 'Gray',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [139.7, 869.7, 139.3, 955.0, 418.0, 955.3, 417.7, 870.0],
      polygon: [
        [139.7, 869.7],
        [139.3, 955.0],
        [418.0, 955.3],
        [417.7, 870.0]
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
            return `${String.fromCharCode(70 + index.row)}${String.fromCharCode(70 + index.row)}${28 - (index.col * 2 + 1)}`
          },
          rows: 7,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${28 - (2 * +col + 1)}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(70 + row)}${String.fromCharCode(70 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Coral',
              cssClass: 'Coral'
            }
          },

          disabledSeats: []
        }
      },
      id: '16',
      title: 'Mezzanine Section 2 Coral',
      shape: 'poly',
      name: 'Coral',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [139.3, 955.7, 139.0, 1058.3, 418.0, 1056.7, 419.0, 956.0],
      polygon: [
        [139.3, 955.7],
        [139.0, 1058.3],
        [418.0, 1056.7],
        [419.0, 956.0]
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
            return `${String.fromCharCode(65 + index.row)}${String.fromCharCode(65 + index.row)}${index.col + 101}`
          },
          rows: 5,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col + 101}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(65 + row)}${String.fromCharCode(65 + row)}`
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
      id: '17',
      title: 'Mezzanine Section 3 Gray',
      shape: 'poly',
      name: 'Gray',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [442.7, 869.3, 444.7, 956.3, 867.3, 955.0, 866.3, 869.3],
      polygon: [
        [442.7, 869.3],
        [444.7, 956.3],
        [867.3, 955.0],
        [866.3, 869.3]
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
            return `${String.fromCharCode(70 + index.row)}${String.fromCharCode(70 + index.row)}${index.col + 101}`
          },
          rows: 3,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col + 101}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(70 + row)}${String.fromCharCode(70 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Coral',
              cssClass: 'Coral'
            }
          },

          disabledSeats: []
        }
      },
      id: '18',
      title: 'Mezzanine Section 3 Coral',
      shape: 'poly',
      name: 'Coral',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [444.5, 957.5, 443.5, 1009.0, 867.0, 1009.0, 871.5, 957.5],
      polygon: [
        [444.5, 957.5],
        [443.5, 1009.0],
        [867.0, 1009.0],
        [871.5, 957.5]
      ]
    },

    {
      Options: {
        reservedSeats: [
          { row: 1, col: 13 },
          { row: 1, col: 14 }
        ],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          seatLabel: (index: SeatIndex) => {
            return `${String.fromCharCode(65 + index.row)}${String.fromCharCode(65 + index.row)}${index.col * 2 + 2}`
          },
          rows: 5,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col * 2 + 2}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(65 + row)}${String.fromCharCode(65 + row)}`
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
      id: '19',
      title: 'Mezzanine Section 4 Gray',
      shape: 'poly',
      name: 'Gray',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [893.5, 869.5, 892.5, 955.5, 1189.5, 955.5, 1194.5, 866.5],
      polygon: [
        [893.5, 869.5],
        [892.5, 955.5],
        [1189.5, 955.5],
        [1194.5, 866.5]
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
            return `${String.fromCharCode(70 + index.row)}${String.fromCharCode(70 + index.row)}${index.col * 2 + 2}`
          },
          rows: 7,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col * 2 + 2}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(70 + row)}${String.fromCharCode(70 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Coral',
              cssClass: 'Coral'
            }
          },

          disabledSeats: []
        }
      },
      id: '20',
      title: 'Mezzanine Section 4 Coral',
      shape: 'poly',
      name: 'Coral',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [892.7, 956.3, 893.3, 1058.0, 1193.0, 1056.3, 1190.3, 957.0],
      polygon: [
        [892.7, 956.3],
        [893.3, 1058.0],
        [1193.0, 1056.3],
        [1190.3, 957.0]
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
            return `${String.fromCharCode(68 + index.row)}${String.fromCharCode(68 + index.row)}${index.col * 2 + 30}`
          },
          rows: 2,
          columns: 3,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col * 2 + 30}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(68 + row)}${String.fromCharCode(68 + row)}`
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
      id: '20',
      title: 'Mezzanine Section 5 Gray',
      shape: 'poly',
      name: 'Gray',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [1230.5, 922.5, 1230.5, 955.5, 1289.0, 954.0, 1292.5, 924.0],
      polygon: [
        [1230.5, 922.5],
        [1230.5, 955.5],
        [1289.0, 954.0],
        [1292.5, 924.0]
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
            return `${String.fromCharCode(70 + index.row)}${String.fromCharCode(70 + index.row)}${index.col * 2 + 30}`
          },
          rows: 7,
          columns: 4,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col * 2 + 30}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(70 + row)}${String.fromCharCode(70 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Coral',
              cssClass: 'Coral'
            }
          },

          disabledSeats: [
            { row: 0, col: 3 },
            { row: 1, col: 3 },
            { row: 2, col: 3 },
            { row: 3, col: 3 },
            { row: 4, col: 3 }
          ]
        }
      },
      id: '21',
      title: 'Mezzanine Section 5 Coral',
      shape: 'poly',
      name: 'Coral',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        1231.0, 957.0, 1229.0, 1057.0, 1310.7, 1056.0, 1311.0, 1023.3, 1290.7, 1023.7, 1289.7, 957.7
      ],
      polygon: [
        [1231.0, 957.0],
        [1229.0, 1057.0],
        [1310.7, 1056.0],
        [1311.0, 1023.3],
        [1290.7, 1023.7],
        [1289.7, 957.7]
      ]
    }
  ]
})

export default getDefaultMap
