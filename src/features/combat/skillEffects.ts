import type { CombatState, MonsterState, Buff } from "../../utils/types";
import type { CombatEvent } from "./combatTypes";
import type { SkillResult } from "./combatActions";
import { applyDamageToEnemy } from "./combatShared";
import { STRINGS } from "../../data/strings";
import { formatPlayerDamageLog } from "./combatHelpers";

export type SkillApplyResult = {
  readonly enemies: MonsterState[];
  readonly newState: CombatState;
};

export function applySkillResult(
  result: SkillResult,
  enemies: MonsterState[],
  events: CombatEvent[],
  log: string[],
  state: CombatState,
  newState: CombatState,
  rng: () => number = Math.random,
): SkillApplyResult {
  if (result.kind === "damage") {
    events.push({
      kind: "damage_dealt",
      targetIndex: result.targetIndex,
      damage: result.damage,
      isCrit: result.isCrit,
    });
    log.push(formatPlayerDamageLog(result.damage, result.isCrit));
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
    // Stun resistance check: base immunity + accumulated resistance
    const target = enemies[result.targetIndex];
    const targetName = target?.def.name ?? "";
    // God Class Phase 4 (bossPhase >= 3) is completely immune to stun
    const isFullyImmune =
      target?.def.behavior === "boss_god_class" && state.bossPhase >= 3;
    const resistChance = isFullyImmune
      ? 1.0
      : (target?.stunResistance ?? 0) + (target?.def.stunImmunity ?? 0);
    const stunSucceeds = rng() >= resistChance;

    if (stunSucceeds && target) {
      // Apply stun BEFORE damage (Note 12)
      const stunBuff: Buff = {
        id: "stunned",
        name: "眩暈",
        turnsRemaining: 1,
        effect: "stunned",
      };
      const newResistance = Math.min(1, (target.stunResistance ?? 0) + 0.4);
      enemies = enemies.map((e, i) =>
        i === result.targetIndex
          ? {
              ...e,
              buffs: [...e.buffs, stunBuff],
              stunResistance: newResistance,
            }
          : e,
      );
      events.push({
        kind: "buff_applied",
        buffId: "stunned",
        turns: 1,
        target: result.targetIndex,
      });
      log.push(STRINGS.skillStun.replace("{0}", targetName));
    } else {
      log.push(STRINGS.stunResisted.replace("{0}", targetName));
    }
    // Damage is always applied regardless of stun outcome
    events.push({
      kind: "damage_dealt",
      targetIndex: result.targetIndex,
      damage: result.damage,
      isCrit: result.isCrit,
    });
    log.push(formatPlayerDamageLog(result.damage, result.isCrit));
    enemies = applyDamageToEnemy(
      enemies,
      result.targetIndex,
      result.damage,
      events,
      log,
      state,
    );
  } else if (result.kind === "buff_self") {
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
      log.push(formatPlayerDamageLog(hit.damage, hit.isCrit));
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
    log.push(formatPlayerDamageLog(result.damage, result.isCrit));
    enemies = applyDamageToEnemy(
      enemies,
      result.targetIndex,
      result.damage,
      events,
      log,
      state,
    );
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
      log.push(formatPlayerDamageLog(hit.damage, hit.isCrit));
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
  return { enemies, newState };
}
