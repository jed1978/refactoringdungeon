# 重構地城 Refactoring Dungeon

> 一款以軟體工程概念為遊戲機制的 Roguelike 瀏覽器遊戲。
>
> A browser-based roguelike where software engineering concepts ARE the game mechanics.

---

## 遊戲簡介 / About

你是一位工程師，深入 Legacy Codebase 地城。
用**重構技能**攻擊 Code Smell 怪物，裝備**設計模式**武裝，最終對抗終極 Boss **神類（God Class）**。

You are a Software Engineer descending into a legacy codebase dungeon.
Fight Code Smell monsters with Refactoring skills, equip Design Pattern gear, and ultimately confront the **God Class** boss.

**適用場合 / Use Cases:**
- Conference demos（DevOpsDays Taiwan、COSCUP 等）
- Engineering team ice-breakers
- Teaching software engineering concepts in an engaging way

---

## 地城結構 / Dungeon Structure

| 樓層 | 主題 | Boss |
|------|------|------|
| 1F | 前端泥沼 — The Frontend Swamp | 義大利麵蟲（Spaghetti Code） |
| 2F | 後端迷宮 — The Backend Labyrinth | 循環依賴蛇（Circular Dependency） |
| 3F | 資料庫深淵 — The Database Abyss | 大泥球（Big Ball of Mud） |
| 4F | 神類聖殿 — The God Class Sanctum | **神類（God Class）** — 4 段Phase |

---

## 快速開始 / Quick Start

```bash
npm install
npm run dev
```

開啟瀏覽器前往 `http://localhost:5173`

---

## DEMO MODE

在 Title Screen 輸入 **↑ ↑ ↓ ↓ ← → ← →**（Konami Code）解鎖 DEMO MODE。

DEMO 模式效果：
- 角色 LV.15，全技能解鎖，全套設計模式裝備
- God Mode（HP 不會低於 1）
- HUD 顯示黃色 `DEMO` 標記

---

## 技術架構 / Technical Architecture

### Hybrid Canvas + DOM Rendering

```
Canvas（低階渲染）          DOM（React 高階 UI）
─────────────────          ──────────────────
Dungeon tile map           HUD overlays
Player/monster sprites     Combat log
Battle scene               Action menu
Particle effects           Dialogue boxes
Lighting system            Inventory / Shop
```

Canvas 以邏輯解析度 240×176 渲染，透過 CSS `image-rendering: pixelated` 等比放大至全螢幕——保有像素風格並支援任意解析度。

### Sprites-as-Code（會議 Demo 亮點）

所有像素藝術以 TypeScript 2D 陣列定義，**零圖片檔案**：

```typescript
// 每個 Monster 都是一個 TypeScript data literal
const SLIME_FRAME: SpriteFrame = [
  [null,   "#4ade80", "#4ade80", null  ],
  ["#4ade80", "#86efac", "#86efac", "#4ade80"],
  // ...
];
```

### BSP Dungeon Generation

每層地城使用 **Binary Space Partition** 演算法自動生成：
- 遞迴分割空間 → 建立房間 → 走廊連接
- 房間類型隨機分配（怪物、事件、寶箱、商店）
- Boss 房間永遠是最大且距出生點最遠的房間

### Two-Tier State Architecture

```
60fps Tier（useRef）          React Tier（useReducer）
──────────────────            ──────────────────────
CombatLoopState               GameState
  animState                     player stats
  particles                     floor layout
  damageNumbers                 inventory
  localPhase                    runStats
                      dispatch()
                    ──────────→
```

戰鬥期間，高頻狀態（動畫、粒子）住在 `useRef` 避免 re-render；
持久結果（HP 變化、經驗、等級）透過 `dispatch` 進入 React 狀態。

### Pixel Dissolve Death Effect

怪物死亡時每個非透明像素獨立飛散——純 Canvas 粒子系統，無任何圖片：

```
Monster died
  → freeze sprite pixels
  → assign each pixel a random velocity (upward bias) + gravity
  → animate 800ms: pixels scatter outward + fade alpha
```

### Web Audio Synthesized SFX

零音訊檔案，全部使用 Web Audio API `OscillatorNode` + `GainNode` 合成：
14 種音效包含攻擊音、暴擊、怪物死亡、升級琶音、勝利和弦等。

---

## 技術亮點（Conference Talk Notes）

1. **Sprites-as-Code** — 開啟任何 `src/sprites/monsters/*.ts`，這就是怪物的像素藝術。TypeScript data literal = pixel art。
2. **Pixel Dissolve** — `src/engine/PixelDissolve.ts`：每個像素都是獨立粒子，800ms 飛散效果，純數學無圖片。
3. **BSP Generator** — `src/features/map/bspGenerator.ts`：Binary Space Partition 演算法生成無限不重複地城。
4. **Two-Tier State** — 60fps 遊戲循環（`useRef`）與 React 狀態（`useReducer`）分離，各司其職。
5. **Zero Dependencies** — 無後端、無外部 API、無圖片、無音效檔。整個遊戲就是 TypeScript + Canvas + React。

---

## 資料夾結構 / Folder Structure

```
src/
├── app/              # React root、providers
├── engine/           # Canvas 渲染引擎（零 React 依賴）
│   ├── AudioSystem.ts      # Web Audio 合成音效
│   ├── BattleAnimator.ts   # 戰鬥動畫佇列
│   ├── BattleRenderer.ts   # 戰鬥場景繪製
│   ├── LightingSystem.ts   # 火炬光照效果
│   ├── ParticleSystem.ts   # 粒子系統
│   ├── PixelDissolve.ts    # 像素飛散特效
│   └── TileRenderer.ts     # 地城 Tile 渲染
├── features/
│   ├── combat/       # 戰鬥狀態機、AI、公式
│   ├── map/          # BSP 地城生成
│   └── events/       # 非戰鬥事件邏輯
├── sprites/          # 所有像素藝術（純 TypeScript data）
│   ├── player.ts
│   ├── monsters/     # 每個怪物一個檔案
│   └── tiles.ts
├── state/            # GameContext + useReducer
├── ui/               # React DOM overlay 元件
└── data/             # 怪物、技能、裝備、字串定義
```

---

## Build

```bash
npm run build     # 生產版本
npx tsc --noEmit  # 型別檢查
```

---

## License

MIT
