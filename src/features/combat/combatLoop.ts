import type {
  CombatAction,
  CombatState,
  CombatPhase,
  FloorTheme,
} from "../../utils/types";
import type { BattleAnimState, AnimFrame } from "../../engine/BattleAnimator";
import type { ParticleSystem } from "../../engine/ParticleSystem";
import type { DamageNumber } from "../../engine/DamageNumbers";
import type {
  BattleRenderState,
  BattleEnemy,
} from "../../engine/BattleRenderer";
import type { CombatEvent } from "./combatTypes";
import type { CombatResult } from "./combatTypes";
import type { GameStateWithPrompt } from "../../state/gameReducer";
import type { GameAction } from "../../state/gameReducer";
import {
  createBattleAnimState,
  queueAnimation,
  updateAnimation,
  isAnimating,
} from "../../engine/BattleAnimator";
import {
  createParticleSystem,
  addParticles,
  updateParticles,
} from "../../engine/ParticleSystem";
import {
  createDamageNumber,
  updateDamageNumbers,
} from "../../engine/DamageNumbers";
import { createDissolveParticles } from "../../engine/PixelDissolve";
import { processPlayerAction, processEnemyTurn } from "./combatStateMachine";
import {
  getDefaultEnemyPositions,
  BATTLE_PLAYER_X,
  BATTLE_PLAYER_Y,
} from "../../engine/BattleRenderer";
import { monsterBattleSprites } from "../../sprites/monsters/battleIndex";
import { AudioSystem } from "../../engine/AudioSystem";

function dispatchCombatResult(
  dispatch: (action: GameAction) => void,
  result: CombatResult,
): void {
  if (result.newPlayerStats) {
    dispatch({
      type: "APPLY_COMBAT_RESULT",
      newCombat: result.state,
      newPlayerStats: result.newPlayerStats,
    });
  } else {
    dispatch({ type: "APPLY_COMBAT_RESULT", newCombat: result.state });
  }
}

export type CombatLoopState = {
  animState: BattleAnimState;
  lastFrame: AnimFrame;
  particles: ParticleSystem;
  damageNumbers: readonly DamageNumber[];
  elapsedMs: number;
  enemyVisible: boolean[];
  rng: () => number;
  localPhase: CombatPhase;
  outcome: "none" | "victory" | "defeat" | "fled";
  lastProcessedTurnIndex: number;
  pendingUnlockedSkills: readonly string[];
};

const IDLE_FRAME: AnimFrame = {
  playerSpriteKey: "idle",
  playerOffset: { x: 0, y: 0 },
  enemySpriteKeys: [],
  enemyOffsets: [],
  flashWhitePlayer: false,
  flashWhiteEnemies: [],
  hitSparks: [],
  screenFlash: null,
  screenShake: null,
  spawnDissolveAt: null,
  finished: false,
};

export function createCombatLoopState(
  combat: CombatState,
  rng: () => number,
): CombatLoopState {
  const count = combat.enemies.length;
  return {
    animState: createBattleAnimState(),
    lastFrame: {
      ...IDLE_FRAME,
      enemySpriteKeys: Array(count).fill("idle"),
      enemyOffsets: Array(count).fill({ x: 0, y: 0 }),
      flashWhiteEnemies: Array(count).fill(false),
    },
    particles: createParticleSystem(),
    damageNumbers: [],
    elapsedMs: 0,
    enemyVisible: Array(count).fill(true),
    rng,
    localPhase: combat.phase,
    outcome: "none",
    lastProcessedTurnIndex: -1,
    pendingUnlockedSkills: [],
  };
}

export function updateCombatLoop(
  loop: CombatLoopState,
  gameState: GameStateWithPrompt,
  dt: number,
  pendingAction: CombatAction | null,
  onActionConsumed: () => void,
  dispatch: (action: GameAction) => void,
): void {
  if (gameState.gameMode.mode !== "combat") return;
  const combat = gameState.gameMode.combat;

  loop.elapsedMs += dt;
  loop.damageNumbers = updateDamageNumbers(loop.damageNumbers, dt);
  loop.particles = updateParticles(loop.particles, dt);

  const { state: newAnimState, frame } = updateAnimation(
    loop.animState,
    dt,
    combat.enemies.length,
  );
  loop.animState = newAnimState;
  loop.lastFrame = frame;

  spawnDissolveIfNeeded(loop, frame, combat);

  const animIdle = !isAnimating(loop.animState);

  if (
    handlePendingAction(
      loop,
      combat,
      gameState,
      pendingAction,
      onActionConsumed,
      dispatch,
      animIdle,
    )
  ) {
    return;
  }

  if (frame.finished) {
    handleAnimationComplete(loop, combat, gameState, dispatch);
  }

  // Fallback: dead-enemy skip queues no animation, so frame.finished never fires.
  // If we're in enemy_turn with idle animations and an unprocessed turn index,
  // trigger handleAnimationComplete directly so the turn chain doesn't stall.
  if (
    !isAnimating(loop.animState) &&
    loop.localPhase === "enemy_turn" &&
    loop.outcome === "none" &&
    loop.lastProcessedTurnIndex !== combat.currentTurnIndex
  ) {
    handleAnimationComplete(loop, combat, gameState, dispatch);
  }
}

