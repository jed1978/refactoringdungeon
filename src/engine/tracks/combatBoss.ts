import type { TrackDef } from "../MusicTypes";
import {
  R,
  A2, Bb2,
  A3, Bb3, D3,
  A4, Bb4, C5, D4, D5, Eb5, F4, F5, G4, G5,
} from "./noteFreqs";

// Boss 戰 — D minor high-speed, 160 BPM, 16 beats
// prettier-ignore
export const combatBossTrack: TrackDef = {
  bpm: 160, loop: true,
  reverbMix: 0.10, delayTime: 0.15, delayFeedback: 0.22,
  voices: [
    {
      role: "lead", type: "sawtooth", vol: 0.07, detune: 10, filterFreq: 3500,
      notes: [
        [D4 ,0.5],[F4 ,0.5],[A4,0.5],[D5,0.5],[C5 ,0.5],[Bb4,0.5],[A4,0.5],[G4,0.5],
        [F4 ,0.5],[A4 ,0.5],[D5,0.5],[F5,0.5],[Eb5,0.5],[D5 ,0.5],[C5,0.5],[Bb4,0.5],
        [A4 ,0.5],[C5 ,0.5],[Eb5,0.5],[G5,0.5],[F5 ,0.5],[Eb5,0.5],[D5,0.5],[C5 ,0.5],
        [Bb4,0.5],[A4 ,0.5],[G4 ,0.5],[F4,0.5],[D5 ,0.5],[A4 ,0.5],[F4,0.5],[D4 ,0.5],
      ],
    },
    {
      role: "bass", type: "triangle", vol: 0.08,
      notes: [
        [D3,1],[R,0.5],[D3,0.5],[A2,2],
        [Bb2,1],[R,0.5],[Bb2,0.5],[A2,2],
        [D3,1],[R,0.5],[D3,0.5],[A2,2],
        [D3,1],[R,0.5],[A2,0.5],[D3,2],
      ],
    },
    {
      role: "pad", type: "square", vol: 0.035, detune: 15,
      notes: [[D3,4],[A3,4],[Bb3,4],[A3,4]],
    },
    {
      role: "arp", type: "sawtooth", vol: 0.030, filterFreq: 2500,
      notes: [
        [D4,1],[A4,1],[F4,1],[D4,1],
        [R,1],[D4,1],[A4,1],[Bb4,1],
        [A4,1],[R,1],[D4,1],[F4,1],
        [A4,1],[D5,1],[R,1],[D4,1],
      ],
    },
  ],
};
