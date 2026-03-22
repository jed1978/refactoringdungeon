# Refactoring Dungeon（重構地城）— Project Specification v2

## Project Overview
A browser-based roguelike game where software engineering concepts ARE the game mechanics.
The player is a Software Engineer descending into a legacy codebase dungeon, fighting Code Smell monsters with Refactoring skills, equipping Design Pattern gear, and ultimately confronting the God Class boss.

**Target audience:** Software engineers who will instantly get the jokes and metaphors.
**Target use:** Conference demos (DevOpsDays Taiwan), social media sharing, workshop ice-breakers.

## Tech Stack (STRICT)
- React 18 + TypeScript + Vite
- Tailwind CSS (utility classes only, for DOM UI panels)
- **Hybrid rendering:**
  - **Canvas:** Dungeon map, player/monster sprites, tile rendering, battle scene, all in-game animations
  - **DOM (React):** HUD overlays, menus, combat log, dialogue boxes, inventory, stat panels
- Canvas renders inside a React component via `useRef` + custom game loop (`requestAnimationFrame`)
- localStorage for save/state (death = delete save, roguelike rule)
- Zero external APIs, zero backend, zero image files — **all pixel art defined programmatically in code**
- Google Fonts: Press Start 2P (pixel font for in-game text), Noto Sans TC (Chinese UI text)

## Language Rules
- **Code & comments:** English
- **All player-facing text (UI, dialogue, item names, descriptions, combat log):** Traditional Chinese (繁體中文)
- **Tone of in-game text:** Sarcastic, self-deprecating engineer humor. Think "工程師的黑色幽默".

## Architecture Principles
- Feature-based folder structure (see below)
- State management: React Context + useReducer (NO Redux, NO Zustand)
- Game state as a single serializable object (easy to save/load/debug)
- Pure functions for all game logic (deterministic, testable)
- **Strict separation:** Game logic → Rendering engine → React UI (3 layers, no mixing)
- Canvas rendering via a dedicated engine module, NOT inside React components

---

## PIXEL ART & RENDERING SYSTEM

### Sprite Definition Format
All sprites are defined as **2D arrays of hex color strings** in code. Transparent pixels = `null`.
This is the core "conference trick": every monster IS a small TypeScript data literal.

```typescript
// Example: 16×16 player sprite
// Each row is 16 pixels wide, 16 rows tall
type PixelColor = string | null; // hex "#rrggbb" or null for transparent
type SpriteFrame = PixelColor[][];
type SpriteSheet = {
  frames: SpriteFrame[];       // animation frames
  frameWidth: number;          // 16
  frameHeight: number;         // 16
  frameDuration: number;       // ms per frame
};
```

### Sprite Sizes
| Entity | Size | Notes |
|--------|------|-------|
| Player (map) | 16×16 | 4-directional walk (2 frames each = 8 frames) |
| Player (battle) | 32×48 | Side view, idle bounce (2 frames) + attack (3 frames) |
| Monsters (map) | 16×16 | Simple idle (2 frames) |
| Monsters (battle) | 32×32 to 48×48 | Boss sprites are 48×48, normal are 32×32. Idle (2 frames) + hurt (1 frame) + special (2 frames) |
| Map tiles | 16×16 | Floor, wall, door, stairs, chest, etc. |
| Items/Icons | 8×8 or 16×16 | Equipment, potions, skill icons |
| Effects | 16×16 | Hit spark, heal glow, level up stars (4 frames each) |

### Tile Map System
Each floor is a grid of 16×16 pixel tiles rendered on Canvas:

| Tile ID | Name | Visual Description |
|---------|------|--------------------|
| 0 | Void | Pure black, unreachable |
| 1 | Stone Floor | Dark gray cobblestone pattern, 2 variants |
| 2 | Wall | Darker stone with top-edge highlight, gives depth |
| 3 | Door (locked) | Wooden door with iron bands, reddish brown |
| 4 | Door (open) | Same door but open, reveals dark interior |
| 5 | Stairs Down | Stone floor with downward spiral icon |
| 6 | Chest (closed) | Wooden chest with gold clasp |
| 7 | Chest (open) | Same chest, lid up, sparkle pixel |
| 8 | Shop Counter | Wooden counter with items displayed |
| 9 | Shrine | Stone altar with blue glow (Code Review) |
| 10 | Bookshelf | Tall shelf with colored book spines (Stack Overflow) |
| 11 | Coffee Machine | Modern machine with steam pixel animation |
| 12 | NPC Marker | Glowing question mark above floor tile |
| 13 | Fog | Semi-transparent dark overlay (unexplored) |
| 14 | Boss Door | Large ornate door with red glow, takes 2 tiles wide |

