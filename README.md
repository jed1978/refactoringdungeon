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

## 重構技能 / Refactoring Skills

| 技能 | MP | 效果 | 解鎖條件 |
|------|----|------|---------|
| Extract Method | 2 | 單體傷害（1.5× ATK） | 初始 |
| Rename Variable | 1 | 揭示敵人數值與弱點 | 初始 |
| Inline Temp | 1 | 快速攻擊（0.8× ATK），先攻 | 初始 |
| Replace Magic Number | 4 | 眩暈 1 回合 + 1.5× 傷害（遞減抗性系統） | LV 3 |
| Move Method | 2 | 閃避下一次攻擊 | LV 5 |
| Parameter Object | 4 | 群體攻擊，全敵人 0.7× ATK | LV 7 |
| Polymorphism | 5 | 削弱 Boss 當前 Phase 能力 | LV 9 |
| Compose Method | 5 | 連鎖 3 個隨機技能（各 0.8× 威力，共 2.4×） | LV 11 |

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
- **God Mode（HP 不會低於 1）** — 這是設計行為，非 Bug
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
- 房間類型隨機分配（怪物、事件、寶箱、商店、練功沙盒）
- **每層保證至少 1 個 Training Room（練功沙盒）**
- Boss 房間永遠是最大且距出生點最遠的房間
- Boss 房間只保留**一個入口**，其餘通道封牆 → 確保 BossDoor 不會切斷走廊
- **雙重連通驗證**（最多重試 5 次）：
  1. `validateMap`（BossDoor 可通行）：所有房間中心可達
  2. `validateMapNoBossDoor`（BossDoor 視為牆）：所有非 Boss 房間不依賴 BossDoor 即可到達，防止「非 Boss 怪物被困在 BossDoor 後面」的死局

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

### Web Audio Synthesized SFX & BGM

零音訊檔案，全部使用 Web Audio API 合成：

- **SFX（`AudioSystem.ts`）**：14 種一次性音效，包含攻擊音、暴擊、怪物死亡、升級琶音、勝利和弦等。
- **BGM（`MusicSynth.ts` + `MusicSystem.ts` + `tracks/*.ts`）**：9 首合成背景音樂，依 GameMode 自動切換，300ms crossfade。

#### BGM 合成管線（Chiptune 品質）

```
每個音符（Note）：
  OscillatorNode ×1 or ×2（去諧對）
    → GainNode（ADSR 包絡）
    → BiquadFilterNode（lowpass，可選）
    → StereoPannerNode（pan，可選）
    → trackInput

trackInput（每首曲目建立一次，loop 間重用）：
  → dryGain → masterGain → destination
  → ConvolverNode（合成混響，可選）→ masterGain
  → DelayNode + feedback loop（可選）→ masterGain
```

| 技術 | 效果 |
|------|------|
| **ADSR 包絡** | 每音符獨立振盪器，消除 gate 產生的硬切嗶嗶聲 |
| **去諧振盪器對** | Lead/Pad 聲部用 ±N cents 雙振盪器，產生合唱厚度 |
| **低通濾波** | BiquadFilterNode 截斷刺耳高頻，square/sawtooth 變暖 |
| **合成混響** | 噪音 buffer × 指數衰減（1.4s），ConvolverNode 空間感 |
| **延遲回聲** | DelayNode + feedback，探索曲飄逸、戰鬥曲緊促 |
| **立體聲展寬** | StereoPannerNode：arp 偏右、pad 偏左 |
| **4 聲部編排** | Lead + Bass + Pad + Arp（一般戰鬥 = 3 聲部） |

