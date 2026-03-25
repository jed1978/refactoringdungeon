# Build & Testing Rules

## Build Verification (CRITICAL)

Always use `npm run build` to verify, NOT `tsc --noEmit` alone.

```bash
npm run build     # ✅ catches all errors including noUnusedLocals
npx tsc --noEmit  # ⚠️  misses noUnusedLocals/noUnusedParameters violations
```

`tsconfig.app.json` enables `noUnusedLocals: true` and `noUnusedParameters: true` which only take effect under `tsc -b` (composite build mode).

## Browser Testing

Use `agent-browser` for all browser testing.

| Tool | When |
|------|------|
| `agent-browser:agent-browser` | Targeted test: specific flow (combat → skill → win) |
| `agent-browser:dogfood` | Exploratory: find bugs, UX issues, visual glitches |

Quick reference:
```bash
agent-browser --session NAME open http://localhost:5173
agent-browser --session NAME wait --load networkidle
agent-browser --session NAME snapshot -i          # find clickable elements
agent-browser --session NAME screenshot /tmp/out.png
agent-browser --session NAME click @e1
agent-browser --session NAME press ArrowRight     # "press", NOT "press_key"
agent-browser --session NAME close
```

DOM selection: use `innerText` (not `textContent`) for exact text matching.

## When to Test
- After implementing a new feature or fixing a bug
- After combat system changes: test full battle flow (enter → attack/skill → victory/defeat)
- After UI changes: verify DOM overlay alignment with canvas

## Reading Live Game State
```js
const root = document.getElementById('root');
const key = Object.keys(root).find(k => k.startsWith('__reactContainer'));
let fiber = root[key]?.child;
while (fiber) {
  const s = fiber.memoizedState?.memoizedState;
  if (s && s.player && s.gameMode) { console.log(JSON.stringify(s, null, 2)); break; }
  fiber = fiber.child ?? fiber.sibling;
}
```

## Dev Server
- `npm run dev` must be running before any browser test
- Default URL: `http://localhost:5173`
