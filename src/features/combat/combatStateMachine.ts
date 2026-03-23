import type { CombatState, MonsterState, PlayerStats } from "../../utils/types";
import { calculateTurnOrder } from "./combatFormulas";

export type { CombatEvent, CombatResult } from "./combatTypes";
export { processPlayerAction } from "./playerTurn";
export { processEnemyTurn } from "./enemyTurn";

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