function spawnDissolveIfNeeded(
  loop: CombatLoopState,
  frame: AnimFrame,
  combat: CombatState,
): void {
  if (frame.spawnDissolveAt === null) return;
  const idx = frame.spawnDissolveAt;
  const positions = getDefaultEnemyPositions(combat.enemies.length);
  const pos = positions[idx];
  const enemy = combat.enemies[idx];
  if (!pos || !enemy) return;

  const size = enemy.def.spriteSize;
  const spriteFrame =
    monsterBattleSprites[enemy.def.spriteId]?.["idle"]?.frames[0];
  if (spriteFrame) {
    loop.particles = addParticles(
      loop.particles,
      createDissolveParticles(spriteFrame, size, size, pos.x, pos.y),
    );
  }
  loop.enemyVisible = loop.enemyVisible.map((v, j) => (j === idx ? false : v));
}

function handlePendingAction(
  loop: CombatLoopState,
  combat: CombatState,
  gameState: GameStateWithPrompt,
  pendingAction: CombatAction | null,
  onActionConsumed: () => void,
  dispatch: (action: GameAction) => void,
  animIdle: boolean,
): boolean {
  if (
    !pendingAction ||
    !animIdle ||
    loop.localPhase !== "selecting" ||
    loop.outcome !== "none"
  ) {
    return false;
  }
  const result = processPlayerAction(
    combat,
    pendingAction,
    gameState.player.stats,
    loop.rng,
    gameState.demoMode ?? false,
    gameState.companionCombats ?? 0,
  );
  onActionConsumed();
  loop.lastProcessedTurnIndex = -1;
  loop.localPhase = result.state.phase;
  applyEvents(loop, result.events, combat);
  if (pendingAction.type === "skill") {
    dispatch({ type: "INCREMENT_SKILL_USE", skillId: pendingAction.skillId });
  }
  if (pendingAction.type === "item") {
    dispatch({ type: "CONSUME_ITEM", itemId: pendingAction.itemId });
    dispatch({ type: "INCREMENT_ITEMS_USED" });
  }
  dispatchCombatResult(dispatch, result);
  return true;
}

function handleAnimationComplete(
  loop: CombatLoopState,
  combat: CombatState,
  gameState: GameStateWithPrompt,
  dispatch: (action: GameAction) => void,
): void {
  if (loop.outcome === "victory") {
    if ((gameState.companionCombats ?? 0) > 0) {
      dispatch({ type: "DECREMENT_COMPANION" });
    }
    dispatch({
      type: "COMBAT_END_VICTORY",
      unlockedSkills: loop.pendingUnlockedSkills,
    });
    return;
  }
  if (loop.outcome === "defeat") {
    dispatch({ type: "COMBAT_END_DEFEAT" });
    return;
  }
  if (loop.outcome === "fled") {
    dispatch({ type: "SET_GAME_MODE", gameMode: { mode: "exploring" } });
    loop.outcome = "none";
    loop.localPhase = "selecting";
    return;
  }

  if (
    loop.localPhase === "enemy_turn" &&
    loop.lastProcessedTurnIndex !== combat.currentTurnIndex
  ) {
    // Always mark as processed first — prevents re-entry on same index
    loop.lastProcessedTurnIndex = combat.currentTurnIndex;
    const entry = combat.turnOrder[combat.currentTurnIndex];
    if (entry?.kind === "enemy") {
      const result = processEnemyTurn(
        combat,
        entry.index,
        gameState.player.stats,
        loop.rng,
        gameState.demoMode ?? false,
      );
      loop.localPhase = result.state.phase;
      applyEvents(loop, result.events, combat);
      dispatchCombatResult(dispatch, result);
    } else {
      // Unexpected: phase says enemy_turn but entry is player — reset gracefully
      loop.localPhase = "selecting";
    }
  }
}

