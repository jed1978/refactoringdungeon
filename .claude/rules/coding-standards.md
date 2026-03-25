# Coding Standards

## TypeScript
- No `any` type — strict TypeScript everywhere
- Discriminated unions for game states (`exploring | combat | event | shop | game_over | victory`)
- All entities (monsters, skills, equipment) defined as data in `src/data/`, not hardcoded in logic

## Architecture Layers (strict separation)
- **`src/engine/`** — Zero React dependencies. Pure TypeScript + Canvas API only.
- **`src/sprites/`** — Pure data files. No logic, no imports from engine or features.
- **`src/features/`** — Pure game logic functions (deterministic, testable). No rendering.
- **`src/ui/`** — React DOM overlay components. No Canvas drawing.

## File & Code Quality
- Max 200 lines per file — no exceptions (practice what we preach: no God Class)
- Functional components + hooks only — no class components
- All game logic functions must be pure (input → output, no side effects)
- Chinese strings centralized in `src/data/strings.ts`
- Canvas coordinates always in logical pixels (16px tile units), CSS handles scaling

## UI Font Minimums
- Press Start 2P headers ≥ 18px, section labels ≥ 14px
- Noto Sans TC item names ≥ 18px, secondary text ≥ 14px
- Never use 10-12px in player-facing UI (too small on scaled canvas)

## Language
- Code & comments: English
- All player-facing text: Traditional Chinese (繁體中文)
- In-game tone: 工程師黑色幽默 (sarcastic, self-deprecating engineer humor)
- All responses in Traditional Chinese
