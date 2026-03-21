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
import type { CombatEvent } from "./combatStateMachine";
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
  );
  onActionConsumed();
  loop.lastProcessedTurnIndex = -1;
  loop.localPhase = result.state.phase;
  applyEvents(loop, result.events, combat);
  if (result.newPlayerStats) {
    dispatch({
      type: "APPLY_COMBAT_RESULT",
      newCombat: result.state,
      newPlayerStats: result.newPlayerStats,
    });
  } else {
    dispatch({ type: "APPLY_COMBAT_RESULT", newCombat: result.state });
  }
  return true;
}

function handleAnimationComplete(
  loop: CombatLoopState,
  combat: CombatState,
  gameState: GameStateWithPrompt,
  dispatch: (action: GameAction) => void,
): void {
  if (loop.outcome === "victory") {
    dispatch({
      type: "COMBAT_END_VICTORY",
      newPlayerStats: gameState.player.stats,
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
    const entry = combat.turnOrder[combat.currentTurnIndex];
    if (entry?.kind === "enemy") {
      loop.lastProcessedTurnIndex = combat.currentTurnIndex;
      const result = processEnemyTurn(
        combat,
        entry.index,
        gameState.player.stats,
        loop.rng,
      );
      loop.localPhase = result.state.phase;
      applyEvents(loop, result.events, combat);
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
        // TODO: queue player_skill animation distinct from basic attack
        break;
      case "monster_died":
        loop.animState = queueAnimation(loop.animState, {
          kind: "death_dissolve",
          targetIndex: event.index,
          elapsed: 0,
        });
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
        break;
      }
      case "combat_won":
        loop.animState = queueAnimation(loop.animState, {
          kind: "transition_out",
          elapsed: 0,
        });
        loop.outcome = "victory";
        break;
      case "combat_lost":
        loop.animState = queueAnimation(loop.animState, {
          kind: "transition_out",
          elapsed: 0,
        });
        loop.outcome = "defeat";
        break;
      case "fled":
        loop.animState = queueAnimation(loop.animState, {
          kind: "transition_out",
          elapsed: 0,
        });
        loop.outcome = "fled";
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
