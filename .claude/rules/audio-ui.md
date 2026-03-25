---
paths:
  - "src/engine/Audio*.ts"
  - "src/engine/Music*.ts"
  - "src/engine/tracks/**"
  - "src/ui/BattleUI.tsx"
  - "src/ui/components/SkillMenu*"
---

# Audio & UI Rules

## MusicSystem Mute Must Sync Both Systems

`AudioSystem` (SFX) and `MusicSystem` (BGM) are independent. Every mute toggle handler MUST call both:

```ts
// ✅ CORRECT
AudioSystem.setMuted(next);
MusicSystem.setMuted(next);

// ❌ WRONG — BGM keeps playing
AudioSystem.setMuted(next);
```

`MusicSystem` does NOT call `AudioSystem.setMuted` internally (circular import).

## MusicSystem Shares AudioContext

`MusicSystem.ts` imports `getCtx()` from `AudioSystem.ts` — the only allowed cross-import within `src/engine/`. Avoids duplicate AudioContext (browsers limit count).

## BGM File Structure

- `MusicTypes.ts` — type defs (Note, VoiceDef, TrackDef, AdsrEnvelope)
- `MusicSynth.ts` — synthesizer core (ADSR, detuned pairs, filter, reverb, delay)
- `MusicSystem.ts` — scheduler (track switching, loop, crossfade)
- `MusicTracks.ts` — barrel file
- `tracks/*.ts` — 9 track data files + `noteFreqs.ts`

## Track → GameMode Mapping

In `computeMusicTrack` (`GameCanvas.tsx`):

- `title` → `"title"`
- `exploring` / `event` / `shop` → `"explore_{currentFloor}"` (clamped to 4)
- `combat` → `"combat_boss"` if any enemy has `behavior.startsWith("boss_")`, else `"combat"`
- `victory` → `"victory"` (one-shot, no loop)
- `game_over` → `"game_over"` (one-shot, no loop)

## SkillMenu Must Not Use absolute Positioning

`SkillMenu` MUST be a normal block element in DOM flow, positioned BEFORE the action panel div in `BattleUI.tsx`. NOT `position: absolute` or `bottom: 100%`.

If absolute, it grows upward and overflows canvas top when many skills unlocked.

Correct: `maxHeight: '45vh'` + `overflowY: 'auto'` for scrollable overflow.