function applyEvents(
  loop: CombatLoopState,
  events: readonly CombatEvent[],
  combat: CombatState,
): void {
  const positions = getDefaultEnemyPositions(combat.enemies.length);

  for (const event of events) {
    switch (event.kind) {
      case "damage_dealt": {
        loop.animState = queueAnimation(loop.animState, {
          kind: "player_attack",
          targetIndex: event.targetIndex,
          elapsed: 0,
        });
        const pos = positions[event.targetIndex];
        if (pos) {
          loop.damageNumbers = [
            ...loop.damageNumbers,
            createDamageNumber(
              event.damage,
              pos.x + 16,
              pos.y,
              event.isCrit,
              false,
            ),
          ];
        }
        AudioSystem.play(event.isCrit ? "critical" : "attack_hit");
        break;
      }
      case "flee_failed":
        loop.animState = queueAnimation(loop.animState, {
          kind: "hit_reaction_player",
          elapsed: 0,
        });
        loop.damageNumbers = [
          ...loop.damageNumbers,
          createDamageNumber(
            event.damage,
            BATTLE_PLAYER_X + 16,
            BATTLE_PLAYER_Y - 8,
            false,
            false,
          ),
        ];
        AudioSystem.play("enemy_hit");
        break;
      case "reveal":
        // Flash the revealed enemy to show the reveal effect
        loop.animState = queueAnimation(loop.animState, {
          kind: "hit_reaction_enemy",
          targetIndex: event.index,
          elapsed: 0,
        });
        break;
      case "skill_used":
        // Companion events (damage_dealt, buff_applied, reveal) queue the main animation.
        // Queue a minimal flash as fallback in case no companion event fires,
        // so frame.finished can always become true (prevents combat freeze).
        loop.animState = queueAnimation(loop.animState, {
          kind: "screen_flash_white",
          elapsed: 0,
        });
        AudioSystem.play("skill_cast");
        break;
      case "monster_died":
        loop.animState = queueAnimation(loop.animState, {
          kind: "death_dissolve",
          targetIndex: event.index,
          elapsed: 0,
        });
        AudioSystem.play("monster_die");
        break;
      case "buff_applied":
        if (event.buffId === "dodge_next" || event.buffId === "dodge_active") {
          // Dodge: white flash instead of hit reaction to distinguish from taking damage
          loop.animState = queueAnimation(loop.animState, {
            kind: "screen_flash_white",
            elapsed: 0,
          });
          if (event.buffId === "dodge_active") {
            AudioSystem.play("dodge");
          }
        } else if (event.target === "player") {
          loop.animState = queueAnimation(loop.animState, {
            kind: "hit_reaction_player",
            elapsed: 0,
          });
        } else {
          loop.animState = queueAnimation(loop.animState, {
            kind: "hit_reaction_enemy",
            targetIndex: event.target as number,
            elapsed: 0,
          });
        }
        break;
      case "monster_split":
        loop.animState = queueAnimation(loop.animState, {
          kind: "screen_flash_white",
          elapsed: 0,
        });
        // Expand enemyVisible array for the new clone
        loop.enemyVisible = [...loop.enemyVisible, true];
        break;
      case "level_up":
        loop.animState = queueAnimation(loop.animState, {
          kind: "screen_flash_white",
          elapsed: 0,
        });
        loop.pendingUnlockedSkills = [
          ...loop.pendingUnlockedSkills,
          ...event.unlockedSkills,
        ];
        AudioSystem.play("level_up");
        break;
      case "damage_received": {
        const entry = combat.turnOrder[combat.currentTurnIndex];
        const enemyIdx = entry?.kind === "enemy" ? entry.index : 0;
        loop.animState = queueAnimation(loop.animState, {
          kind: "enemy_attack",
          enemyIndex: enemyIdx,
          elapsed: 0,
        });
        loop.animState = queueAnimation(loop.animState, {
          kind: "hit_reaction_player",
          elapsed: 0,
        });
        loop.damageNumbers = [
          ...loop.damageNumbers,
          createDamageNumber(
            event.damage,
            BATTLE_PLAYER_X + 16,
            BATTLE_PLAYER_Y - 8,
            event.isCrit,
            false,
          ),
        ];
        AudioSystem.play("enemy_hit");
        break;
      }
      case "damage_reflected":
        loop.animState = queueAnimation(loop.animState, {
          kind: "hit_reaction_player",
          elapsed: 0,
        });
        loop.damageNumbers = [
          ...loop.damageNumbers,
          createDamageNumber(
            event.damage,
            BATTLE_PLAYER_X + 16,
            BATTLE_PLAYER_Y - 8,
            false,
            false,
          ),
        ];
        AudioSystem.play("enemy_hit");
        break;
      case "monster_summon":
        loop.animState = queueAnimation(loop.animState, {
          kind: "screen_flash_white",
          elapsed: 0,
        });
        loop.enemyVisible = [...loop.enemyVisible, true];
        break;
      case "buff_stolen":
        loop.animState = queueAnimation(loop.animState, {
          kind: "hit_reaction_player",
          elapsed: 0,
        });
        break;
      case "boss_phase_shift":
        loop.animState = queueAnimation(loop.animState, {
          kind: "boss_phase_shift",
          elapsed: 0,
        });
        AudioSystem.play("boss_appear");
        break;
      case "boss_enrage":
        loop.animState = queueAnimation(loop.animState, {
          kind: "hit_reaction_enemy",
          targetIndex: 0,
          elapsed: 0,
        });
        break;
      case "combat_won":
        loop.animState = queueAnimation(loop.animState, {
          kind: "transition_out",
          elapsed: 0,
        });
        loop.outcome = "victory";
        AudioSystem.play("victory");
        break;
      case "combat_lost":
        loop.animState = queueAnimation(loop.animState, {
          kind: "transition_out",
          elapsed: 0,
        });
        loop.outcome = "defeat";
        AudioSystem.play("game_over");
        break;
      case "fled":
        loop.animState = queueAnimation(loop.animState, {
          kind: "transition_out",
          elapsed: 0,
        });
        loop.outcome = "fled";
        AudioSystem.play("flee");
        break;
      case "item_used":
        loop.animState = queueAnimation(loop.animState, {
          kind: "screen_flash_white",
          elapsed: 0,
        });
        AudioSystem.play("item_used");
        break;
      case "companion_attack": {
        loop.animState = queueAnimation(loop.animState, {
          kind: "hit_reaction_enemy",
          targetIndex: event.targetIndex,
          elapsed: 0,
        });
        const cPos = positions[event.targetIndex];
        if (cPos) {
          loop.damageNumbers = [
            ...loop.damageNumbers,
            createDamageNumber(event.damage, cPos.x + 16, cPos.y, false, false),
          ];
        }
        AudioSystem.play("player_hit");
        break;
      }
      case "boss_absorb_attack":
        loop.animState = queueAnimation(loop.animState, {
          kind: "screen_flash_white",
          elapsed: 0,
        });
        AudioSystem.play("enemy_hit");
        break;
    }
  }
}

