import type { CombatState, PlayerStats } from "../../utils/types";
import type { CombatAction } from "../../utils/types";
import type { CombatEvent, CombatResult } from "./combatTypes";
import { calculateFleeChance } from "./combatFormulas";
import {
  resolvePlayerAttack,
  resolveSkill,
  resolveMonsterAttack,
} from "./combatActions";
import { firstAliveIndex, applyDamageToEnemy } from "./combatShared";
import { applySkillResult } from "./skillEffects";
import { applyPostPlayerAction } from "./bossEffects";
import { SKILLS_MAP } from "../../data/skills";
import { ITEMS_MAP } from "../../data/items";
import { STRINGS } from "../../data/strings";
import {
  formatPlayerDamageLog,
  formatEnemyDamageLog,
  clampHpDemoMode,
} from "./combatHelpers";

export function processPlayerAction(
  state: CombatState,
  action: CombatAction,
  playerStats: PlayerStats,
  rng: () => number,
  isDemoMode = false,
  companionCombats = 0,
): CombatResult {
  const events: CombatEvent[] = [];
  const log: string[] = [];
  let enemies = [...state.enemies];
  let newPlayerStats: PlayerStats | undefined;
  let newState = { ...state };

  switch (action.type) {
    case "attack": {
      const targetIdx =
        enemies[action.targetIndex]?.currentHp > 0
          ? action.targetIndex
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
      log.push(formatPlayerDamageLog(result.damage, result.isCrit));
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
      // Deduct MP first (always consumed even if rejected)
      newPlayerStats = {
        ...playerStats,
        mp: Math.max(0, playerStats.mp - skill.mpCost),
      };

      // God Class Phase 3 (bossPhase >= 2): 40% chance to reject skill
      const skillTarget =
        enemies[action.targetIndex]?.currentHp > 0
          ? action.targetIndex
          : firstAliveIndex(enemies);
      const targetMonster = enemies[skillTarget];
      const isGodClassPhase3 =
        targetMonster?.def.behavior === "boss_god_class" &&
        state.bossPhase >= 2;
      if (isGodClassPhase3 && rng() < 0.4) {
        log.push(STRINGS.godClassRejectPR);
        break;
      }

      log.push(STRINGS.playerUsesSkill.replace("{0}", skill.name));
      const result = resolveSkill(
        action.skillId,
        newPlayerStats,
        skillTarget,
        enemies,
        rng,
        state,
      );
      const applied = applySkillResult(
        result,
        enemies,
        events,
        log,
        state,
        newState,
        rng,
      );
      enemies = applied.enemies;
      newState = applied.newState;
      break;
    }

    case "item": {
      const itemDef = ITEMS_MAP[action.itemId];
      if (!itemDef) break;
      const ps = newPlayerStats ?? playerStats;
      let itemNewStats = ps;
      if (itemDef.effect === "heal_hp") {
        itemNewStats = { ...ps, hp: Math.min(ps.maxHp, ps.hp + itemDef.value) };
      } else if (itemDef.effect === "heal_mp") {
        itemNewStats = { ...ps, mp: Math.min(ps.maxMp, ps.mp + itemDef.value) };
      } else if (itemDef.effect === "max_hp") {
        itemNewStats = {
          ...ps,
          maxHp: ps.maxHp + itemDef.value,
          hp: ps.hp + itemDef.value,
        };
      } else if (itemDef.effect === "atk_boost") {
        events.push({
          kind: "buff_applied",
          buffId: "atk_boost",
          turns: itemDef.value,
          target: "player",
        });
      }
      newPlayerStats = itemNewStats;
      events.push({
        kind: "item_used",
        itemId: itemDef.id,
        value: itemDef.value,
      });
      log.push(STRINGS.itemUsed.replace("{0}", itemDef.name));
      break;
    }

    case "flee": {
      if (calculateFleeChance(rng)) {
        events.push({ kind: "fled" });
        log.push(STRINGS.fleeSuccess);
      } else {
        const firstEnemy = enemies.find((e) => e.currentHp > 0);
        if (firstEnemy) {
          const hit = resolveMonsterAttack(firstEnemy, playerStats, rng);
          events.push({ kind: "flee_failed", damage: hit.damage });
          log.push(STRINGS.fleeFail.replace("{0}", firstEnemy.def.name));
          log.push(formatEnemyDamageLog(hit.damage, hit.isCrit));
          const rawHp = Math.max(0, playerStats.hp - hit.damage);
          const hp = clampHpDemoMode(rawHp, isDemoMode);
          newPlayerStats = { ...(newPlayerStats ?? playerStats), hp };
          if (hp <= 0) events.push({ kind: "combat_lost" });
        }
      }
      break;
    }

    default:
      break;
  }

  // Post-action: boss effects, companion, victory (Note 6: flee_fail must return before this)
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

  const postCtx = applyPostPlayerAction(
    action,
    state,
    { enemies, newState, newPlayerStats },
    events,
    log,
    playerStats,
    isDemoMode,
    companionCombats,
  );
  enemies = postCtx.enemies;
  newState = postCtx.newState;
  newPlayerStats = postCtx.newPlayerStats;

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
