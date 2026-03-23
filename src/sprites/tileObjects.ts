import type { SpriteFrame } from "../utils/types";

// Floor 1 theme colors (for floor base under objects)
const F1 = "#4a5944";
const F2 = "#3d4c38";
const F3 = "#566b4e";

// Stairs colors
const SD = "#1a1a1a"; // dark center
const SM = "#2a2a2a"; // mid dark
const SL = "#3a3a3a"; // lighter step edge

// Chest colors
const WD = "#8B4513"; // wood primary
const WK = "#6B3410"; // wood dark
const GD = "#FFD700"; // gold
const GA = "#DAA520"; // gold aged

// Shrine colors
const S1 = "#666666"; // stone primary
const S2 = "#555555"; // stone dark
const S3 = "#777777"; // stone highlight
const B1 = "#4488ff"; // blue glow
const B2 = "#6699ff"; // blue glow bright

// Bookshelf colors
const SH = "#5C3A1E"; // shelf wood
const SK = "#4A2A10"; // shelf dark
const RD = "#CC3333"; // red book
const BK = "#3366CC"; // blue book
const GN = "#33CC66"; // green book
const YL = "#CCCC33"; // yellow book

// Coffee machine colors
const M1 = "#888888"; // machine body
const M2 = "#666666"; // machine dark
const M3 = "#999999"; // machine highlight
const CP = "#DDDDDD"; // cup
const CF = "#4A2F1E"; // coffee
const ST = "#CCCCCC"; // steam

// Shop counter colors
const SC = "#8B4513"; // counter wood
const SD2 = "#6B3410"; // counter dark

// Stairs down: stone floor with downward spiral icon
export const stairsDown: SpriteFrame = [
  [F1, F1, F1, F1, F2, F2, F2, F2, F2, F2, F2, F2, F1, F1, F1, F1],
  [F1, F1, F1, F2, SM, SM, SM, SM, SM, SM, SM, SM, F2, F1, F1, F1],
  [F1, F1, F2, SM, SM, SL, SL, SL, SL, SL, SL, SM, SM, F2, F1, F1],
  [F1, F2, SM, SL, SL, F1, F1, F1, F1, F1, SL, SL, SM, F2, F1, F1],
  [F2, SM, SL, F1, F1, F1, F1, F1, F1, SL, SL, SM, SM, SM, F2, F1],
  [F2, SM, SL, F1, F1, SM, SM, SM, SL, SL, SM, SM, SD, SM, F2, F1],
  [F2, SM, SL, F1, SM, SM, SD, SM, SM, SL, SM, SD, SD, SM, F2, F1],
  [F2, SM, SL, F1, SM, SD, SD, SD, SM, SL, SD, SD, SD, SM, F2, F1],
  [F2, SM, SL, F1, SM, SD, SD, SD, SM, SD, SD, SD, SM, SM, F2, F1],
  [F2, SM, SL, F1, SM, SM, SD, SM, SM, SD, SD, SM, SM, SM, F2, F1],
  [F2, SM, SL, F1, F1, SM, SM, SM, SD, SD, SM, SM, F1, SM, F2, F1],
  [F1, F2, SM, SL, F1, F1, F1, SD, SD, SM, SM, F1, F1, F2, F1, F1],
  [F1, F1, F2, SM, SL, SL, SD, SD, SM, SM, F1, F1, F2, F1, F1, F1],
  [F1, F1, F1, F2, SM, SM, SD, SM, SM, F1, F1, F2, F1, F1, F1, F1],
  [F1, F1, F1, F1, F2, F2, SM, F2, F2, F2, F2, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F2, F1, F1, F1, F1, F1, F1, F1, F1, F1],
];

