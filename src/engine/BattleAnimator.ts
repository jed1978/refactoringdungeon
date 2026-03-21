import type { ScreenFlash, ScreenShake } from "./ScreenEffects";
import { createFlash, updateFlash, updateShake } from "./ScreenEffects";
import type { HitSpark } from "./BattleRenderer";

export type AnimSequence =
  | { readonly kind: "idle" }
  | {
      readonly kind: "player_attack";
      readonly targetIndex: number;
      elapsed: number;
    }
  | {
      readonly kind: "player_skill";
      readonly skillId: string;
      readonly targetIndex: number;
      elapsed: number;
    }
  | {
      readonly kind: "enemy_attack";
      readonly enemyIndex: number;
      elapsed: number;
    }
  | {
      readonly kind: "hit_reaction_enemy";
      readonly targetIndex: number;
      elapsed: number;
    }
  | { readonly kind: "hit_reaction_player"; elapsed: number }
  | {
      readonly kind: "death_dissolve";
      readonly targetIndex: number;
      elapsed: number;
    }
  | { readonly kind: "screen_flash_white"; elapsed: number }
  | { readonly kind: "transition_in"; elapsed: number }
  | { readonly kind: "transition_out"; elapsed: number }
  | { readonly kind: "boss_phase_shift"; elapsed: number };

export type SpriteOffset = {
  readonly x: number;
  readonly y: number;
};

export type AnimFrame = {
  readonly playerSpriteKey: string;
  readonly playerOffset: SpriteOffset;
  readonly enemySpriteKeys: readonly string[];
  readonly enemyOffsets: readonly SpriteOffset[];
  readonly flashWhitePlayer: boolean;
  readonly flashWhiteEnemies: readonly boolean[];
  readonly hitSparks: readonly HitSpark[];
  readonly screenFlash: ScreenFlash | null;
  readonly screenShake: ScreenShake | null;
  readonly spawnDissolveAt: number | null; // enemy index to dissolve
  readonly finished: boolean;
};

export type BattleAnimState = {
  readonly current: AnimSequence;
  readonly queue: readonly AnimSequence[];
  readonly screenFlash: ScreenFlash | null;
  readonly screenShake: ScreenShake | null;
  readonly hitSparks: readonly HitSpark[];
};

export function createBattleAnimState(): BattleAnimState {
  return {
    current: { kind: "idle" },
    queue: [],
    screenFlash: null,
    screenShake: null,
    hitSparks: [],
  };
}

export function queueAnimation(
  state: BattleAnimState,
  seq: AnimSequence,
): BattleAnimState {
  if (state.current.kind === "idle") {
    return { ...state, current: seq };
  }
  return { ...state, queue: [...state.queue, seq] };
}

