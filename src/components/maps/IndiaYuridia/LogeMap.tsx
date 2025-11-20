const getDefaultMap = () => ({
  name: 'Orchestra-map',
  areas: [
    // SECTION 5

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 3,
          columns: 7,
          indexerColumns: {
            visible: true,
            label: (col: number) => `50${7 - col}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`
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
      id: '01',
      title: 'Loge Section 5',
      shape: 'poly',
      name: 'Section 5',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [172, 263, 160, 375, 306, 422, 306, 317],
      polygon: [
        [172, 263],
        [160, 375],
        [306, 422],
        [306, 317]
      ]
    },
    // SECTION 3

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 3,
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
            label: (row: number) => `${String.fromCharCode(65 + row)}`
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
      id: '02',
      title: 'Loge Section 3',
      shape: 'poly',
      name: 'Section 3',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [332, 318, 336, 432, 474, 453, 473, 351],
      polygon: [
        [332, 318],
        [336, 432],
        [474, 453],
        [473, 351]
      ]
    },
    // SECTION 1

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 3,
          columns: 11,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (11 - col >= 10) {
                return `1${11 - col}`
              } else {
                return `10${11 - col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`
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
      id: '03',
      title: 'Loge Section 1',
      shape: 'poly',
      name: 'Section 1',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [500, 353, 500, 458, 643, 466, 641, 361],
      polygon: [
        [500, 353],
        [500, 458],
        [643, 466],
        [641, 361]
      ]
    },
    // SECTION 2

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 3,
          columns: 11,
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
            label: (row: number) => `${String.fromCharCode(65 + row)}`
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
      id: '04',
      title: 'Loge Section 2',
      shape: 'poly',
      name: 'Section 2',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [670, 365, 666, 466, 806, 458, 807, 354],
      polygon: [
        [670, 365],
        [666, 466],
        [806, 458],
        [807, 354]
      ]
    },
    // SECTION 4

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 3,
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
            label: (row: number) => `${String.fromCharCode(65 + row)}`
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
      id: '05',
      title: 'Loge Section 4',
      shape: 'poly',
      name: 'Section 4',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [838, 353, 840, 461, 974, 438, 981, 328],
      polygon: [
        [838, 353],
        [840, 461],
        [974, 438],
        [981, 328]
      ]
    },
    // SECTION 6

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 3,
          columns: 7,
          indexerColumns: {
            visible: true,
            label: (col: number) => `60${col + 1}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`
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
      id: '06',
      title: 'Loge Section 6',
      shape: 'poly',
      name: 'Section 6',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [1022, 316, 1022, 426, 1170, 373, 1156, 267],
      polygon: [
        [1022, 316],
        [1022, 426],
        [1170, 373],
        [1156, 267]
      ]
    },
    // YELLOW LEFT LOGE

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 4,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (14 - col >= 10) {
                return `1${14 - col}`
              } else {
                return `10${14 - col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(68 + row)}`
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
      id: '07',
      title: 'Loge Yellow Center Left',
      shape: 'poly',
      name: 'Yellow',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [338, 472, 339, 612, 530, 642, 528, 500],
      polygon: [
        [338, 472],
        [339, 612],
        [530, 642],
        [528, 500]
      ]
    },
    // YELLOW CENTER LOGE

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 4,
          columns: 15,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col + 1}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(68 + row)}`
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
      id: '08',
      title: 'Loge Yellow Center Mid',
      shape: 'poly',
      name: 'Yellow',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [553, 500, 551, 642, 764, 642, 766, 500],
      polygon: [
        [553, 500],
        [551, 642],
        [764, 642],
        [766, 500]
      ]
    },

    // YELLOW RIGHT LOGE

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 4,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (1 + col >= 10) {
                return `2${1 + col}`
              } else {
                return `20${1 + col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(68 + row)}`
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
      id: '09',
      title: 'Loge Yellow Center Right',
      shape: 'poly',
      name: 'Yellow',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [785, 502, 784, 642, 974, 615, 975, 473],
      polygon: [
        [785, 502],
        [784, 642],
        [974, 615],
        [975, 473]
      ]
    },
    // PURPLE RIGHT LOGE

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 5,
          columns: 7,
          indexerColumns: {
            visible: true,
            label: (col: number) => `40${col + 1}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(68 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Purple',
              cssClass: 'Purple'
            }
          },
          disabledSeats: [
            { row: 0, col: 6 },
            { row: 1, col: 6 },
            { row: 2, col: 6 }
          ]
        }
      },
      id: '10',
      title: 'Loge Purple Top Right',
      shape: 'poly',
      name: 'Purple',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [1004, 468, 1003, 645, 1133, 609, 1137, 531, 1127, 546, 1125, 434],
      polygon: [
        [1004, 468],
        [1003, 645],
        [1133, 609],
        [1137, 531],
        [1127, 546],
        [1125, 434]
      ]
    },
    // LEFT RIGHT LOGE

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 5,
          columns: 7,
          indexerColumns: {
            visible: true,
            label: (col: number) => `30${7 - col}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(68 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Purple',
              cssClass: 'Purple'
            }
          },
          disabledSeats: [
            { row: 0, col: 0 },
            { row: 1, col: 0 },
            { row: 2, col: 0 }
          ]
        }
      },
      id: '11',
      title: 'Loge Purple Top Left',
      shape: 'poly',
      name: 'Purple',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [192, 429, 194, 536, 182, 531, 182, 607, 312, 642, 314, 467],
      polygon: [
        [192, 429],
        [194, 536],
        [182, 531],
        [182, 607],
        [312, 642],
        [314, 467]
      ]
    },

    // LEFT CENTER PURPLE LOGE

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 10,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (14 - col >= 10) {
                return `1${14 - col}`
              } else {
                return `10${14 - col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              if (row < 1) {
                return `${String.fromCharCode(72 + row)}`
              } else {
                return `${String.fromCharCode(73 + row)}`
              }
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
      id: '12',
      title: 'Loge Purple Center Left',
      shape: 'poly',
      name: 'Purple',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [339, 616, 339, 936, 527, 963, 530, 641],
      polygon: [
        [339, 616],
        [339, 936],
        [527, 963],
        [530, 641]
      ]
    },
    // CENTER PURPLE LOGE

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 10,
          columns: 15,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${col + 1}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              if (row < 1) {
                return `${String.fromCharCode(72 + row)}`
              } else {
                return `${String.fromCharCode(73 + row)}`
              }
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
      id: '13',
      title: 'Loge Purple Center Mid',
      shape: 'poly',
      name: 'Purple',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [550, 644, 551, 964, 763, 970, 765, 642],
      polygon: [
        [550, 644],
        [551, 964],
        [763, 970],
        [765, 642]
      ]
    },

    // RIGHT CENTER PURPLE LOGE

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 8,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (1 + col >= 10) {
                return `2${1 + col}`
              } else {
                return `20${1 + col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              if (row < 1) {
                return `${String.fromCharCode(72 + row)}`
              } else {
                return `${String.fromCharCode(73 + row)}`
              }
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
      id: '14',
      title: 'Loge Purple Center Right',
      shape: 'poly',
      name: 'Purple',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [784, 643, 784, 927, 971, 901, 974, 616],
      polygon: [
        [784, 643],
        [784, 927],
        [971, 901],
        [974, 616]
      ]
    },
    // RIGHT GRAY LOGE

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 7,
          columns: 10,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (1 + col >= 10) {
                return `4${1 + col}`
              } else {
                return `40${1 + col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(75 + row)}`
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
      title: 'Loge Gray Top Right',
      shape: 'poly',
      name: 'Gray',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [997, 695, 1007, 941, 1150, 901, 1143, 656],
      polygon: [
        [997, 695],
        [1007, 941],
        [1150, 901],
        [1143, 656]
      ]
    },

    // LEFT GRAY LOGE

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 7,
          columns: 10,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (10 - col >= 10) {
                return `3${10 - col}`
              } else {
                return `30${10 - col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(75 + row)}`
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
      id: '16',
      title: 'Loge Gray Top Left',
      shape: 'poly',
      name: 'Gray',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [170, 655, 163, 900, 310, 937, 312, 696],
      polygon: [
        [170, 655],
        [163, 900],
        [310, 937],
        [312, 696]
      ]
    },
    // LEFT BACK GRAY LOGE

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 3,
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
            label: (row: number) => `${String.fromCharCode(82 + row)}`
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
      title: 'Loge Gray Bottom Left',
      shape: 'poly',
      name: 'Gray',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [150, 899, 147, 1012, 323, 1043, 323, 1007, 307, 1001, 307, 937],
      polygon: [
        [150, 899],
        [147, 1012],
        [323, 1043],
        [323, 1007],
        [307, 1001],
        [307, 937]
      ]
    },

    // LEFT CENTER BACK GRAY LOGE

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 3,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (14 - col >= 10) {
                return `1${14 - col}`
              } else {
                return `10${14 - col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(82 + row)}`
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
      id: '18',
      title: 'Loge Gray Bottom Center Left',
      shape: 'poly',
      name: 'Gray',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [339, 937, 338, 1007, 328, 1009, 325, 1041, 530, 1073, 524, 964],
      polygon: [
        [339, 937],
        [338, 1007],
        [328, 1009],
        [325, 1041],
        [530, 1073],
        [524, 964]
      ]
    },

    // RIGHT CENTER BACK GRAY LOGE

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 4,
          columns: 9,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 6 >= 10) {
                return `2${col + 6}`
              } else {
                return `20${6 + col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(81 + row)}`
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
      title: 'Loge Gray Bottom Center Right',
      shape: 'poly',
      name: 'Gray',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [862, 915, 862, 1064, 985, 1045, 987, 1009, 977, 1008, 974, 902],
      polygon: [
        [862, 915],
        [862, 1064],
        [985, 1045],
        [987, 1009],
        [977, 1008],
        [974, 902]
      ]
    },

    // RIGHT BACK GRAY LOGE

    {
      Options: {
        reservedSeats: [],
        legendVisible: false,
        cart: { visible: false },
        map: {
          rows: 3,
          columns: 15,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 >= 10) {
                return `4${col + 1}`
              } else {
                return `40${1 + col}`
              }
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(82 + row)}`
          },
          seatTypes: {
            default: {
              label: 'Gray',
              cssClass: 'Gray'
            }
          },
          disabledSeats: [
            { row: 0, col: 14 },
            { row: 0, col: 13 },
            { row: 0, col: 12 },
            { row: 0, col: 11 },
            { row: 1, col: 14 },
            { row: 1, col: 13 },
            { row: 1, col: 12 },
            { row: 1, col: 11 }
          ]
        }
      },
      id: '20',
      title: 'Loge Gray Bottom Right',
      shape: 'poly',
      name: 'Gray',
      fillColor: '#eab54d4d',
      strokeColor: '#eab54d4d',
      coords: [1007, 941, 1009, 1004, 991, 1010, 988, 1044, 1165, 1014, 1165, 899],
      polygon: [
        [1007, 941],
        [1009, 1004],
        [991, 1010],
        [988, 1044],
        [1165, 1014],
        [1165, 899]
      ]
    }
  ]
})

export default getDefaultMap