// Chest closed: wooden chest with gold clasp
export const chestClosed: SpriteFrame = [
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, WK, WK, WK, WK, WK, WK, WK, WK, WK, WK, F1, F1, F1],
  [F1, F1, WK, WD, WD, WD, WD, WD, WD, WD, WD, WD, WD, WK, F1, F1],
  [F1, F1, WK, WD, WD, WD, WD, GD, GD, WD, WD, WD, WD, WK, F1, F1],
  [F1, F1, WK, WK, WK, WK, WK, GA, GA, WK, WK, WK, WK, WK, F1, F1],
  [F1, F1, WK, WD, WD, WD, WD, GD, GD, WD, WD, WD, WD, WK, F1, F1],
  [F1, F1, WK, WD, WK, WD, WD, GA, GA, WD, WD, WK, WD, WK, F1, F1],
  [F1, F1, WK, WD, WK, WD, WD, WD, WD, WD, WD, WK, WD, WK, F1, F1],
  [F1, F1, WK, WD, WK, WD, WD, WD, WD, WD, WD, WK, WD, WK, F1, F1],
  [F1, F1, WK, WK, WK, WK, WK, WK, WK, WK, WK, WK, WK, WK, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
];

// Chest open: lid up with sparkle pixel
export const chestOpen: SpriteFrame = [
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, "#ffffff", F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, WK, WK, WK, WK, WK, WK, WK, WK, WK, WK, F1, F1, F1],
  [F1, F1, WK, WD, WD, WD, WD, WD, WD, WD, WD, WD, WD, WK, F1, F1],
  [F1, F1, WK, WD, WD, WD, WD, GD, GD, WD, WD, WD, WD, WK, F1, F1],
  [F1, F1, WK, WK, WK, WK, WK, WK, WK, WK, WK, WK, WK, WK, F1, F1],
  [
    F1,
    F1,
    WK,
    "#1a1a1a",
    "#1a1a1a",
    "#1a1a1a",
    GD,
    GD,
    GD,
    "#1a1a1a",
    "#1a1a1a",
    "#1a1a1a",
    "#1a1a1a",
    WK,
    F1,
    F1,
  ],
  [
    F1,
    F1,
    WK,
    "#1a1a1a",
    "#ffffff",
    "#1a1a1a",
    GA,
    "#1a1a1a",
    GA,
    "#1a1a1a",
    "#ffffff",
    "#1a1a1a",
    "#1a1a1a",
    WK,
    F1,
    F1,
  ],
  [
    F1,
    F1,
    WK,
    "#1a1a1a",
    "#1a1a1a",
    "#1a1a1a",
    "#1a1a1a",
    GD,
    "#1a1a1a",
    "#1a1a1a",
    "#1a1a1a",
    "#1a1a1a",
    "#1a1a1a",
    WK,
    F1,
    F1,
  ],
  [F1, F1, WK, WD, WK, WD, WD, "#1a1a1a", WD, WD, WD, WK, WD, WK, F1, F1],
  [F1, F1, WK, WD, WK, WD, WD, WD, WD, WD, WD, WK, WD, WK, F1, F1],
  [F1, F1, WK, WD, WK, WD, WD, WD, WD, WD, WD, WK, WD, WK, F1, F1],
  [F1, F1, WK, WK, WK, WK, WK, WK, WK, WK, WK, WK, WK, WK, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
];

// Shrine: stone altar with blue glow
export const shrine: SpriteFrame = [
  [F1, F1, F1, F1, F1, F1, F1, B2, B2, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, B2, B1, B1, B2, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, B2, B1, B1, B1, B1, B2, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, B2, B1, B1, B2, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, B2, B2, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, S3, S3, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, S3, S3, S3, S1, S1, S3, S3, S3, F1, F1, F1, F1],
  [F1, F1, F1, S3, S1, S1, S1, S1, S1, S1, S1, S1, S3, F1, F1, F1],
  [F1, F1, F1, S1, S1, S2, S1, S1, S1, S1, S2, S1, S1, F1, F1, F1],
  [F1, F1, F1, S1, S2, S2, S2, S1, S1, S2, S2, S2, S1, F1, F1, F1],
  [F1, F1, F1, S3, S1, S1, S1, S1, S1, S1, S1, S1, S3, F1, F1, F1],
  [F1, F1, S3, S1, S1, S1, S1, S1, S1, S1, S1, S1, S1, S3, F1, F1],
  [F1, F1, S1, S1, S2, S1, S1, S1, S1, S1, S1, S2, S1, S1, F1, F1],
  [F1, F1, S1, S2, S2, S2, S1, S1, S1, S1, S2, S2, S2, S1, F1, F1],
  [F1, F1, S1, S1, S1, S1, S1, S1, S1, S1, S1, S1, S1, S1, F1, F1],
  [F1, F2, S2, S2, S2, S2, S2, S2, S2, S2, S2, S2, S2, S2, F2, F1],
];

