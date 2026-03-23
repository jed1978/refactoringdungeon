import { getCtx } from "./AudioSystem";
import { scheduleVoice, createTrackBus } from "./MusicSynth";
import type { TrackDef, MusicTrack } from "./MusicTypes";
import { TRACKS } from "./MusicTracks";

// Re-export MusicTrack so existing importers don't need to change
export type { MusicTrack };

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
    try { gain.disconnect(); } catch { /* already disconnected */ }
  }, 400);
}

// ── Track scheduling ──────────────────────────────────────────────────────────

function startTrack(track: MusicTrack, def: TrackDef, mgain: GainNode): void {
  const ctx = getCtx();
  // Create reverb/delay bus ONCE — reused across all loop iterations
  const trackInput = createTrackBus(mgain, def);
  const beatDur = 60 / def.bpm;
  const totalBeats = def.voices[0].notes.reduce((s, [, b]) => s + b, 0);
  const loopDur = totalBeats * beatDur;

  function iteration(startTime: number): void {
    for (const voice of def.voices) {
      scheduleVoice(ctx, trackInput, voice, startTime, beatDur);
    }
    if (!def.loop) return;
    const nextStart = startTime + loopDur;
    const delayMs = Math.max(50, (nextStart - ctx.currentTime) * 1000 - 100);
    loopTimer = setTimeout(() => {
      if (currentTrack === track) iteration(nextStart);
    }, delayMs);
  }

  iteration(ctx.currentTime + 0.05);
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
    // 350ms gap matches the 300ms crossfade so new track starts after fade-out
    setTimeout(() => {
      if (currentTrack !== track) return;
      const ctx = getCtx();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.3);
      gain.connect(ctx.destination);
      masterGain = gain;
      startTrack(track, def, gain);
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
