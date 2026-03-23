import type { TrackDef } from "../MusicTypes";
// prettier-ignore
import { R, G2,Bb2, C3,D3,Eb3,F3,G3,Bb3, C4,D4,Eb4,F4,G4,Bb4, C5 } from "./noteFreqs";

// Title Screen — C minor mysterious, 100 BPM, 16 beats
// prettier-ignore
export const titleTrack: TrackDef = {
  bpm: 100, loop: true,
  reverbMix: 0.28, delayTime: 0.24, delayFeedback: 0.28,
  voices: [
    {
      role: "lead", type: "square", vol: 0.05, detune: 8,
      notes: [
        [C4,1],[Eb4,1],[G4,1],[C5,1],[Bb4,1],[G4,1],[Eb4,1],[C4,1],
        [G3,1],[Bb3,1],[Eb4,1],[G4,1],[F4,1],[Eb4,1],[D4,1],[C4,1],
      ],
    },
    {
      role: "bass", type: "triangle", vol: 0.07,
      notes: [[C3,4],[G2,4],[Eb3,4],[Bb2,4]],
    },
    {
      role: "pad", type: "sine", vol: 0.04, detune: 12, pan: -0.2,
      notes: [[C3,4],[G3,4],[Eb3,4],[Bb3,4]],
    },
    {
      role: "arp", type: "sawtooth", vol: 0.03, filterFreq: 2200, pan: 0.3,
      notes: [
        // Cm arp
        [C4,0.5],[Eb4,0.5],[G4,0.5],[C5,0.5],[G4,0.5],[Eb4,0.5],[C4,0.5],[R,0.5],
        // Gm arp
        [G3,0.5],[Bb3,0.5],[D4,0.5],[G4,0.5],[D4,0.5],[Bb3,0.5],[G3,0.5],[R,0.5],
        // Eb arp
        [Eb3,0.5],[G3,0.5],[Bb3,0.5],[Eb4,0.5],[Bb3,0.5],[G3,0.5],[Eb3,0.5],[R,0.5],
        // Bb arp
        [Bb2,0.5],[D3,0.5],[F3,0.5],[Bb3,0.5],[F3,0.5],[D3,0.5],[Bb2,0.5],[R,0.5],
      ],
    },
  ],
};