| 場景 | 音樂 | 聲部 | 特性 |
|------|------|------|------|
| Title Screen | C minor 神秘琶音 | 4 聲部 | 100 BPM，reverb + delay，loop |
| 1F 前端泥沼 | A minor 低調氛圍 | 4 聲部 | 80 BPM，reverb，loop |
| 2F 後端迷宮 | D minor 機械節奏 | 4 聲部 | 80 BPM，reverb + delay，loop |
| 3F 資料庫深淵 | G minor 深沉低音 | 4 聲部 | 70 BPM，heavy reverb，loop |
| 4F 神類聖殿 | D minor 壓迫和弦 | 4 聲部 | 80 BPM，reverb + delay，loop |
| 一般戰鬥 | A minor 快節奏 | 3 聲部 | 140 BPM，dry + short delay，loop |
| Boss 戰 | D minor 高速連奏 | 4 聲部 | 160 BPM，reverb + delay，loop |
| 勝利 | C major fanfare | 4 聲部 | 120 BPM，reverb，一次性 |
| 遊戲結束 | A minor 下行旋律 | 3 聲部 | 60 BPM，heavy reverb，一次性 |

### 樓層推進邏輯

```
清除該層所有小怪
      ↓
BossDoor 解鎖（按 Space 開門）
      ↓
進入 Boss 房間，擊敗 Boss
      ↓
下樓梯（StairsDown）解鎖
      ↓
進入下一層
```

### Training Room（練功沙盒）

每層地城保證至少出現一個 **Training Room**（`TileType.TrainingRoom`，優先放在 Empty 房間中心）。

- 面對 Training Room 磁磚按 **Space** 進入練習戰鬥
- 使用該樓層怪物池隨機組成 1–3 隻怪物
- 勝利可獲得 EXP 與 Gold，但**不移除地圖怪物**
- 可重複挑戰，適合刷等或練習技能
- BossDoor 邏輯不受影響（Training 戰鬥不計入 `floor.monsters`）

---

## 技術亮點（Conference Talk Notes）

1. **Sprites-as-Code** — 開啟任何 `src/sprites/monsters/*.ts`，這就是怪物的像素藝術。TypeScript data literal = pixel art。
2. **Pixel Dissolve** — `src/engine/PixelDissolve.ts`：每個像素都是獨立粒子，800ms 飛散效果，純數學無圖片。
3. **BSP Generator** — `src/features/map/bspGenerator.ts`：Binary Space Partition 演算法生成無限不重複地城。
4. **Two-Tier State** — 60fps 遊戲循環（`useRef`）與 React 狀態（`useReducer`）分離，各司其職。
5. **Zero Dependencies** — 無後端、無外部 API、無圖片、無音效檔、無音樂檔。整個遊戲就是 TypeScript + Canvas + React。
6. **Synthesized BGM** — `src/engine/MusicSynth.ts` + `tracks/*.ts`：9 首背景音樂用 Web Audio API 合成（ADSR 包絡、去諧振盪器對、低通濾波、混響、延遲），4 聲部編排，依遊戲模式自動切換，300ms crossfade，零音檔。

---

## 資料夾結構 / Folder Structure

```
src/
├── app/              # React root、providers
├── engine/           # Canvas 渲染引擎（零 React 依賴）
│   ├── AudioSystem.ts      # Web Audio 合成音效（14 種 SFX）
│   ├── MusicTypes.ts       # BGM 型別（Note, VoiceDef, TrackDef, AdsrEnvelope）
│   ├── MusicSynth.ts       # BGM 合成器核心（ADSR、去諧對、濾波、混響、延遲）
│   ├── MusicSystem.ts      # BGM 引擎（切換、淡入淡出、loop 排程）
│   ├── MusicTracks.ts      # BGM barrel file（匯入 tracks/*.ts）
│   └── tracks/             # 9 首曲目資料 + noteFreqs.ts 頻率常數
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

## Build & Deploy

```bash
npm run build     # 生產版本（tsc -b + vite build）
npm run dev       # 本地開發（http://localhost:5173）
```

> **注意：** 請用 `npm run build` 驗證，不要只用 `npx tsc --noEmit`。
> `tsc -b` 才會套用 `noUnusedLocals`/`noUnusedParameters`，`tsc --noEmit` 會漏掉這些錯誤。

### Vercel 部署

專案已部署於 [Vercel](https://vercel.com)，連結 GitHub `main` branch 自動部署：

- push to `main` → Vercel 自動觸發 `npm run build` → production deploy
- PR → 自動產生 Preview URL

---

## License

MIT
