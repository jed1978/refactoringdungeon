import type { TrackDef } from "../MusicTypes";
import {
  A2, F2, E2,
  A3, F3, E3,
  C3, D3, G3,
} from "./noteFreqs";

// 遊戲結束 — A minor descending, 60 BPM, one-shot (no loop)
// prettier-ignore
export const gameOverTrack: TrackDef = {
  bpm: 60, loop: false,
  reverbMix: 0.38,
  voices: [
    {
      role: "lead", type: "sine", vol: 0.06,
      notes: [[A3,2],[G3,2],[F3,2],[E3,2],[D3,2],[C3,4]],
    },
    {
      role: "bass", type: "triangle", vol: 0.06, filterFreq: 600,
      notes: [[A2,4],[F2,4],[E2,4],[A2,2]],
    },
    {
      role: "pad", type: "sine", vol: 0.04, detune: 15,
      adsr: { attack: 0.25, decay: 0.3, sustain: 0.5, release: 0.6 },
      notes: [[A3,4],[F3,4],[E3,4],[A3,2]],
    },
  ],
};
