import type { TrackDef } from "../MusicTypes";
import {
  R,
  G2,
  D3, Eb3, G3,
  C4, D4, Eb4, F4, G4, Bb4,
  C5, D5, Eb5,
  Bb3,
} from "./noteFreqs";

// 3F 資料庫深淵 — G minor deep, 70 BPM, 16 beats
// prettier-ignore
export const explore3Track: TrackDef = {
  bpm: 70, loop: true,
  reverbMix: 0.30,
  voices: [
    {
      role: "lead", type: "square", vol: 0.05, detune: 8,
      notes: [
        [G3,2],[Bb3,2],[D4,2],[F4,2],
        [Eb4,2],[C4,2],[D4,2],[G3,2],
      ],
    },
    {
      role: "bass", type: "triangle", vol: 0.07, filterFreq: 800,
      notes: [[G2,4],[D3,4],[Eb3,4],[D3,4]],
    },
    {
      role: "pad", type: "sine", vol: 0.04, detune: 12, pan: -0.2,
      notes: [[G3,4],[D3,4],[Eb3,4],[D3,4]],
    },
    {
      role: "arp", type: "sawtooth", vol: 0.028, filterFreq: 1200, pan: 0.2,
      notes: [
        [G4,1],[Bb4,1],[D5,1],[G4,1],
        [R,1],[D5,1],[Bb4,1],[G4,1],
        [Eb4,1],[G4,1],[Bb4,1],[Eb5,1],
        [R,1],[C5,1],[Bb4,1],[G4,1],
      ],
    },
  ],
};
