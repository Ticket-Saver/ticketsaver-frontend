import { SeatIndex } from "seatchart";

const getDefaultMap = () => ({
  name: "SanJose-map",
  areas: [
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 10) {
              return `A${String.fromCharCode(65 + index.row)}${20 - index.col}`;
            } else {
              return `A${String.fromCharCode(65 + index.row)}${20 - index.col}`;
            }
          },
          rows: 1,
          columns: 10,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${20 - col}`;
              } else {
                return `${20 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Purple",
              cssClass: "Purple",
            },
          },
          disabledSeats: [{ row: 1, col: 0 }],
        },
      },
      id: "1",
      title: "Section 102 Purple Left",
      shape: "poly",
      name: "Purple",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [521,19,523,33,656,35,656,19],
      polygon: [
        [521, 19],
        [523, 33],
        [656, 35],
        [656, 19],
      ],
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 10) {
              return `A${String.fromCharCode(65 + index.row)}${10 - index.col}`;
            } else {
              return `A${String.fromCharCode(65 + index.row)}${10 - index.col}`;
            }
          },
          rows: 1,
          columns: 10,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 > 10) {
                return `${10 - col}`;
              } else {
                return `${10 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Purple",
              cssClass: "Purple",
            },
          },
          disabledSeats: [{ row: 1, col: 0 }],
        },
      },
      id: "2",
      title: "Section 102 Purple Right",
      shape: "poly",
      name: "Purple",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [656,19,657,33,789,33,789,19],
      polygon: [
        [656, 18],
        [657, 35],
        [789, 19],
        [789, 33],
      ],
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            const specialCasesObj = {
              "0,4": "♿",
              "0,5": "🚹",
              "1,2": "♿",
              "1,3": "🚹",
              "1,4": "🚹",
              "1,5": "🚹",
              "2,0": "🧏",
              "2,1": "🧏",
              "3,0": "🧏",
              "3,1": "🧏",
            };
            const specialCases = new Map(Object.entries(specialCasesObj));
            const baseString = `${String.fromCharCode(65 + index.row)}${
              10 - index.col
            }`;
            const key = `${index.row},${index.col}`;
            const prefix = specialCases.get(key) || "";

            return prefix + baseString;
          },
          rows: 8,
          columns: 10,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${col + 1}`;
              } else {
                return `${col + 1}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Purple",
              cssClass: "Purple",
            },
          },
          disabledSeats: [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 0, col: 3 },
            { row: 1, col: 0 },
            { row: 1, col: 1 },
          ],
        },
      },
      id: "3",
      title: "Section 103 Purple ",
      shape: "poly",
      name: "Purple",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [455, 45, 455, 68, 426, 70, 427,95, 400,94,403,240,535,240,537,45],
      polygon: [
        [455, 45],
        [455, 68],
        [426, 70],
        [427,95],
        [400,94],
        [403,240],
        [535,240],
        [535,240],
        [537,45]

      ],
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 10) {
              return `${String.fromCharCode(65 + index.row)}${index.col + 1}`;
            } else {
              return `${String.fromCharCode(65 + index.row)}${index.col + 1}`;
            }
          },
          rows: 8,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${col + 1}`;
              } else {
                return `${col + 1}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Purple",
              cssClass: "Purple",
            },
          },
          disabledSeats: [],
        },
      },
      id: "4",
      title: "Section 102 Purple",
      shape: "poly",
      name: "Purple",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [560,46,560,236,750,236,750,46],
      polygon: [
        [560, 46],
        [560, 236],
        [753, 236],
        [750, 46],
      ],
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
              "0,4": "🚹",
              "1,7": "♿",
              "1,6": "🚹",
              "1,5": "🚹",
              "1,4": "🚹",
              "2,9": "🧏",
              "2,8": "🧏",
              "3,9": "🧏",
              "3,8": "🧏",
            };
            const specialCases = new Map(Object.entries(specialCasesObj));
            const baseString = `${String.fromCharCode(65 + index.row)}${
              index.col + 1
            }`;
            const key = `${index.row},${index.col}`;
            const prefix = specialCases.get(key) || "";

            return prefix + baseString;
          },
          rows: 8,
          columns: 10,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${col + 1}`;
              } else {
                return `${col + 1}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Purple",
              cssClass: "Purple",
            },
          },
          disabledSeats: [
            { row: 0, col: 9 },
            { row: 0, col: 8 },
            { row: 0, col: 7 },
            { row: 0, col: 6 },
            { row: 1, col: 9 },
            { row: 1, col: 8 },
          ],
        },
      },
      id: "5",
      title: "Section 101 Purple",
      shape: "poly",
      name: "Purple",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [773,46,773,240,910,240,910,95,884,95,884,70,855,70,855,46],
      polygon: [
        [773, 46],
        [773, 240],
        [910, 240],
        [910, 95],
        [884,95],
        [884,70],
        [855,70],
        [855,46]
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 10) {
              return `${String.fromCharCode(73 + index.row)}${10 - index.col}`;
            } else {
              return `${String.fromCharCode(73 + index.row)}${10 - index.col}`;
            }
          },
          rows: 7,
          columns: 10,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${10 - col}`;
              } else {
                return `${10 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(73 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Green",
              cssClass: "Green",
            },
          },
          disabledSeats: [],
        },
      },
      id: "43",
      title: "Section 103 Green ",
      shape: "poly",
      name: "Green",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [402,247,402,420,540,420,540,247],
      polygon: [
        [402,247],
        [402,420],
        [540,420],
        [540,247]
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (14 - index.col > 10) {
              return `${String.fromCharCode(73 + index.row)}${14 - index.col}`;
            } else {
              return `${String.fromCharCode(73 + index.row)}${14 - index.col}`;
            }
          },
          rows: 7,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (14 - col > 10) {
                return `${14 - col}`;
              } else {
                return `${14 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(73 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Green",
              cssClass: "Green",
            },
          },
          disabledSeats: [],
        },
      },
      id: "6",
      title: "Section 102 Green",
      shape: "poly",
      name: "Green",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [560,247,560,420,750,420,750,247],
      polygon: [
        [560,247],
        [560,420],
        [750,420],
        [750,247]
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 10) {
              return `${String.fromCharCode(73 + index.row)}${index.col + 1}`;
            } else {
              return `${String.fromCharCode(73 + index.row)}${index.col + 1}`;
            }
          },
          rows: 7,
          columns: 10,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${col + 1}`;
              } else {
                return `${col + 1}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(73 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Green",
              cssClass: "Green",
            },
          },
          disabledSeats: [],
        },
      },
      id: "7",
      title: "Section 101 Green",
      shape: "poly",
      name: "Green",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [770,245,770,420,910,420,910,245],
      polygon: [
        [770,245],
        [770,420],
        [910,420],
        [910,245]
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 10) {
              return `${String.fromCharCode(65 + index.row)}${10 - index.col}`;
            } else {
              return `${String.fromCharCode(65 + index.row)}${10 - index.col}`;
            }
          },
          rows: 3,
          columns: 10,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${10 - col}`;
              } else {
                return `${10 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Green",
              cssClass: "Green",
            },
          },
          disabledSeats: [],
        },
      },
      id: "8",
      title: "Section 106 Green ",
      shape: "poly",
      name: "Green",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [400,470,400,540,540,540,540,470],
      polygon: [
        [400,470],
        [400,540],
        [540,540],
        [540,470]
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 10) {
              return `${String.fromCharCode(65 + index.row)}${14 - index.col}`;
            } else {
              return `${String.fromCharCode(65 + index.row)}${14 - index.col}`;
            }
          },
          rows: 5,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${14 - col}`;
              } else {
                return `${14 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Green",
              cssClass: "Green",
            },
          },
          disabledSeats: [],
        },
      },
      id: "9",
      title: "Section 105 Green",
      shape: "poly",
      name: "Green",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [560,470,560,600,760,600,760,470],
      polygon: [
        [560,470],
        [560,600],
        [760,600],
        [760,470]
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 10) {
              return `${String.fromCharCode(65 + index.row)}${index.col + 1}`;
            } else {
              return `${String.fromCharCode(65 + index.row)}${index.col + 1}`;
            }
          },
          rows: 3,
          columns: 10,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${col + 1}`;
              } else {
                return `${col + 1}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Green",
              cssClass: "Green",
            },
          },
          disabledSeats: [],
        },
      },
      id: "10",
      title: "Section 104 Green",
      shape: "poly",
      name: "Green",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [770,470,770,550,910,550,910,470],
      polygon: [
        [770,470],
        [770,550],
        [910,550],
        [910,470],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 10) {
              return `${String.fromCharCode(68 + index.row)}${10 - index.col}`;
            } else {
              return `${String.fromCharCode(68 + index.row)}${10 - index.col}`;
            }
          },
          rows: 8,
          columns: 10,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${col + 1}`;
              } else {
                return `${col + 1}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(68 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Red",
              cssClass: "Red",
            },
          },
          disabledSeats: [],
        },
      },
      id: "11",
      title: "Section 106 Red",
      shape: "poly",
      name: "Red",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [400,550,400,750,540,750,540,550],
      polygon: [
        [400,550],
        [400,750],
        [540,750],
        [540,550]
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 10) {
              return `${String.fromCharCode(70 + index.row)}${14 - index.col}`;
            } else {
              return `${String.fromCharCode(70 + index.row)}${14 - index.col}`;
            }
          },
          rows: 8,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${14 - col}`;
              } else {
                return `${14 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(70 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Red",
              cssClass: "Red",
            },
          },
          disabledSeats: [],
        },
      },
      id: "12",
      title: "Section 105 Red",
      shape: "poly",
      name: "Red",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [560,600,560,800,750,800,750,600],
      polygon: [
        [560,600],
        [560,800],
        [750,800],
        [750,600]
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 10) {
              return `${String.fromCharCode(68 + +index.row)}${index.col + 1}`;
            } else {
              return `${String.fromCharCode(68 + index.row)}${index.col + 1}`;
            }
          },
          rows: 8,
          columns: 10,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${col + 1}`;
              } else {
                return `${col + 1}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(68 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Red",
              cssClass: "Red",
            },
          },
          disabledSeats: [],
        },
      },
      id: "13",
      title: "Section 104 Red ",
      shape: "poly",
      name: "Red",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [770,550,770,750,910,750,910,550],
      polygon: [
        [770,550],
        [770,750],
        [910,750],
        [910,550]
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            const specialCasesObj = {
              "6,6": "♿",
              "6,7": "🚹",
              "5,2": "♿",
              "5,3": "🚹",
            };
            const specialCases = new Map(Object.entries(specialCasesObj));
            const baseString = `${String.fromCharCode(76 + index.row)}${
              10 - index.col
            }`;
            const key = `${index.row},${index.col}`;
            const prefix = specialCases.get(key) || "";

            return prefix + baseString;
          },
          rows: 7,
          columns: 10,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${10 - col}`;
              } else {
                return `${10 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(76 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Orange",
              cssClass: "Orange",
            },
          },
          disabledSeats: [
            { row: 3, col: 0 },
            { row: 4, col: 0 },
            { row: 5, col: 0 },
            { row: 5, col: 1 },
            { row: 6, col: 0 },
            { row: 6, col: 1 },
            { row: 6, col: 2 },
            { row: 6, col: 3 },
            { row: 6, col: 4 },
          ],
        },
      },
      id: "14",
      title: "Section 106 Orange",
      shape: "poly",
      name: "Orange",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [400,750,400,830,410,830,410,880,420,880,420,900,460,900,460,930,540,930,540,750],
      polygon: [
        [400,750],
        [400,830],
        [410,830],
        [410,880],
        [420,880],
        [420,900],
        [460,900],
        [460,930],
        [540,930],
        [540,750],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            const specialCasesObj = {
              "6,3": "♿",
              "6,2": "🚹",
              "5,7": "♿",
              "5,6": "🚹",
            };
            const specialCases = new Map(Object.entries(specialCasesObj));
            const baseString = `${String.fromCharCode(76 + index.row)}${
              index.col + 1
            }`;
            const key = `${index.row},${index.col}`;
            const prefix = specialCases.get(key) || "";

            return prefix + baseString;
          },
          rows: 7,
          columns: 10,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${col + 1}`;
              } else {
                return `${col + 1}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(76 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Orange",
              cssClass: "Orange",
            },
          },
          disabledSeats: [
            { row: 3, col: 9 },
            { row: 4, col: 9 },
            { row: 5, col: 9 },
            { row: 5, col: 8 },
            { row: 6, col: 9 },
            { row: 6, col: 8 },
            { row: 6, col: 7 },
            { row: 6, col: 6 },
            { row: 6, col: 5 },
          ],
        },
      },
      id: "15",
      title: "Section 104 Orange",
      shape: "poly",
      name: "Orange",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [770,750,770,920,850,920,850,900,890,900,890,880,900,880,900,820,910,820,910,750],
      polygon: [
        [770,750],
        [770,920],
        [850,920],
        [850,900],
        [890,900],
        [890,880],
        [900,880],
        [900,820],
        [910,820],
        [910,750],
      ],
    },

    // OUTSIDE SECTION
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 10) {
              return `${String.fromCharCode(65 + index.row)}${10 - index.col}`;
            } else {
              return `${String.fromCharCode(65 + index.row)}${10 - index.col}`;
            }
          },
          rows: 5,
          columns: 10,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${10 - col}`;
              } else {
                return `${10 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Green",
              cssClass: "Green",
            },
          },
          disabledSeats: [
            { row: 4, col: 9 },
            { row: 3, col: 9 },
          ],
        },
      },
      id: "16",
      title: "Section 202",
      shape: "poly",
      name: "Green",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [980,210,980,350,1090,350,1090,223,1050,223,1050,210],
      polygon: [
        [980,210],
        [980,350],
        [1090,350],
        [1090,223],
        [1050,223],
        [1050,210],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.row < 4) {
              return `${String.fromCharCode(65 + +index.row)}${4 - index.col}`;
            } else {
              return `${String.fromCharCode(65 + index.row)}${5 - index.col}`;
            }
          },
          rows: 5,
          columns: 5,
          indexerColumns: {
            visible: false,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${5 - col}`;
              } else {
                return `${5 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Green",
              cssClass: "Green",
            },
          },
          disabledSeats: [
            { row: 0, col: 4 },
            { row: 1, col: 4 },
            { row: 2, col: 4 },
            { row: 3, col: 4 },
          ],
        },
      },
      id: "17",
      title: "Section 203",
      shape: "poly",
      name: "Green",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [980,380,980,440,1090,440,1090,370,1070,370,1070,380],
      polygon: [
        [980,380],
        [980,440],
        [1090,440],
        [1090,370],
        [1070,370],
        [1070,380],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.row < 4) {
              return `${String.fromCharCode(65 + +index.row)}${5 - index.col}`;
            } else {
              return `${String.fromCharCode(65 + index.row)}${7 - index.col}`;
            }
          },
          rows: 5,
          columns: 7,
          indexerColumns: {
            visible: false,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${7 - col}`;
              } else {
                return `${7 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Green",
              cssClass: "Green",
            },
          },
          disabledSeats: [
            { row: 0, col: 6 },
            { row: 1, col: 6 },
            { row: 2, col: 6 },
            { row: 3, col: 6 },
            { row: 0, col: 5 },
            { row: 1, col: 5 },
            { row: 2, col: 5 },
            { row: 3, col: 5 },
          ],
        },
      },
      id: "18",
      title: "Section 204",
      shape: "poly",
      name: "Green",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [980,520,980,590,1090,590,1090,500,1070,500,1070,520],
      polygon: [
        [980,520],
        [980,590],
        [1090,590],
        [1090,500],
        [1070,500],
        [1070,520],
      ],
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.row < 4) {
              return `${String.fromCharCode(65 + +index.row)}${11 - index.col}`;
            } else {
              return `${String.fromCharCode(65 + index.row)}${13 - index.col}`;
            }
          },
          rows: 5,
          columns: 13,
          indexerColumns: {
            visible: false,
            label: (col: number, row: number) => {
              if (col + 1 < 10) {
                return `${13 - col}`;
              } else {
                return `${13 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Red",
              cssClass: "Red",
            },
          },
          disabledSeats: [
            { row: 0, col: 12 },
            { row: 0, col: 11 },
            { row: 1, col: 12 },
            { row: 1, col: 11 },
            { row: 2, col: 12 },
            { row: 2, col: 11 },
            { row: 3, col: 12 },
            { row: 3, col: 11 },
          ],
        },
      },
      id: "19",
      title: "Section 205",
      shape: "poly",
      name: "Red",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [990,640,990,780,1090,780,1090,620,1070,620,1070,640],
      polygon: [
        [990,640],
        [990,780],
        [1090,780],
        [1090,620],
        [1070,620],
        [1070,640]
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.row == 0) {
              return `${String.fromCharCode(65 + +index.row)}${8 - index.col}`;
            }
            if (index.row == 1) {
              return `${String.fromCharCode(65 + +index.row)}${9 - index.col}`;
            }
            if (index.row == 2) {
              return `${String.fromCharCode(65 + +index.row)}${11 - index.col}`;
            }
            if (index.row == 3) {
              return `${String.fromCharCode(65 + +index.row)}${12 - index.col}`;
            }
            if (index.row == 4) {
              return `${String.fromCharCode(65 + +index.row)}${14 - index.col}`;
            }
          },
          rows: 5,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${14 - col}`;
              } else {
                return `${14 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Orange",
              cssClass: "Orange",
            },
          },
          disabledSeats: [
            { row: 0, col: 8 },
            { row: 0, col: 9 },
            { row: 0, col: 10 },
            { row: 0, col: 11 },
            { row: 0, col: 12 },
            { row: 0, col: 13 },
            { row: 1, col: 9 },
            { row: 1, col: 10 },
            { row: 1, col: 11 },
            { row: 1, col: 12 },
            { row: 1, col: 13 },
            { row: 2, col: 11 },
            { row: 2, col: 12 },
            { row: 2, col: 13 },
            { row: 3, col: 12 },
            { row: 3, col: 13 },
          ],
        },
      },
      id: "20",
      title: "Section 206",
      shape: "poly",
      name: "Orange",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [940,910,1030,1010,1110,800,990,810],
      polygon: [
        [940,910],
        [1030,1010],
        [1110,800],
        [990,810],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.row == 0) {
              return `${String.fromCharCode(65 + +index.row)}${8 - index.col}`;
            }
            if (index.row == 1) {
              return `${String.fromCharCode(65 + +index.row)}${9 - index.col}`;
            }
            if (index.row == 2) {
              return `${String.fromCharCode(65 + +index.row)}${11 - index.col}`;
            }
            if (index.row == 3) {
              return `${String.fromCharCode(65 + +index.row)}${12 - index.col}`;
            }
            if (index.row == 4) {
              return `${String.fromCharCode(65 + +index.row)}${14 - index.col}`;
            }
          },
          rows: 5,
          columns: 14,
          indexerColumns: {
            visible: false,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${14 - col}`;
              } else {
                return `${14 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Orange",
              cssClass: "Orange",
            },
          },
          disabledSeats: [
            { row: 0, col: 8 },
            { row: 0, col: 9 },
            { row: 0, col: 10 },
            { row: 0, col: 11 },
            { row: 0, col: 12 },
            { row: 0, col: 13 },
            { row: 1, col: 9 },
            { row: 1, col: 10 },
            { row: 1, col: 11 },
            { row: 1, col: 12 },
            { row: 1, col: 13 },
            { row: 2, col: 11 },
            { row: 2, col: 12 },
            { row: 2, col: 13 },
            { row: 3, col: 12 },
            { row: 3, col: 13 },
          ],
        },
      },
      id: "21",
      title: "Section 207",
      shape: "poly",
      name: "Orange",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [820,960,820,1070,930,1050,1010,1010,930,920,880,950],
      polygon: [
        [820,960],
        [820,1070],
        [930,1050],
        [1010,1010],
        [930,920],
        [880,950],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.row < 4) {
              return `${String.fromCharCode(65 + +index.row)}${5 - index.col}`;
            } else {
              return `${String.fromCharCode(65 + index.row)}${7 - index.col}`;
            }
          },
          rows: 5,
          columns: 7,
          indexerColumns: {
            visible: false,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${7 - col}`;
              } else {
                return `${7 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Orange",
              cssClass: "Orange",
            },
          },
          disabledSeats: [
            { row: 0, col: 6 },
            { row: 0, col: 5 },
            { row: 1, col: 6 },
            { row: 1, col: 5 },
            { row: 2, col: 6 },
            { row: 2, col: 5 },
            { row: 3, col: 6 },
            { row: 3, col: 5 },
          ],
        },
      },
      id: "22",
      title: "Section 208",
      shape: "poly",
      name: "Orange",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [710,950,710,1070,810,1070,810,1050,780,1050,780,950],
      polygon: [
        [710,950],
        [710,1070],
        [810,1070],
        [810,1050],
        [780,1050],
        [780,950],
      ],
    },
    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 10) {
              return `${String.fromCharCode(65 + +index.row)}${7 - index.col}`;
            } else {
              return `${String.fromCharCode(65 + index.row)}${7 - index.col}`;
            }
          },
          rows: 5,
          columns: 7,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${7 - col}`;
              } else {
                return `${7 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Orange",
              cssClass: "Orange",
            },
          },
          disabledSeats: [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 3, col: 0 },
            { row: 3, col: 1 },
            { row: 3, col: 5 },
            { row: 3, col: 6 },
            { row: 4, col: 5 },
            { row: 4, col: 6 },
          ],
        },
      },
      id: "23",
      title: "Section 209",
      shape: "poly",
      name: "Orange",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [520,960,520,1040,500,1040,500,1070,570,1070,570,1020,600,1020,600,960],
      polygon: [
        [520,960],
        [520,1040],
        [500,1040],
        [500,1070],
        [570,1070],
        [570,1020],
        [600,1020],
        [600,960],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 10) {
              return `${String.fromCharCode(65 + +index.row)}${14 - index.col}`;
            } else {
              return `${String.fromCharCode(65 + index.row)}${14 - index.col}`;
            }
          },
          rows: 5,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${14 - col}`;
              } else {
                return `${14 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Orange",
              cssClass: "Orange",
            },
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
            { row: 3, col: 0 },
            { row: 3, col: 1 },
          ],
        },
      },
      id: "24",
      title: "Section 210",
      shape: "poly",
      name: "Orange",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [390,930,310,1010,360,1050,440,1070,490,1070,490,960,430,950],
      polygon: [
        [390,930],
        [310,1010],
        [360,1050],
        [440,1070],
        [490,1070],
        [490,960],
        [430,950],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 10) {
              return `${String.fromCharCode(65 + +index.row)}${16 - index.col}`;
            } else {
              return `${String.fromCharCode(65 + index.row)}${16 - index.col}`;
            }
          },
          rows: 5,
          columns: 16,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${16 - col}`;
              } else {
                return `${16 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Orange",
              cssClass: "Orange",
            },
          },
          disabledSeats: [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 0, col: 3 },
            { row: 0, col: 4 },
            { row: 0, col: 5 },
            { row: 0, col: 6 },
            { row: 0, col: 7 },
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 1, col: 3 },
            { row: 1, col: 4 },
            { row: 1, col: 5 },
            { row: 1, col: 6 },
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
            { row: 2, col: 3 },
            { row: 2, col: 4 },
            { row: 3, col: 0 },
            { row: 3, col: 1 },
            { row: 3, col: 2 },
            { row: 3, col: 3 },
          ],
        },
      },
      id: "25",
      title: "Section 211",
      shape: "poly",
      name: "Orange",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords:[
        215,790,220,870,250,950,290,990,370,910,315,820,280,830,280,815,240,820,230,790
      ],
      polygon: [
        [215,790],
        [220,870],
        [250,950],
        [290,990],
        [370,910],
        [315,820],
        [280,830],
        [280,815],
        [240,820],
        [230,790],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 10) {
              return `${String.fromCharCode(65 + +index.row)}${13 - index.col}`;
            } else {
              return `${String.fromCharCode(65 + index.row)}${13 - index.col}`;
            }
          },
          rows: 5,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${13 - col}`;
              } else {
                return `${13 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Red",
              cssClass: "Red",
            },
          },
          disabledSeats: [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 3, col: 0 },
            { row: 3, col: 1 },
          ],
        },
      },
      id: "26",
      title: "Section 212",
      shape: "poly",
      name: "Red",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [210,620,210,780,320,780,320,640,240,640,240,620],
      polygon: [
        [210,620],
        [210,780],
        [320,780],
        [320,640],
        [240,640],
        [240,620],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 10) {
              return `${String.fromCharCode(65 + +index.row)}${7 - index.col}`;
            } else {
              return `${String.fromCharCode(65 + index.row)}${7 - index.col}`;
            }
          },
          rows: 5,
          columns: 7,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${7 - col}`;
              } else {
                return `${7 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Green",
              cssClass: "Green",
            },
          },
          disabledSeats: [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 3, col: 0 },
            { row: 3, col: 1 },
          ],
        },
      },
      id: "27",
      title: "Section 213",
      shape: "poly",
      name: "Green",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [220,500,220,590,320,590,320,520,240,520,240,500],
      polygon: [
        [220,500],
        [220,590],
        [320,590],
        [320,520],
        [240,520],
        [240,500],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 10) {
              return `${String.fromCharCode(65 + +index.row)}${5 - index.col}`;
            } else {
              return `${String.fromCharCode(65 + index.row)}${5 - index.col}`;
            }
          },
          rows: 5,
          columns: 5,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${5 - col}`;
              } else {
                return `${5 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Green",
              cssClass: "Green",
            },
          },
          disabledSeats: [
            { row: 0, col: 0 },
            { row: 1, col: 0 },
            { row: 2, col: 0 },
            { row: 3, col: 0 },
          ],
        },
      },
      id: "28",
      title: "Section 214",
      shape: "poly",
      name: "Green",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [220,370,220,440,330,440,330,380,230,380,230,370],
      polygon: [
        [220,370],
        [220,440],
        [330,440],
        [330,380],
        [230,380],
        [230,370],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.col + 1 < 10) {
              return `${String.fromCharCode(65 + +index.row)}${10 - index.col}`;
            } else {
              return `${String.fromCharCode(65 + index.row)}${10 - index.col}`;
            }
          },
          rows: 5,
          columns: 10,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${10 - col}`;
              } else {
                return `${10 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Green",
              cssClass: "Green",
            },
          },
          disabledSeats: [
            { row: 3, col: 0 },
            { row: 4, col: 0 },
          ],
        },
      },
      id: "29",
      title: "Section 215",
      shape: "poly",
      name: "Green",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [220,230,220,350,320,350,320,210,260,210,260,230],
      polygon: [
        [220,230],
        [220,350],
        [320,350],
        [320,210],
        [260,210],
        [260,230],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            const specialCasesObj = {
              "7,8": "🚹",
              "7,9": "🚹",
              "8,3": "🚹",
              "8,4": "🦽",
              "8,5": "♿",
              "8,6": "♿",
              "8,7": "♿",
              "7,2": "🚹",
              
            };
            const specialCases = new Map(Object.entries(specialCasesObj));
            if (index.row >= 7) {
              const baseString = `${String.fromCharCode(72)}${10 - index.col}`;
              const key = `${index.row},${index.col}`;
              const prefix = specialCases.get(key) || "";

              return prefix + baseString;
            }
            const baseString = `${String.fromCharCode(65 + index.row)}${
              11 - index.col
            }`;
            const key = `${index.row},${index.col}`;
            const prefix = specialCases.get(key) || "";

            return prefix + baseString;
          },
          rows: 9,
          columns: 11,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${11 - col}`;
              } else {
                return `${11 - col}`;
              }
            },
          },
          indexerRows: {
            visible: false,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Green",
              cssClass: "Green",
            },
          },
          disabledSeats: [
            { row: 7, col: 0 },
            { row: 7, col: 3 },
            { row: 7, col: 4 },
            { row: 7, col: 9 },
            { row: 7, col: 8 },
            { row: 8, col: 7 },
            { row: 8, col: 6 },
            { row: 8, col: 5},
            { row: 7, col: 5 },
            { row: 7, col: 6 },
            { row: 7, col: 7 },
            { row: 7, col: 10 },
            { row: 8, col: 0 },
            { row: 8, col: 1 },
            { row: 8, col: 2 },
            { row: 8, col: 10 },
            { row: 8, col: 9 },
            { row: 8, col: 8 },
            { row: 4, col: 9 },
            { row: 4, col: 10 },
            { row: 5, col: 8 },
            { row: 5, col: 9 },
            { row: 5, col: 10 },
            { row: 6, col: 8 },
            { row: 6, col: 9 },
            { row: 6, col: 10 },
            { row: 6, col: 7 },           
          ],
        },
      },
      id: "30",
      title: "Section 302",
      shape: "poly",
      name: "Green",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [1150,190,1150,334,1300,335,1295,320,1316,320,
        1315,290,1326,290,1326,260,
        1290,260,1290,244,1270,244,
        1270,230,1250,230,1250,220,
        1230,220,1230,190],
      polygon: [
        [1150,190],
        [1150,334],
        [1300,335],[1295,320],
        [1316,320],[1315,290],
        [1326,290],[1326,260],
        [1290,260],[1290,244],
        [1270,244],[1270,230],
        [1250,230],[1250,220],
        [1230,220],[1230,190]
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            const specialCasesObj = {
              "7,8": "🚹",
              "7,9": "🚹",
              "8,3": "🚹",
              "8,4": "♿",
              "8,5": "♿",
              "8,6": "♿",
              "8,7": "🚹",
              "7,1": "🚹",
              "7,2": "🚹",
              
            };
            const specialCases = new Map(Object.entries(specialCasesObj));
            if (index.row >= 7) {
              const baseString = `${String.fromCharCode(72)}${10 - index.col}`;
              const key = `${index.row},${index.col}`;
              const prefix = specialCases.get(key) || "";

              return prefix + baseString;
            }
            const baseString = `${String.fromCharCode(65 + index.row)}${
              11 - index.col
            }`;
            const key = `${index.row},${index.col}`;
            const prefix = specialCases.get(key) || "";

            return prefix + baseString;
          },
          rows: 9,
          columns: 11,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${11 - col}`;
              } else {
                return `${11 - col}`;
              }
            },
          },
          indexerRows: {
            visible: false,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Orange",
              cssClass: "Orange",
            },
          },
          disabledSeats: [
            { row: 7, col: 0 },
            { row: 7, col: 10 },
            { row: 7, col: 3 },
            { row: 7, col: 4 },
            { row: 7, col: 5 },
            { row: 7, col: 6 },
            { row: 7, col: 7 },
            { row: 8, col: 0 },
            { row: 8, col: 1 },
            { row: 8, col: 2 },
            { row: 8, col: 8 },
            { row: 8, col: 9 },
            { row: 8, col: 10 },
          ],
        },
      },
      id: "31",
      title: "Section 303",
      shape: "poly",
      name: "Orange",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [1140,370,1140,510,1316,510,1315,480,1328,480,1328,405,1310,405,1310,370],
      polygon: [
        [1140,370],[1140,510],
        [1316,510],[1315,480],
        [1328,480],[1310,405],
        [1328,405],[1310,370],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            const specialCasesObj = {
              "7,1": "🚹",
              "7,2": "🚹",
              "7,4": "🦽",
              "7,3": "🦽",
              "7,5": "🦽",
              "7,6": "🦽",
              "7,7": "🚹",
              "7,8": "🚹",
            };
            const specialCases = new Map(Object.entries(specialCasesObj));
            if (index.row >= 7) {
              const baseString = `${String.fromCharCode(72)}${9 - index.col}`;
              const key = `${index.row},${index.col}`;
              const prefix = specialCases.get(key) || "";

              return prefix + baseString;
            }
            const baseString = `${String.fromCharCode(65 + index.row)}${
              11 - index.col
            }`;
            const key = `${index.row},${index.col}`;
            const prefix = specialCases.get(key) || "";

            return prefix + baseString;
          },
          rows: 8,
          columns: 11,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${11 - col}`;
              } else {
                return `${11 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Orange",
              cssClass: "Orange",
            },
          },
          disabledSeats: [
            { row: 7, col: 0 },
            { row: 7, col: 10 },
            { row: 7, col: 9 },
          ],
        },
      },
      id: "32",
      title: "Section 304",
      shape: "poly",
      name: "Orange",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [1145,534,1145,680,1316,680,1315,534],
      polygon: [
        [1145,534],
        [1145,680],
        [1316,680],
        [1315,534],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            const specialCasesObj = {
              "8,4": "🚹",
              "7,3": "🚹",
              "7,2": "🚹",
              "7,1": "🚹",
              "7,0": "🚹",
              "8,5": "♿",
              "8,6": "♿",
              "8,7": "♿",
              "8,8": "🚹",
              "7,9": "🚹",
              "7,10": "🚹",
              "7,11": "🚹",
              "7,12": "🚹",
            };
            const specialCases = new Map(Object.entries(specialCasesObj));
            if (index.row >= 7) {
              const baseString = `${String.fromCharCode(72)}${13 - index.col}`;
              const key = `${index.row},${index.col}`;
              const prefix = specialCases.get(key) || "";

              return prefix + baseString;
            }
            const baseString = `${String.fromCharCode(65 + index.row)}${
              13 - index.col
            }`;
            const key = `${index.row},${index.col}`;
            const prefix = specialCases.get(key) || "";

            return prefix + baseString;
          },
          rows: 9,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${13 - col}`;
              } else {
                return `${13 - col}`;
              }
            },
          },
          indexerRows: {
            visible: false,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Brown",
              cssClass: "Brown",
            },
          },
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
            { row: 2, col: 2 },
            { row: 3, col: 0 },
            { row: 3, col: 1 },
            { row: 4, col: 0 },
            { row: 5, col: 0 },
            { row: 7, col: 4 },
            { row: 7, col: 5 },
            { row: 7, col: 6 },
            { row: 7, col: 7 },
            { row: 7, col: 8 },
            { row: 8, col: 0 },
            { row: 8, col: 1 },
            { row: 8, col: 2 },
            { row: 8, col: 3 },
            { row: 8, col: 9 },
            { row: 8, col: 10 },
            { row: 8, col: 11 },
            { row: 8, col: 12 },
          ],
        },
      },
      id: "33",
      title: "Section 305",
      shape: "poly",
      name: "Brown",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [1140,716,1135,840,1286,910,1310,850,1324,845,1330,780,1310,780,1310,710],
      polygon: [
        [1140,716],[1135,840],
        [1286,910],[1310,850],
        [1324,845],[1330,780],
        [1310,780],[1310,710],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.row < 7) {
              return `${String.fromCharCode(65 + +index.row)}${14 - index.col}`;
            } else {
              return `${String.fromCharCode(72)}${14 - index.col}`;
            }
          },
          rows: 9,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${14 - col}`;
              } else {
                return `${14 - col}`;
              }
            },
          },
          indexerRows: {
            visible: false,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Brown",
              cssClass: "Brown",
            },
          },
          disabledSeats: [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 0, col: 3 },
            { row: 0, col: 4 },
            { row: 0, col: 5 },
            { row: 0, col: 6 },
            { row: 0, col: 7 },
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 1, col: 3 },
            { row: 1, col: 4 },
            { row: 1, col: 5 },
            { row: 1, col: 6 },
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
            { row: 2, col: 3 },
            { row: 2, col: 4 },
            { row: 2, col: 5 },
            { row: 3, col: 0 },
            { row: 3, col: 1 },
            { row: 3, col: 2 },
            { row: 3, col: 3 },
            { row: 4, col: 0 },
            { row: 4, col: 1 },
            { row: 4, col: 2 },
            { row: 5, col: 0 },
            { row: 5, col: 1 },
            { row: 6, col: 0 },
          ],
        },
      },
      id: "34",
      title: "Section 306",
      shape: "poly",
      name: "Brown",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [1075,1014,1170,1160,1244,1075,1280,990,1126,950],
      polygon: [
        [1075,1014],
        [1170,1160],
        [1244,1075],
        [1280,990],
        [1126,950],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            const specialCasesObj = {
              "7,12": "🚹",
              "7,11": "🚹",
              "7,10": "🚹",
              "8,9": "🚹",
              "8,8": "🚹",
              "8,7": "♿",
              "8,5": "♿",
              "8,6": "♿",
              "7,0": "🚹",
              "7,1": "🚹",
              "7,2": "🚹",
              "7,3": "🚹",
              "7,4": "🚹",
            };
            const specialCases = new Map(Object.entries(specialCasesObj));
            if (index.row >= 7) {
              const baseString = `${String.fromCharCode(72)}${13 - index.col}`;
              const key = `${index.row},${index.col}`;
              const prefix = specialCases.get(key) || "";

              return prefix + baseString;
            }
            const baseString = `${String.fromCharCode(65 + index.row)}${
              13 - index.col
            }`;
            const key = `${index.row},${index.col}`;
            const prefix = specialCases.get(key) || "";

            return prefix + baseString;
          },
          rows: 9,
          columns: 13,
          indexerColumns: {
            visible: false,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${9 - col}`;
              } else {
                return `${9 - col}`;
              }
            },
          },
          indexerRows: {
            visible: false,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Blue",
              cssClass: "Blue",
            },
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
            { row: 1, col: 3 },
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
            { row: 3, col: 0 },
            { row: 3, col: 1 },
            { row: 4, col: 0 },
            { row: 5, col: 0 },
            { row: 7, col: 5 },
            { row: 7, col: 6 },
            { row: 7, col: 7 },
            { row: 7, col: 8 },
            { row: 7, col: 9 },
            { row: 8, col: 0 },
            { row: 8, col: 1 },
            { row: 8, col: 2 },
            { row: 8, col: 3 },
            { row: 8, col: 4 },
            { row: 8, col: 10 },
            { row: 8, col: 11 },
            { row: 8, col: 12 },
          ],
        },
      },
      id: "35",
      title: "Section 307",
      shape: "poly",
      name: "Blue",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [870,1100,880,1300,960,1285,964,1300,1040,1280,1030,1260,1070,1240,974,1080],
      polygon: [
        [870,1100],[880,1300],
        [860,1285],[964,1300],
        [1040,1280],[1030,1260],
        [1080,1240],[974,109],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            const specialCasesObj = {
              "7,11": "🚹",
              "7,10": "🚹",
              "7,9": "🚹",
              "8,8": "🚹",
              "8,7": "♿",
              "8,5": "♿",
              "8,6": "♿",
              "8,4": "🚹",
              "7,1": "🚹",
              "7,2": "🚹",
              "7,3": "🚹",
            };
            const specialCases = new Map(Object.entries(specialCasesObj));
            if (index.row >= 7) {
              const baseString = `${String.fromCharCode(72)}${12 - index.col}`;
              const key = `${index.row},${index.col}`;
              const prefix = specialCases.get(key) || "";

              return prefix + baseString;
            }
            const baseString = `${String.fromCharCode(65 + index.row)}${
              12 - index.col
            }`;
            const key = `${index.row},${index.col}`;
            const prefix = specialCases.get(key) || "";

            return prefix + baseString;
          },
          rows: 9,
          columns: 12,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${12 - col}`;
              } else {
                return `${12 - col}`;
              }
            },
          },
          indexerRows: {
            visible: false,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Blue",
              cssClass: "Blue",
            },
          },
          disabledSeats: [
            { row: 7, col: 0 },
            { row: 7, col: 5 },
            { row: 7, col: 6 },
            { row: 7, col: 7 },
            { row: 7, col: 8 },
            { row: 8, col: 9 },
            { row: 7, col: 4 },
            { row: 8, col: 0 },
            { row: 8, col: 1 },
            { row: 8, col: 2 },
            { row: 8, col: 3 },
            { row: 8, col: 10 },
            { row: 8, col: 11 },
            { row: 8, col: 12 },
          ],
        },
      },
      id: "36",
      title: "Section 308",
      shape: "poly",
      name: "Blue",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [550,1130,545,1310,590,1310,590,1330,670,1330,670,1320,710,1320,700,1130],
      polygon: [
        [550,1130],[545,1310],
        [590,1310],[590,1330],
        [670,1330],[670,1320],
        [710,1320],[700,1130],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            const specialCasesObj = {
              "7,12": "🚹",
              "7,11": "🚹",
              "7,10": "🚹",
              "7,9": "🚹",
              "8,8": "🚹",
              "8,7": "♿",
              "8,5": "♿",
              "8,6": "♿",
              "8,4": "🚹",
              "7,0": "🚹",
              "7,1": "🚹",
              "7,2": "🚹",
              "7,3": "🚹",
            };
            const specialCases = new Map(Object.entries(specialCasesObj));
            if (index.row >= 7) {
              const baseString = `${String.fromCharCode(72)}${13 - index.col}`;
              const key = `${index.row},${index.col}`;
              const prefix = specialCases.get(key) || "";

              return prefix + baseString;
            }
            const baseString = `${String.fromCharCode(65 + index.row)}${
              13 - index.col
            }`;
            const key = `${index.row},${index.col}`;
            const prefix = specialCases.get(key) || "";

            return prefix + baseString;
          },
          rows: 9,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${13 - col}`;
              } else {
                return `${13 - col}`;
              }
            },
          },
          indexerRows: {
            visible: false,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Blue",
              cssClass: "Blue",
            },
          },
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
            { row: 2, col: 2 },
            { row: 3, col: 0 },
            { row: 3, col: 1 },
            { row: 4, col: 0 },
            { row: 5, col: 0 },
            { row: 7, col: 4 },
            { row: 7, col: 5 },
            { row: 7, col: 6 },
            { row: 7, col: 7 },
            { row: 7, col: 8 },
            { row: 8, col: 0 },
            { row: 8, col: 1 },
            { row: 8, col: 2 },
            { row: 8, col: 3 },
            { row: 8, col: 9 },
            { row: 8, col: 10 },
            { row: 8, col: 11 },
            { row: 8, col: 12 },
          ],
        },
      },
      id: "37",
      title: "Section 309",
      shape: "poly",
      name: "Blue",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [340,1095,240,1220,290,1254,280,1270,354,1295,360,1280,414,1290,450,1130],
      polygon: [
        [340,1095],[240,1220],
        [290,1254],[280,1270],
        [354,1295],[360,1280],
        [414,1290],[450,1130],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            if (index.row < 7) {
              return `${String.fromCharCode(65 + +index.row)}${14 - index.col}`;
            } else {
              return `${String.fromCharCode(72)}${14 - index.col}`;
            }
          },
          rows: 8,
          columns: 14,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${14 - col}`;
              } else {
                return `${14 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Brown",
              cssClass: "Brown",
            },
          },
          disabledSeats: [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 0, col: 3 },
            { row: 0, col: 4 },
            { row: 0, col: 5 },
            { row: 0, col: 6 },
            { row: 0, col: 7 },
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 1, col: 3 },
            { row: 1, col: 4 },
            { row: 1, col: 5 },
            { row: 1, col: 6 },
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
            { row: 2, col: 3 },
            { row: 2, col: 4 },
            { row: 2, col: 5 },
            { row: 3, col: 0 },
            { row: 3, col: 1 },
            { row: 3, col: 2 },
            { row: 3, col: 3 },
            { row: 4, col: 0 },
            { row: 4, col: 1 },
            { row: 4, col: 2 },
            { row: 5, col: 0 },
            { row: 5, col: 1 },
            { row: 6, col: 0 },
          ],
        },
      },
      id: "38",
      title: "Section 310",
      shape: "poly",
      name: "Brown",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [50,1005,95,1095,160,1154,260,1020,210,964,160,984,150,970],
      polygon: [
        [50,1005],[95,1095],
        [160,1154],[260,1020],
        [210,964],[160,984],
        [150,970],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            const specialCasesObj = {
              "7,12": "🚹",
              "7,11": "🚹",
              "7,10": "🚹",
              "7,9": "🚹",
              "8,7": "♿",
              "8,5": "♿",
              "8,6": "♿",
              "8,4": "🚹",
              "7,0": "🚹",
              "7,1": "🚹",
              "7,2": "🚹",
              "7,3": "🚹",
            };
            const specialCases = new Map(Object.entries(specialCasesObj));
            if (index.row >= 7) {
              const baseString = `${String.fromCharCode(72)}${13 - index.col}`;
              const key = `${index.row},${index.col}`;
              const prefix = specialCases.get(key) || "";

              return prefix + baseString;
            }
            const baseString = `${String.fromCharCode(65 + index.row)}${
              13 - index.col
            }`;
            const key = `${index.row},${index.col}`;
            const prefix = specialCases.get(key) || "";

            return prefix + baseString;
          },
          rows: 9,
          columns: 13,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${13 - col}`;
              } else {
                return `${13 - col}`;
              }
            },
          },
          indexerRows: {
            visible: false,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Brown",
              cssClass: "Brown",
            },
          },
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
            { row: 3, col: 1 },
            { row: 3, col: 2 },
            { row: 4, col: 0 },
            { row: 7, col: 4 },
            { row: 7, col: 5 },
            { row: 7, col: 6 },
            { row: 7, col: 7 },
            { row: 7, col: 8 },
            { row: 8, col: 0 },
            { row: 8, col: 1 },
            { row: 8, col: 2 },
            { row: 8, col: 3 },
            { row: 8, col: 9 },
            { row: 8, col: 10 },
            { row: 8, col: 11 },
            { row: 8, col: 12 },
          ],
        },
      },
      id: "39",
      title: "Section 311",
      shape: "poly",
      name: "Brown",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [15,754,15,820,0,820,10,894,25,890,50,950,200,870,185,830,185,760],
      polygon: [
        [15,754],[15,820],
        [0,820],[10,894],
        [25,890],[50,950],
        [200,870],[185,830],
        [185,760],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            const specialCasesObj = {
              "7,1": "🚹",
              "7,2": "🚹",
              "7,3": "🦽",
              "7,4": "🦽",
              "7,5": "🦽",
              "7,6": "🦽",
              "7,7": "🚹",
              "7,8": "🚹",
            };
            const specialCases = new Map(Object.entries(specialCasesObj));
            if (index.row < 7) {
              const baseString = `${String.fromCharCode(65 + index.row)}${
                11 - index.col
              }`;
              const key = `${index.row},${index.col}`;
              const prefix = specialCases.get(key) || "";

              return prefix + baseString;
            }
            if (index.row == 7) {
              const baseString = `${String.fromCharCode(72)}${9 - index.col}`;
              const key = `${index.row},${index.col}`;
              const prefix = specialCases.get(key) || "";

              return prefix + baseString;
            }
            const baseString = `${String.fromCharCode(65 + index.row)}${
              11 - index.col
            }`;
            const key = `${index.row},${index.col}`;
            const prefix = specialCases.get(key) || "";

            return prefix + baseString;
          },
          rows: 8,
          columns: 11,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${11 - col}`;
              } else {
                return `${11 - col}`;
              }
            },
          },
          indexerRows: {
            visible: true,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Orange",
              cssClass: "Orange",
            },
          },
          disabledSeats: [
            { row: 7, col: 0 },
            { row: 7, col: 9 },
            { row: 7, col: 10 },
          ],
        },
      },
      id: "40",
      title: "Section 312",
      shape: "poly",
      name: "Orange",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [16,550,15,665,30,665,30,680,180,680,180,540,30,540,30,550],
      polygon: [
        [16,550],[15,665],
        [30,665],[30,680],
        [180,680],[180,540],
        [30,540],[30,550],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            const specialCasesObj = {
              "7,8": "🚹",
              "7,9": "🚹",
              "8,3": "🚹",
              "8,4": "♿",
              "8,5": "♿",
              "8,6": "♿",
              "8,7": "🚹",
              "7,1": "🚹",
              "7,2": "🚹",
            };
            const specialCases = new Map(Object.entries(specialCasesObj));
            if (index.row >= 7) {
              const baseString = `${String.fromCharCode(72)}${10 - index.col}`;
              const key = `${index.row},${index.col}`;
              const prefix = specialCases.get(key) || "";

              return prefix + baseString;
            }
            const baseString = `${String.fromCharCode(65 + index.row)}${
              11 - index.col
            }`;
            const key = `${index.row},${index.col}`;
            const prefix = specialCases.get(key) || "";

            return prefix + baseString;
          },
          rows: 9,
          columns: 11,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${11 - col}`;
              } else {
                return `${11 - col}`;
              }
            },
          },
          indexerRows: {
            visible: false,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Orange",
              cssClass: "Orange",
            },
          },
          disabledSeats: [
            { row: 7, col: 0 },
            { row: 7, col: 3 },
            { row: 7, col: 4 },
            { row: 7, col: 5 },
            { row: 7, col: 6 },
            { row: 7, col: 7 },
            { row: 7, col: 10 },
            { row: 8, col: 0 },
            { row: 8, col: 1 },
            { row: 8, col: 2 },
            { row: 8, col: 8 },
            { row: 8, col: 9 },
            { row: 8, col: 10 },
          ],
        },
      },
      id: "41",
      title: "Section 313",
      shape: "poly",
      name: "Orange",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [15,369,15,400,0,400,0,475,15,475,15,504,180,504,178,369],
      polygon: [
        [15,369],[15,400],
        [0,400],[0,475],
        [15,475],[15,504],
        [180,504],[178,369],
      ],
    },

    {
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          seatLabel: (index: SeatIndex) => {
            const specialCasesObj = {
              "7,8": "🚹",
              "7,9": "🚹",
              "8,6": "🦽",
              "8,7": "🦽",
            };
            const specialCases = new Map(Object.entries(specialCasesObj));
            if (index.row >= 7) {
              const baseString = `${String.fromCharCode(72)}${10 - index.col}`;
              const key = `${index.row},${index.col}`;
              const prefix = specialCases.get(key) || "";

              return prefix + baseString;
            }
            const baseString = `${String.fromCharCode(65 + index.row)}${
              11 - index.col
            }`;
            const key = `${index.row},${index.col}`;
            const prefix = specialCases.get(key) || "";

            return prefix + baseString;
          },
          rows: 9,
          columns: 11,
          indexerColumns: {
            visible: true,
            label: (col: number) => {
              if (col + 1 < 10) {
                return `${11 - col}`;
              } else {
                return `${11 - col}`;
              }
            },
          },
          indexerRows: {
            visible: false,
            label: (row: number) => `${String.fromCharCode(65 + row)}`,
          },
          seatTypes: {
            default: {
              label: "Green",
              cssClass: "Green",
            },
          },
          disabledSeats: [
            { row: 4, col: 0 },
            { row: 4, col: 1 },
            { row: 5, col: 0 },
            { row: 5, col: 1 },
            { row: 5, col: 2 },
            { row: 6, col: 0 },
            { row: 6, col: 0 },
            { row: 6, col: 1 },
            { row: 6, col: 2 },
            { row: 7, col: 0 },
            { row: 7, col: 1 },
            { row: 7, col: 2 },
            { row: 7, col: 3 },
            { row: 7, col: 4 },
            { row: 7, col: 5 },
            { row: 7, col: 6 },
            { row: 7, col: 7 },
            { row: 7, col: 10 },
            { row: 8, col: 0 },
            { row: 8, col: 1 },
            { row: 8, col: 2 },
            { row: 8, col: 3 },
            { row: 8, col: 4 },
            { row: 8, col: 5 },
            { row: 8, col: 8 },
            { row: 8, col: 9 },
            { row: 8, col: 10 },
            { row: 6, col: 3 },
          ],
        },
      },
      id: "42",
      title: "Section 314",
      shape: "poly",
      name: "Green",
      fillColor: "#eab54d4d",
      strokeColor: "#f54242",
      coords: [100,200,100,220,76,220,75,236,55,236,55,250,40,250,40,265,6,265,6,300,13,300,15,
        330,40,340,180,340,180,200],
      polygon: [
        [100,200],[100,220],
        [76,220],[75,236],
        [55,236],[55,250],
        [40,250],[40,265],
        [6,265],[6,300],
        [13,340],[15,340],
        [40,340],
        [180,340],[180,200],
      ],
    },
  ],
});

export default getDefaultMap;
