import type {
  CombatState,
  MonsterState,
  PlayerStats,
  CombatAction,
} from "../../utils/types";
import type { CombatEvent } from "./combatTypes";
import type { MonsterAIResult } from "./monsterAI";
import { checkLevelUp } from "./combatFormulas";
import { applyDamageToEnemy } from "./combatShared";
import { STRINGS } from "../../data/strings";

export type PostActionCtx = {
  enemies: MonsterState[];
  newState: CombatState;
  newPlayerStats: PlayerStats | undefined;
};

/** Boss circular_dep reflect + god_class phase shift + companion attack + victory check */
export function applyPostPlayerAction(
  action: CombatAction,
  origState: CombatState,
  ctx: PostActionCtx,
  events: CombatEvent[],
  log: string[],
  playerStats: PlayerStats,
  isDemoMode: boolean,
  companionCombats: number,
): PostActionCtx {
  let { enemies, newState, newPlayerStats } = ctx;

  // Boss special effects (attack/skill only)
  if (action.type !== "flee") {
    const primaryIdx =
      action.type === "attack" || action.type === "skill"
        ? action.targetIndex
        : -1;
    if (primaryIdx >= 0) {
      const origEnemy = origState.enemies[primaryIdx];
      const updEnemy = enemies[primaryIdx];
      if (origEnemy && updEnemy && updEnemy.currentHp > 0) {
        // Circular dep: reflect 30% damage back
        if (origEnemy.def.behavior === "boss_circular_dep") {
          const dmgDealt = events
            .filter(
              (e): e is Extract<typeof e, { kind: "damage_dealt" }> =>
                e.kind === "damage_dealt" && e.targetIndex === primaryIdx,
            )
            .reduce((s, e) => s + e.damage, 0);
          if (dmgDealt > 0) {
            const reflectDmg = Math.max(1, Math.floor(dmgDealt * 0.4));
            events.push({ kind: "damage_reflected", damage: reflectDmg });
            const rawHp = Math.max(
              0,
              (newPlayerStats ?? playerStats).hp - reflectDmg,
            );
            const hp = isDemoMode && rawHp <= 0 ? 1 : rawHp;
            newPlayerStats = { ...(newPlayerStats ?? playerStats), hp };
            if (hp <= 0) events.push({ kind: "combat_lost" });
            log.push(
              STRINGS.damageReflected.replace("{0}", String(reflectDmg)),
            );
          }
        }
        // God class: phase shift at 75/50/25%
        if (origEnemy.def.behavior === "boss_god_class") {
          const hpPct = updEnemy.currentHp / origEnemy.def.hp;
          let bossPhase = newState.bossPhase;
          if (hpPct < 0.75 && bossPhase < 1) {
            bossPhase = 1;
            events.push({ kind: "boss_phase_shift", newPhase: 1 });
            newState = { ...newState, bossPhase };
            log.push(
              STRINGS.bossPhaseShift
                .replace("{0}", origEnemy.def.name)
                .replace("{1}", "2"),
            );
          }
          if (hpPct < 0.5 && bossPhase < 2) {
            bossPhase = 2;
            events.push({ kind: "boss_phase_shift", newPhase: 2 });
            newState = { ...newState, bossPhase };
            log.push(
              STRINGS.bossPhaseShift
                .replace("{0}", origEnemy.def.name)
                .replace("{1}", "3"),
            );
          }
          if (hpPct < 0.25 && bossPhase < 3) {
            bossPhase = 3;
            events.push({ kind: "boss_phase_shift", newPhase: 3 });
            events.push({ kind: "boss_enrage" });
            newState = { ...newState, bossPhase };
            log.push(STRINGS.bossEnrage.replace("{0}", origEnemy.def.name));
          }
        }
      }
    }

    // Companion attack
    if (companionCombats > 0) {
      const cIdx = enemies.findIndex((e) => e.currentHp > 0);
      if (cIdx >= 0) {
        const companionDmg = Math.max(1, Math.floor(playerStats.atk * 0.5));
        enemies = applyDamageToEnemy(
          enemies,
          cIdx,
          companionDmg,
          events,
          log,
          origState,
        );
        events.push({
          kind: "companion_attack",
          damage: companionDmg,
          targetIndex: cIdx,
        });
        log.push(STRINGS.companionAttack.replace("{0}", String(companionDmg)));
      }
    }

    // Victory check
    const aliveEnemies = enemies.filter((e) => e.currentHp > 0);
    if (aliveEnemies.length === 0) {
      const totalExp = origState.enemies.reduce((s, e) => s + e.def.exp, 0);
      const totalGold = origState.enemies.reduce((s, e) => s + e.def.gold, 0);
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
  }

  return { enemies, newState, newPlayerStats };
}

/** big_ball ability side-effects during enemy turn */
export function applyBigBallAbility(
  monster: MonsterState,
  enemyIndex: number,
  enemies: MonsterState[],
  aiResult: MonsterAIResult,
  events: CombatEvent[],
  log: string[],
  newState: CombatState,
): { enemies: MonsterState[]; newState: CombatState } {
  const ability = aiResult.bigBallAbility;
  if (!ability) return { enemies, newState };

  if (ability === "self_heal" || ability === "steal_heal") {
    const healAmt = Math.floor(monster.def.hp * 0.1);
    enemies = enemies.map((e, i) =>
      i === enemyIndex
        ? { ...e, currentHp: Math.min(e.def.hp, e.currentHp + healAmt) }
        : e,
    );
    events.push({
      kind: "boss_absorb_attack",
      abilityName: STRINGS.absorbAbilityHeal,
    });
    log.push(STRINGS.bossAbsorbHeal.replace("{0}", String(healAmt)));
  }
  if (ability === "steal_heal") {
    events.push({ kind: "buff_stolen", buffId: "atk_boost" });
    log.push(STRINGS.bossAbsorbSteal);
  }
  if (ability === "multi_hit") {
    events.push({
      kind: "boss_absorb_attack",
      abilityName: STRINGS.absorbAbilityMultiHit,
    });
    log.push(
      STRINGS.bossAbsorbAttack.replace("{0}", STRINGS.absorbAbilityMultiHit),
    );
  }
  if (ability === "heavy_hit") {
    events.push({
      kind: "boss_absorb_attack",
      abilityName: STRINGS.absorbAbilityHeavyHit,
    });
    log.push(
      STRINGS.bossAbsorbAttack.replace("{0}", STRINGS.absorbAbilityHeavyHit),
    );
  }
  return { enemies, newState: { ...newState, enemies } };
}