// Bookshelf: tall shelf with colored book spines
export const bookshelf: SpriteFrame = [
  [F1, F1, SH, SH, SH, SH, SH, SH, SH, SH, SH, SH, SH, SH, F1, F1],
  [F1, F1, SH, RD, RD, BK, GN, YL, RD, BK, BK, GN, YL, SH, F1, F1],
  [F1, F1, SH, RD, RD, BK, GN, YL, RD, BK, BK, GN, YL, SH, F1, F1],
  [F1, F1, SH, RD, RD, BK, GN, YL, RD, BK, BK, GN, YL, SH, F1, F1],
  [F1, F1, SH, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SH, F1, F1],
  [F1, F1, SH, BK, GN, RD, YL, BK, GN, RD, YL, RD, BK, SH, F1, F1],
  [F1, F1, SH, BK, GN, RD, YL, BK, GN, RD, YL, RD, BK, SH, F1, F1],
  [F1, F1, SH, BK, GN, RD, YL, BK, GN, RD, YL, RD, BK, SH, F1, F1],
  [F1, F1, SH, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SH, F1, F1],
  [F1, F1, SH, YL, RD, GN, BK, RD, YL, GN, BK, YL, RD, SH, F1, F1],
  [F1, F1, SH, YL, RD, GN, BK, RD, YL, GN, BK, YL, RD, SH, F1, F1],
  [F1, F1, SH, YL, RD, GN, BK, RD, YL, GN, BK, YL, RD, SH, F1, F1],
  [F1, F1, SH, SK, SK, SK, SK, SK, SK, SK, SK, SK, SK, SH, F1, F1],
  [F1, F1, SH, SH, SH, SH, SH, SH, SH, SH, SH, SH, SH, SH, F1, F1],
  [F1, F1, SH, SK, F1, F1, F1, F1, F1, F1, F1, F1, SK, SH, F1, F1],
  [F1, F1, SH, SK, F1, F1, F1, F1, F1, F1, F1, F1, SK, SH, F1, F1],
];

// Coffee machine: modern machine with steam
export const coffeeMachine: SpriteFrame = [
  [F1, F1, F1, F1, F1, F1, F1, ST, F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, ST, F1, ST, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, ST, F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, M3, M3, M3, M3, M3, M3, M3, M3, F1, F1, F1, F1],
  [F1, F1, F1, F1, M1, M1, M1, M1, M1, M1, M1, M1, F1, F1, F1, F1],
  [F1, F1, F1, F1, M1, M2, M2, M1, M1, M2, M2, M1, F1, F1, F1, F1],
  [
    F1,
    F1,
    F1,
    F1,
    M1,
    M2,
    "#44aa44",
    M1,
    M1,
    M2,
    "#cc3333",
    M1,
    F1,
    F1,
    F1,
    F1,
  ],
  [F1, F1, F1, F1, M1, M2, M2, M1, M1, M2, M2, M1, F1, F1, F1, F1],
  [F1, F1, F1, F1, M1, M1, M1, M1, M1, M1, M1, M1, F1, F1, F1, F1],
  [F1, F1, F1, F1, M2, M2, M2, M2, M2, M2, M2, M2, F1, F1, F1, F1],
  [F1, F1, F1, F1, M1, F1, CP, CP, CP, F1, F1, M1, F1, F1, F1, F1],
  [F1, F1, F1, F1, M1, F1, CP, CF, CP, F1, F1, M1, F1, F1, F1, F1],
  [F1, F1, F1, F1, M1, F1, CP, CF, CP, CP, F1, M1, F1, F1, F1, F1],
  [F1, F1, F1, F1, M2, M2, M2, M2, M2, M2, M2, M2, F1, F1, F1, F1],
  [F1, F1, F1, F1, M2, F1, F1, F1, F1, F1, F1, M2, F1, F1, F1, F1],
  [F1, F1, F1, F1, M2, F1, F1, F1, F1, F1, F1, M2, F1, F1, F1, F1],
];

