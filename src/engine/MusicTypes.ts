export type Note = [number, number]; // [freq Hz, beats] — 0 Hz = rest

export type AdsrEnvelope = {
  attack: number;   // seconds
  decay: number;    // seconds
  sustain: number;  // gain level 0-1
  release: number;  // seconds
};

export type VoiceRole = "lead" | "bass" | "pad" | "arp";

export type VoiceDef = {
  role: VoiceRole;
  type: OscillatorType;
  vol: number;
  notes: Note[];
  detune?: number;      // cents for chorus pair (0 = single oscillator)
  adsr?: AdsrEnvelope;  // overrides role default if provided
  filterFreq?: number;  // lowpass cutoff Hz
  filterQ?: number;     // Q resonance (default 1)
  pan?: number;         // stereo pan -1..1
};

export type TrackDef = {
  bpm: number;
  loop: boolean;
  voices: VoiceDef[];
  reverbMix?: number;     // wet level 0–0.5
  delayTime?: number;     // echo delay seconds
  delayFeedback?: number; // echo feedback 0–0.5
};

export type MusicTrack =
  | "title"
  | "explore_1"
  | "explore_2"
  | "explore_3"
  | "explore_4"
  | "combat"
  | "combat_boss"
  | "victory"
  | "game_over"
  | "silence";