**Floor Themes (palette swap per floor):**
| Floor | Floor Color | Wall Color | Accent | Atmosphere |
|-------|------------|------------|--------|------------|
| 1F Frontend Swamp | Murky green-gray | Dark olive | Toxic green sparks | Sticky, slimy feel |
| 2F Backend Labyrinth | Cool blue-gray | Dark navy | Electric blue circuits | Technical, maze-like |
| 3F Database Abyss | Deep purple-gray | Dark indigo | Data-stream cyan | Deep, vast, echoing |
| 4F God Class Sanctum | Blood red-black | Obsidian | Gold + white lightning | Oppressive, final |

### Camera System
- Canvas viewport: 15×11 tiles visible (240×176 logical pixels, scaled up to fill container)
- Camera follows player, smooth scroll (lerp to target position)
- Camera bounds: never show beyond map edges
- Canvas is rendered at logical resolution then CSS-scaled with `image-rendering: pixelated`
- **Scale factor:** Logical 240×176 → display at 2x-4x depending on screen (CSS `width: 100%` on container)

### Rendering Pipeline
```
GameState (data)
  → RenderEngine reads state
  → Clear Canvas
  → Draw floor tiles (visible area only)
  → Draw items/interactables on map
  → Draw monsters on map (with idle animation)
  → Draw player (with walk/idle animation)
  → Draw fog of war overlay (semi-transparent)
  → Draw lighting effect (radial gradient around player)
  → DOM overlays render on top (React components with absolute positioning)
```

### Lighting & Atmosphere
- **Torch light effect:** Radial gradient centered on player, fades to dark at edges
- Light radius: 5 tiles bright, 3 tiles dim, beyond = very dark (barely visible)
- **Flicker:** Light radius oscillates ±0.3 tiles with perlin noise for torch flicker feel
- Boss rooms: special lighting (red pulse for God Class Sanctum)
- This single effect transforms "flat tile grid" into "atmospheric dungeon"

---

## BATTLE SCENE (Canvas)