// NPC marker: glowing question mark above floor tile
const QM = "#FFD700"; // question mark yellow
const QG = "#FFEE88"; // question mark glow

export const npcMarker: SpriteFrame = [
  [F1, F1, F1, F1, F1, F1, QG, QG, QG, QG, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, QG, QM, QM, QM, QM, QG, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, QG, QM, QM, QG, QG, QM, QM, QG, F1, F1, F1, F1],
  [F1, F1, F1, F1, QG, QM, QM, QG, QG, QM, QM, QG, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, QG, QG, F1, QG, QM, QM, QG, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, QG, QM, QM, QG, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, QG, QM, QM, QG, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, QG, QM, QM, QG, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, QG, QM, QM, QG, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, QG, QG, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, QG, QM, QM, QG, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, QG, QM, QM, QG, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, QG, QG, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F3, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F3, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
];

// Shop counter: wooden counter with small items displayed
const IT1 = "#cc3333"; // potion red
const IT2 = "#3366cc"; // scroll blue
const IT3 = "#33cc66"; // herb green

export const shopCounter: SpriteFrame = [
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, IT1, F1, IT2, IT2, F1, IT3, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, IT1, IT1, F1, IT2, IT2, F1, IT3, IT3, F1, F1, F1, F1],
  [F1, SC, SC, SC, SC, SC, SC, SC, SC, SC, SC, SC, SC, SC, SC, F1],
  [F1, SC, WD, WD, WD, WD, WD, WD, WD, WD, WD, WD, WD, WD, SC, F1],
  [F1, SC, WD, WD, WD, WD, WD, WD, WD, WD, WD, WD, WD, WD, SC, F1],
  [F1, SC, WD, WK, WD, WD, WK, WD, WD, WK, WD, WD, WK, WD, SC, F1],
  [F1, SC, WD, WK, WD, WD, WK, WD, WD, WK, WD, WD, WK, WD, SC, F1],
  [F1, SC, WD, WK, WD, WD, WK, WD, WD, WK, WD, WD, WK, WD, SC, F1],
  [F1, SC, WD, WK, WD, WD, WK, WD, WD, WK, WD, WD, WK, WD, SC, F1],
  [
    F1,
    SD2,
    SD2,
    SD2,
    SD2,
    SD2,
    SD2,
    SD2,
    SD2,
    SD2,
    SD2,
    SD2,
    SD2,
    SD2,
    SD2,
    F1,
  ],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
  [F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1, F1],
];

// Debt Collector tile — briefcase shape with coin symbol
// Colors: gold coin, dark suit
const DC = "#FFD700"; // coin gold
const DK = "#B8860B"; // coin dark
const DS = "#1a1a2e"; // suit dark
const DL = "#2a2a4e"; // suit mid

