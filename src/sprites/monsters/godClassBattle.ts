import type { SpriteSheet } from '../../utils/types';

// 神類 (God Class) — FINAL BOSS Battle sprite
// Imposing crowned figure, body shows all monster traits
// Size: 48×48, 4 phase variants
//
// Phase 1: 75-100% HP — calm, regal gold
// Phase 2: 50-75%  HP — cracking, chaotic
// Phase 3: 25-50%  HP — red glow, aura expanding
// Phase 4: 0-25%   HP — enraged, blood red chaos

const _ = null;
// Phase 1 palette — regal gold
const GA = '#ffd700'; // gold
const GB = '#cc9900'; // gold shadow
const GC = '#ffeeaa'; // gold highlight
const OB = '#1a1a2e'; // obsidian dark
const CS = '#e2e8f0'; // silver crown
const GW = '#ffffff'; // white glint
const GR = '#cc3333'; // subtle red accent
// Phase 3/4 additions
const RD = '#cc0000'; // blood red
const RF = '#ff6600'; // fire orange
const WH = '#ffffff'; // chaos white

function r48(row: (string | null)[]): (string | null)[] {
  while (row.length < 48) row.push(_);
  return row.slice(0, 48);
}

// ─── PHASE 1 ─────────────────────────────────────────────────────────────────
// Calm, regal, imposing

