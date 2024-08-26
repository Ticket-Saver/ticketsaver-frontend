import { SeatIndex } from 'seatchart'
const getDefaultMap = () => ({
  name: 'Orchestra-map',
  areas: [
    // TOP LEFT ORANGE
    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 4,
          columns: 5,
          indexerColumns: {
            visible: true,
            label: (col: number) => `30${5 - col}`
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
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 0, col: 3 },
            { row: 0, col: 4 }
          ]
        }
      },
      id: '01',
      title: 'Orange Top Left',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [441, 139, 374, 206, 445, 229, 490, 153],
      polygon: [
        [441, 137],
        [374, 206],
        [445, 229],
        [493, 153]
      ]
    },
    //TOP LEFT CENTER - ORANGE
    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 4,
          columns: 7,
          indexerColumns: {
            visible: true,
            label: (col: number) => `10${7 - col}`
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: [
            { row: 0, col: 0 },
            { row: 1, col: 0 }
          ]
        }
      },
      id: '02',
      title: 'Orange Top Left Center',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [538, 124, 466, 237, 580, 253, 610, 136],
      polygon: [
        [538, 124],
        [466, 237],
        [580, 253],
        [610, 136]
      ]
    },
    // TOP CENTER - ORANGE
    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 4,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col + 1}`
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: [
            { row: 0, col: 10 },
            { row: 0, col: 11 },
            { row: 1, col: 11 },
            { row: 2, col: 11 }
          ]
        }
      },
      id: '03',
      title: 'Orange Top Center',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [631, 137, 596, 257, 678, 260, 752, 253, 721, 135],
      polygon: [
        [631, 137],
        [596, 257],
        [678, 260],
        [752, 253],
        [721, 135]
      ]
    },
    // TOP RIGHT CENTER - ORANGE
    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 4,
          columns: 7,
          indexerColumns: {
            visible: true,
            label: (col: number) => `20${col + 1}`
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: [
            { row: 0, col: 6 },
            { row: 1, col: 6 }
          ]
        }
      },
      id: '04',
      title: 'Orange Top Right Center',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [740, 135, 771, 255, 882, 236, 813, 128],
      polygon: [
        [740, 135],
        [771, 255],
        [882, 236],
        [813, 128]
      ]
    },
    // TOP RIGHT - ORANGE
    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 4,
          columns: 5,
          indexerColumns: {
            visible: true,
            label: (col: number) => `40${col + 1}`
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: [
            { row: 0, col: 4 },
            { row: 1, col: 4 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 0, col: 3 },
            { row: 0, col: 0 }
          ]
        }
      },
      id: '05',
      title: 'Orange Top Right',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [851, 150, 895, 226, 964, 206, 902, 140],
      polygon: [
        [851, 150],
        [895, 226],
        [964, 206],
        [902, 140]
      ]
    },
    // CENTER LEFT - ORANGE
    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 6,
          columns: 11,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (11 - col < 10) {
                return `10${11 - col}`
              } else {
                return `1${11 - col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              if (row < 4) {
                return `${String.fromCharCode(69 + row)}`
              } else {
                return `${String.fromCharCode(70 + row)}`
              }
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
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 3, col: 0 },
            { row: 4, col: 0 }
          ]
        }
      },
      id: '06',
      title: 'Orange Center Left',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [470, 232, 436, 305, 411, 409, 488, 429, 562, 438, 567, 347, 580, 257],
      polygon: [
        [470, 232],
        [436, 305],
        [411, 409],
        [488, 429],
        [562, 438],
        [567, 347],
        [580, 257]
      ]
    },
    // CENTER CENTER - ORANGE
    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 6,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col + 1}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              if (row < 4) {
                return `${String.fromCharCode(69 + row)}`
              } else {
                return `${String.fromCharCode(70 + row)}`
              }
            }
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: [
            { row: 0, col: 12 },
            { row: 1, col: 12 },
            { row: 2, col: 12 }
          ]
        }
      },
      id: '07',
      title: 'Orange Center Mid',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [596, 257, 590, 345, 592, 441, 678, 445, 761, 440, 763, 345, 754, 256, 673, 262],
      polygon: [
        [596, 257],
        [590, 345],
        [592, 441],
        [678, 445],
        [761, 440],
        [763, 345],
        [754, 256],
        [673, 262]
      ]
    },
    // CENTER RIGHT - ORANGE
    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 6,
          columns: 11,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `20${col + 1}`
              } else {
                return `2${col + 1}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              if (row < 4) {
                return `${String.fromCharCode(69 + row)}`
              } else {
                return `${String.fromCharCode(70 + row)}`
              }
            }
          },
          seatTypes: {
            default: {
              label: 'Orange',
              cssClass: 'Orange'
            }
          },
          disabledSeats: [
            { row: 0, col: 10 },
            { row: 0, col: 9 },
            { row: 0, col: 8 },
            { row: 1, col: 10 },
            { row: 1, col: 9 },
            { row: 1, col: 8 },
            { row: 2, col: 10 },
            { row: 2, col: 9 },
            { row: 3, col: 10 },
            { row: 4, col: 10 }
          ]
        }
      },
      id: '08',
      title: 'Orange Center Right',
      shape: 'poly',
      name: 'Orange',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [770, 253, 782, 345, 787, 438, 875, 425, 937, 407, 915, 318, 880, 235],
      polygon: [
        [770, 253],
        [782, 345],
        [787, 438],
        [875, 425],
        [937, 407],
        [915, 318],
        [880, 235]
      ]
    },

    // GREEN

    // GREEN TOP LEFT
    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 8,
          columns: 8,
          indexerColumns: {
            visible: true,
            label: (col: number) => `30${8 - col}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              if (row < 4) {
                return `${String.fromCharCode(69 + row)}`
              } else {
                return `${String.fromCharCode(70 + row)}`
              }
            }
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
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 2, col: 0 },
            { row: 3, col: 0 }
          ]
        }
      },
      id: '09',
      title: 'Green Top Left',
      shape: 'poly',
      name: 'Green',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [
        375, 208, 321, 282, 283, 361, 266, 415, 328, 440, 380, 456, 388, 398, 411, 311, 446, 231
      ],
      polygon: [
        [375, 208],
        [321, 282],
        [283, 361],
        [266, 415],
        [328, 440],
        [380, 456],
        [388, 398],
        [411, 311],
        [446, 231]
      ]
    },
    // GREEN CENTER UP LEFT
    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 5,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (12 - col >= 10) {
                return `3${12 - col}`
              } else {
                return `30${12 - col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(76 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Green',
              cssClass: 'Green'
            }
          },
          disabledSeats: [
            { row: 0, col: 0 },
            { row: 1, col: 0 }
          ]
        }
      },
      id: '10',
      title: 'Green Top Center left',
      shape: 'poly',
      name: 'Green',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [411, 411, 404, 466, 402, 562, 492, 578, 562, 587, 563, 496, 563, 441],
      polygon: [
        [411, 411],
        [404, 466],
        [402, 562],
        [492, 578],
        [562, 587],
        [563, 496],
        [563, 441]
      ]
    },
    // GREEN CENTER UP
    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 5,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col + 1}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(76 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Green',
              cssClass: 'Green'
            }
          },
          disabledSeats: []
        }
      },
      id: '11',
      title: 'Green Top Center Mid',
      shape: 'poly',
      name: 'Green',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [595, 445, 592, 589, 763, 588, 760, 442],
      polygon: [
        [595, 445],
        [592, 589],
        [763, 588],
        [760, 442]
      ]
    },
    // GREEN RIGHT UP
    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 5,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `20${col + 1}`
              } else {
                return `2${col + 1}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(76 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Green',
              cssClass: 'Green'
            }
          },
          disabledSeats: []
        }
      },
      id: '12',
      title: 'Green Top Center Right',
      shape: 'poly',
      name: 'Green',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [788, 441, 787, 588, 947, 562, 944, 466, 937, 408],
      polygon: [
        [788, 441],
        [787, 588],
        [947, 562],
        [944, 466],
        [937, 408]
      ]
    },
    // RIGHT TOP - GREEN

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 8,
          columns: 8,
          indexerColumns: {
            visible: true,
            label: (col: number) => `40${col + 1}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              if (row < 4) {
                return `${String.fromCharCode(69 + row)}`
              } else {
                return `${String.fromCharCode(70 + row)}`
              }
            }
          },
          seatTypes: {
            default: {
              label: 'Green',
              cssClass: 'Green'
            }
          },
          disabledSeats: [
            { row: 0, col: 7 },
            { row: 0, col: 6 },
            { row: 1, col: 7 },
            { row: 1, col: 6 },
            { row: 2, col: 7 },
            { row: 3, col: 7 }
          ]
        }
      },
      id: '13',
      title: 'Green Top Right',
      shape: 'poly',
      name: 'Green',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [896, 232, 940, 341, 962, 460, 1072, 419, 1030, 309, 967, 209],
      polygon: [
        [896, 232],
        [940, 341],
        [962, 460],
        [1072, 419],
        [1030, 309],
        [967, 209]
      ]
    },

    // LEFT DOWN CENTER - GREEN

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 6,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (12 - col >= 10) {
                return `1${12 - col}`
              } else {
                return `10${12 - col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(81 + row)}`
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
      id: '14',
      title: 'Pink Bottom Center Left', //Green Bottom Center Left
      shape: 'poly',
      name: 'Pink',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [402, 563, 411, 748, 564, 770, 565, 584, 488, 578],
      polygon: [
        [402, 563],
        [411, 748],
        [564, 770],
        [565, 584],
        [488, 578]
      ]
    },
    // DOWN CENTER - GREEN

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 3,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col + 1}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(81 + row)}`
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
      id: '15',
      title: 'Pink Bottom Center', //Green Bottom Center
      shape: 'poly',
      name: 'Pink',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [594, 589, 596, 678, 680, 683, 763, 676, 763, 587, 677, 592],
      polygon: [
        [594, 589],
        [596, 678],
        [680, 683],
        [763, 676],
        [763, 587],
        [677, 592]
      ]
    },
    // BOTTOM CENTER - GREEN

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 3,
          columns: 4,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col + 1}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(84 + row)}`
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
      id: '16',
      title: 'Pink Bottom Special', //Green Bottom Special
      shape: 'poly',
      name: 'Pink',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [595, 678, 595, 770, 665, 770, 664, 683],
      polygon: [
        [595, 678],
        [595, 770],
        [665, 770],
        [664, 683]
      ]
    },
    // RIGHT PURPLE

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 9,
          columns: 11,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 >= 10) {
                return `4${col + 1}`
              } else {
                return `40${col + 1}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(78 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Pink',
              cssClass: 'Pink'
            }
          },
          disabledSeats: [
            { row: 0, col: 10 },
            { row: 0, col: 9 },
            { row: 0, col: 8 },
            { row: 1, col: 10 },
            { row: 1, col: 9 },
            { row: 2, col: 10 },
            { row: 3, col: 10 }
          ]
        }
      },
      id: '17',
      title: 'Pink Right', //Purple Right
      shape: 'poly',
      name: 'Pink',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [958, 461, 963, 740, 1089, 705, 1086, 524, 1071, 421],
      polygon: [
        [958, 461],
        [963, 740],
        [1089, 705],
        [1086, 524],
        [1071, 421]
      ]
    },
    // LEFT PURPLE

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 9,
          columns: 11,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (11 - col >= 10) {
                return `3${11 - col}`
              } else {
                return `30${11 - col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(78 + row)}`
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
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 2, col: 0 },
            { row: 3, col: 0 }
          ]
        }
      },
      id: '33',
      title: 'Pink Left', // Purple Left
      shape: 'poly',
      name: 'Pink',
      fillColor: '#ea92bab',
      strokeColor: '#ea92bab ',
      coords: [272, 416, 255, 483, 252, 707, 381, 740, 378, 519, 379, 461],
      polygon: [
        [272, 416],
        [255, 483],
        [252, 707],
        [381, 740],
        [378, 519],
        [379, 461]
      ]
    },

    // RIGHT down green

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 6,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 >= 10) {
                return `2${col + 1}`
              } else {
                return `20${col + 1}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(81 + row)}`
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
      id: '18',
      title: 'Pink Bottom Right', //Pink Bottom Right
      shape: 'poly',
      name: 'Pink',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [787, 584, 787, 770, 943, 744, 947, 560, 869, 578],
      polygon: [
        [787, 584],
        [787, 770],
        [943, 744],
        [947, 560],
        [869, 578]
      ]
    },
    // LEFT YELLOW DOWN

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 4,
          columns: 11,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (11 - col < 10) {
                return `30${11 - col}`
              } else {
                return `3${11 - col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(87 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Celeste',
              cssClass: 'Celeste'
            }
          },
          disabledSeats: []
        }
      },
      id: '20',
      title: 'Blue Bottom Left', //Yellow Bottom Left,
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [250, 703, 249, 828, 379, 866, 378, 740],
      polygon: [
        [250, 703],
        [249, 828],
        [379, 866],
        [378, 740]
      ]
    },

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 4,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (12 - col < 10) {
                return `10${12 - col}`
              } else {
                return `1${12 - col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(87 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Celeste',
              cssClass: 'Celeste'
            }
          },
          disabledSeats: []
        }
      },
      id: '21',
      title: 'Blue Top Left', //Pink Top Left
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [408, 744, 411, 874, 562, 895, 564, 770],
      polygon: [
        [408, 744],
        [411, 874],
        [562, 895],
        [564, 770]
      ]
    },
    //  PINK CENTER

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 4,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col + 1}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(87 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Celeste',
              cssClass: 'Celeste'
            }
          },
          disabledSeats: []
        }
      },
      id: '22',
      title: 'Blue Top Center', //Pink Top Center
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [593, 773, 594, 895, 688, 901, 765, 896, 763, 771],
      polygon: [
        [593, 773],
        [594, 895],
        [688, 901],
        [765, 896],
        [763, 771]
      ]
    },

    //  PINK RIGHT

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 4,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `20${col + 1}`
              } else {
                return `2${col + 1}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(87 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Celeste',
              cssClass: 'Celeste'
            }
          },
          disabledSeats: []
        }
      },
      id: '23',
      title: 'Blue Top Right', //Pink top Right
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [788, 771, 786, 895, 940, 869, 940, 746],
      polygon: [
        [788, 771],
        [786, 895],
        [940, 869],
        [940, 746]
      ]
    },

    //  YELLOW TOP RIGHT

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 4,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `40${col + 1}`
              } else {
                return `4${col + 1}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(87 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Celeste',
              cssClass: 'Celeste'
            }
          },
          disabledSeats: []
        }
      },
      id: '24',
      title: 'Blue Top Right', //Yellow Top Right
      shape: 'poly',
      name: 'Blue',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [961, 740, 961, 866, 1090, 829, 1088, 704],
      polygon: [
        [961, 740],
        [961, 866],
        [1090, 829],
        [1088, 704]
      ]
    },

    //  YELLOW DOWN RIGHT
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 10) {
              return `${String.fromCharCode(65 + index.row)}${String.fromCharCode(65 + index.row)}40${index.col + 1}`
            } else {
              return `${String.fromCharCode(65 + index.row)}${String.fromCharCode(65 + index.row)}4${index.col + 1}`
            }
          },
          rows: 8,
          columns: 11,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `40${col + 1}`
              } else {
                return `4${col + 1}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(65 + row)}${String.fromCharCode(65 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Purple',
              cssClass: 'Purple'
            }
          },
          disabledSeats: [
            { row: 6, col: 10 },
            { row: 6, col: 9 },
            { row: 7, col: 10 },
            { row: 7, col: 9 },
            { row: 7, col: 8 }
          ]
        }
      },
      id: '25',
      title: 'Purple Bottom Right', //Yellow Bottom Right
      shape: 'poly',
      name: 'Purple',
      fillColor: '',
      stayHighlighted: true,
      strokeColor: '#f54242',
      coords: [
        960, 866, 960, 1114, 1061, 1100, 1058, 1070, 1075, 1062, 1075, 1036, 1091, 1027, 1090, 832
      ],
      polygon: [
        [960, 866],
        [960, 1114],
        [1061, 1100],
        [1058, 1070],
        [1075, 1062],
        [1075, 1036],
        [1091, 1027],
        [1090, 832]
      ]
    },

    //  PINK DOWN RIGHT
    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 10) {
              return `${String.fromCharCode(
                65 + index.row
              )}${String.fromCharCode(65 + index.row)}20${index.col + 1}`
            } else {
              return `${String.fromCharCode(
                65 + index.row
              )}${String.fromCharCode(65 + index.row)}2${index.col + 1}`
            }
          },
          rows: 5,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `20${col + 1}`
              } else {
                return `2${col + 1}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(65 + row)}${String.fromCharCode(65 + row)}`
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
      id: '26',
      title: 'Yellow Bottom Right', //Pink Bottom Right
      shape: 'poly',
      name: 'Yellow',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [787, 896, 785, 1050, 943, 1027, 940, 872],
      polygon: [
        [787, 896],
        [785, 1050],
        [943, 1027],
        [940, 872]
      ]
    },

    //  PINK DOWN CENTER
    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          seatLabel: (index: SeatIndex) =>
            `${String.fromCharCode(65 + index.row)}${String.fromCharCode(
              65 + index.row
            )}${index.col + 1}`,
          rows: 5,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col + 1}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(65 + row)}${String.fromCharCode(65 + row)}`
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
      id: '27',
      title: 'Pink Down Center',
      shape: 'poly',
      name: 'Pink',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [596, 896, 594, 1051, 765, 1051, 765, 895],
      polygon: [
        [596, 896],
        [594, 1051],
        [765, 1051],
        [765, 895]
      ]
    },
    //  PINK DOWN LEFT
    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          seatLabel: (index: SeatIndex) => {
            if (12 - index.col < 10) {
              return `${String.fromCharCode(
                65 + index.row
              )}${String.fromCharCode(65 + index.row)}${String.fromCharCode(65 + index.row)}10${12 - index.col}`
            } else {
              return `${String.fromCharCode(
                65 + index.row
              )}${String.fromCharCode(65 + index.row)}1${12 - index.col}`
            }
          },
          rows: 5,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (12 - col < 10) {
                return `10${12 - col}`
              } else {
                return `1${12 - col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(65 + row)}${String.fromCharCode(65 + row)}`
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
      id: '28',
      title: 'Yellow Bottom Left', //Pink Bottom Left
      shape: 'poly',
      name: 'Yellow',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [411, 873, 406, 1025, 565, 1050, 565, 895],
      polygon: [
        [411, 873],
        [406, 1025],
        [565, 1050],
        [565, 895]
      ]
    },
    //  YELLOW DOWN LEFT
    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          seatLabel: (index: SeatIndex) => {
            if (11 - index.col < 10) {
              return `${String.fromCharCode(65 + index.row)}${String.fromCharCode(65 + index.row)}30${11 - index.col}`
            } else {
              return `${String.fromCharCode(65 + index.row)}${String.fromCharCode(65 + index.row)}3${11 - index.col}`
            }
          },
          rows: 8,
          columns: 11,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (11 - col < 10) {
                return `30${11 - col}`
              } else {
                return `3${11 - col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(65 + row)}${String.fromCharCode(65 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Purple',
              cssClass: 'Purple'
            }
          },
          disabledSeats: [
            { row: 6, col: 0 },
            { row: 6, col: 1 },
            { row: 7, col: 0 },
            { row: 7, col: 1 },
            { row: 7, col: 2 }
          ]
        }
      },
      id: '29',
      title: 'Purple Bottom Left', //Yellow Bottom Left 2
      shape: 'poly',
      name: 'Purple',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [
        251, 831, 249, 1023, 266, 1034, 269, 1063, 277, 1066, 278, 1097, 378, 1116, 379, 866
      ],
      polygon: [
        [251, 831],
        [249, 1023],
        [266, 1034],
        [269, 1063],
        [277, 1066],
        [278, 1097],
        [378, 1116],
        [379, 866]
      ]
    },
    //  YELLOW DOWN LEFT BACK
    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          seatLabel: (index: SeatIndex) => {
            if (12 - index.col < 10) {
              return `${String.fromCharCode(70 + index.row)}${String.fromCharCode(70 + index.row)}10${12 - index.col}`
            } else {
              return `${String.fromCharCode(70 + index.row)}${String.fromCharCode(70 + index.row)}1${12 - index.col}`
            }
          },
          rows: 3,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (12 - col < 10) {
                return `10${12 - col}`
              } else {
                return `1${12 - col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(70 + row)}${String.fromCharCode(70 + row)}`
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
      title: 'Yellow Bottom Center Left',
      shape: 'poly',
      name: 'Yellow',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [406, 1027, 406, 1122, 488, 1133, 568, 1134, 565, 1049],
      polygon: [
        [406, 1027],
        [406, 1122],
        [488, 1133],
        [568, 1134],
        [565, 1049]
      ]
    },
    //  YELLOW DOWN CENTER BACK
    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          seatLabel: (index: SeatIndex) =>
            `${String.fromCharCode(70 + index.row)}${String.fromCharCode(70 + index.row)}${index.col + 1}`,
          rows: 3,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col + 1}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(70 + row)}${String.fromCharCode(70 + row)}`
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
      id: '31',
      title: 'Yellow Bottom Center Mid',
      shape: 'poly',
      name: 'Yellow',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [596, 1052, 596, 1143, 766, 1144, 767, 1052],
      polygon: [
        [596, 1052],
        [596, 1143],
        [766, 1144],
        [767, 1052]
      ]
    },
    //  YELLOW DOWN RIGHT BACK
    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 >= 10) {
              return `${String.fromCharCode(70 + index.row)}${String.fromCharCode(70 + index.row)}2${index.col + 1}`
            } else {
              return `${String.fromCharCode(70 + index.row)}${String.fromCharCode(70 + index.row)}20${index.col + 1}`
            }
          },
          rows: 3,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 >= 10) {
                return `2${col + 1}`
              } else {
                return `20${col + 1}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) =>
              `${String.fromCharCode(70 + row)}${String.fromCharCode(70 + row)}`
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
      title: 'Yellow Bottom Center Right',
      shape: 'poly',
      name: 'Yellow',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [786, 1051, 786, 1138, 947, 1123, 944, 1024],
      polygon: [
        [786, 1051],
        [786, 1138],
        [947, 1123],
        [944, 1024]
      ]
    }
  ]
})

export default getDefaultMap
