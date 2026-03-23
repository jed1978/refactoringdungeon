import type { TrackDef } from "../MusicTypes";
import {
  R,
  C3, E3, G3,
  B4, C4, C5, E4, E5, G4, G5,
} from "./noteFreqs";

// 勝利 — C major fanfare, 120 BPM, one-shot (no loop)
// prettier-ignore
export const victoryTrack: TrackDef = {
  bpm: 120, loop: false,
  reverbMix: 0.28,
  voices: [
    {
      role: "lead", type: "square", vol: 0.08, detune: 8,
      notes: [
        [C4,0.5],[E4,0.5],[G4,0.5],[C5,0.5],[E5,1],[R,1],
        [C5,0.5],[E5,0.5],[G5,1.5],[R,2],
      ],
    },
    {
      role: "bass", type: "triangle", vol: 0.08,
      notes: [[C3,1],[E3,1],[G3,1],[C4,5]],
    },
    {
      role: "pad", type: "sine", vol: 0.05,
      adsr: { attack: 0.2, decay: 0.3, sustain: 0.7, release: 0.5 },
      notes: [[C3,3],[G3,3],[C4,2.5]],
    },
    {
      role: "arp", type: "square", vol: 0.035, detune: 8, pan: 0.3,
      notes: [
        [C5,0.5],[E5,0.5],[G5,0.5],[E5,0.5],[C5,0.5],[G4,0.5],
        [E5,0.5],[G5,0.5],[B4,1],[R,4],
      ],
    },
  ],
};