### Layout (Dragon Quest / classic JRPG side-view style)
```
Canvas Battle Scene (240×176 logical pixels):
┌──────────────────────────────────────┐
│                                      │
│   [Background: floor theme art]      │
│                                      │
│          [Monster Sprite(s)]         │  ← Center-top area
│          with HP bar above           │
│                                      │
│                                      │
│                    [Player Sprite]    │  ← Bottom-right, facing left
│                                      │
└──────────────────────────────────────┘

DOM Overlay (on top of Canvas):
┌──────────────────────────────────────┐
│ ┌──────────────────────────────────┐ │
│ │  Combat Log (scrolling text)     │ │ ← Top overlay, semi-transparent bg
│ │  "你對複製貼上靈施展提取方法！"     │ │
│ └──────────────────────────────────┘ │
│                                      │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ ⚔️攻擊  🔧技能  💊道具  🏃逃跑  │ │ ← Bottom overlay, action menu
│ │                                  │ │
│ │ HP ████████░░ 75/100             │ │
│ │ MP ████░░░░░░ 40/100             │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### Battle Animations (Canvas)
| Animation | Description | Frames | Duration |
|-----------|------------|--------|----------|
| Player idle | Gentle breathing bounce (1px up/down) | 2 | 800ms loop |
| Player attack | Lunge forward 8px → slash effect → return | 6 | 400ms |
| Player hit | Flash white 2x → knockback 4px → return | 4 | 300ms |
| Player skill | Glow color of skill type → cast pose → projectile | 8 | 600ms |
| Monster idle | Slight hover/bounce | 2 | 600ms loop |
| Monster attack | Lunge toward player → impact spark | 4 | 300ms |
| Monster hit | Flash white → shake → damage number floats up | 4 | 300ms |
| Monster death | Flash rapidly → pixel dissolve (pixels scatter) | 12 | 800ms |
| Damage number | Float up from target, fade out | - | 600ms (Canvas text) |
| Critical hit | Screen flash + larger damage number + "暴擊！" text | - | 400ms |
| Level up | Gold sparkle shower from top of screen | 16 | 1200ms |
| Boss phase shift | Screen shake + flash + boss sprite swap | 8 | 1000ms |

### Pixel Dissolve Death Effect (Signature Animation)
When a monster dies:
1. Freeze monster sprite
2. For each non-transparent pixel, assign a random velocity vector (upward bias) and gravity
3. Over 800ms, each pixel flies outward as an individual particle
4. Particles fade out (alpha decreases)
This creates a dramatic "shatter into pixels" effect that looks amazing and is 100% code — great for conference demo.

---

## MONSTER SPRITE DESIGN GUIDE

Each monster's pixel art should visually reference its code smell concept:

| Monster | Visual Concept | Size | Key Visual Elements |
|---------|---------------|------|-------------------|
| 複製貼上靈 | Twin ghostly clipboard shapes | 32×32 | Two overlapping translucent forms, copy icon motif |
| 魔數精靈 | Floating number entity with glitchy aura | 32×32 | Body made of jumbled digits (4, 2, 7...), flickering pixels |
| 殭屍程式 | Zombie-fied code bracket `{ }` with dead eyes | 32×32 | Gray/green zombie, body shaped like curly braces |
| 長方法獸 | Tall stretched creature (long body!) | 32×48 | Comically tall and thin, scrollbar on its side |
| 越界觸手怪 | Octopus-like with tentacles crossing boundaries | 32×32 | Purple tentacles reaching across a dotted line |
| 散彈修改鳥 | Bird made of scattered code fragments | 32×32 | Fragmented body, pieces floating apart |
| 義大利麵蟲 (Boss) | Massive tangled noodle-worm | 48×48 | Spaghetti strands tangled, marinara red accents |
| 循環依賴蛇 (Boss) | Ouroboros snake eating own tail | 48×48 | Snake in circle, arrows showing circular flow |
| N+1 查詢蟲 | Bug that duplicates itself | 32×32 | Insect with "+1" on body, afterimages trailing |
| 過早優化魔 | Wizard with premature gray hair, gold-plated but fragile | 32×32 | Fancy robes but cracking, magnifying glass |
| 洩漏抽象體 | Blob leaking mysterious fluid through cracks | 32×32 | Container shape with dripping holes |
| 大泥球 (Boss) | Massive amorphous mud blob absorbing things | 48×48 | Brown mass with recognizable bits of other monsters inside |
| 資料泥團 | Cluster of stuck-together data shapes | 32×32 | Multiple small shapes fused uncomfortably |
| 懶惰類別 | Sleeping block with heavy armor | 32×32 | Cube with Z's floating, thick shell, tiny stubby limbs |
| 神類 (Final Boss) | Massive entity with ALL type indicators | 48×48 | Imposing figure with crown, body shifts between all monster traits at each phase; 4 distinct sprite variations |

### Player Sprite Design
- **Character:** 工程師 wearing a hoodie, laptop bag, headphones around neck
- **Map sprite (16×16):** Simple but recognizable silhouette — hoodie outline, glasses glint
- **Battle sprite (32×48):** More detailed — can see hoodie color, laptop as weapon, glasses
- **Color scheme:** Dark hoodie (#374151), blue jeans (#3b82f6), skin, glasses glint (#60a5fa)

---

## UI LAYOUT (DOM Overlays)

### Exploration Mode
```
┌─────────────────────────────────────┐
│░░░ [Minimap] ░░ 1F 前端泥沼 ░░ [☰] │ ← DOM: top bar (semi-transparent dark bg)
│                                     │
│         [Canvas: Dungeon Map]       │ ← Canvas: takes full screen
│         Camera follows player       │
│         Tile-based rendering        │
│         Lighting + fog of war       │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ HP ████████░░  MP ██████░░░░░░ │ │ ← DOM: bottom HUD (semi-transparent)
│ │ LV.3 重構學徒   💰 120         │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Event/Dialogue (DOM Overlay)
```
┌─────────────────────────────────────┐
│                                     │
│         [Canvas: Scene BG]          │
│         NPC sprite visible          │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ┌─┐                            │ │ ← DOM: JRPG dialogue box
│ │ │☕│ 「要來杯咖啡嗎？            │ │    Portrait icon + typewriter text
│ │ └─┘  暫時提升攻擊力喔！」       │ │
│ │                                 │ │
│ │  [接受 ☕]        [不用了]      │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Dialogue box styling:**
- Dark semi-transparent background with 2px pixel-art border (CSS box-shadow)
- Text appears character-by-character (typewriter effect, 30ms per char)
- Click/tap/Space to speed up or advance
- NPC portrait: 32×32 pixel art rendered to small canvas or CSS box-shadow

### Inventory/Status Screen (DOM, full overlay)
Pixel-art border using CSS box-shadow technique, retro RPG menu feel.
Items displayed as pixel art icons (small inline canvases) with Chinese names.

---

## GAME DESIGN DOCUMENT

### Core Loop
```
[Explore Floor] → [Encounter] → [Combat / Event / Shop] → [Loot / Level Up] → [Next Room]
                                                                                    ↓
                                                                          [Floor Boss] → [Descend]
                                                                                    ↓
                                                                          [Final Boss: God Class]
