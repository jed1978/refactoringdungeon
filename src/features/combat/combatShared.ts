import type { CombatState, MonsterState, PlayerStats } from "../../utils/types";
import type { CombatEvent, CombatResult } from "./combatTypes";
import { STRINGS } from "../../data/strings";

export function firstAliveIndex(enemies: readonly MonsterState[]): number {
  const idx = enemies.findIndex((e) => e.currentHp > 0);
  return idx >= 0 ? idx : 0;
}

export function advanceToNextTurn(
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

export function applyDamageToEnemy(
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