export function updateAnimation(
  state: BattleAnimState,
  dt: number,
  enemyCount: number,
): { state: BattleAnimState; frame: AnimFrame } {
  let current = state.current;
  let screenFlash = state.screenFlash
    ? updateFlash(state.screenFlash, dt)
    : null;
  let screenShake = state.screenShake
    ? updateShake(state.screenShake, dt)
    : null;
  let hitSparks = updateHitSparks(state.hitSparks, dt);
  let finished = false;
  let spawnDissolveAt: number | null = null;

  // Default frame
  const defaultEnemyKeys = Array.from({ length: enemyCount }, () => "idle");
  const defaultOffsets: SpriteOffset[] = Array.from(
    { length: enemyCount },
    () => ({ x: 0, y: 0 }),
  );
  const defaultFlash: boolean[] = Array.from(
    { length: enemyCount },
    () => false,
  );

  let playerKey = "idle";
  let playerOffset: SpriteOffset = { x: 0, y: 0 };
  let playerFlash = false;
  const enemyKeys = [...defaultEnemyKeys];
  const enemyOffsets = [...defaultOffsets];
  const enemyFlash = [...defaultFlash];

  switch (current.kind) {
    case "idle":
      finished = state.queue.length > 0;
      break;

    case "player_attack": {
      current = { ...current, elapsed: current.elapsed + dt };
      const t = current.elapsed / 400;
      // Lunge forward (leftward for player facing left), swing, return
      const lunge = t < 0.4 ? t / 0.4 : t < 0.6 ? 1 : (1 - t) / 0.4;
      playerKey = t < 0.5 ? "attack" : "idle";
      playerOffset = { x: -Math.round(lunge * 8), y: 0 };
      // Hit spark at enemy at t=0.5
      if (t >= 0.45 && t < 0.55 && hitSparks.length === 0) {
        hitSparks = [
          ...hitSparks,
          createHitSparkAt(current.targetIndex, enemyCount),
        ];
      }
      if (t >= 0.5 && t < 0.6) {
        enemyKeys[current.targetIndex] = "hit";
        enemyFlash[current.targetIndex] = true;
      }
      finished = current.elapsed >= 400;
      break;
    }

    case "player_skill": {
      current = { ...current, elapsed: current.elapsed + dt };
      const t = current.elapsed / 600;
      playerKey = t < 0.7 ? "skill_cast" : "idle";
      if (t >= 0.5 && t < 0.7) {
        enemyKeys[current.targetIndex] = "hit";
        enemyFlash[current.targetIndex] = true;
      }
      if (t >= 0.45 && t < 0.55 && hitSparks.length === 0) {
        hitSparks = [
          ...hitSparks,
          createHitSparkAt(current.targetIndex, enemyCount),
        ];
        // Crit flash
        screenFlash = createFlash("#ffffff", 100);
      }
      finished = current.elapsed >= 600;
      break;
    }

    case "enemy_attack": {
      current = { ...current, elapsed: current.elapsed + dt };
      const t = current.elapsed / 300;
      const idx = current.enemyIndex;
      if (idx < enemyCount) {
        enemyKeys[idx] = "attack";
        const lunge = t < 0.4 ? t / 0.4 : t < 0.6 ? 1 : (1 - t) / 0.4;
        enemyOffsets[idx] = { x: Math.round(lunge * 8), y: 0 };
        if (t >= 0.4 && t < 0.6) {
          playerFlash = true;
        }
      }
      playerKey = t >= 0.4 && t < 0.6 ? "hit" : "idle";
      finished = current.elapsed >= 300;
      break;
    }

    case "hit_reaction_enemy": {
      current = { ...current, elapsed: current.elapsed + dt };
      const t = current.elapsed / 300;
      const idx = current.targetIndex;
      if (idx < enemyCount) {
        enemyFlash[idx] = Math.floor(t * 4) % 2 === 0;
        enemyOffsets[idx] = {
          x: Math.round(Math.sin(t * Math.PI * 4) * 2),
          y: 0,
        };
      }
      finished = current.elapsed >= 300;
      break;
    }

    case "hit_reaction_player": {
      current = { ...current, elapsed: current.elapsed + dt };
      const t = current.elapsed / 300;
      playerFlash = Math.floor(t * 4) % 2 === 0;
      playerKey = "hit";
      playerOffset = { x: Math.round(Math.sin(t * Math.PI * 4) * 2), y: 0 };
      finished = current.elapsed >= 300;
      break;
    }

    case "death_dissolve": {
      current = { ...current, elapsed: current.elapsed + dt };
      const idx = current.targetIndex;
      if (current.elapsed <= dt + 1 && idx < enemyCount) {
        // First frame: trigger dissolve
        spawnDissolveAt = idx;
      }
      // Hide enemy sprite
      if (idx < enemyCount) {
        enemyKeys[idx] = "hit";
      }
      finished = current.elapsed >= 800;
      break;
    }

    case "screen_flash_white": {
      current = { ...current, elapsed: current.elapsed + dt };
      if (!screenFlash) screenFlash = createFlash("#ffffff", 100);
      finished = current.elapsed >= 100;
      break;
    }

    case "transition_in": {
      current = { ...current, elapsed: current.elapsed + dt };
      screenFlash = createFlash("#ffffff", 400);
      finished = current.elapsed >= 400;
      break;
    }

    case "transition_out": {
      current = { ...current, elapsed: current.elapsed + dt };
      screenFlash = createFlash("#000000", 400);
      finished = current.elapsed >= 400;
      break;
    }

    case "boss_phase_shift": {
      current = { ...current, elapsed: current.elapsed + dt };
      const t = current.elapsed / 1000;
      if (t < 0.3) {
        // Screen shake + enemy flash
        for (let i = 0; i < enemyCount; i++) {
          enemyFlash[i] = Math.floor(t * 10) % 2 === 0;
        }
      } else if (t < 0.6 && !screenFlash) {
        // White flash
        screenFlash = createFlash("#ffffff", 300);
      } else if (t >= 0.6 && !screenFlash) {
        // Red tint
        screenFlash = createFlash("#ff0000", 400);
      }
      finished = current.elapsed >= 1000;
      break;
    }
  }

  // Advance queue when done
  let nextCurrent = current;
  let nextQueue = state.queue;
  if (finished && current.kind !== "idle") {
    if (state.queue.length > 0) {
      nextCurrent = state.queue[0];
      nextQueue = state.queue.slice(1);
    } else {
      nextCurrent = { kind: "idle" };
    }
  }

  const newState: BattleAnimState = {
    current: nextCurrent,
    queue: nextQueue,
    screenFlash,
    screenShake,
    hitSparks,
  };

  const frame: AnimFrame = {
    playerSpriteKey: playerKey,
    playerOffset,
    enemySpriteKeys: enemyKeys,
    enemyOffsets,
    flashWhitePlayer: playerFlash,
    flashWhiteEnemies: enemyFlash,
    hitSparks,
    screenFlash,
    screenShake,
    spawnDissolveAt,
    finished: finished && nextCurrent.kind === "idle",
  };

  return { state: newState, frame };
}

export function isAnimating(state: BattleAnimState): boolean {
  return state.current.kind !== "idle" || state.queue.length > 0;
}

function createHitSparkAt(enemyIndex: number, enemyCount: number): HitSpark {
  const spacing = 240 / (enemyCount + 1);
  const x = Math.round(spacing * (enemyIndex + 1));
  const y = 24 + 16;
  return { x, y, elapsed: 0 };
}

function updateHitSparks(sparks: readonly HitSpark[], dt: number): HitSpark[] {
  return sparks
    .map((s) => ({ ...s, elapsed: s.elapsed + dt }))
    .filter((s) => s.elapsed < 320); // 4 frames × 80ms
}