```

### Player Stats
| Stat | Concept Mapping | Description |
|------|----------------|-------------|
| HP (心智值) | Developer Sanity | Hits 0 = burnout = game over |
| MP (重構能量) | Refactoring Energy | Consumed by skills, regenerates per floor |
| ATK (程式力) | Coding Power | Base damage |
| DEF (架構力) | Architecture Defense | Damage reduction |
| SPD (迭代速) | Iteration Speed | Turn order |
| LV (年資) | Seniority Level | Overall progression |

### Dungeon Structure (4 Floors)
| Floor | Theme | Name | Monsters | Boss |
|-------|-------|------|----------|------|
| 1F | 前端泥沼 | The Frontend Swamp | Duplicate Code, Magic Number, Dead Code | Spaghetti Code |
| 2F | 後端迷宮 | The Backend Labyrinth | Long Method, Feature Envy, Shotgun Surgery | Circular Dependency |
| 3F | 資料庫深淵 | The Database Abyss | N+1 Query, Premature Optimization, Leaky Abstraction | Big Ball of Mud |
| 4F (Boss) | 神類聖殿 | The God Class Sanctum | All previous + Data Clump, Lazy Class | **God Class** |

### Monster Bestiary (Code Smells)
| Monster | 中文名 | HP | Behavior |
|---------|--------|-----|----------|
| Duplicate Code | 複製貼上靈 | Low | Splits into 2 copies at 50% HP |
| Magic Number | 魔數精靈 | Low | Random damage (1~max×3), unpredictable |
| Dead Code | 殭屍程式 | Very Low | Swarm — always appear in groups of 3-5 |
| Long Method | 長方法獸 | Very High | Slow but hits hard, multi-phase attack |
| Feature Envy | 越界觸手怪 | Medium | Steals player buffs |
| Shotgun Surgery | 散彈修改鳥 | Medium | Hits 3-5 times per turn, low per-hit damage |
| Spaghetti Code | 義大利麵蟲 | High | Floor 1 Boss — entangles, reduces SPD |
| Circular Dependency | 循環依賴蛇 | High | Floor 2 Boss — heals when you damage it (reflects %) |
| N+1 Query | N+1 查詢蟲 | Medium | Summons 1 additional copy each turn |
| Premature Optimization | 過早優化魔 | Medium | High DEF but low HP, wastes your turns |
| Leaky Abstraction | 洩漏抽象體 | Medium | Ignores a portion of your DEF |
| Big Ball of Mud | 大泥球 | Very High | Floor 3 Boss — absorbs defeated monsters' abilities |
| Data Clump | 資料泥團 | Low | Always appears with 2-3 others, buffs allies |
| Lazy Class | 懶惰類別 | Low | Does nothing but has high DEF, wastes turns |
| **God Class** | **神類** | **極高** | **Final Boss — has ALL abilities, phase transitions at 75/50/25% HP** |

### Refactoring Skills (Player Abilities)
| Skill | 中文名 | MP Cost | Effect | Unlock |
|-------|--------|---------|--------|--------|
| Extract Method | 提取方法 | 2 | Single target damage (1.5× ATK) | Start |
| Rename Variable | 重新命名 | 1 | Reveal enemy stats + weakness | Start |
| Inline Temp | 內聯暫存 | 1 | Quick attack (0.8× ATK), always goes first | Start |
| Replace Magic Number | 常數替換 | 3 | Stun for 1 turn, 2× damage vs Magic Number type | LV 3 |
| Move Method | 搬移方法 | 2 | Reposition: dodge next attack | LV 5 |
| Introduce Parameter Object | 參數物件化 | 4 | AoE: hit all enemies (0.7× ATK each) | LV 7 |
| Replace Conditional with Polymorphism | 多型替換 | 5 | Transform: weaken boss's current phase ability | LV 9 |
| Compose Method | 組合方法 | 6 | Ultimate: chain 3 random skills at 0.6× power | LV 11 |

### Design Pattern Equipment
| Slot | Pattern | 中文名 | Effect |
|------|---------|--------|--------|
| Weapon | Factory Method Keyboard | 工廠方法鍵盤 | +ATK, attacks create a weak clone hit |
| Armor | Strategy Pattern Hoodie | 策略模式帽T | +DEF, reduce damage from varied attack types |
| Accessory | Observer Pattern Earbuds | 觀察者模式耳機 | +SPD, alert when ambush incoming |
| Shield | Singleton Shield | 單例護盾 | Block status effects once per combat |
| Special | Adapter Pattern Dongle | 轉接器模式轉接頭 | Convert 30% incoming damage to MP |

### Non-Combat Encounters (Random Events)
- **Code Review 神壇** — Answer a refactoring trivia question, correct = full heal, wrong = lose 20% HP
- **Stack Overflow 圖書館** — Choose: learn a random skill OR restore MP
- **Coffee Machine ☕** — Temporary buff (+ATK or +SPD) for 5 combats
- **Technical Debt Collector 💸** — Pay HP to skip next 2 encounters
- **Pair Programming Partner 👥** — NPC joins for 3 combats (auto-attacks each turn)
- **Legacy Documentation 📜** — Reveals full floor map

### Procedural Map Generation
- Each floor: grid-based dungeon with actual corridors and rooms
- Generator: **BSP (Binary Space Partition) dungeon generation**
  - Recursively split area into rooms
  - Connect rooms with corridors
  - Place doors at room-corridor connections
- Map size: 40×30 tiles per floor
- Room sizes: 5×5 to 10×8 tiles
- Room types assigned after generation: Monster (50%), Event (15%), Treasure (10%), Shop (5%), Empty (20%)
- Boss room: always the largest room, farthest from start
- Start room: smallest room, farthest from boss
- Fog of war: tiles beyond player light radius are dark
- Monsters visible on map as sprites (walk into them to trigger combat)

### Combat System
- Turn-based, SPD determines order
- Player chooses: Attack (basic, free) / Skill (costs MP) / Item / Flee (50% chance, fail = enemy free hit)
- Damage formula: `ATK × skill_multiplier × (1 + random(-0.1, 0.1)) - target_DEF × 0.5`
- Critical hit: 10% chance, 1.5× damage, screen flash + dramatic message
- Combat log: scrollable, showing each action with sarcastic commentary

### Game Over & Victory
- **Death:** Stats summary, sarcastic epitaph, player sprite does pixel-dissolve, "再來一局" button
- **Victory:** "成功重構 legacy codebase！", full run stats, pixel confetti rains down
- **Both:** Auto-delete save from localStorage

---

## FOLDER STRUCTURE

```
src/
├── app/                    # App shell, React root, providers
├── engine/                 # Canvas rendering engine (NO React here)
│   ├── GameLoop.ts         # requestAnimationFrame loop, delta time
│   ├── Renderer.ts         # Main render pipeline
│   ├── Camera.ts           # Viewport tracking, smooth scroll
│   ├── SpriteRenderer.ts   # Draw sprite frames to canvas
│   ├── ParticleSystem.ts   # Pixel dissolve, sparkles, damage numbers
│   ├── LightingSystem.ts   # Torch light radial gradient + flicker
│   ├── TileRenderer.ts     # Draw tile map (only visible tiles)
│   ├── AudioSystem.ts      # Web Audio synthesized SFX (14 sounds)
│   ├── MusicSystem.ts      # BGM engine: track switching, loop, fade
│   └── MusicTracks.ts      # BGM note sequence data (9 tracks)
├── sprites/                # All sprite data (pure data, no logic)
│   ├── player.ts           # Player sprite frames
│   ├── monsters/           # One file per monster
│   ├── tiles.ts            # Tile sprite definitions per floor theme
│   ├── effects.ts          # Hit/heal/levelup effect frames
│   ├── items.ts            # Item icons
│   └── npc.ts              # NPC portraits and map sprites
├── features/
│   ├── game/               # Core game flow, state transitions
│   ├── combat/             # Combat state machine, AI, formulas
│   ├── map/                # Dungeon generation (BSP), pathfinding
│   ├── inventory/          # Equipment, items
│   └── events/             # Non-combat encounter logic
├── ui/                     # React DOM overlay components
│   ├── HUD.tsx             # Top bar
│   ├── BottomHUD.tsx       # HP/MP bars
│   ├── BattleUI.tsx        # Action menu, combat log, enemy HP
│   ├── DialogueBox.tsx     # JRPG typewriter text box
│   ├── InventoryScreen.tsx
│   ├── ShopScreen.tsx
│   ├── TitleScreen.tsx
│   ├── GameOverScreen.tsx
│   ├── VictoryScreen.tsx
│   └── components/         # Shared: PixelBorder, StatBar, etc.
├── data/
│   ├── monsters.ts
│   ├── skills.ts
│   ├── equipment.ts
│   ├── events.ts
│   ├── strings.ts
│   └── floorThemes.ts
├── state/
│   ├── GameContext.tsx
│   └── gameReducer.ts
└── utils/
    ├── types.ts
    ├── random.ts           # Seeded RNG
    └── constants.ts
