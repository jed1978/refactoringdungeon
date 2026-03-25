---
paths:
  - "src/features/combat/**"
  - "src/engine/BattleAnimator.ts"
  - "src/engine/BattleRenderer.ts"
---

# Combat System Architecture Rules

## Event → Animation Mapping (FREEZE RISK)

Every `CombatEvent` kind in `combatStateMachine.ts` MUST have a matching `case` in `applyEvents()` in `combatLoop.ts` that calls `queueAnimation()`.

If an event queues no animation, `BattleAnimator.frame.finished` never becomes `true` → `handleAnimationComplete` never fires → **permanent combat freeze**.

**Rule:** Adding a new CombatEvent kind requires TWO simultaneous changes:
1. The event kind in the discriminated union (`combatStateMachine.ts`)
2. A matching case in `applyEvents()` (`combatLoop.ts`) with at least one `queueAnimation()` call

Known past freeze causes: `flee_failed`, `reveal`, dead enemy skip.

## Dead Enemy Skip Fallback

When a dead monster's turn arrives, `processEnemyTurn` returns empty events → no animation → freeze. The fallback in `updateCombatLoop` handles this:

```ts
if (
  !isAnimating(loop.animState) &&
  loop.localPhase === "enemy_turn" &&
  loop.outcome === "none" &&
  loop.lastProcessedTurnIndex !== combat.currentTurnIndex
) {
  handleAnimationComplete(loop, combat, gameState, dispatch);
}
```

`lastProcessedTurnIndex` must update BEFORE the `entry?.kind === "enemy"` guard to prevent double-processing.

## Flee Fail Must Not Advance Turn

In `processPlayerAction()`, when flee fails, return early with `phase: "selecting"` and `isPlayerTurn: true` BEFORE the normal enemy-turn advance code path. Otherwise the enemy gets two turns in one round.

## COMBAT_END_VICTORY Must Not Carry Stale Stats

`COMBAT_END_VICTORY` reducer MUST NOT accept or apply `newPlayerStats` from the 60fps loop. `APPLY_COMBAT_RESULT` already wrote correct stats. The `gameStateRef.current` snapshot may be stale (pre-render), overwriting correct values.

## Stun Must Apply Before Damage

Skills that apply stun + damage (e.g. Replace Magic Number): push the `buff_applied` event and update enemy buffs BEFORE calling `applyDamageToEnemy`. Damage may kill the target — stun must already be recorded.

## Demo Mode HP Floor Is Intentional

When `isDemoMode === true`, player HP cannot drop below 1. This is correct behavior, not a bug. HUD shows yellow `DEMO` badge.