export const debtCollector: SpriteFrame = [
  [F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2],
  [F2, DS, DS, DS, DS, DS, DS, DS, DS, DS, DS, DS, DS, DS, DS, F2],
  [F2, DS, DL, DL, DL, DL, DL, DL, DL, DL, DL, DL, DL, DL, DS, F2],
  [F2, DS, DL, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, DL, DS, F2],
  [F2, DS, DL, F2, DC, DC, DK, F2, F2, DC, DC, DK, F2, DL, DS, F2],
  [F2, DS, DL, F2, DC, F2, DK, F2, F2, DC, F2, DK, F2, DL, DS, F2],
  [F2, DS, DL, F2, DC, DK, DK, F2, F2, DC, DK, DK, F2, DL, DS, F2],
  [F2, DS, DL, F2, F2, F2, F2, DC, DK, F2, F2, F2, F2, DL, DS, F2],
  [F2, DS, DL, F2, F2, F2, F2, DC, DK, F2, F2, F2, F2, DL, DS, F2],
  [F2, DS, DL, F2, F2, DC, DC, DK, DK, DC, DC, F2, F2, DL, DS, F2],
  [F2, DS, DL, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, DL, DS, F2],
  [F2, DS, DL, DL, DL, DL, DL, DL, DL, DL, DL, DL, DL, DL, DS, F2],
  [F2, DS, DS, DS, DS, DS, DS, DS, DS, DS, DS, DS, DS, DS, DS, F2],
  [F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2],
  [F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2],
  [F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2],
];

// Pair Programmer tile — two silhouettes side by side
const PP1 = "#60a5fa"; // blue hoodie (player color)
const PP2 = "#34d399"; // green hoodie (partner)
const PPH = "#f3d9bc"; // skin

export const pairProgrammer: SpriteFrame = [
  [F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2],
  [F2, F2, PPH, PPH, F2, F2, F2, F2, F2, F2, PPH, PPH, F2, F2, F2, F2],
  [F2, PPH, PPH, PPH, PPH, F2, F2, F2, F2, PPH, PPH, PPH, PPH, F2, F2, F2],
  [F2, PPH, PPH, PPH, PPH, F2, F2, F2, F2, PPH, PPH, PPH, PPH, F2, F2, F2],
  [F2, F2, PPH, PPH, F2, F2, F2, F2, F2, F2, PPH, PPH, F2, F2, F2, F2],
  [F2, PP1, PP1, PP1, PP1, PP1, F2, F2, PP2, PP2, PP2, PP2, PP2, F2, F2, F2],
  [F2, PP1, PP1, PP1, PP1, PP1, F2, F2, PP2, PP2, PP2, PP2, PP2, F2, F2, F2],
  [F2, PP1, PP1, PP1, PP1, PP1, F2, F2, PP2, PP2, PP2, PP2, PP2, F2, F2, F2],
  [F2, PP1, PP1, PP1, PP1, PP1, F2, F2, PP2, PP2, PP2, PP2, PP2, F2, F2, F2],
  [F2, F2, PP1, PP1, F2, PP1, F2, F2, F2, PP2, PP2, F2, PP2, F2, F2, F2],
  [F2, F2, PP1, PP1, F2, PP1, F2, F2, F2, PP2, PP2, F2, PP2, F2, F2, F2],
  [F2, F2, PP1, PP1, F2, PP1, F2, F2, F2, PP2, PP2, F2, PP2, F2, F2, F2],
  [F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2],
  [F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2],
  [F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2],
  [F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2],
];

// Legacy Documentation tile — scroll/document shape
const LC = "#f5e6c3"; // parchment
const LD = "#d4b483"; // parchment dark
const LR = "#8B4513"; // roll edge
const LT = "#333333"; // text lines