const p1f1: (string | null)[][] = [
  r48([_, _, _, _, _, _, _, _, _, _, CS, CS, GA, CS, CS, GA, CS, CS, GA, CS, CS, _]),
  r48([_, _, _, _, _, _, _, _, _, CS, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, CS, _]),
  r48([_, _, _, _, _, _, _, _, CS, GA, GC, GA, GA, GA, GA, GA, GA, GA, GC, GA, GA, CS]),
  r48([_, _, _, _, _, _, _, CS, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, CS]),
  r48([_, _, _, _, _, _, _, OB, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, OB]),
  r48([_, _, _, _, _, _, OB, GA, GA, OB, GA, OB, GA, GA, GA, OB, GA, OB, GA, GA, GA, OB]),
  r48([_, _, _, _, _, OB, GA, GA, GW, OB, GW, OB, GA, GA, GW, OB, GW, OB, GA, GA, GA, OB]),
  r48([_, _, _, _, _, OB, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, OB]),
  r48([_, _, _, _, _, OB, GA, GA, GA, GA, GR, GA, GA, GA, GA, GA, GR, GA, GA, GA, GA, OB]),
  r48([_, _, _, _, OB, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, OB]),
  r48([_, _, _, OB, GA, GC, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GC, GA, GA, OB]),
  r48([_, _, OB, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, OB]),
  r48([_, OB, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, OB]),
  r48([OB, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, OB]),
  r48([OB, GA, GB, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GB, GA, GA, OB]),
  r48([OB, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, OB]),
  r48([OB, GA, GA, GA, GR, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GR, GA, GA, GA, GA, GA, OB]),
  r48([OB, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, OB]),
  r48([OB, GA, GB, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GB, GA, OB]),
  r48([OB, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, OB]),
  r48([_, OB, GA, GA, GA, GA, GR, GA, GA, GA, GA, GA, GA, GA, GA, GR, GA, GA, GA, GA, OB]),
  r48([_, OB, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, OB]),
  r48([_, _, OB, GA, GC, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GC, GA, GA, OB]),
  r48([_, _, OB, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, OB]),
  r48([_, _, _, OB, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, OB]),
  r48([_, _, _, _, OB, OB, GA, GA, OB, _, OB, GA, OB, _, OB, GA, GA, OB, OB]),
  r48([_, _, _, _, _, _, OB, GA, GA, OB, _, OB, GA, OB, _, GA, GA, OB, _]),
  r48([_, _, _, _, _, _, OB, GA, GA, OB, _, OB, GA, OB, _, GA, GA, OB, _]),
  r48([_, _, _, _, _, _, OB, GA, GA, OB, _, OB, GA, OB, _, GA, GA, OB, _]),
  r48([_, _, _, _, _, _, OB, GA, GA, GA, GA, GA, GA, GA, GA, GA, GA, OB, _]),
  r48([_, _, _, _, _, _, _, OB, GA, GA, GA, GA, GA, GA, GA, GA, OB, _]),
  r48([_, _, _, _, _, _, _, _, OB, OB, OB, OB, OB, OB, OB, OB, _]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
  r48([_]),
];

// Phase 1 frame 2: crown glints shift slightly
const p1f2: (string | null)[][] = p1f1.map((row) =>
  row.map((px) => {
    if (px === GC) return GW;
    if (px === GW) return GC;
    return px;
  }),
);

// Phase 1 hit frame
const p1hit: (string | null)[][] = p1f1.map((row) =>
  row.map((px) => {
    if (px === GA) return GC;
    if (px === OB) return GB;
    return px;
  }),
);

// ─── PHASE 2 ─────────────────────────────────────────────────────────────────
// Cracking — same silhouette, cracks replacing some gold pixels with dark
const CK = '#333311'; // crack color

const p2f1: (string | null)[][] = p1f1.map((row, i) =>
  row.map((px, j) => {
    // Add cracks every ~7 pixels along certain rows
    if (px === GA && (i + j) % 7 === 0 && i > 8) return CK;
    if (px === GB) return CK;
    return px;
  }),
);

const p2f2: (string | null)[][] = p1f1.map((row, i) =>
  row.map((px, j) => {
    if (px === GA && (i + j + 3) % 7 === 0 && i > 8) return CK;
    if (px === GC) return CK;
    return px;
  }),
);

// ─── PHASE 3 ─────────────────────────────────────────────────────────────────
// Red glow — gold shifts to orange-red, cracks glow red

const p3f1: (string | null)[][] = p1f1.map((row, i) =>
  row.map((px, j) => {
    if (px === GA) return i < 12 ? GA : RF;
    if (px === GB) return RD;
    if (px === GC) return WH;
    if (px === GR) return RF;
    if ((i + j) % 7 === 0 && i > 8) return RD;
    return px;
  }),
);

const p3f2: (string | null)[][] = p1f1.map((row, i) =>
  row.map((px, j) => {
    if (px === GA) return i < 12 ? GA : RD;
    if (px === GB) return RF;
    if (px === GC) return RF;
    if (px === GR) return WH;
    if ((i + j + 3) % 7 === 0 && i > 8) return RF;
    return px;
  }),
);

// ─── PHASE 4 ─────────────────────────────────────────────────────────────────
// Enraged — full blood red chaos, crown on fire

const p4f1: (string | null)[][] = p1f1.map((row, i) =>
  row.map((px, j) => {
    if (px === GA) return (i + j) % 3 === 0 ? WH : RD;
    if (px === GB) return RD;
    if (px === GC) return WH;
    if (px === CS) return WH;
    if (px === GW) return RF;
    if (px === GR) return WH;
    if (px === OB) return RD;
    return px;
  }),
);

const p4f2: (string | null)[][] = p1f1.map((row, i) =>
  row.map((px, j) => {
    if (px === GA) return (i + j + 1) % 3 === 0 ? WH : RF;
    if (px === GB) return RF;
    if (px === GC) return RD;
    if (px === CS) return RF;
    if (px === GW) return WH;
    if (px === GR) return RF;
    if (px === OB) return RD;
    return px;
  }),
);

export const godClassBattleSprite: Record<string, SpriteSheet> = {
  idle: {
    frames: [p1f1, p1f2],
    frameWidth: 48,
    frameHeight: 48,
    frameDuration: 400,
  },
  hit: {
    frames: [p1hit],
    frameWidth: 48,
    frameHeight: 48,
    frameDuration: 200,
  },
  idle_phase2: {
    frames: [p2f1, p2f2],
    frameWidth: 48,
    frameHeight: 48,
    frameDuration: 350,
  },
  idle_phase3: {
    frames: [p3f1, p3f2],
    frameWidth: 48,
    frameHeight: 48,
    frameDuration: 300,
  },
  idle_phase4: {
    frames: [p4f1, p4f2],
    frameWidth: 48,
    frameHeight: 48,
    frameDuration: 200,
  },
};
