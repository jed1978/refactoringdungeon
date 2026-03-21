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
      readonly target: "player" | number;
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
    }
  | { readonly kind: "damage_reflected"; readonly damage: number }
  | {
      readonly kind: "monster_summon";
      readonly newMonster: MonsterState;
    }
  | { readonly kind: "buff_stolen"; readonly buffId: string }
  | { readonly kind: "boss_phase_shift"; readonly newPhase: number }
  | { readonly kind: "boss_enrage" };

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
    floorMonsterIndex: 0,
    playerDodgeTurns: 0,
    bossPhase: 0,
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
        state,
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
      } else if (result.kind === "stun") {
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
        // Apply stun buff to the target monster (if still alive)
        const targetAfterDamage = enemies[result.targetIndex];
        if (targetAfterDamage && targetAfterDamage.currentHp > 0) {
          const stunBuff: Buff = {
            id: "stunned",
            name: "眩暈",
            turnsRemaining: 1,
            effect: "stunned",
          };
          enemies = enemies.map((e, i) =>
            i === result.targetIndex
              ? { ...e, buffs: [...e.buffs, stunBuff] }
              : e,
          );
          events.push({
            kind: "buff_applied",
            buffId: "stunned",
            turns: 1,
            target: result.targetIndex,
          });
          log.push(
            STRINGS.skillStun.replace(
              "{0}",
              enemies[result.targetIndex]?.def.name ?? "",
            ),
          );
        }
      } else if (result.kind === "buff_self") {
        // dodge_next: track on combat state
        newState = { ...newState, playerDodgeTurns: 1 };
        events.push({
          kind: "buff_applied",
          buffId: result.buffId,
          turns: 1,
          target: "player",
        });
        log.push(STRINGS.skillDodgeNext);
      } else if (result.kind === "aoe") {
        log.push(STRINGS.skillAoe);
        for (const hit of result.hits) {
          events.push({
            kind: "damage_dealt",
            targetIndex: hit.targetIndex,
            damage: hit.damage,
            isCrit: hit.isCrit,
          });
          log.push(
            hit.isCrit
              ? STRINGS.playerDealsCrit.replace("{0}", String(hit.damage))
              : STRINGS.playerDealsNormal.replace("{0}", String(hit.damage)),
          );
          enemies = applyDamageToEnemy(
            enemies,
            hit.targetIndex,
            hit.damage,
            events,
            log,
            state,
          );
        }
      } else if (result.kind === "weaken") {
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
        // Apply weakened debuff to the target (if still alive)
        const targetAfterDamage = enemies[result.targetIndex];
        if (targetAfterDamage && targetAfterDamage.currentHp > 0) {
          const weakenBuff: Buff = {
            id: "weakened",
            name: "能力削弱",
            turnsRemaining: 2,
            effect: "weakened",
          };
          enemies = enemies.map((e, i) =>
            i === result.targetIndex
              ? { ...e, buffs: [...e.buffs, weakenBuff] }
              : e,
          );
          events.push({
            kind: "buff_applied",
            buffId: "weakened",
            turns: 2,
            target: result.targetIndex,
          });
          log.push(
            STRINGS.skillWeaken.replace(
              "{0}",
              enemies[result.targetIndex]?.def.name ?? "",
            ),
          );
        }
      } else if (result.kind === "chain") {
        log.push(STRINGS.skillChain);
        for (const hit of result.hits) {
          events.push({
            kind: "damage_dealt",
            targetIndex: hit.targetIndex,
            damage: hit.damage,
            isCrit: hit.isCrit,
          });
          log.push(
            hit.isCrit
              ? STRINGS.playerDealsCrit.replace("{0}", String(hit.damage))
              : STRINGS.playerDealsNormal.replace("{0}", String(hit.damage)),
          );
          enemies = applyDamageToEnemy(
            enemies,
            hit.targetIndex,
            hit.damage,
            events,
            log,
            state,
          );
        }
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

  // Boss special effects after player action
  if (action.type !== "flee") {
    const primaryIdx =
      action.type === "attack" || action.type === "skill"
        ? action.targetIndex
        : -1;
    if (primaryIdx >= 0) {
      const originalEnemy = state.enemies[primaryIdx];
      const updatedEnemy = enemies[primaryIdx];
      if (originalEnemy && updatedEnemy && updatedEnemy.currentHp > 0) {
        // Reflect damage for circular dependency boss
        if (originalEnemy.def.behavior === "boss_circular_dep") {
          const dmgDealt = events
            .filter(
              (e): e is Extract<typeof e, { kind: "damage_dealt" }> =>
                e.kind === "damage_dealt" && e.targetIndex === primaryIdx,
            )
            .reduce((s, e) => s + e.damage, 0);
          if (dmgDealt > 0) {
            const reflectDmg = Math.max(1, Math.floor(dmgDealt * 0.3));
            events.push({ kind: "damage_reflected", damage: reflectDmg });
            const hp = Math.max(
              0,
              (newPlayerStats ?? playerStats).hp - reflectDmg,
            );
            newPlayerStats = { ...(newPlayerStats ?? playerStats), hp };
            if (hp <= 0) events.push({ kind: "combat_lost" });
            log.push(
              STRINGS.damageReflected.replace("{0}", String(reflectDmg)),
            );
          }
        }
        // Phase shift for god class boss
        if (originalEnemy.def.behavior === "boss_god_class") {
          const hpPct = updatedEnemy.currentHp / originalEnemy.def.hp;
          let bossPhase = newState.bossPhase;
          if (hpPct < 0.75 && bossPhase < 1) {
            bossPhase = 1;
            events.push({ kind: "boss_phase_shift", newPhase: 1 });
            newState = { ...newState, bossPhase };
            log.push(
              STRINGS.bossPhaseShift
                .replace("{0}", originalEnemy.def.name)
                .replace("{1}", "2"),
            );
          }
          if (hpPct < 0.5 && bossPhase < 2) {
            bossPhase = 2;
            events.push({ kind: "boss_phase_shift", newPhase: 2 });
            newState = { ...newState, bossPhase };
            log.push(
              STRINGS.bossPhaseShift
                .replace("{0}", originalEnemy.def.name)
                .replace("{1}", "3"),
            );
          }
          if (hpPct < 0.25 && bossPhase < 3) {
            bossPhase = 3;
            events.push({ kind: "boss_phase_shift", newPhase: 3 });
            events.push({ kind: "boss_enrage" });
            newState = { ...newState, bossPhase };
            log.push(STRINGS.bossEnrage.replace("{0}", originalEnemy.def.name));
          }
        }
      }
    }
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

  // Flee fail: penalize with free hit but return control to player (no extra enemy turn)
  const fleeFailed = events.some((e) => e.kind === "flee_failed");
  if (fleeFailed) {
    newState = {
      ...newState,
      enemies,
      isPlayerTurn: true,
      phase: "selecting",
      log: { entries: [...state.log.entries, ...log] },
    };
    return { state: newState, events, newPlayerStats, logEntries: log };
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

  // Check if monster is stunned
  const stunnedBuff = monster.buffs.find(
    (b) => b.id === "stunned" && b.turnsRemaining > 0,
  );
  if (stunnedBuff) {
    // Decrement stun, monster skips turn
    const updatedBuffs = monster.buffs.map((b) =>
      b.id === "stunned" ? { ...b, turnsRemaining: b.turnsRemaining - 1 } : b,
    );
    enemies = enemies.map((e, i) =>
      i === enemyIndex ? { ...e, buffs: updatedBuffs } : e,
    );
    events.push({
      kind: "buff_applied",
      buffId: "stunned",
      turns: stunnedBuff.turnsRemaining - 1,
      target: enemyIndex,
    });
    log.push(STRINGS.monsterStunned.replace("{0}", monster.def.name));
    newState = { ...newState, enemies };
    return advanceToNextTurn(
      { ...newState, log: { entries: [...state.log.entries, ...log] } },
      events,
      log,
      newPlayerStats,
    );
  }

  // Tick weakened buff on monster
  enemies = enemies.map((e, i) => {
    if (i !== enemyIndex) return e;
    const updatedBuffs = e.buffs
      .map((b) =>
        b.id === "weakened"
          ? { ...b, turnsRemaining: b.turnsRemaining - 1 }
          : b,
      )
      .filter((b) => b.turnsRemaining > 0);
    return { ...e, buffs: updatedBuffs };
  });

  const aiResult = chooseMonsterAction(enemies[enemyIndex]!, state, rng);

  if (aiResult.entanglePlayer) {
    events.push({
      kind: "buff_applied",
      buffId: "entangled",
      turns: 2,
      target: "player",
    });
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

  // lazy_class: skip turn
  if (aiResult.shouldSkip) {
    log.push(STRINGS.lazyClassSkip.replace("{0}", monster.def.name));
    events.push({
      kind: "buff_applied",
      buffId: "lazy_skip",
      turns: 0,
      target: enemyIndex,
    });
    newState = { ...newState, enemies };
    return advanceToNextTurn(
      { ...newState, log: { entries: [...state.log.entries, ...log] } },
      events,
      log,
      newPlayerStats,
    );
  }

  // n_plus_one: summon a copy (once per combat)
  if (aiResult.shouldSummon) {
    const clone: MonsterState = {
      def: monster.def,
      currentHp: Math.floor(monster.def.hp / 2),
      position: monster.position,
      buffs: [],
    };
    const summonedMonster: MonsterState = {
      ...monster,
      buffs: [
        ...monster.buffs,
        {
          id: "already_summoned",
          name: "已召喚",
          turnsRemaining: 999,
          effect: "summon_flag",
        },
      ],
    };
    enemies = enemies.map((e, i) => (i === enemyIndex ? summonedMonster : e));
    events.push({ kind: "monster_summon", newMonster: clone });
    log.push(STRINGS.monsterSummon.replace("{0}", monster.def.name));
    enemies = [...enemies, clone];
  }

  // Check player dodge
  if (state.playerDodgeTurns > 0) {
    newState = { ...newState, playerDodgeTurns: 0 };
    events.push({
      kind: "buff_applied",
      buffId: "dodge_active",
      turns: 0,
      target: "player",
    });
    log.push(STRINGS.playerDodged.replace("{0}", monster.def.name));
    newState = { ...newState, enemies };
    return advanceToNextTurn(
      { ...newState, log: { entries: [...state.log.entries, ...log] } },
      events,
      log,
      newPlayerStats,
    );
  }

  // Resolve attack(s)
  const currentMonster = enemies[enemyIndex]!;
  const hitCount = aiResult.hitCount;
  const isEnraged =
    currentMonster.def.behavior === "boss_god_class" && newState.bossPhase >= 3;
  const totalAttacks = isEnraged ? 2 : hitCount;

  if (hitCount > 1) {
    log.push(
      STRINGS.shotgunSurgery
        .replace("{0}", monster.def.name)
        .replace("{1}", String(hitCount)),
    );
  }
  log.push(STRINGS.enemyAttacks.replace("{0}", monster.def.name));

  let totalDmg = 0;
  for (let a = 0; a < totalAttacks; a++) {
    const hit = resolveMonsterAttack(currentMonster, playerStats, rng);
    totalDmg += hit.damage;
    events.push({
      kind: "damage_received",
      damage: hit.damage,
      isCrit: hit.isCrit,
    });
    log.push(
      hit.isCrit
        ? STRINGS.enemyDealsCrit.replace("{0}", String(hit.damage))
        : STRINGS.enemyDealsNormal.replace("{0}", String(hit.damage)),
    );
  }

  const newHp = Math.max(0, playerStats.hp - totalDmg);
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
  _state: CombatState,
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