export function buildBattleRenderState(
  loop: CombatLoopState,
  combat: CombatState,
  theme: FloorTheme,
): BattleRenderState {
  const frame = loop.lastFrame;
  const positions = getDefaultEnemyPositions(combat.enemies.length);

  const enemies: BattleEnemy[] = combat.enemies.map((e, i) => ({
    spriteId: e.def.spriteId,
    spriteSize: e.def.spriteSize,
    animKey: frame.enemySpriteKeys[i] ?? "idle",
    x: positions[i]?.x ?? 0,
    y: 24,
    hpPercent: e.def.hp > 0 ? e.currentHp / e.def.hp : 0,
    maxHp: e.def.hp,
    currentHp: e.currentHp,
    name: e.def.name,
    flashWhite: frame.flashWhiteEnemies[i] ?? false,
    visible: loop.enemyVisible[i] ?? true,
    offsetX: frame.enemyOffsets[i]?.x ?? 0,
    offsetY: frame.enemyOffsets[i]?.y ?? 0,
  }));

  return {
    theme,
    elapsedMs: loop.elapsedMs,
    enemies,
    player: {
      animKey: frame.playerSpriteKey,
      x: BATTLE_PLAYER_X,
      y: BATTLE_PLAYER_Y,
      offsetX: frame.playerOffset.x,
      offsetY: frame.playerOffset.y,
      flashWhite: frame.flashWhitePlayer,
    },
    particles: loop.particles,
    damageNumbers: loop.damageNumbers,
    screenFlash: frame.screenFlash,
    screenShake: frame.screenShake,
    hitSparks: frame.hitSparks,
  };
}