```

---

## DEVELOPMENT PHASES

### Phase 1: Engine Foundation
1. Vite + React + TypeScript + Tailwind project setup
2. Google Fonts: Press Start 2P + Noto Sans TC
3. All TypeScript types & interfaces
4. **Canvas game engine scaffolding:**
   - GameLoop with requestAnimationFrame + delta time
   - Renderer that clears and draws to a canvas ref
   - Camera with viewport tracking
   - SpriteRenderer: takes a SpriteFrame[][] and draws to canvas at (x,y)
5. **Sprite data:**
   - Player sprite (map: 16×16, 4-dir walk; battle: 32×48 idle)
   - 3 tile types (floor, wall, void) for Floor 1 theme
   - Hit spark effect (4 frames)
6. **Proof of concept:** Render a small 10×10 hardcoded tile grid with the player sprite walking around (WASD/arrow keys/tap)
7. DOM HUD overlay: top bar (floor name) + bottom bar (HP/MP placeholder)
8. Title screen with pixel art game logo (CSS + small canvas)

**Deliverable:** Player sprite walks on a tile grid with camera follow, lighting effect active, HUD overlays visible. Looks like a real game.

### Phase 2: Dungeon & Exploration
1. BSP dungeon generator (40×30 tiles, rooms + corridors)
2. Full tileset for Floor 1 theme
3. Room type assignment + monster sprites on map
4. Fog of war + torch lighting
5. Player-monster collision → trigger combat (placeholder)
6. Interactable tiles: chests, doors
7. Minimap (small canvas in top-left DOM overlay)
8. Stairs → floor transition (screen fade) → regenerate
9. Full GameState context + reducer
10. Auto-save on room change

**Deliverable:** Full dungeon exploration. Atmospheric lighting. Feels like a dungeon crawler.

### Phase 3: Combat System
1. All battle sprites (player + Floor 1 monsters + boss)
2. Battle scene renderer (background, positioning, all animations)
3. **Pixel dissolve death effect**
4. Battle DOM overlay (action menu, combat log, HP bars)
5. Combat logic (turn order, skills, AI, damage, flee)
6. Combat results (XP, gold, drops, level up)

**Deliverable:** Fight through Floor 1 to boss. Cinematic pixel animations.

### Phase 4: Content & Progression
1. All remaining monster sprites (11 monsters + 3 bosses)
2. Floor themes 2-4 (palette swaps + backgrounds)
3. All skills + equipment system + inventory UI
4. All 4 floors with monster pools
5. Boss mechanics (God Class 4-phase)
6. Non-combat events with NPC sprites + dialogue
7. Shop system + level up stat allocation

**Deliverable:** Complete game, Floor 1 through God Class.

### Phase 5: Polish & Demo-Ready
1. Title screen with animated pixel logo
2. Sound effects (Web Audio synthesized)
3. Death/Victory screens with dramatic effects
4. Save/Load + "繼續冒險"
5. DEMO MODE (type "KONAMI" → LV 15 + all gear + floor warp)
6. Controls tutorial overlay
7. Performance optimization (offscreen canvas, sprite caching)
8. README.md with screenshots + architecture notes

**Deliverable:** Conference-ready. Visually impressive.

---

## CRITICAL ARCHITECTURE NOTES

### 1. Combat Event → Animation Mapping (CRITICAL)

Every `CombatEvent` kind emitted by `combatStateMachine.ts` **must** have a corresponding `case` in `applyEvents()` in `combatLoop.ts`, and that case **must** queue at least one animation via `queueAnimation()`.

**Why:** `BattleAnimator`'s `frame.finished` only becomes `true` when the animation queue had items and all have completed. If an event queues no animation, the queue stays empty → `finished` is never `true` → `handleAnimationComplete()` never runs → the game permanently freezes.

**Past incidents:** `flee_failed` and `reveal` events both caused combat lock because they were missing from `applyEvents()`; see also Note 5 for a related flee bug.

**Rule:** Whenever a new `CombatEvent` kind is added to the discriminated union in `combatStateMachine.ts`, immediately add a matching `case` in `applyEvents()` in `combatLoop.ts` that queues at least a minimal animation (e.g. `hit_reaction_player` or `hit_reaction_enemy`).

### 2. Two-Tier State Architecture

The game uses two distinct state tiers that must not be mixed:

- **60fps tier (`useRef`):** `CombatLoopState` and other game-loop state lives in a `useRef`. Direct property assignment is allowed for performance. Arrays must still use `.map()` to produce new arrays — no direct index mutation (`arr[i] = x` is forbidden).
- **React tier (`useReducer`):** `GameState` via `GameContext` + `useReducer`. Strictly immutable — all updates via `dispatch(GameAction)`.

Communication is one-way: 60fps tier reads from React state via snapshot, writes back via `dispatch()`. Never put 60fps loop state into React state (causes re-render storm), and never read React state directly inside the rAF loop.

### 3. Canvas Text Must Use DOM Overlays

Due to `image-rendering: pixelated` CSS scaling applied to the canvas, any text drawn via the Canvas 2D text API becomes blurry/aliased at display size.

**Rule:** All player-visible text (monster names, combat log, HP values, dialogue) must be rendered as DOM elements with `position: absolute` on top of the canvas. Use `VIEWPORT.logicalWidth` / `VIEWPORT.logicalHeight` as the coordinate reference for percentage positioning.

**Exception:** Damage numbers (`DamageNumbers.ts`) are rendered on canvas intentionally — the pixelated style is a feature, not a bug, and they need tight synchronisation with canvas animations.

### 4. DOM Overlay Coordinate System

DOM overlays on the battle canvas use percentage positioning derived from logical canvas coordinates:

```ts
const xPct = (logicalX / VIEWPORT.logicalWidth) * 100;   // VIEWPORT.logicalWidth = 240
const yPct = (logicalY / VIEWPORT.logicalHeight) * 100;  // VIEWPORT.logicalHeight = 176
// style={{ left: `${xPct}%`, top: `${yPct}%` }}
```

This keeps DOM elements aligned with canvas content at any CSS scale factor (2x–4x).

### 5. New Game Must Reset Player to STARTING_PLAYER (CRITICAL)

The `START_GAME` reducer case **must** spread `STARTING_PLAYER` from `initialState.ts`, not `state.player`.

```ts
// ✅ CORRECT
case "START_GAME":
  return {
    ...state,
    player: { ...STARTING_PLAYER, position: action.startPos },
    ...
  };

