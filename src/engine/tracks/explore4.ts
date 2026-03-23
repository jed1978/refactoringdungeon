import type { TrackDef } from "../MusicTypes";
import {
  R,
  A2, Bb2,
  D3, Eb3, A3, Bb3,
  C4, D4, Eb4, F4, G4, A4, Bb4,
  D5,
} from "./noteFreqs";

// 4F 神類聖殿 — D minor oppressive, 80 BPM, 16 beats
// prettier-ignore
export const explore4Track: TrackDef = {
  bpm: 80, loop: true,
  reverbMix: 0.20, delayTime: 0.15, delayFeedback: 0.25,
  voices: [
    {
      role: "lead", type: "sawtooth", vol: 0.06, detune: 12, filterFreq: 2000,
      notes: [
        [D4,1],[F4,1],[Bb4,2],[A4,1],[G4,1],[F4,2],
        [Eb4,1],[D4,1],[C4,2],[Bb3,1],[A3,1],[R,2],
      ],
    },
    {
      role: "bass", type: "triangle", vol: 0.07,
      notes: [[D3,4],[Bb2,4],[A2,4],[Eb3,4]],
    },
    {
      role: "pad", type: "sine", vol: 0.04, detune: 15,
      notes: [[D3,4],[Bb3,4],[A3,4],[Eb3,4]],
    },
    {
      role: "arp", type: "square", vol: 0.028, pan: -0.3,
      notes: [
        [D4,1],[F4,1],[A4,1],[D5,1],
        [R,1],[A4,1],[F4,1],[D4,1],
        [Bb3,1],[F4,1],[A4,1],[Bb4,1],
        [R,1],[G4,1],[Eb4,1],[D4,1],
      ],
    },
  ],
};
