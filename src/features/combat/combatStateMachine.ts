import type {
  CombatState,
  MonsterState,
  PlayerStats,
  Buff,
} from "../../utils/types";
import {
  calculateTurnOrder,
  calculateFleeChance,
  checkLevelUp,
} from "./combatFormulas";
import {
  resolvePlayerAttack,
  resolveSkill,
  resolveMonsterAttack,
} from "./combatActions";
import { chooseMonsterAction } from "./monsterAI";
import { SKILLS_MAP } from "../../data/skills";
import { STRINGS } from "../../data/strings";

export type CombatEvent =
  | {
      readonly kind: "damage_dealt";
      readonly targetIndex: number;
      readonly damage: number;
      readonly isCrit: boolean;
    }
  | {
      readonly kind: "damage_received";
      readonly damage: number;
      readonly isCrit: boolean;
    }
  | { readonly kind: "monster_died"; readonly index: number }
  | {
      readonly kind: "monster_split";
      readonly sourceIndex: number;
      readonly clone: MonsterState;
    }
  | {
      readonly kind: "skill_used";
      readonly skillId: string;
      readonly mpCost: number;
    }
  | { readonly kind: "reveal"; readonly index: number }
  | { readonly kind: "fled" }
  | { readonly kind: "flee_failed"; readonly damage: number }
  | {
      readonly kind: "buff_applied";
      readonly buffId: string;
      readonly turns: number;
    }
  | {
      readonly kind: "combat_won";
      readonly expGained: number;
      readonly goldGained: number;
    }
  | { readonly kind: "combat_lost" }
  | {
      readonly kind: "level_up";
      readonly newLevel: number;
      readonly unlockedSkills: readonly string[];
    };

export type CombatResult = {
  readonly state: CombatState;
  readonly events: readonly CombatEvent[];
  readonly newPlayerStats?: PlayerStats;
  readonly logEntries: readonly string[];
};

export function initCombat(
  enemies: readonly MonsterState[],
  playerStats: PlayerStats,
): CombatState {
  const turnOrder = calculateTurnOrder(playerStats.spd, enemies);
  return {
    enemies,
    turn: 1,
    isPlayerTurn: turnOrder[0]?.kind === "player",
    log: { entries: [] },
    phase: turnOrder[0]?.kind === "player" ? "selecting" : "enemy_turn",
    turnOrder,
    currentTurnIndex: 0,
    selectedTarget: 0,
    revealedEnemies: [],
    bossEntangledTurns: 0,
  };
}

function firstAliveIndex(enemies: readonly MonsterState[]): number {
  const idx = enemies.findIndex((e) => e.currentHp > 0);
  return idx >= 0 ? idx : 0;
}

