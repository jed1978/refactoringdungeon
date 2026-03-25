# Testing Rules — Refactoring Dungeon

## Browser Testing

Use `agent-browser` skills for all browser-based testing. Do NOT use Playwright MCP.

### Available Skills
| Skill | When to Use |
|-------|-------------|
| `agent-browser:agent-browser` | Targeted test: specific flow like "start game → walk to monster → enter combat → use skill → win" |
| `agent-browser:dogfood` | Exploratory test: find bugs, UX issues, visual glitches across the whole game |

### Prerequisites
- Dev server running: `npm run dev` (Vite, port 5173)
- Ensure `http://localhost:5173` is accessible before invoking agent-browser

### Test Scenarios (Priority Order)
1. **Combat freeze check** — Enter combat, use each action (attack, skill, flee), verify game doesn't lock
2. **Combat flow** — Full battle: attack → enemy turn → player turn → victory/defeat
3. **Skill usage** — Each skill works without freezing (especially Rename Variable / reveal event)
4. **Flee mechanics** — Both success and failure paths
5. **Navigation** — WASD/arrow movement, camera follow, fog of war
6. **UI alignment** — Monster names above HP bars, combat log readable, action buttons clickable
7. **DOM overlay positioning** — Text overlays aligned with canvas sprites at current viewport size

### After Combat System Changes (MANDATORY)
Run this checklist with agent-browser after any change to:
- `combatStateMachine.ts`
- `combatLoop.ts` (especially `applyEvents()`)
- `BattleAnimator.ts`
- `BattleUI.tsx`

Checklist:
1. Start a combat encounter
2. Use basic attack → verify animation plays → verify enemy HP decreases
3. Use a skill (e.g. Extract Method) → verify MP consumed → verify damage dealt
4. Use Rename Variable → verify stats revealed → verify no freeze
5. Attempt flee → verify both success/fail paths don't freeze
6. Kill all enemies → verify victory screen appears
7. Let player die → verify defeat screen appears

### Visual Verification
- Monster sprites render at correct positions
- HP bars visible above monsters
- Monster names visible above HP bars (DOM overlay)
- Damage numbers float up and fade
- Death dissolve animation plays on monster kill
- Screen flash on critical hit
- Combat log updates with each action

### What NOT to Test with agent-browser
- Pure logic functions (use unit tests / vitest instead)
- Sprite data correctness (visual inspection in dev, not automatable)
- Build / type checking (use `npx tsc --noEmit`)