// ❌ WRONG — carries over HP=0 and other dead-state stats from the previous run
case "START_GAME":
  return {
    ...state,
    player: { ...state.player, position: action.startPos },
    ...
  };
```

**Past incident:** After dying (HP=0 stored in state), starting a new game inherited HP=0 — player was dead from the first frame.

### 6. Flee Fail Must Not Advance to Enemy Turn (CRITICAL)

In `processPlayerAction()` inside `combatStateMachine.ts`, when flee fails, the function must **return early with `phase: "selecting"`** before the normal "advance to enemy_turn" code path.

```ts
// After resolving flee action:
const fleeFailed = events.some((e) => e.kind === "flee_failed");
if (fleeFailed) {
  return { state: { ...newState, phase: "selecting", isPlayerTurn: true }, events, ... };
}
// Only reach enemy_turn advance if flee did NOT fail
```

**Past incident:** `flee_failed` was correctly handled in `applyEvents()` (no combat lock), but `processPlayerAction` fell through to advance `isPlayerTurn → false`, giving the enemy a free attack after a failed flee — effectively two enemy turns in one round.

### 7. COMBAT_END_VICTORY Must NOT Pass newPlayerStats (CRITICAL)

`APPLY_COMBAT_RESULT` already writes the correct final stats (exp, gold, level-up, HP/MP) to `state.player.stats` during combat. `COMBAT_END_VICTORY` must **not** accept or apply a `newPlayerStats` payload from the 60fps loop.

```ts
// ✅ CORRECT — reducer uses state.player.stats already set by APPLY_COMBAT_RESULT
case "COMBAT_END_VICTORY":
  return { ...state, player: { ...state.player, skills: newSkills }, ... };