export const legacyDocs: SpriteFrame = [
  [F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2],
  [F2, F2, LR, LR, LR, LR, LR, LR, LR, LR, LR, LR, LR, LR, F2, F2],
  [F2, LR, LC, LC, LC, LC, LC, LC, LC, LC, LC, LC, LC, LC, LR, F2],
  [F2, LR, LC, LD, LD, LD, LD, LD, LD, LD, LD, LD, LD, LC, LR, F2],
  [F2, LR, LC, LD, LT, LT, LT, LT, LT, LT, LT, LT, LD, LC, LR, F2],
  [F2, LR, LC, LD, LT, LC, LC, LC, LC, LC, LC, LT, LD, LC, LR, F2],
  [F2, LR, LC, LD, LT, LT, LT, LT, LT, LT, LT, LT, LD, LC, LR, F2],
  [F2, LR, LC, LD, LT, LC, LC, LC, LC, LC, LC, LT, LD, LC, LR, F2],
  [F2, LR, LC, LD, LT, LT, LT, LT, LT, LT, LT, LT, LD, LC, LR, F2],
  [F2, LR, LC, LD, LT, LC, LC, LC, LC, LC, LC, LT, LD, LC, LR, F2],
  [F2, LR, LC, LD, LT, LT, LT, LT, LT, LT, LT, LT, LD, LC, LR, F2],
  [F2, LR, LC, LD, LD, LD, LD, LD, LD, LD, LD, LD, LD, LC, LR, F2],
  [F2, LR, LC, LC, LC, LC, LC, LC, LC, LC, LC, LC, LC, LC, LR, F2],
  [F2, F2, LR, LR, LR, LR, LR, LR, LR, LR, LR, LR, LR, LR, F2, F2],
  [F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2],
  [F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2, F2],
];

// Training Room tile — terminal monitor with >_ prompt
const TB = "#1a1a2e"; // terminal body
const TG = "#00ff41"; // green phosphor text
const TS = "#0d0d1a"; // screen dark
const TF = "#2a2a4e"; // frame
const TL = "#888888"; // stand/leg

// prettier-ignore
export const trainingRoom: SpriteFrame = [
  [F2,  F2,  F2,  F2,  F2,  F2,  F2,  F2,  F2,  F2,  F2,  F2,  F2,  F2,  F2,  F2],
  [F2,  TF,  TF,  TF,  TF,  TF,  TF,  TF,  TF,  TF,  TF,  TF,  TF,  TF,  TF,  F2],
  [F2,  TF,  TB,  TB,  TB,  TB,  TB,  TB,  TB,  TB,  TB,  TB,  TB,  TB,  TF,  F2],
  [F2,  TF,  TB,  TS,  TS,  TS,  TS,  TS,  TS,  TS,  TS,  TS,  TS,  TB,  TF,  F2],
  [F2,  TF,  TB,  TS,  TG,  TG,  TS,  TG,  TS,  TS,  TS,  TS,  TS,  TB,  TF,  F2],
  [F2,  TF,  TB,  TS,  TG,  TS,  TS,  TS,  TS,  TS,  TS,  TS,  TS,  TB,  TF,  F2],
  [F2,  TF,  TB,  TS,  TG,  TG,  TS,  TG,  TS,  TS,  TS,  TS,  TS,  TB,  TF,  F2],
  [F2,  TF,  TB,  TS,  TS,  TS,  TS,  TS,  TG,  TG,  TS,  TS,  TS,  TB,  TF,  F2],
  [F2,  TF,  TB,  TS,  TS,  TS,  TS,  TS,  TS,  TS,  TG,  TS,  TS,  TB,  TF,  F2],
  [F2,  TF,  TB,  TS,  TS,  TS,  TS,  TS,  TS,  TS,  TS,  TS,  TS,  TB,  TF,  F2],
  [F2,  TF,  TB,  TB,  TB,  TB,  TB,  TB,  TB,  TB,  TB,  TB,  TB,  TB,  TF,  F2],
  [F2,  TF,  TF,  TF,  TF,  TF,  TF,  TF,  TF,  TF,  TF,  TF,  TF,  TF,  TF,  F2],
  [F2,  F2,  F2,  F2,  F2,  F2,  F2,  TL,  TL,  TL,  F2,  F2,  F2,  F2,  F2,  F2],
  [F2,  F2,  F2,  F2,  F2,  TL,  TL,  TL,  TL,  TL,  TL,  TL,  F2,  F2,  F2,  F2],
  [F2,  F2,  F2,  F2,  F2,  TL,  F2,  F2,  F2,  F2,  TL,  F2,  F2,  F2,  F2,  F2],
  [F2,  F2,  F2,  F2,  F2,  F2,  F2,  F2,  F2,  F2,  F2,  F2,  F2,  F2,  F2,  F2],
];
