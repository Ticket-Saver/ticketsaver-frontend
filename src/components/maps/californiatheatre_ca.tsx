import { SeatIndex } from 'seatchart'

const getDefaultMap = () => ({
  name: 'CalifoniaTheatre-map',
  areas: [
    // Mezzanine Sections
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            let asciiValue = 77 - index.row
            if (asciiValue <= 73) {
              asciiValue -= 1
            }
            const letter = String.fromCharCode(asciiValue)
            const doubleLetter = `${letter}${letter}`
            const seatNumber = 18 - index.col * 2
            return `${doubleLetter}${seatNumber}`
          },
          rows: 4,
          columns: 9,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${18 - col * 2}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              let asciiValue = 77 - (row % 6)
              if (asciiValue <= 73) {
                asciiValue -= 1
              }
              const character = String.fromCharCode(asciiValue)
              const doubleCharacter = `${character}${character}`
              return doubleCharacter
            }
          },
          seatTypes: {
            default: {
              label: 'Green',
              cssClass: 'Green'
            }
          },
          disabledSeats: [
            { row: 4, col: 0 },
            { row: 5, col: 0 },
            { row: 0, col: 17 },
            { row: 1, col: 17 },
            { row: 2, col: 17 },
            { row: 3, col: 17 },
            { row: 4, col: 17 },
            { row: 5, col: 17 }
          ]
        }
      },
      id: '1',
      title: 'Mezzanine Green left',
      shape: 'poly',
      name: 'Green',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [294.0, 294.7, 296.7, 402.0, 448.7, 355.3, 448.7, 253.3],
      polygon: [
        [294.0, 294.7],
        [296.7, 402.0],
        [448.7, 355.3],
        [448.7, 253.3]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            let asciiValue = 72 - index.row
            if (asciiValue <= 70) {
              asciiValue -= 1
            }
            const letter = String.fromCharCode(asciiValue)
            const doubleLetter = `${letter}${letter}`
            const seatNumber = 16 - index.col * 2
            return `${doubleLetter}${seatNumber}`
          },
          rows: 2,
          columns: 8,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              return `${16 - col * 2}`
            }
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              let asciiValue = 72 - (row % 6)
              if (asciiValue <= 70) {
                asciiValue -= 1
              }
              const character = String.fromCharCode(asciiValue)
              const doubleCharacter = `${character}${character}`
              return doubleCharacter
            }
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
      id: '2',
      title: 'Mezzanine Coral left',
      shape: 'poly',
      name: 'Coral',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [313.3, 402.7, 314.0, 451.3, 452.7, 410.0, 449.3, 363.3],
      polygon: [
        [313.3, 402.7],
        [314.0, 451.3],
        [452.7, 410.0],
        [449.3, 363.3]
      ]
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            let asciiValue = 77 - index.row
            if (asciiValue <= 73) {
              asciiValue -= 1
            }
            const letter = String.fromCharCode(asciiValue)
            const doubleLetter = `${letter}${letter}`
            const seatNumber = 101 + index.col
            return `${doubleLetter}${seatNumber}`
          },
          rows: 6,
          columns: 23,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${101 + col}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              let asciiValue = 77 - (row % 6)
              if (asciiValue <= 73) {
                asciiValue -= 1
              }
              const character = String.fromCharCode(asciiValue)
              const doubleCharacter = `${character}${character}`
              return doubleCharacter
            }
          },
          seatTypes: {
            default: {
              label: 'Coral',
              cssClass: 'Coral'
            }
          },
          disabledSeats: [
            { row: 0, col: 22 },
            { row: 2, col: 22 },
            { row: 4, col: 22 }
          ]
        }
      },
      id: '3',
      title: 'Mezzanine Coral middle',
      shape: 'poly',
      name: 'Coral',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [
        486.9, 251.4, 586.5, 234.8, 752.5, 234.8, 859.1, 251.4, 865.25, 409.1, 752.5, 388.35, 586.5,
        388.35, 482.75, 409.1
      ],
      polygon: [
        [430, 80],
        [550, 60],
        [750, 60],
        [870, 80],
        [875, 270],
        [750, 245],
        [550, 245],
        [425, 270]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            let asciiValue = 77 - (index.row % 6)
            if (asciiValue <= 73) {
              asciiValue -= 1
            }
            const letter = String.fromCharCode(asciiValue)
            const doubleLetter = `${letter}${letter}`
            const seatNumber = 1 + index.col * 2
            return `${doubleLetter}${seatNumber}`
          },
          rows: 4,
          columns: 9,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${1 + 2 * col}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              let asciiValue = 77 - (row % 6)
              if (asciiValue <= 73) {
                asciiValue -= 1
              }
              const character = String.fromCharCode(asciiValue)
              const doubleCharacter = `${character}${character}`
              return doubleCharacter
            }
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
      id: '4',
      title: 'Mezzanine Green right',
      shape: 'poly',
      name: 'Green',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [898.0, 255.3, 892.7, 360.0, 1046.7, 402.7, 1046.7, 301.3],
      polygon: [
        [898.0, 255.3],
        [892.7, 360.0],
        [1046.7, 402.7],
        [1046.7, 301.3]
      ]
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            let asciiValue = 72 - (index.row % 6)
            if (asciiValue <= 70) {
              asciiValue -= 1
            }
            const letter = String.fromCharCode(asciiValue)
            const doubleLetter = `${letter}${letter}`
            const seatNumber = 1 + index.col * 2
            return `${doubleLetter}${seatNumber}`
          },
          rows: 2,
          columns: 8,
          indexerColumns: {
            visible: true,
            label: (col: number) => `${1 + 2 * col}`
          },
          indexerRows: {
            visible: true,
            label: (row: number) => {
              let asciiValue = 72 - (row % 6)
              if (asciiValue <= 70) {
                asciiValue -= 1
              }
              const character = String.fromCharCode(asciiValue)
              const doubleCharacter = `${character}${character}`
              return doubleCharacter
            }
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
      id: '5',
      title: 'Mezzanine Coral right',
      shape: 'poly',
      name: 'Coral',
      fillColor: '#eab54d4d',
      strokeColor: '#f54242',
      coords: [896.5, 362.0, 892.0, 409.0, 1027.5, 449.0, 1028.0, 398.0],
      polygon: [
        [896.5, 362.0],
        [892.0, 409.0],
        [1027.5, 449.0],
        [1028.0, 398.0]
      ]
    },

        // Grand Tier sections
        {
            Options: {
                reservedSeats: [],
                cart: { visible: false },
                legendVisible: false,
                map: {
                    seatLabel: (index: SeatIndex) => {
                        const specialCasesObj = {
                            "0,2": "♿",
                            "0,3": "♿",
                            "0,6": "♿",
                            "0,7": "♿",
                        };
                        const specialCases = new Map(Object.entries(specialCasesObj));
                        const baseString = `FF${101 + index.col}`;
                        const key = `${index.row},${index.col}`;
                        const prefix = specialCases.get(key) || "";

                        return prefix + baseString;
                    },
                    rows: 1,
                    columns: 10,
                    indexerColumns: {
                        visible: true,
                        label: (col: number) => {
                            return `${101 + col}`;
                        },
                    },
                    indexerRows: {
                        visible: true,
                        label: () => "FF",
                    },
                    seatTypes: {
                        default: {
                            label: "Purple",
                            cssClass: "Purple",
                        },
                    },  
                    disabledSeats: [
                        { row: 3, col: 0 },
                        { row: 4, col: 0 },
                    ],
                },
            },
            id: "6",
            title: "Grand Tier middle top",
            shape: "poly",
            name: "Purple",
            fillColor: "#eab54d4d",
            strokeColor: "#f54242",
            coords: [578, 440, 767, 440, 767, 460, 578, 460],
            polygon: [
                [578, 440],
                [767, 440],
                [767, 460],
                [578, 460],
            ],
        },
        {
            Options: {
                reservedSeats: [],
                cart: { visible: false },
                legendVisible: false,
                map: {
                    seatLabel: (index: SeatIndex) => {
                        const letter = String.fromCharCode(69 - index.row);
                        const doubleLetter = `${letter}${letter}`;
                        const seatNumber = 20 - (index.col * 2);
                        return `${doubleLetter}${seatNumber}`;
                    },
                    rows: 3,
                    columns: 10,
                    indexerColumns: {
                        visible: true,
                        label: (col: number) => `${20 - (col * 2)}`,
                    },
                    indexerRows: {
                        visible: true,
                        label: (row: number) => {
                            const letter = String.fromCharCode(69 - (row % 6));
                            const doubleLetter = `${letter}${letter}`;
                            return doubleLetter;
                        }
                    },
                    seatTypes: {
                        default: {
                            label: "Purple",
                            cssClass: "Purple",
                        },
                    },
                },
            },
            id: "7",
            title: "Grand Tier left top",
            shape: "poly",
            name: "Purple",
            fillColor: "#eab54d4d",
            strokeColor: "#f54242",
            coords: [340, 522, 500, 476, 500, 560, 335, 605],
            polygon: [
                [340, 522],
                [500, 476],
                [500, 560],
                [335, 605],
            ],
        },
        {
            Options: {
                reservedSeats: [],
                cart: { visible: false },
                legendVisible: false,
                map: {
                    seatLabel: (index: SeatIndex) => {
                        const letter = String.fromCharCode(69 - index.row); 
                        const doubleLetter = `${letter}${letter}`;
                        const seatNumber = 101 + (index.col * 1);
                        return `${doubleLetter}${seatNumber}`;
                    },
                    rows: 3,
                    columns: 16,
                    indexerColumns: {
                        visible: true,
                        label: (col: number) => `${101 + col}`,
                    },
                    indexerRows: {
                        visible: true,
                        label: (row: number) => {
                            const letter = String.fromCharCode(69 - (row));
                            const doubleLetter = `${letter}${letter}`;
                            return doubleLetter;
                        }
                    },
                    seatTypes: {
                        default: {
                            label: "Purple",
                            cssClass: "Purple",
                        },
                    },
                    disabledSeats: [
                        { row: 1, col: 15 },
                    ],
                },
            },
            id: "8",
            title: "Grand Tier middle middle",
            shape: "poly",
            name: "Purple",
            fillColor: "#eab54d4d",
            strokeColor: "#f54242",
            coords: [540.5, 475.34, 673, 465.24, 805.5, 475.34, 810.3, 552.74, 673, 539.74, 533.7, 552.74],
            polygon: [
                [540.5, 475.34],
                [673, 465.24],
                [805.5, 475.34],
                [810.3, 552.74],
                [673, 539.74],
                [533.7, 552.74],
            ],
        },
        {
            Options: {
                reservedSeats: [],
                cart: { visible: false },
                legendVisible: false,
                map: {
                    seatLabel: (index: SeatIndex) => {
                        const letter = String.fromCharCode(69 - index.row);
                        const doubleLetter = `${letter}${letter}`;
                        const seatNumber = 1 + (index.col * 2);
                        return `${doubleLetter}${seatNumber}`;
                    },
                    rows: 3,
                    columns: 10,
                    indexerColumns: {
                        visible: true,
                        label: (col: number) => `${1 + col * 2}`,
                    },
                    indexerRows: {
                        visible: true,
                        label: (row: number) => {
                            const letter = String.fromCharCode(69 - row);
                            const doubleLetter = `${letter}${letter}`;
                            return doubleLetter;
                        }
                    },
                    seatTypes: {
                        default: {
                            label: "purple",
                            cssClass: "Purple",
                        },
                    },
                },
            },
            id: "9",
            title: "Grand Tier right top",
            shape: "poly",
            name: "Purple",
            fillColor: "#eab54d4d",
            strokeColor: "#f54242",
            coords: [840, 475, 1000, 525, 1005, 610, 840, 558],
            polygon: [
                [840, 475],
                [1000, 525],
                [1005, 610],
                [840, 558],
            ],
        },
        {
            Options: {
                reservedSeats: [],
                cart: { visible: false },
                legendVisible: false,
                map: {
                    seatLabel: (index: SeatIndex) => {
                        const letter = String.fromCharCode(66 - index.row);
                        const doubleLetter = `${letter}${letter}`;
                        const seatNumber = 101 + index.col;
                        return `${doubleLetter}${seatNumber}`;
                    },
                    rows: 2,
                    columns: 11,
                    indexerColumns: {
                        visible: true,
                        label: (col: number) => `${101 + col}`,
                    },
                    indexerRows: {
                        visible: true,
                        label: (row: number) => {
                            const letter = String.fromCharCode(66 - row);
                            const doubleLetter = `${letter}${letter}`;
                            return doubleLetter;
                        }
                    },
                    seatTypes: {
                        default: {
                            label: "Purple",
                            cssClass: "Purple",
                        },
                    },
                    disabledSeats: [
        
                    ],
                },
            },
            id: "10",
            title: "Grand Tier left bottom",
            shape: "poly",
            name: "Purple",
            fillColor: "#eab54d4d",
            strokeColor: "#f54242",
            coords: [343.2, 616.2, 437.5, 583.4, 532.7, 562.9, 518.76, 620.4, 437.5, 640.8, 335, 677.7],
            polygon: [
                [343.2, 616.2],
                [437.5, 583.4],
                [532.7, 562.9],
                [518.76, 620.4],
                [437.5, 640.8],
                [335, 677.7],
            ]
        },
        {
            Options: {
                reservedSeats: [],
                cart: { visible: false },
                legendVisible: false,
                map: {
                    seatLabel: (index: SeatIndex) => {
                        const letter = String.fromCharCode(66 - index.row);
                        const doubleLetter = `${letter}${letter}`;
                        const seatNumber = 112 + index.col;
                        return `${doubleLetter}${seatNumber}`;
                    },
                    rows: 2,
                    columns: 17,
                    indexerColumns: {
                        visible: true,
                        label: (col: number) => `${112 + col}`,
                    },
                    indexerRows: {
                        visible: true,
                        label: (row: number) => {
                            const letter = String.fromCharCode(66 - row);
                            const doubleLetter = `${letter}${letter}`;
                            return doubleLetter;
                        }
                    },
                    seatTypes: {
                        default: {
                            label: "Purple",
                            cssClass: "Purple",
                        },
                    },
                    disabledSeats: [
                        { row: 3, col: 0 },
                        { row: 4, col: 0 },
                    ],
                },
            },
            id: "11",
            title: "Grand Tier middle bottom",
            shape: "poly",
            name: "Purple",
            fillColor: "#eab54d4d",
            strokeColor: "#f54242",
            coords: [532, 560.84, 676.5, 545.9, 817.6, 560.84, 801, 612.3, 676.5, 599.85, 521.1, 616.45],
            polygon: [
                [532, 560.84],
                [676.5, 545.9],
                [817.6, 560.84],
                [801, 612.3],
                [676.5, 599.85],
                [521.1, 616.45],
            ],
        },
        {
            Options: {
                reservedSeats: [],
                cart: { visible: false },
                legendVisible: false,
                map: {
                    seatLabel: (index: SeatIndex) => {
                        const letter = String.fromCharCode(66 - index.row);
                        const doubleLetter = `${letter}${letter}`;
                        const seatNumber = 129 + index.col;
                        return `${doubleLetter}${seatNumber}`;
                    },
                    rows: 2,
                    columns: 12,
                    indexerColumns: {
                        visible: true,
                        label: (col: number) => `${129 + col}`,
                    },
                    indexerRows: {
                        visible: true,
                        label: (row: number) => {
                            const letter = String.fromCharCode(66 - row);
                            const doubleLetter = `${letter}${letter}`;
                            return doubleLetter;
                        }
                    },
                    seatTypes: {
                        default: {
                            label: "Purple",
                            cssClass: "Purple",
                        },
                    },
                    disabledSeats: [
                        { row: 3, col: 0 },
                        { row: 4, col: 0 },
                    ],
                },
            },
            id: "12",
            title: "Grand Tier right bottom",
            shape: "poly",
            name: "Purple",
            fillColor: "#eab54d4d",
            strokeColor: "#f54242",
            coords: [815.4, 562.36, 929, 588.6, 1011, 625.5, 998.7, 670.6, 929, 644.36, 800, 613.2],
            polygon: [
                [815.4, 562.36],
                [929, 588.6],
                [1011, 625.5],
                [998.7, 670.6],
                [929, 644.36],
                [800, 613.2],
            ],
        },
        // Orchestra
        {
            Options: {
                reservedSeats: [],
                cart: { visible: false },
                legendVisible: false,
                map: {
                    seatLabel: (index: SeatIndex) => {
                        let asciiValue = 86 - index.row;
                        if (asciiValue <= 79) {
                            asciiValue -= 1;
                        }
                        const letter = String.fromCharCode(asciiValue);
                        const seatNumber = 14 - (index.col * 2);
                        return `${letter}${seatNumber}`;
                    },
                    rows: 4,
                    columns: 7,
                    indexerColumns: {
                        visible: true,
                        label: (col: number) => `${14 - col * 2}`,
                    },
                    indexerRows: {
                        visible: true,
                        label: (row: number) => {
                            let asciiValue = 86 - row;
                            if (asciiValue <= 79) {
                                asciiValue -= 1;
                            }
                            return `${String.fromCharCode(asciiValue)}`;
                        },
                    },
                    seatTypes: {
                        default: {
                            label: "Purple",
                            cssClass: "Purple",
                        },
                    },
                    disabledSeats: [
                        { row: 0, col: 0 },
                    ],
                },
            },
            id: "13",
            title: "Orchestra Sec Purple left",
            shape: "poly",
            name: "Purple",
            fillColor: "#eab54d4d",
            strokeColor: "#f54242",
            coords: [334.0,722.3,338.0,747.7,318.3,754.3,321.0,822.3,437.0,791.3,435.0,695.7],
            polygon: [
                [334.0,722.3],
                [338.0,747.7],
                [318.3,754.3],
                [321.0,822.3],
                [437.0,791.3],
                [435.0,695.7]
            ]
        },
        {
            Options: {
                reservedSeats: [],
                cart: { visible: false },
                legendVisible: false,
                map: {
                    seatLabel: (index: SeatIndex) => {
                        let asciiValue = 82 - index.row;
                        if (asciiValue <= 79) {
                            asciiValue -= 1;
                        }
                        const letter = String.fromCharCode(asciiValue);
                        const seatNumber = 16 - (index.col * 2);
                        return `${letter}${seatNumber}`;
                    },
                    rows: 6,
                    columns: 8,
                    indexerColumns: {
                        visible: true,
                        label: (col: number) => `${16 - col * 2}`,
                    },
                    indexerRows: {
                        visible: true,
                        label: (row: number) => {
                            let asciiValue = 82 - row;
                            if (asciiValue <= 79) {
                                asciiValue -= 1;
                            }
                            return `${String.fromCharCode(asciiValue)}`;
                        },
                    },
                    seatTypes: {
                        default: {
                            label: "Orange",
                            cssClass: "Orange",
                        },
                    },
                    disabledSeats: [
                        { row: 5, col: 0 },
                    ],
                },
            },
            id: "14",
            title: "Orchestra Sec Orange left",
            shape: "poly",
            name: "Orange",
            fillColor: "#eab54d4d",
            strokeColor: "#f54242",
            coords: [303.7,837.3,303.0,941.7,323.3,971.0,440.3,935.7,433.3,793.7],
            polygon: [
                [303.7,837.3],
                [303.0,941.7],
                [323.3,971.0],
                [440.3,935.7],
                [433.3,793.7]
            ]
        },
        {
            Options: {
                reservedSeats: [],
                cart: { visible: false },
                legendVisible: false,
                map: {
                    seatLabel: (index: SeatIndex) => {
                        let asciiValue = 86 - index.row;
                        if (asciiValue <= 79) {
                            asciiValue -= 1;
                        }
                        const letter = String.fromCharCode(asciiValue);
                        const seatNumber = 101 + index.col;
                        return `${letter}${seatNumber}`;
                    },
                    rows: 7,
                    columns: 25,
                    indexerColumns: {
                        visible: true,
                        label: (col: number) => `${101 + col}`,
                    },
                    indexerRows: {
                        visible: true,
                        label: (row: number) => {
                            let asciiValue = 86 - row;
                            if (asciiValue <= 79) {
                                asciiValue -= 1;
                            }
                            return `${String.fromCharCode(asciiValue)}`;
                        },
                    },
                    seatTypes: {
                        default: {
                            label: "Orange",
                            cssClass: "Orange",
                        },
                    },
                    disabledSeats: [
                        { row: 0, col: 23 },
                        { row: 0, col: 24 },
                        { row: 1, col: 24 },
                        { row: 3, col: 24 },
                        { row: 5, col: 24 },
                        { row: 6, col: 23 },
                        { row: 6, col: 24 },
                    ],
                },
            },
            id: "15",
            title: "Orchestra Sec Orange middle",
            shape: "poly",
            name: "Orange",
            fillColor: "#eab54d4d",
            strokeColor: "#f54242",
            coords: [476.5,686.5,483.0,706.0,468.0,710.5,473.5,734.5,458.0,736.0,459.0,754.5,467.0,755.5,470.5,781.5,457.5,787.0,460.5,804.5,466.5,803.0,471.0,830.0,456.0,836.0,463.5,855.5,525.0,844.5,591.0,835.5,693.0,833.0,739.5,833.0,838.5,849.5,842.5,828.0,867.5,833.5,877.5,788.5,866.0,785.5,877.5,741.5,865.5,737.0,870.5,711.0,854.0,710.5,858.5,683.0,750.0,663.5,593.5,665.0],
            polygon: [
                [476.5,686.5],
                [483.0,706.0],
                [468.0,710.5],
                [473.5,734.5],
                [458.0,736.0],
                [459.0,754.5],
                [467.0,755.5],
                [470.5,781.5],
                [457.5,787.0],
                [460.5,804.5],
                [466.5,803.0],
                [471.0,830.0],
                [456.0,836.0],
                [463.5,855.5],
                [525.0,844.5],
                [591.0,835.5],
                [693.0,833.0],
                [739.5,833.0],
                [838.5,849.5],
                [842.5,828.0],
                [867.5,833.5],
                [877.5,788.5],
                [866.0,785.5],
                [877.5,741.5],
                [865.5,737.0],
                [870.5,711.0],
                [854.0,710.5],
                [858.5,683.0],
                [750.0,663.5],
                [593.5,665.0]
            ]
        },
        {
            Options: {
                reservedSeats: [],
                cart: { visible: false },
                legendVisible: false,
                map: {
                    seatLabel: (index: SeatIndex) => {
                        let asciiValue = 78 - index.row;
                        if (asciiValue <= 75) {
                            asciiValue -= 1;
                        }
                        const letter = String.fromCharCode(asciiValue);
                        const seatNumber = 101 + index.col;
                        return `${letter}${seatNumber}`;
                    },
                    rows: 3,
                    columns: 24,
                    indexerColumns: {
                        visible: true,
                        label: (col: number) => `${101 + col}`,
                    },
                    indexerRows: {
                        visible: true,
                        label: (row: number) => {
                            let asciiValue = 78 - row;
                            if (asciiValue <= 75) {
                                asciiValue -= 1;
                            }
                            return `${String.fromCharCode(asciiValue)}`;
                        },
                    },
                    seatTypes: {
                        default: {
                            label: "Yellow",
                            cssClass: "Yellow",
                        },
                    },
                    disabledSeats: [
                        { row: 1, col: 23 },
                        { row: 2, col: 22 },
                        { row: 2, col: 23 },
                    ],
                },
            },
            id: "16",
            title: "Orchestra Yellow middle",
            shape: "poly",
            name: "Yellow",
            fillColor: "#eab54d4d",
            strokeColor: "#f54242",
            coords: [465.0,858.3,487.3,927.7,552.3,914.7,586.0,910.7,617.7,906.3,716.0,905.3,753.0,905.3,784.3,909.3,848.3,920.7,866.7,859.0,801.7,843.7,752.0,836.7,685.3,834.3,600.7,837.7],
            polygon: [
                [465.0,858.3],
                [487.3,927.7],
                [552.3,914.7],
                [586.0,910.7],
                [617.7,906.3],
                [716.0,905.3],
                [753.0,905.3],
                [784.3,909.3],
                [848.3,920.7],
                [866.7,859.0],
                [801.7,843.7],
                [752.0,836.7],
                [685.3,834.3],
                [600.7,837.7]
            ]
        },
        {
            Options: {
                reservedSeats: [],
                cart: { visible: false },
                legendVisible: false,
                map: {
                    seatLabel: (index: SeatIndex) => {
                        let asciiValue = 86 - index.row;
                        if (asciiValue <= 82) {
                            asciiValue -= 1;
                        }
                        const letter = String.fromCharCode(asciiValue);
                        const seatNumber = 1 + index.col * 2;
                        return `${letter}${seatNumber}`;
                    },
                    rows: 4,
                    columns: 7,
                    indexerColumns: {
                        visible: true,
                        label: (col: number) => `${1 + col * 2}`,
                    },
                    indexerRows: {
                        visible: true,
                        label: (row: number) => {
                            let asciiValue = 86 - row;
                            if (asciiValue <= 82) {
                                asciiValue -= 1;
                            }
                            return `${String.fromCharCode(asciiValue)}`;
                        },
                    },
                    seatTypes: {
                        default: {
                            label: "Purple",
                            cssClass: "Purple",
                        },
                    },
                    disabledSeats: [
                    ],
                },
            },
            id: "17",
            title: "Orchestra Sec Purple right",
            shape: "poly",
            name: "Purple",
            fillColor: "#eab54d4d",
            strokeColor: "#f54242",
            coords: [900.5,693.5,899.0,789.0,1020.5,821.5,1019.5,725.5],
            polygon: [
                [900.5,693.5],
                [899.0,789.0],
                [1020.5, 821.5],
                [1019.5,725.5]
            ]
        },
        {
            Options: {
                reservedSeats: [],
                cart: { visible: false },
                legendVisible: false,
                map: {
                    seatLabel: (index: SeatIndex) => {
                        let asciiValue = 82 - index.row;
                        if (asciiValue <= 76) {
                            asciiValue -= 1;
                        }
                        const letter = String.fromCharCode(asciiValue);
                        const seatNumber = 1 + index.col * 2;
                        return `${letter}${seatNumber}`;
                    },
                    rows: 6,
                    columns: 8,
                    indexerColumns: {
                        visible: true,
                        label: (col: number) => `${1 + col * 2}`,
                    },
                    indexerRows: {
                        visible: true,
                        label: (row: number) => {
                            let asciiValue = 82 - row;
                            if (asciiValue <= 76) {
                                asciiValue -= 1;
                            }
                            return `${String.fromCharCode(asciiValue)}`;
                        },
                    },
                    seatTypes: {
                        default: {
                            label: "Orange",
                            cssClass: "Orange",
                        },
                    },
                    disabledSeats: [
                        { row: 5, col: 7 }, 
                    ],
                },
            },
            id: "18",
            title: "Orchestra Sec Orange right",
            shape: "poly",
            name: "Orange",
            fillColor: "#eab54d4d",
            strokeColor: "#f54242",
            coords: [902.3,791.0,900.0,934.0,1012.7,964.7,1019.7,943.7,1027.7,947.3,1033.7,934.0,1033.7,828.3],
            polygon: [
                [902.3,791.0],
                [900.0,934.0],
                [1012.7,964.7],
                [1019.7,943.7],
                [1027.7,947.3],
                [1033.7,934.0],
                [1033.7,828.3]
            ]
        },
        {
            Options: {
                reservedSeats: [],
                cart: { visible: false },
                legendVisible: false,
                map: {
                    seatLabel: (index: SeatIndex) => {
                        const specialCasesObj = {
                            "0,0": "♿",
                            "0,1": "♿",
                        };
                        const specialCases = new Map(Object.entries(specialCasesObj));
                        const seatNumber = 101 + (index.col % 3);
                        const letter = String.fromCharCode(75 - index.row);
                        const baseString = `${letter}${seatNumber}`;
                        const key = `${index.row},${index.col}`;
                        const prefix = specialCases.get(key) || "";

                        return prefix + baseString;
                    },
                    rows: 1,
                    columns: 2,
                    indexerColumns: {
                        visible: true,
                        label: (col: number) => `${101 + col}`,
                    },
                    indexerRows: {
                        visible: true,
                        label: (row: number) => `${String.fromCharCode(75 - row)}`,
                    },
                    seatTypes: {
                        default: {
                            label: "Yellow",
                            cssClass: "Yellow",
                        },
                    },
                    disabledSeats: [
                        { row: 1, col: 1 },
                    ],
                },
            },
            id: "19",
            title: "Orchestra Sec Yellow middle left",
            shape: "poly",
            name: "Yellow",
            fillColor: "#eab54d4d",
            strokeColor: "#f54242",
            coords: [505, 942, 550, 935, 540, 978, 520, 978],
            polygon: [
                [455, 895],
                [500, 888],
                [490, 940],
                [470, 940],
            ]
        },
        {
            Options: {
                reservedSeats: [],
                cart: { visible: false },
                legendVisible: false,
                map: {
                    seatLabel: (index: SeatIndex) => {
                        const rowChar = 'K';
                        const seatNumber = 104 + index.col;
                        return `${rowChar}${seatNumber}`;
                    },
                    rows: 1,
                    columns: 13,
                    indexerColumns: {
                        visible: true,
                        label: (col: number) => `${103 + col + 1}`,
                    },
                    indexerRows: {
                        visible: true,
                        label: () => 'K',
                    },
                    seatTypes: {
                        default: {
                            label: "Yellow",
                            cssClass: "Yellow",
                        },
                    },
                    disabledSeats: [
                        { row: 3, col: 0 },
                        { row: 4, col: 0 },
                    ],
                },
            },
            id: "20",
            title: "Orchestra Sec Yellow middle middle",
            shape: "poly",
            name: "Yellow",
            fillColor: "#eab54d4d",
            strokeColor: "#f54242",
            coords: [570, 928, 640, 918, 725, 918, 788, 928, 788, 945, 570, 945],
            polygon: [
                [570, 928],
                [640, 918],
                [725, 918],
                [788, 928],
                [788, 945],
                [570, 945],
            ]
        },
        {
            Options: {
                reservedSeats: [],
                cart: { visible: false },
                legendVisible: false,
                map: {
                    seatLabel: (index: SeatIndex) => {
                        const specialCasesObj = {
                            "0,0": "♿",
                            "0,1": "♿",
                        };
                        const specialCases = new Map(Object.entries(specialCasesObj));
                        const seatNumber = 117 + (index.col % 3);
                        const letter = String.fromCharCode(75 - index.row);
                        const baseString = `${letter}${seatNumber}`;
                        const key = `${index.row},${index.col}`;
                        const prefix = specialCases.get(key) || "";

                        return prefix + baseString;
                    },
                    rows: 1,
                    columns: 2,
                    indexerColumns: {
                        visible: true,
                        label: (col: number) => `${117 + col}`,
                    },
                    indexerRows: {
                        visible: true,
                        label: (row: number) => `${String.fromCharCode(75 - row)}`,
                    },
                    seatTypes: {
                        default: {
                            label: "Yellow",
                            cssClass: "Yellow",
                        },
                    },
                    disabledSeats: [
                        { row: 1, col: 0 },
                        { row: 1, col: 1 },
                    ],
                },
            },
            id: "21",
            title: "Orchestra Sec Yellow middle right",
            shape: "poly",
            name: "Green",
            fillColor: "#eab54d4d",
            strokeColor: "#f54242",
            coords: [800, 930, 845, 940, 825, 980, 800, 975],
            polygon: [
                [800, 930],
                [845, 940],
                [825, 980],
                [800, 975],
            ]
        },
        {
            Options: {
                reservedSeats: [],
                cart: { visible: false },
                legendVisible: false,
                map: {
                    seatLabel: (index: SeatIndex) => {
                        const specialCasesObj = {
                            "0,5": "♿",
                            "0,7": "♿",
                            "0,8": "♿",
                        };
                        const specialCases = new Map(Object.entries(specialCasesObj));
                        const seatNumber = 20 - (index.col * 2);
                        const letter = String.fromCharCode(72 - index.row);
                        const baseString = `${letter}${seatNumber}`;
                        const key = `${index.row},${index.col}`;
                        const prefix = specialCases.get(key) || "";
                        return prefix + baseString;
                    },
                    rows: 8,
                    columns: 10,
                    indexerColumns: {
                        visible: true,
                        label: (col: number) => {
                            return `${20 - (col * 2)}`;
                        },
                    },
                    indexerRows: {
                        visible: true,
                        label: (row: number) => `${String.fromCharCode(72 - row)}`,
                    },
                    seatTypes: {
                        default: {
                            label: "Yellow",
                            cssClass: "Yellow",
                        },
                    },
                    disabledSeats: [
                        { row: 0, col: 0 },
                        { row: 0, col: 1 },
                        { row: 0, col: 2 },
                        { row: 3, col: 0 },
                        { row: 4, col: 0 },
                        { row: 5, col: 0 },
                        { row: 6, col: 0 },
                        { row: 6, col: 1 },
                        { row: 7, col: 0 },
                        { row: 7, col: 1 },
                        { row: 7, col: 2 },
                    ],
                },
            },
            id: "22",
            title: "Orchestra Sec Yellow left top",
            shape: "poly",
            name: "Yellow",
            fillColor: "#eab54d4d",
            strokeColor: "#f54242",
            coords: [310, 1065, 442, 1006, 469, 1033, 528, 1195, 410, 1246, 362, 1204, 317, 1123],
            polygon: [
                [310, 1065],
                [442, 1006],
                [469, 1033],
                [528, 1195],
                [410, 1246],
                [362, 1204],
                [317, 1123],
            ]
        },
        {
            Options: {
                reservedSeats: [],
                cart: { visible: false },
                legendVisible: false,
                map: {
                    seatLabel: (index: SeatIndex) => {
                        const specialCasesObj = {
                            "8,0": "♿",
                            "8,11": "♿",
                        };
                        const specialCases = new Map(Object.entries(specialCasesObj));
                        const seatNumber = 101 + index.col;
                        let asciiCode = 74 - index.row;
                        if (asciiCode <= 73) asciiCode--;
                        const letter = String.fromCharCode(asciiCode);
                        const baseString = `${letter}${seatNumber}`;
                        const key = `${index.row},${index.col}`;
                        const prefix = specialCases.get(key) || "";
                        return prefix + baseString;
                    },
                    rows: 9,
                    columns: 21,
                    indexerColumns: {
                        visible: true,
                        label: (col: number) => `${101 + col}`,
                    },
                    indexerRows: {
                        visible: true,
                        label: (row: number) => {
                            let asciiCode = 74 - row;
                            if (asciiCode <= 73) asciiCode--;
                            return `${String.fromCharCode(asciiCode)}`;
                        },
                    },
                    seatTypes: {
                        default: {
                            label: "Yellow",
                            cssClass: "Yellow",
                        },
                    },
                    disabledSeats: [
                        { row: 0, col: 9 },
                        { row: 0, col: 10 },
                        { row: 0, col: 11 },
                        { row: 0, col: 12 },
                        { row: 0, col: 13 },
                        { row: 0, col: 14 },
                        { row: 0, col: 15 },
                        { row: 0, col: 16 },
                        { row: 0, col: 17 },
                        { row: 0, col: 18 },
                        { row: 0, col: 19 },
                        { row: 0, col: 20 },
                        { row: 2, col: 20 },
                        { row: 3, col: 20 },
                        { row: 3, col: 19 },
                        { row: 4, col: 18 },
                        { row: 4, col: 19 },
                        { row: 4, col: 20 },
                        { row: 5, col: 17 },
                        { row: 5, col: 18 },
                        { row: 5, col: 19 },
                        { row: 5, col: 20 },
                        { row: 6, col: 16 },
                        { row: 6, col: 17 },
                        { row: 6, col: 18 },
                        { row: 6, col: 19 },
                        { row: 6, col: 20 },
                        { row: 7, col: 15 },
                        { row: 7, col: 16 },
                        { row: 7, col: 17 },
                        { row: 7, col: 18 },
                        { row: 7, col: 19 },
                        { row: 7, col: 20 },
                        { row: 8, col: 12 },
                        { row: 8, col: 13 },
                        { row: 8, col: 14 },
                        { row: 8, col: 15 },
                        { row: 8, col: 16 },
                        { row: 8, col: 17 },
                        { row: 8, col: 18 },
                        { row: 8, col: 19 },
                        { row: 8, col: 20 },
                    ],
                },
            },
            id: "23",
            title: "Orchestra Sec Yellow middle",
            shape: "poly",
            name: "Yellow",
            fillColor: "#eab54d4d",
            strokeColor: "#f54242",
            coords: [
                484.17, 986.09, 588.95, 972.19, 588.95, 950.64, 751.7, 950.64,
                751.7, 972.19, 857.86, 986.09, 778.17, 1200.9, 566.79, 1200.9
            ],
            polygon: [
                [484.17, 986.09],
                [588.95, 972.19],
                [588.95, 950.64],
                [751.7, 950.64],
                [751.7, 972.19],
                [857.86, 986.09],
                [778.17, 1200.9],
                [566.79, 1200.9],
            ]
        },
        {
            Options: {
                reservedSeats: [],
                cart: { visible: false },
                legendVisible: false,
                map: {
                    seatLabel: (index: SeatIndex) => {
                        const specialCasesObj = {
                            "0,1": "♿",
                            "0,2": "♿",
                            "0,4": "♿",
                        };
                        const specialCases = new Map(Object.entries(specialCasesObj));
                        const seatNumber = 1 + (index.col * 2);
                        const letter = String.fromCharCode(72 - index.row);
                        const baseString = `${letter}${seatNumber}`;
                        const key = `${index.row},${index.col}`;
                        const prefix = specialCases.get(key) || "";
                        return prefix + baseString;
                    },
                    rows: 8,
                    columns: 10,
                    indexerColumns: {
                        visible: true,
                        label: (col: number) => {
                            return `${1 + (col * 2)}`;
                        },
                    },
                    indexerRows: {
                        visible: true,
                        label: (row: number) => `${String.fromCharCode(72 - row)}`,
                    },
                    seatTypes: {
                        default: {
                            label: "Yellow",
                            cssClass: "Yellow",
                        },
                    },
                    disabledSeats: [
                        { row: 0, col: 7 },
                        { row: 0, col: 8 },
                        { row: 0, col: 9 },
                        { row: 3, col: 9 },
                        { row: 4, col: 9 },
                        { row: 5, col: 9 },
                        { row: 6, col: 8 },
                        { row: 6, col: 9 },
                        { row: 7, col: 7 },
                        { row: 7, col: 8 },
                        { row: 7, col: 9 },
                    ],
                },
            },
            id: "24",
            title: "Orchestra Sec Yellow right",
            shape: "poly",
            name: "Yellow",
            fillColor: "#eab54d4d",
            strokeColor: "#f54242",
            //i y d, U y D 
            coords: [900, 1008, 1033, 1062, 1015, 1135, 970, 1205, 922, 1240, 818, 1195, 865, 1040],
            polygon: [
                [900, 1008],
                [1033, 1062],
                [1015, 1135],
                [970, 1205],
                [922, 1240],
                [818, 1195],
                [865, 1040],
            ]
        },
    ],
});

export default getDefaultMap
