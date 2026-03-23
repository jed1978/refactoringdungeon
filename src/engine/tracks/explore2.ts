import type { TrackDef } from "../MusicTypes";
// prettier-ignore
import { R, A2,Bb2, A3,Bb3,D3, D4,Eb4,E4,F4,G4,A4,Bb4, C5,D5 } from "./noteFreqs";

// 2F 後端迷宮 — D minor mechanical, 80 BPM, 16 beats
// prettier-ignore
export const explore2Track: TrackDef = {
  bpm: 80, loop: true,
  reverbMix: 0.15, delayTime: 0.20, delayFeedback: 0.25,
  voices: [
    {
      role: "lead", type: "sawtooth", vol: 0.05, detune: 10, filterFreq: 2500,
      notes: [
        [D4,0.5],[F4,0.5],[A4,1],[D5,2],[C5,1],[Bb4,1],
        [G4,1],[F4,1],[A4,1],[G4,1],[F4,1],[E4,1],[D4,2],[R,2],
      ],
    },
    {
      role: "bass", type: "triangle", vol: 0.07,
      notes: [[D3,4],[A2,4],[Bb2,4],[A2,4]],
    },
    {
      role: "pad", type: "sine", vol: 0.04, detune: 15,
      notes: [[D3,4],[A3,4],[Bb3,4],[A3,4]],
    },
    {
      role: "arp", type: "square", vol: 0.028, filterFreq: 2000, pan: 0.4,
      notes: [
        [D4,1],[F4,1],[A4,1],[D5,1],
        [R,1],[A4,1],[F4,1],[D4,1],
        [Bb3,1],[D4,1],[F4,1],[A4,1],
        [G4,1],[R,1],[F4,1],[D4,1],
      ],
    },
  ],
};
