import type { TrackDef } from "../MusicTypes";
// prettier-ignore
import { R, E2,F2, A2, E3,F3,G3,A3, C4,E4,F4,G4,A4, C5 } from "./noteFreqs";

// 1F 前端泥沼 — A minor ambient, 80 BPM, 16 beats
// prettier-ignore
export const explore1Track: TrackDef = {
  bpm: 80, loop: true,
  reverbMix: 0.20,
  voices: [
    {
      role: "lead", type: "square", vol: 0.05, detune: 6, filterFreq: 3000,
      notes: [
        [A3,2],[R,1],[E4,1],[C4,2],[A3,2],
        [G3,2],[R,1],[E3,1],[A3,4],
      ],
    },
    {
      role: "bass", type: "triangle", vol: 0.07,
      notes: [[A2,4],[E2,4],[F2,4],[E2,4]],
    },
    {
      role: "pad", type: "sine", vol: 0.04, pan: -0.3,
      notes: [[A3,4],[E3,4],[F3,4],[E3,4]],
    },
    {
      role: "arp", type: "sawtooth", vol: 0.028, filterFreq: 1500, pan: 0.3,
      notes: [
        [A4,1],[C5,1],[E4,1],[A4,1],
        [R,1],[E4,1],[C5,1],[A4,1],
        [G4,1],[R,1],[E4,1],[G4,1],
        [F4,1],[R,1],[E4,1],[A3,1],
      ],
    },
  ],
};
