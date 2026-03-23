import type { CombatState, MonsterState, PlayerStats } from "../../utils/types";
import type { CombatEvent, CombatResult } from "./combatTypes";
import { resolveMonsterAttack } from "./combatActions";
import { chooseMonsterAction } from "./monsterAI";
import { advanceToNextTurn } from "./combatShared";
import { applyBigBallAbility } from "./bossEffects";
import { clampHpDemoMode, formatEnemyDamageLog } from "./combatHelpers";
import { STRINGS } from "../../data/strings";

export function processEnemyTurn(
  state: CombatState,
  enemyIndex: number,
  playerStats: PlayerStats,
  rng: () => number,
  isDemoMode = false,
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

  // Stunned: skip turn, decrement buff
  const stunnedBuff = monster.buffs.find((b) => b.id === "stunned" && b.turnsRemaining > 0);
  if (stunnedBuff) {
    const updatedBuffs = monster.buffs.map((b) => b.id === "stunned" ? { ...b, turnsRemaining: b.turnsRemaining - 1 } : b);
    enemies = enemies.map((e, i) => i === enemyIndex ? { ...e, buffs: updatedBuffs } : e);
    events.push({ kind: "buff_applied", buffId: "stunned", turns: stunnedBuff.turnsRemaining - 1, target: enemyIndex });
    log.push(STRINGS.monsterStunned.replace("{0}", monster.def.name));
    newState = { ...newState, enemies };
    return advanceToNextTurn({ ...newState, log: { entries: [...state.log.entries, ...log] } }, events, log, newPlayerStats);
  }

  // Tick weakened buff
  enemies = enemies.map((e, i) => {
    if (i !== enemyIndex) return e;
    const updatedBuffs = e.buffs.map((b) => b.id === "weakened" ? { ...b, turnsRemaining: b.turnsRemaining - 1 } : b).filter((b) => b.turnsRemaining > 0);
    return { ...e, buffs: updatedBuffs };
  });

  const aiResult = chooseMonsterAction(enemies[enemyIndex]!, state, rng);

  if (aiResult.entanglePlayer) {
    events.push({ kind: "buff_applied", buffId: "entangled", turns: 2, target: "player" });
    log.push(STRINGS.bossEntangle.replace("{0}", monster.def.name));
    newState = { ...newState, bossEntangledTurns: 2 };
  }

  // Split (duplicate_code)
  if (aiResult.shouldSplit) {
    const clone: MonsterState = { ...monster, currentHp: Math.floor(monster.def.hp / 4), buffs: [{ id: "already_split", name: "已分裂", turnsRemaining: 99, effect: "split_flag" }] };
    const markedMonster: MonsterState = { ...monster, buffs: [...monster.buffs, { id: "already_split", name: "已分裂", turnsRemaining: 99, effect: "split_flag" }] };
    enemies = [...enemies.map((e, i) => i === enemyIndex ? markedMonster : e), clone];
    events.push({ kind: "monster_split", sourceIndex: enemyIndex, clone });
    log.push(STRINGS.duplicateSplits.replace("{0}", monster.def.name));
  }

  // Lazy class: skip
  if (aiResult.shouldSkip) {
    log.push(STRINGS.lazyClassSkip.replace("{0}", monster.def.name));
    events.push({ kind: "buff_applied", buffId: "lazy_skip", turns: 0, target: enemyIndex });
    newState = { ...newState, enemies };
    return advanceToNextTurn({ ...newState, log: { entries: [...state.log.entries, ...log] } }, events, log, newPlayerStats);
  }

  // n_plus_one: summon
  if (aiResult.shouldSummon) {
    const clone: MonsterState = { def: monster.def, currentHp: Math.floor(monster.def.hp / 2), position: monster.position, buffs: [] };
    const summonedMonster: MonsterState = { ...monster, buffs: [...monster.buffs, { id: "already_summoned", name: "已召喚", turnsRemaining: 999, effect: "summon_flag" }] };
    enemies = [...enemies.map((e, i) => i === enemyIndex ? summonedMonster : e), clone];
    events.push({ kind: "monster_summon", newMonster: clone });
    log.push(STRINGS.monsterSummon.replace("{0}", monster.def.name));
  }

  // boss_big_ball abilities
  if (monster.def.behavior === "boss_big_ball" && aiResult.bigBallAbility) {
    const bigBallResult = applyBigBallAbility(monster, enemyIndex, enemies, aiResult, events, log, newState);
    enemies = bigBallResult.enemies;
    newState = bigBallResult.newState;
  }

  // Player dodge
  if (state.playerDodgeTurns > 0) {
    newState = { ...newState, playerDodgeTurns: 0 };
    events.push({ kind: "buff_applied", buffId: "dodge_active", turns: 0, target: "player" });
    log.push(STRINGS.playerDodged.replace("{0}", monster.def.name));
    newState = { ...newState, enemies };
    return advanceToNextTurn({ ...newState, log: { entries: [...state.log.entries, ...log] } }, events, log, newPlayerStats);
  }

  // Resolve attacks
  const currentMonster = enemies[enemyIndex]!;
  const isEnraged = currentMonster.def.behavior === "boss_god_class" && newState.bossPhase >= 3;
  const totalAttacks = isEnraged ? 2 : aiResult.hitCount;
  const heavyHitMult = currentMonster.def.behavior === "boss_big_ball" && aiResult.bigBallAbility === "heavy_hit" ? 1.5 : 1.0;
  const bigBallHealOnly = currentMonster.def.behavior === "boss_big_ball" && (aiResult.bigBallAbility === "self_heal" || aiResult.bigBallAbility === "steal_heal");

  if (!bigBallHealOnly) {
    if (aiResult.hitCount > 1) log.push(STRINGS.shotgunSurgery.replace("{0}", monster.def.name).replace("{1}", String(aiResult.hitCount)));
    log.push(STRINGS.enemyAttacks.replace("{0}", monster.def.name));
  }

  let totalDmg = 0;
  if (!bigBallHealOnly) {
    for (let a = 0; a < totalAttacks; a++) {
      const hit = resolveMonsterAttack(currentMonster, playerStats, rng);
      const finalDmg = Math.max(1, Math.round(hit.damage * heavyHitMult));
      totalDmg += finalDmg;
      events.push({ kind: "damage_received", damage: finalDmg, isCrit: hit.isCrit });
      log.push(formatEnemyDamageLog(finalDmg, hit.isCrit));
    }
  }

  const rawNewHp = Math.max(0, playerStats.hp - totalDmg);
  const newHp = clampHpDemoMode(rawNewHp, isDemoMode);
  newPlayerStats = { ...playerStats, hp: newHp };
  if (newHp <= 0) events.push({ kind: "combat_lost" });

  const entangledTurns = Math.max(0, (newState.bossEntangledTurns ?? 0) - 1);
  newState = { ...newState, enemies, bossEntangledTurns: entangledTurns };

  return advanceToNextTurn({ ...newState, log: { entries: [...state.log.entries, ...log] } }, events, log, newPlayerStats);
}