export function processPlayerAction(
  state: CombatState,
  action: import("../../utils/types").CombatAction,
  playerStats: PlayerStats,
  rng: () => number,
): CombatResult {
  const events: CombatEvent[] = [];
  const log: string[] = [];
  let enemies = [...state.enemies];
  let newPlayerStats: PlayerStats | undefined;
  let newState = { ...state };

  switch (action.type) {
    case "attack": {
      const rawTarget = action.targetIndex;
      const targetIdx =
        enemies[rawTarget]?.currentHp > 0
          ? rawTarget
          : firstAliveIndex(enemies);
      const result = resolvePlayerAttack(playerStats, targetIdx, enemies, rng);
      if (!result) break;

      events.push({
        kind: "damage_dealt",
        targetIndex: targetIdx,
        damage: result.damage,
        isCrit: result.isCrit,
      });
      log.push(
        STRINGS.playerAttacks.replace(
          "{0}",
          enemies[targetIdx]?.def.name ?? "",
        ),
      );
      log.push(
        result.isCrit
          ? STRINGS.playerDealsCrit.replace("{0}", String(result.damage))
          : STRINGS.playerDealsNormal.replace("{0}", String(result.damage)),
      );

      enemies = applyDamageToEnemy(
        enemies,
        targetIdx,
        result.damage,
        events,
        log,
        state,
      );
      break;
    }

    case "skill": {
      const skill = SKILLS_MAP[action.skillId];
      if (!skill || playerStats.mp < skill.mpCost) {
        log.push(STRINGS.skillNoMp);
        break;
      }

      events.push({
        kind: "skill_used",
        skillId: action.skillId,
        mpCost: skill.mpCost,
      });
      log.push(STRINGS.playerUsesSkill.replace("{0}", skill.name));

      const rawSkillTarget = action.targetIndex;
      const skillTarget =
        enemies[rawSkillTarget]?.currentHp > 0
          ? rawSkillTarget
          : firstAliveIndex(enemies);
      const result = resolveSkill(
        action.skillId,
        playerStats,
        skillTarget,
        enemies,
        rng,
      );

      if (result.kind === "damage") {
        events.push({
          kind: "damage_dealt",
          targetIndex: result.targetIndex,
          damage: result.damage,
          isCrit: result.isCrit,
        });
        log.push(
          result.isCrit
            ? STRINGS.playerDealsCrit.replace("{0}", String(result.damage))
            : STRINGS.playerDealsNormal.replace("{0}", String(result.damage)),
        );
        enemies = applyDamageToEnemy(
          enemies,
          result.targetIndex,
          result.damage,
          events,
          log,
          state,
        );
      } else if (result.kind === "reveal") {
        events.push({ kind: "reveal", index: result.targetIndex });
        const enemy = enemies[result.targetIndex];
        if (enemy) {
          log.push(
            STRINGS.skillRenameVariable
              .replace("{0}", enemy.def.name)
              .replace("{1}", String(enemy.def.atk))
              .replace("{2}", String(enemy.def.def))
              .replace("{3}", String(enemy.def.spd)),
          );
        }
        newState = {
          ...newState,
          revealedEnemies: [...state.revealedEnemies, result.targetIndex],
        };
      }

      const mp = Math.max(0, playerStats.mp - skill.mpCost);
      newPlayerStats = { ...playerStats, mp };
      break;
    }

    case "flee": {
      const success = calculateFleeChance(rng);
      if (success) {
        events.push({ kind: "fled" });
        log.push(STRINGS.fleeSuccess);
      } else {
        // Enemy free hit
        const firstEnemy = enemies.find((e) => e.currentHp > 0);
        if (firstEnemy) {
          const hit = resolveMonsterAttack(firstEnemy, playerStats, rng);
          events.push({ kind: "flee_failed", damage: hit.damage });
          log.push(STRINGS.fleeFail.replace("{0}", firstEnemy.def.name));
          log.push(
            hit.isCrit
              ? STRINGS.enemyDealsCrit.replace("{0}", String(hit.damage))
              : STRINGS.enemyDealsNormal.replace("{0}", String(hit.damage)),
          );
          const hp = Math.max(0, playerStats.hp - hit.damage);
          newPlayerStats = { ...(newPlayerStats ?? playerStats), hp };
          if (hp <= 0) events.push({ kind: "combat_lost" });
        }
      }
      break;
    }

    default:
      break;
  }

  // Check victory
  const aliveEnemies = enemies.filter((e) => e.currentHp > 0);
  if (aliveEnemies.length === 0 && action.type !== "flee") {
    const totalExp = state.enemies.reduce((s, e) => s + e.def.exp, 0);
    const totalGold = state.enemies.reduce((s, e) => s + e.def.gold, 0);
    events.push({
      kind: "combat_won",
      expGained: totalExp,
      goldGained: totalGold,
    });

    const statsForLevel = newPlayerStats ?? playerStats;
    const withRewards: PlayerStats = {
      ...statsForLevel,
      exp: statsForLevel.exp + totalExp,
      gold: statsForLevel.gold + totalGold,
    };
    const levelResult = checkLevelUp(withRewards);
    newPlayerStats = levelResult.newStats;
    if (levelResult.didLevel) {
      events.push({
        kind: "level_up",
        newLevel: levelResult.newStats.level,
        unlockedSkills: levelResult.unlockedSkills,
      });
    }
  }

  // Advance turn
  const nextTurnIndex = (state.currentTurnIndex + 1) % state.turnOrder.length;
  const nextEntry = state.turnOrder[nextTurnIndex];
  const nextIsPlayer = nextEntry?.kind === "player";

  newState = {
    ...newState,
    enemies,
    turn: nextIsPlayer ? state.turn + 1 : state.turn,
    isPlayerTurn: nextIsPlayer,
    phase: nextIsPlayer ? "selecting" : "enemy_turn",
    currentTurnIndex: nextTurnIndex,
    log: { entries: [...state.log.entries, ...log] },
  };

  return { state: newState, events, newPlayerStats, logEntries: log };
}

