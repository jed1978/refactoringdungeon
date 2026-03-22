import { AudioSystem } from "./AudioSystem";
import { MusicSystem } from "./MusicSystem";

export function setAllAudioMuted(muted: boolean): void {
  AudioSystem.setMuted(muted);
  MusicSystem.setMuted(muted);
}
