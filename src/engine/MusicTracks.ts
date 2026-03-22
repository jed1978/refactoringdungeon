import type { MusicTrack } from "./MusicSystem";

// Note frequencies (Hz)
const R = 0;
const E2 = 82,
  F2 = 87,
  G2 = 98,
  A2 = 110,
  Bb2 = 117;
const C3 = 131,
  D3 = 147,
  Eb3 = 156,
  E3 = 165,
  F3 = 175,
  G3 = 196,
  A3 = 220,
  Bb3 = 233;
const C4 = 262,
  D4 = 294,
  Eb4 = 311,
  E4 = 330,
  F4 = 349,
  G4 = 392,
  A4 = 440,
  Bb4 = 466,
  B4 = 494;
const C5 = 523,
  D5 = 587,
  Eb5 = 622,
  E5 = 659,
  F5 = 698,
  G5 = 784,
  A5 = 880;

export type Note = [number, number]; // [freq Hz, beats]
export type VoiceDef = { type: OscillatorType; vol: number; notes: Note[] };
export type TrackDef = { bpm: number; loop: boolean; voices: VoiceDef[] };

// prettier-ignore
export const TRACKS: Partial<Record<MusicTrack, TrackDef>> = {
  title: { bpm:100, loop:true, voices:[
    { type:"square",   vol:0.06, notes:[[C4,1],[Eb4,1],[G4,1],[C5,1],[Bb4,1],[G4,1],[Eb4,1],[C4,1],[G3,1],[Bb3,1],[Eb4,1],[G4,1],[F4,1],[Eb4,1],[D4,1],[C4,1]] },
    { type:"triangle", vol:0.07, notes:[[C3,4],[G2,4],[Eb3,4],[Bb2,4]] },
  ]},

  explore_1: { bpm:80, loop:true, voices:[
    { type:"square",   vol:0.05, notes:[[A3,2],[R,1],[E4,1],[C4,2],[A3,2],[G3,2],[R,1],[E3,1],[A3,4]] },
    { type:"triangle", vol:0.06, notes:[[A2,4],[E2,4],[F2,4],[E2,4]] },
  ]},

  explore_2: { bpm:80, loop:true, voices:[
    { type:"square",   vol:0.05, notes:[[D4,0.5],[F4,0.5],[A4,1],[D5,2],[C5,1],[Bb4,1],[G4,1],[F4,1],[A4,1],[G4,1],[F4,1],[E4,1],[D4,2],[R,2]] },
    { type:"triangle", vol:0.06, notes:[[D3,4],[A2,4],[Bb2,4],[A2,4]] },
  ]},

  explore_3: { bpm:70, loop:true, voices:[
    { type:"square",   vol:0.05, notes:[[G3,2],[Bb3,2],[D4,2],[F4,2],[Eb4,2],[C4,2],[D4,2],[G3,2]] },
    { type:"triangle", vol:0.06, notes:[[G2,4],[D3,4],[Eb3,4],[D3,4]] },
  ]},

  explore_4: { bpm:80, loop:true, voices:[
    { type:"square",   vol:0.06, notes:[[D4,1],[F4,1],[Bb4,2],[A4,1],[G4,1],[F4,2],[Eb4,1],[D4,1],[C4,2],[Bb3,1],[A3,1],[R,2]] },
    { type:"triangle", vol:0.07, notes:[[D3,4],[Bb2,4],[A2,4],[Eb3,4]] },
  ]},

  combat: { bpm:140, loop:true, voices:[
    { type:"square",   vol:0.07, notes:[[A4,0.5],[C5,0.5],[E5,0.5],[A5,0.5],[G5,1],[E5,1],[F4,0.5],[A4,0.5],[E5,0.5],[D5,0.5],[C5,2],[E4,0.5],[G4,0.5],[A4,0.5],[C5,0.5],[B4,1],[A4,1],[D4,0.5],[F4,0.5],[A4,0.5],[G4,0.5],[E4,2]] },
    { type:"triangle", vol:0.07, notes:[[A2,1],[R,0.5],[A2,0.5],[G2,2],[A2,1],[R,0.5],[A2,0.5],[F2,2],[A2,1],[R,0.5],[A2,0.5],[G2,2],[A2,1],[R,0.5],[A2,0.5],[E2,2]] },
  ]},

  combat_boss: { bpm:160, loop:true, voices:[
    { type:"square",   vol:0.07, notes:[[D4,0.5],[F4,0.5],[A4,0.5],[D5,0.5],[C5,0.5],[Bb4,0.5],[A4,0.5],[G4,0.5],[F4,0.5],[A4,0.5],[D5,0.5],[F5,0.5],[Eb5,0.5],[D5,0.5],[C5,0.5],[Bb4,0.5],[A4,0.5],[C5,0.5],[Eb5,0.5],[G5,0.5],[F5,0.5],[Eb5,0.5],[D5,0.5],[C5,0.5],[Bb4,0.5],[A4,0.5],[G4,0.5],[F4,0.5],[D5,0.5],[A4,0.5],[F4,0.5],[D4,0.5]] },
    { type:"triangle", vol:0.08, notes:[[D3,1],[R,0.5],[D3,0.5],[A2,2],[Bb2,1],[R,0.5],[Bb2,0.5],[A2,2],[D3,1],[R,0.5],[D3,0.5],[A2,2],[G3,1],[R,0.5],[A2,0.5],[D3,2]] },
  ]},

  victory: { bpm:120, loop:false, voices:[
    { type:"square",   vol:0.08, notes:[[C4,0.5],[E4,0.5],[G4,0.5],[C5,0.5],[E5,1],[R,1],[C5,0.5],[E5,0.5],[G5,1.5],[R,2]] },
    { type:"triangle", vol:0.08, notes:[[C3,1],[E3,1],[G3,1],[C4,5]] },
  ]},

  game_over: { bpm:60, loop:false, voices:[
    { type:"square",   vol:0.06, notes:[[A3,2],[G3,2],[F3,2],[E3,2],[D3,2],[C3,4]] },
    { type:"triangle", vol:0.06, notes:[[A2,4],[F2,4],[E2,4],[A2,2]] },
  ]},
};
