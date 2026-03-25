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

  // Stunned: skip turn, decrement buff, decay stun resistance
  const stunnedBuff = monster.buffs.find(
    (b) => b.id === "stunned" && b.turnsRemaining > 0,
  );
  if (stunnedBuff) {
    const updatedBuffs = monster.buffs.map((b) =>
      b.id === "stunned" ? { ...b, turnsRemaining: b.turnsRemaining - 1 } : b,
    );
    const decayedResistance = Math.max(0, (monster.stunResistance ?? 0) - 0.15);
    enemies = enemies.map((e, i) =>
      i === enemyIndex
        ? { ...e, buffs: updatedBuffs, stunResistance: decayedResistance }
        : e,
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

  // Tick weakened buff + decay stun resistance on active turns
  enemies = enemies.map((e, i) => {
    if (i !== enemyIndex) return e;
    const updatedBuffs = e.buffs
      .map((b) =>
        b.id === "weakened"
          ? { ...b, turnsRemaining: b.turnsRemaining - 1 }
          : b,
      )
      .filter((b) => b.turnsRemaining > 0);
    const decayedStunResistance = Math.max(0, (e.stunResistance ?? 0) - 0.1);
    return { ...e, buffs: updatedBuffs, stunResistance: decayedStunResistance };
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

  // Split (duplicate_code)
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
    enemies = [
      ...enemies.map((e, i) => (i === enemyIndex ? markedMonster : e)),
      clone,
    ];
    events.push({ kind: "monster_split", sourceIndex: enemyIndex, clone });
    log.push(STRINGS.duplicateSplits.replace("{0}", monster.def.name));
  }

  // Lazy class: delegate / heal ally / rare attack
  if (monster.def.behavior === "lazy_class") {
    const aliveAllies = enemies.filter(
      (e, i) => i !== enemyIndex && e.currentHp > 0,
    );
    const isAlone = aliveAllies.length === 0;
    const roll = rng();

    if (isAlone || roll < 0.1) {
      // Panic attack or rare attack — fall through to normal attack below
      log.push(
        (isAlone
          ? STRINGS.lazyClassPanic
          : STRINGS.lazyClassRareAttack
        ).replace("{0}", monster.def.name),
      );
    } else if (roll < 0.4) {
      // Heal an ally (30% chance)
      const allyIdx = enemies.findIndex(
        (e, i) => i !== enemyIndex && e.currentHp > 0,
      );
      if (allyIdx >= 0) {
        const ally = enemies[allyIdx]!;
        const healAmt = Math.floor(ally.def.hp * 0.15);
        enemies = enemies.map((e, i) =>
          i === allyIdx
            ? { ...e, currentHp: Math.min(e.def.hp, e.currentHp + healAmt) }
            : e,
        );
        log.push(
          STRINGS.lazyClassHealAlly
            .replace("{0}", monster.def.name)
            .replace("{1}", String(healAmt)),
        );
        events.push({
          kind: "buff_applied",
          buffId: "lazy_heal",
          turns: 0,
          target: allyIdx,
        });
        newState = { ...newState, enemies };
        return advanceToNextTurn(
          { ...newState, log: { entries: [...state.log.entries, ...log] } },
          events,
          log,
          newPlayerStats,
        );
      }
    } else {
      // Delegate — skip this turn (60% chance when allies exist)
      log.push(STRINGS.lazyClassDelegate.replace("{0}", monster.def.name));
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
  }

  // n_plus_one: summon
  if (aiResult.shouldSummon) {
    const clone: MonsterState = {
      def: monster.def,
      currentHp: Math.floor(monster.def.hp / 2),
      position: monster.position,
      buffs: [],
      stunResistance: 0,
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
    enemies = [
      ...enemies.map((e, i) => (i === enemyIndex ? summonedMonster : e)),
      clone,
    ];
    events.push({ kind: "monster_summon", newMonster: clone });
    log.push(STRINGS.monsterSummon.replace("{0}", monster.def.name));
  }

  // boss_big_ball abilities
  if (monster.def.behavior === "boss_big_ball" && aiResult.bigBallAbility) {
    const bigBallResult = applyBigBallAbility(
      monster,
      enemyIndex,
      enemies,
      aiResult,
      events,
      log,
      newState,
    );
    enemies = bigBallResult.enemies;
    newState = bigBallResult.newState;
  }

  // Player dodge
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

  // Resolve attacks
  const currentMonster = enemies[enemyIndex]!;
  const isEnraged =
    currentMonster.def.behavior === "boss_god_class" && newState.bossPhase >= 3;
  const totalAttacks = isEnraged ? 2 : aiResult.hitCount;
  const heavyHitMult =
    currentMonster.def.behavior === "boss_big_ball" &&
    aiResult.bigBallAbility === "heavy_hit"
      ? 1.5
      : 1.0;
  // Big Ball heal abilities now also do a weak attack (no longer a free turn)
  const bigBallHealMult =
    currentMonster.def.behavior === "boss_big_ball" &&
    (aiResult.bigBallAbility === "self_heal" ||
      aiResult.bigBallAbility === "steal_heal")
      ? 0.5
      : 1.0;

  if (aiResult.hitCount > 1)
    log.push(
      STRINGS.shotgunSurgery
        .replace("{0}", monster.def.name)
        .replace("{1}", String(aiResult.hitCount)),
    );
  log.push(STRINGS.enemyAttacks.replace("{0}", monster.def.name));

  let totalDmg = 0;
  for (let a = 0; a < totalAttacks; a++) {
    const hit = resolveMonsterAttack(currentMonster, playerStats, rng);
    const finalDmg = Math.max(
      1,
      Math.round(hit.damage * heavyHitMult * bigBallHealMult),
    );
    totalDmg += finalDmg;
    events.push({
      kind: "damage_received",
      damage: finalDmg,
      isCrit: hit.isCrit,
    });
    log.push(formatEnemyDamageLog(finalDmg, hit.isCrit));
  }

  const rawNewHp = Math.max(0, playerStats.hp - totalDmg);
  const newHp = clampHpDemoMode(rawNewHp, isDemoMode);
  newPlayerStats = { ...playerStats, hp: newHp };
  if (newHp <= 0) events.push({ kind: "combat_lost" });

  const entangledTurns = Math.max(0, (newState.bossEntangledTurns ?? 0) - 1);
  newState = { ...newState, enemies, bossEntangledTurns: entangledTurns };

  return advanceToNextTurn(
    { ...newState, log: { entries: [...state.log.entries, ...log] } },
    events,
    log,
    newPlayerStats,
  );
}