export function processEnemyTurn(
  state: CombatState,
  enemyIndex: number,
  playerStats: PlayerStats,
  rng: () => number,
): CombatResult {
  const events: CombatEvent[] = [];
  const log: string[] = [];
  let enemies = [...state.enemies];
  let newPlayerStats: PlayerStats | undefined;
  let newState = { ...state };

  const monster = enemies[enemyIndex];
  if (!monster || monster.currentHp <= 0) {
    return advanceToNextTurn(state, events, log, newPlayerStats);
  }

  const aiResult = chooseMonsterAction(monster, state, rng);

  if (aiResult.entanglePlayer) {
    events.push({ kind: "buff_applied", buffId: "entangled", turns: 2 });
    log.push(STRINGS.bossEntangle.replace("{0}", monster.def.name));
    newState = { ...newState, bossEntangledTurns: 2 };
  }

  // Handle split
  if (aiResult.shouldSplit) {
    const clone: MonsterState = {
      ...monster,
      currentHp: Math.floor(monster.def.hp / 4),
      buffs: [
        {
          id: "already_split",
          name: "已分裂",
          turnsRemaining: 99,
          effect: "split_flag",
        },
      ],
    };
    const markedMonster: MonsterState = {
      ...monster,
      buffs: [
        ...monster.buffs,
        {
          id: "already_split",
          name: "已分裂",
          turnsRemaining: 99,
          effect: "split_flag",
        },
      ],
    };
    enemies = enemies.map((e, i) => (i === enemyIndex ? markedMonster : e));
    events.push({ kind: "monster_split", sourceIndex: enemyIndex, clone });
    log.push(STRINGS.duplicateSplits.replace("{0}", monster.def.name));
    enemies = [...enemies, clone];
  }

  // Resolve attack
  const hit = resolveMonsterAttack(monster, playerStats, rng);
  events.push({
    kind: "damage_received",
    damage: hit.damage,
    isCrit: hit.isCrit,
  });
  log.push(STRINGS.enemyAttacks.replace("{0}", monster.def.name));
  log.push(
    hit.isCrit
      ? STRINGS.enemyDealsCrit.replace("{0}", String(hit.damage))
      : STRINGS.enemyDealsNormal.replace("{0}", String(hit.damage)),
  );

  const newHp = Math.max(0, playerStats.hp - hit.damage);
  newPlayerStats = { ...playerStats, hp: newHp };
  if (newHp <= 0) events.push({ kind: "combat_lost" });

  // Tick entangle
  const entangledTurns = Math.max(0, (newState.bossEntangledTurns ?? 0) - 1);
  newState = { ...newState, enemies, bossEntangledTurns: entangledTurns };

  return advanceToNextTurn(
    { ...newState, log: { entries: [...state.log.entries, ...log] } },
    events,
    log,
    newPlayerStats,
  );
}

function advanceToNextTurn(
  state: CombatState,
  events: CombatEvent[],
  log: string[],
  newPlayerStats: PlayerStats | undefined,
): CombatResult {
  const nextTurnIndex = (state.currentTurnIndex + 1) % state.turnOrder.length;
  const nextEntry = state.turnOrder[nextTurnIndex];
  const nextIsPlayer = nextEntry?.kind === "player";

  const newState: CombatState = {
    ...state,
    turn: nextIsPlayer ? state.turn + 1 : state.turn,
    isPlayerTurn: nextIsPlayer,
    phase: nextIsPlayer ? "selecting" : "enemy_turn",
    currentTurnIndex: nextTurnIndex,
  };

  return { state: newState, events, newPlayerStats, logEntries: log };
}

function applyDamageToEnemy(
  enemies: MonsterState[],
  targetIndex: number,
  damage: number,
  events: CombatEvent[],
  log: string[],
  state: CombatState,
): MonsterState[] {
  const updated = enemies.map((e, i) => {
    if (i !== targetIndex) return e;
    return { ...e, currentHp: Math.max(0, e.currentHp - damage) };
  });

  const target = updated[targetIndex];
  if (target && target.currentHp <= 0) {
    events.push({ kind: "monster_died", index: targetIndex });
    log.push(
      STRINGS.monsterDefeated
        .replace("{0}", target.def.name)
        .replace("{1}", String(target.def.exp))
        .replace("{2}", String(target.def.gold)),
    );
  }

  return updated;
}
