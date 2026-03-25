---
paths:
  - "src/state/**"
  - "src/ui/**"
  - "src/engine/**"
  - "src/app/**"
---

# State & Rendering Architecture Rules

## Two-Tier State (useRef vs useReducer)

Two state tiers that MUST NOT be mixed:

- **60fps tier (`useRef`):** `CombatLoopState`, animation state, particles, damage numbers. Direct property assignment OK. Arrays: use `.map()` to produce new arrays — no `arr[i] = x`.
- **React tier (`useReducer`):** `GameState` via `GameContext`. Strictly immutable — all updates via `dispatch(GameAction)`.

Communication is one-way: 60fps reads React state via snapshot, writes back via `dispatch()`.

NEVER:
- Put 60fps state into React state (re-render storm)
- Read React state directly inside rAF loop (stale)
- `dispatch()` inside the game loop per-frame (re-render every frame)

Only dispatch at discrete events: combat end, chest open, door enter, etc.

## Canvas Text = DOM Overlays

Due to `image-rendering: pixelated` CSS scaling, Canvas 2D text API renders blurry.

**Rule:** All player-visible text MUST be DOM elements with `position: absolute` on top of canvas.

**Exception:** `DamageNumbers.ts` — pixelated style is intentional and needs tight animation sync.

## DOM Overlay Coordinate System

DOM overlays use percentage positioning from logical canvas coordinates:

```ts
const xPct = (logicalX / VIEWPORT.logicalWidth) * 100;   // 240
const yPct = (logicalY / VIEWPORT.logicalHeight) * 100;   // 176
// style={{ left: `${xPct}%`, top: `${yPct}%` }}
```

Canvas container and DOM overlay container MUST share the same parent (`position: relative`).

## New Game Must Reset to STARTING_PLAYER

`START_GAME` reducer MUST spread `STARTING_PLAYER` from `initialState.ts`, NOT `state.player`. Otherwise HP=0 from previous death carries over.

```ts
// ✅ CORRECT
case "START_GAME":
  return { ...state, player: { ...STARTING_PLAYER, position: action.startPos } };

// ❌ WRONG — carries dead-state stats
case "START_GAME":
  return { ...state, player: { ...state.player, position: action.startPos } };
```