// ❌ WRONG — snapshot may be stale, overwrites correctly updated stats
case "COMBAT_END_VICTORY":
  return { ...state, player: { ...state.player, stats: action.newPlayerStats, skills: newSkills }, ... };
```

**Why:** `gameStateRef.current` in the 60fps loop is updated by `useEffect` (after React renders). If `COMBAT_END_VICTORY` fires before `useEffect` has reflected the latest `APPLY_COMBAT_RESULT`, `action.newPlayerStats` is a stale snapshot — it overwrites the correct HP/exp/gold with pre-combat values.

**Past incident:** Combat "felt like it didn't happen" — player's HP appeared unchanged, exp/gold showed no gain, because the stale snapshot reset the React state that `APPLY_COMBAT_RESULT` had correctly updated.

### 8. BossDoor Must Have Exactly One Entrance (CRITICAL)

`placeBossDoor` in `bspGenerator.ts` must:
1. Collect Floor tiles just outside the boss room boundary
2. BFS-group them into contiguous entrance clusters
3. Keep ONE cluster → `TileType.BossDoor`
4. Seal all other clusters → `TileType.Wall`

Additionally:
- `validateMap` must be called **after** `placeBossDoor` (not before)
- `isPassable()` in `mapValidator.ts` must include `TileType.BossDoor` so the validator can reach `bossPos` through the door

**Why:** BSP corridors can pass through the boss room, creating entrances on multiple sides. If all are converted to BossDoor, the corridors are cut — other rooms become unreachable and the dungeon is unbeatable.

**Past incident:** Screenshot showed two BossDoor tiles blocking a corridor, making the dungeon unplayable because both sides were sealed.

### 9. BossDoor and Stairs Progression Logic

- **BossDoor** (entering boss room): opens when ALL **non-boss** monsters are cleared
  - Check: `floor.monsters.some(m => !m.def.behavior.startsWith("boss_"))`
  - If true → show "消滅所有小怪才能進入 Boss 房！", block
- **StairsDown** (descending to next floor): requires the **boss** to be dead
  - Check: `floor.monsters.some(m => m.def.behavior.startsWith("boss_"))`
  - If true → show "消滅 Boss 才能下樓！", block
- `behavior.startsWith("boss_")` is the canonical way to identify boss monsters (there is no `isBoss` field on `MonsterDef`)

### 10. MusicSystem Mute Must Sync Both Systems (CRITICAL)

There are two independent audio systems: `AudioSystem` (SFX) and `MusicSystem` (BGM). Both must be muted/unmuted together. Muting only one silences one channel but leaves the other playing.

```ts
// ✅ CORRECT — in every mute toggle handler (HUD.tsx, PauseMenu.tsx)
AudioSystem.setMuted(next);
MusicSystem.setMuted(next);

