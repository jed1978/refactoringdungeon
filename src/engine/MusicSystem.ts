import { getCtx } from "./AudioSystem";
import type { TrackDef, VoiceDef } from "./MusicTracks";
import { TRACKS } from "./MusicTracks";

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

// ── Scheduling ────────────────────────────────────────────────────────────────

function scheduleVoice(
  ctx: AudioContext,
  out: GainNode,
  voice: VoiceDef,
  startTime: number,
  beatDur: number,
): void {
  const osc = ctx.createOscillator();
  const vg = ctx.createGain();
  osc.type = voice.type;
  osc.connect(vg);
  vg.connect(out);
  const firstFreq = voice.notes.find(([f]) => f > 0)?.[0] ?? 440;
  osc.frequency.setValueAtTime(firstFreq, startTime);
  vg.gain.setValueAtTime(0, startTime);
  let t = startTime;
  for (const [freq, beats] of voice.notes) {
    const dur = beats * beatDur;
    if (freq > 0) {
      osc.frequency.setValueAtTime(freq, t);
      vg.gain.setValueAtTime(voice.vol, t);
      vg.gain.setValueAtTime(0, t + dur * 0.85);
    } else {
      vg.gain.setValueAtTime(0, t);
    }
    t += dur;
  }
  osc.start(startTime);
  osc.stop(t + 0.05);
}

function scheduleLoop(
  track: MusicTrack,
  def: TrackDef,
  gain: GainNode,
  startTime: number,
): void {
  const ctx = getCtx();
  const beatDur = 60 / def.bpm;
  for (const voice of def.voices) {
    scheduleVoice(ctx, gain, voice, startTime, beatDur);
  }
  if (!def.loop) return;
  const totalDur =
    def.voices[0].notes.reduce((s, [, b]) => s + b, 0) * beatDur;
  const nextStart = startTime + totalDur;
  const delay = Math.max(50, (nextStart - ctx.currentTime) * 1000 - 100);
  loopTimer = setTimeout(() => {
    if (currentTrack === track && masterGain === gain) {
      scheduleLoop(track, def, gain, nextStart);
    }
  }, delay);
}

// ── Module state ──────────────────────────────────────────────────────────────

let currentTrack: MusicTrack | null = null;
let masterGain: GainNode | null = null;
let loopTimer: ReturnType<typeof setTimeout> | null = null;
let musicMuted = false;

function clearLoop(): void {
  if (loopTimer !== null) {
    clearTimeout(loopTimer);
    loopTimer = null;
  }
}

function fadeAndDisconnect(gain: GainNode): void {
  const ctx = getCtx();
  gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
  setTimeout(() => {
    try {
      gain.disconnect();
    } catch {
      /* ignore */
    }
  }, 400);
}

// ── Public API ────────────────────────────────────────────────────────────────

export const MusicSystem = {
  setTrack(track: MusicTrack): void {
    if (track === currentTrack) return;
    clearLoop();
    const prevGain = masterGain;
    masterGain = null;
    currentTrack = track;
    if (prevGain) fadeAndDisconnect(prevGain);
    const def = TRACKS[track];
    if (!def || musicMuted) return;
    setTimeout(() => {
      if (currentTrack !== track) return;
      const ctx = getCtx();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.3);
      gain.connect(ctx.destination);
      masterGain = gain;
      scheduleLoop(track, def, gain, ctx.currentTime + 0.05);
    }, 350);
  },

  setMuted(v: boolean): void {
    musicMuted = v;
    if (v) {
      clearLoop();
      if (masterGain) {
        fadeAndDisconnect(masterGain);
        masterGain = null;
      }
    } else {
      const track = currentTrack;
      currentTrack = null;
      if (track) this.setTrack(track);
    }
  },

  stop(): void {
    clearLoop();
    currentTrack = null;
    if (masterGain) {
      fadeAndDisconnect(masterGain);
      masterGain = null;
    }
  },
};
