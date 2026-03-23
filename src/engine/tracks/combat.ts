import type { TrackDef } from "../MusicTypes";
import {
  R,
  E2,
  F2,
  G2,
  A2,
  A4,
  B4,
  C5,
  D4,
  D5,
  E4,
  E5,
  F4,
  G4,
  G5,
  A5,
} from "./noteFreqs";

// 一般戰鬥 — A minor fast, 140 BPM, 16 beats, dry with short delay
// prettier-ignore
export const combatTrack: TrackDef = {
  bpm: 140, loop: true,
  delayTime: 0.10, delayFeedback: 0.20,
  voices: [
    {
      role: "lead", type: "square", vol: 0.07, detune: 6,
      notes: [
        [A4,0.5],[C5,0.5],[E5,0.5],[A5,0.5],[G5,1],[E5,1],
        [F4,0.5],[A4,0.5],[E5,0.5],[D5,0.5],[C5,2],
        [E4,0.5],[G4,0.5],[A4,0.5],[C5,0.5],[B4,1],[A4,1],
        [D4,0.5],[F4,0.5],[A4,0.5],[G4,0.5],[E4,2],
      ],
    },
    {
      role: "bass", type: "triangle", vol: 0.07,
      notes: [
        [A2,1],[R,0.5],[A2,0.5],[G2,2],
        [A2,1],[R,0.5],[A2,0.5],[F2,2],
        [A2,1],[R,0.5],[A2,0.5],[G2,2],
        [A2,1],[R,0.5],[A2,0.5],[E2,2],
      ],
    },
    {
      role: "arp", type: "sawtooth", vol: 0.035, filterFreq: 3000, pan: 0.2,
      notes: [
        // Am power fifth arp
        [A4,0.5],[E5,0.5],[A5,0.5],[R,0.5],
        [A4,0.5],[E5,0.5],[A5,0.5],[R,0.5],
        [A4,0.5],[E5,0.5],[A5,0.5],[R,0.5],
        [A4,0.5],[E5,0.5],[A5,0.5],[R,0.5],
        // Gm variant
        [G4,0.5],[D5,0.5],[G5,0.5],[R,0.5],
        [G4,0.5],[D5,0.5],[G5,0.5],[R,0.5],
        [G4,0.5],[D5,0.5],[G5,0.5],[R,0.5],
        [G4,0.5],[D5,0.5],[G5,0.5],[R,0.5],
      ],
    },
  ],
};