// ❌ WRONG — BGM keeps playing after player hits mute
AudioSystem.setMuted(next);
```

`MusicSystem` does NOT call `AudioSystem.setMuted` internally (that would create a circular import). Each component that exposes a mute toggle is responsible for calling both.

**MusicSystem files:**
- `src/engine/MusicSystem.ts` — engine logic (track switching, fade, loop scheduling)
- `src/engine/MusicTracks.ts` — note sequence data (`// prettier-ignore` to keep arrays compact)

**Track → GameMode mapping** (in `computeMusicTrack`, `GameCanvas.tsx`):
- `title` → `"title"`
- `exploring` / `event` / `shop` → `"explore_{currentFloor}"` (clamped to 4)
- `combat` → `"combat_boss"` if any enemy has `behavior.startsWith("boss_")`, else `"combat"`
- `victory` → `"victory"` (one-shot, no loop)
- `game_over` → `"game_over"` (one-shot, no loop)

**MusicSystem exception to engine purity rule:** `MusicSystem.ts` imports `getCtx()` from `AudioSystem.ts` to share the same `AudioContext`. This is the only allowed cross-import within `src/engine/` — it avoids creating duplicate `AudioContext` instances (browsers limit their count).

---

## CODING STANDARDS
- No `any` type — strict TypeScript
- All game logic functions must be pure
- **Engine code (src/engine/):** Zero React dependencies. Pure TypeScript + Canvas API only.
- **Sprite data (src/sprites/):** Pure data files. No logic, no imports from engine.
- React components: functional only, hooks for state
- File size cap: no file > 200 lines
- Chinese strings centralized in `src/data/strings.ts`
- All entities defined as data, not hardcoded in logic
- Discriminated unions for game states
- Canvas coordinates always in logical pixels (16px tile units), scale handled by CSS
- **UI font size minimums:** Press Start 2P headers ≥ 18px, section labels ≥ 14px; Noto Sans TC item names ≥ 18px, secondary text ≥ 14px — never use 10-12px in player-facing UI (too small on scaled canvas)

## TESTING

### Browser Testing Tool

**Platform note:** `agent-browser` binary is NOT available on darwin-arm64 (Apple Silicon Mac). Use **Playwright MCP** instead.

| Tool | When to Use |
|------|-------------|
| `agent-browser:agent-browser` | Linux / CI environments where the binary is available |
| `agent-browser:dogfood` | Same — Linux / CI only |
| **Playwright MCP** (`mcp__plugin_playwright_playwright__*`) | **darwin-arm64 (Apple Silicon)** — use this for all browser testing on local dev |

**Playwright MCP quick reference:**
```
browser_navigate → http://localhost:5173
browser_snapshot → read page structure / find element refs
browser_click / browser_press_key / browser_evaluate → interact
browser_take_screenshot → visual verification
browser_console_messages → check for JS errors
```

To read live game state from the browser console:
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

### When to Test
- After implementing a new feature or fixing a bug, run browser tests to verify visually
- After combat system changes, test a full battle flow (enter combat → attack/skill → victory/defeat)
- After UI changes, verify DOM overlay alignment with canvas at different viewport sizes

### Dev Server
- `npm run dev` must be running before any browser test
- Default URL: `http://localhost:5173`

## RESPONSE RULES
- All responses in Traditional Chinese (繁體中文)
- Explain what you're building before writing code
- After each phase, summarize what's done and what's next
- Pick tradeoffs yourself unless critical