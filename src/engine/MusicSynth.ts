import { getCtx } from "./AudioSystem";
import type { VoiceDef, TrackDef, AdsrEnvelope } from "./MusicTypes";

// Default ADSR per voice role
const ROLE_ADSR: Record<string, AdsrEnvelope> = {
  lead: { attack: 0.01,  decay: 0.08, sustain: 0.7, release: 0.06 },
  bass: { attack: 0.005, decay: 0.10, sustain: 0.8, release: 0.04 },
  pad:  { attack: 0.18,  decay: 0.20, sustain: 0.6, release: 0.30 },
  arp:  { attack: 0.005, decay: 0.05, sustain: 0.5, release: 0.03 },
};

function scheduleNote(
  ctx: AudioContext,
  dest: AudioNode,
  voice: VoiceDef,
  adsr: AdsrEnvelope,
  freq: number,
  startT: number,
  noteDur: number,
): void {
  const detune = voice.detune ?? 0;
  const oscCount = detune > 0 ? 2 : 1;
  const vol = voice.vol / oscCount;

  // ADSR envelope
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, startT);
  gainNode.gain.linearRampToValueAtTime(vol, startT + adsr.attack);
  const sustainLevel = vol * adsr.sustain;
  gainNode.gain.linearRampToValueAtTime(sustainLevel, startT + adsr.attack + adsr.decay);
  const releaseAt = startT + noteDur;
  gainNode.gain.setValueAtTime(sustainLevel, releaseAt);
  gainNode.gain.linearRampToValueAtTime(0, releaseAt + adsr.release);

  let out: AudioNode = gainNode;

  // Optional lowpass filter
  if (voice.filterFreq != null) {
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(voice.filterFreq, startT);
    filter.Q.setValueAtTime(voice.filterQ ?? 1, startT);
    gainNode.connect(filter);
    out = filter;
  }

  // Optional stereo panning
  if (voice.pan != null) {
    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(voice.pan, startT);
    out.connect(panner);
    out = panner;
  }

  out.connect(dest);

  // Create oscillator(s) — detuned pair for chorus effect
  const stopT = releaseAt + adsr.release + 0.06;
  const detuneValues = oscCount === 2 ? [detune, -detune] : [0];
  for (const dt of detuneValues) {
    const osc = ctx.createOscillator();
    osc.type = voice.type;
    osc.frequency.setValueAtTime(freq, startT);
    if (dt !== 0) osc.detune.setValueAtTime(dt, startT);
    osc.connect(gainNode);
    osc.start(startT);
    osc.stop(stopT);
  }
}

/** Schedules all notes in one voice starting at startTime. */
export function scheduleVoice(
  ctx: AudioContext,
  dest: AudioNode,
  voice: VoiceDef,
  startTime: number,
  beatDur: number,
): void {
  const adsr = voice.adsr ?? ROLE_ADSR[voice.role] ?? ROLE_ADSR.lead;
  let t = startTime;
  for (const [freq, beats] of voice.notes) {
    const dur = beats * beatDur;
    if (freq > 0) {
      scheduleNote(ctx, dest, voice, adsr, freq, t, dur * 0.9);
    }
    t += dur;
  }
}

function makeReverb(ctx: AudioContext): ConvolverNode {
  const len = Math.floor(ctx.sampleRate * 1.4);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.32));
    }
  }
  const conv = ctx.createConvolver();
  conv.buffer = buf;
  return conv;
}

/**
 * Creates the reverb + delay effect chain connected to masterGain.
 * Returns the input GainNode — connect voice output here.
 * Call ONCE per track start, reuse across loop iterations.
 */
export function createTrackBus(masterGain: GainNode, def: TrackDef): GainNode {
  const ctx = getCtx();
  const input = ctx.createGain();
  input.connect(masterGain);

  if ((def.reverbMix ?? 0) > 0) {
    const reverb = makeReverb(ctx);
    const wetGain = ctx.createGain();
    wetGain.gain.setValueAtTime(def.reverbMix!, ctx.currentTime);
    input.connect(reverb);
    reverb.connect(wetGain);
    wetGain.connect(masterGain);
  }

  if ((def.delayTime ?? 0) > 0) {
    const delay = ctx.createDelay(2.0);
    delay.delayTime.setValueAtTime(def.delayTime!, ctx.currentTime);
    const fb = ctx.createGain();
    fb.gain.setValueAtTime(Math.min(def.delayFeedback ?? 0.25, 0.45), ctx.currentTime);
    const delayWet = ctx.createGain();
    delayWet.gain.setValueAtTime(0.18, ctx.currentTime);
    input.connect(delay);
    delay.connect(fb);
    fb.connect(delay); // feedback loop (supported by Web Audio spec)
    delay.connect(delayWet);
    delayWet.connect(masterGain);
  }

  return input;
}
