let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function playTone(
  freq: number,
  type: OscillatorType,
  durationMs: number,
  volume = 0.15,
): void {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(volume, c.currentTime + 0.01);
  gain.gain.linearRampToValueAtTime(0, c.currentTime + durationMs / 1000);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + durationMs / 1000 + 0.05);
}

function playFreqSweep(
  startFreq: number,
  endFreq: number,
  type: OscillatorType,
  durationMs: number,
  volume = 0.15,
): void {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(startFreq, c.currentTime);
  osc.frequency.linearRampToValueAtTime(
    endFreq,
    c.currentTime + durationMs / 1000,
  );
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.linearRampToValueAtTime(0, c.currentTime + durationMs / 1000);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + durationMs / 1000 + 0.05);
}

function playNoise(
  durationMs: number,
  filterFreq = 300,
  volume = 0.1,
): void {
  const c = getCtx();
  const bufLen = Math.ceil((c.sampleRate * durationMs) / 1000);
  const buf = c.createBuffer(1, bufLen, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = filterFreq;
  const gain = c.createGain();
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.linearRampToValueAtTime(0, c.currentTime + durationMs / 1000);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  src.start();
}

function playSfx(sfx: string): void {
  switch (sfx) {
    case "step":
      playTone(200, "sine", 50, 0.05);
      break;
    case "chest_open":
      playFreqSweep(800, 1200, "sine", 120);
      break;
    case "door_open":
      playTone(400, "square", 80, 0.1);
      break;
    case "attack_hit":
      playNoise(100, 300, 0.1);
      break;
    case "critical":
      playNoise(100, 300, 0.1);
      playTone(1500, "sine", 150, 0.1);
      break;
    case "skill_cast":
      playFreqSweep(400, 1200, "sawtooth", 200, 0.1);
      break;
    case "enemy_hit":
      playTone(150, "sine", 120, 0.2);
      break;
    case "monster_die":
      playFreqSweep(800, 80, "sawtooth", 400, 0.15);
      break;
    case "boss_appear":
      playTone(60, "sine", 600, 0.3);
      break;
    case "level_up": {
      const freqs = [262, 330, 392, 523];
      freqs.forEach((f, i) => {
        setTimeout(() => playTone(f, "sine", 120, 0.2), i * 100);
      });
      break;
    }
    case "game_over":
      [330, 262, 220].forEach((f, i) => {
        setTimeout(() => playTone(f, "sine", 200, 0.2), i * 220);
      });
      break;
    case "victory": {
      [262, 330, 392, 523].forEach((f, i) => {
        setTimeout(() => playTone(f, "sine", 100, 0.2), i * 80);
      });
      setTimeout(() => {
        playTone(262, "sine", 300, 0.15);
        playTone(330, "sine", 300, 0.15);
        playTone(392, "sine", 300, 0.15);
      }, 400);
      break;
    }
    case "flee":
      playFreqSweep(800, 100, "sawtooth", 200, 0.1);
      break;
    case "item_used":
      playTone(600, "sine", 100, 0.15);
      break;
  }
}

export const AudioSystem = {
  setMuted(v: boolean): void {
    muted = v;
  },
  isMuted(): boolean {
    return muted;
  },
  play(sfx: string): void {
    if (muted) return;
    try {
      playSfx(sfx);
    } catch {
      /* ignore audio errors */
    }
  },
};
