# Refactoring Dungeon（重構地城）— Project Specification v2

> **Architecture rules have been extracted to `.claude/rules/`.**
> Coding standards, build/test procedures, and all 18 critical architecture notes
> are now in focused rule files that load automatically based on which files you're editing.
> This file contains game design, specs, and reference material only.

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
│ │  Combat Log (scrolling text)     │ │
│ └──────────────────────────────────┘ │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ ⚔️攻擊  🔧技能  💊道具  🏃逃跑  │ │
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
| Damage number | Float up from target, fade out | - | 600ms |
| Critical hit | Screen flash + larger damage number + "暴擊！" | - | 400ms |
| Level up | Gold sparkle shower from top of screen | 16 | 1200ms |
| Boss phase shift | Screen shake + flash + boss sprite swap | 8 | 1000ms |

### Pixel Dissolve Death Effect (Signature Animation)
When a monster dies:
1. Freeze monster sprite
2. For each non-transparent pixel, assign a random velocity vector (upward bias) and gravity
3. Over 800ms, each pixel flies outward as an individual particle
4. Particles fade out (alpha decreases)

---

## MONSTER SPRITE DESIGN GUIDE

| Monster | Visual Concept | Size | Key Visual Elements |
|---------|---------------|------|-------------------|
| 複製貼上靈 | Twin ghostly clipboard shapes | 32×32 | Two overlapping translucent forms, copy icon motif |
| 魔數精靈 | Floating number entity with glitchy aura | 32×32 | Body made of jumbled digits, flickering pixels |
| 殭屍程式 | Zombie-fied code bracket `{ }` | 32×32 | Gray/green zombie, body shaped like curly braces |
| 長方法獸 | Tall stretched creature | 32×48 | Comically tall and thin, scrollbar on its side |
| 越界觸手怪 | Octopus crossing boundaries | 32×32 | Purple tentacles reaching across a dotted line |
| 散彈修改鳥 | Bird of scattered fragments | 32×32 | Fragmented body, pieces floating apart |
| 義大利麵蟲 (Boss) | Massive tangled noodle-worm | 48×48 | Spaghetti strands tangled, marinara red accents |
| 循環依賴蛇 (Boss) | Ouroboros snake | 48×48 | Snake in circle, arrows showing circular flow |
| N+1 查詢蟲 | Self-duplicating bug | 32×32 | Insect with "+1" on body, afterimages trailing |
| 過早優化魔 | Fancy but fragile wizard | 32×32 | Fancy robes but cracking, magnifying glass |
| 洩漏抽象體 | Leaking container blob | 32×32 | Container shape with dripping holes |
| 大泥球 (Boss) | Amorphous absorbing blob | 48×48 | Brown mass with bits of other monsters inside |
| 資料泥團 | Stuck-together data cluster | 32×32 | Multiple small shapes fused uncomfortably |
| 懶惰類別 | Sleeping armored block | 32×32 | Cube with Z's floating, thick shell, stubby limbs |
| 神類 (Final Boss) | Massive ALL-type entity | 48×48 | Crown, body shifts at each phase; 4 sprite variations |

### Player Sprite Design
- **Character:** 工程師 wearing a hoodie, laptop bag, headphones around neck
- **Map sprite (16×16):** Hoodie outline, glasses glint
- **Battle sprite (32×48):** Hoodie color, laptop as weapon, glasses
- **Color scheme:** Dark hoodie (#374151), blue jeans (#3b82f6), glasses glint (#60a5fa)

---

## UI LAYOUT (DOM Overlays)

### Exploration Mode
```
┌─────────────────────────────────────┐
│░░░ [Minimap] ░░ 1F 前端泥沼 ░░ [☰] │ ← DOM: top bar
│                                     │
│         [Canvas: Dungeon Map]       │ ← Canvas: full screen
│         Camera follows player       │
│         Lighting + fog of war       │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ HP ████████░░  MP ██████░░░░░░ │ │ ← DOM: bottom HUD
│ │ LV.3 重構學徒   💰 120         │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Event/Dialogue (DOM Overlay)
```
┌─────────────────────────────────────┐
│         [Canvas: Scene BG]          │
│ ┌─────────────────────────────────┐ │
│ │ ┌─┐                            │ │ ← JRPG dialogue box
│ │ │☕│ 「要來杯咖啡嗎？            │ │    Typewriter text, 30ms/char
│ │ └─┘  暫時提升攻擊力喔！」       │ │
│ │  [接受 ☕]        [不用了]      │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## GAME DESIGN DOCUMENT

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
| Magic Number | 魔數精靈 | Low | Random damage (1~max×3) |
| Dead Code | 殭屍程式 | Very Low | Swarm — groups of 3-5 |
| Long Method | 長方法獸 | Very High | Slow but hits hard |
| Feature Envy | 越界觸手怪 | Medium | Steals player buffs |
| Shotgun Surgery | 散彈修改鳥 | Medium | 3-5 hits per turn, low each |
| Spaghetti Code | 義大利麵蟲 | High | Boss 1F — entangles, reduces SPD |
| Circular Dependency | 循環依賴蛇 | High | Boss 2F — heals on damage (reflects %) |
| N+1 Query | N+1 查詢蟲 | Medium | Summons 1 copy each turn |
| Premature Optimization | 過早優化魔 | Medium | High DEF, low HP, wastes turns |
| Leaky Abstraction | 洩漏抽象體 | Medium | Ignores portion of DEF |
| Big Ball of Mud | 大泥球 | Very High | Boss 3F — absorbs defeated abilities |
| Data Clump | 資料泥團 | Low | Appears with 2-3 others, buffs allies |
| Lazy Class | 懶惰類別 | Low | Does nothing, high DEF |
| **God Class** | **神類** | **極高** | **Final Boss — ALL abilities, phase shifts at 75/50/25% HP** |

### Refactoring Skills
| Skill | 中文名 | MP | Effect | Unlock |
|-------|--------|----|--------|--------|
| Extract Method | 提取方法 | 2 | 1.5× ATK single target | Start |
| Rename Variable | 重新命名 | 1 | Reveal enemy stats | Start |
| Inline Temp | 內聯暫存 | 1 | 0.8× ATK, always first | Start |
| Replace Magic Number | 常數替換 | 3 | Stun 1 turn, 2× vs Magic Number | LV 3 |
| Move Method | 搬移方法 | 2 | Dodge next attack | LV 5 |
| Introduce Parameter Object | 參數物件化 | 4 | AoE 0.7× ATK all enemies | LV 7 |
| Polymorphism | 多型替換 | 5 | Weaken boss's current phase | LV 9 |
| Compose Method | 組合方法 | 6 | Chain 3 random skills at 0.6× | LV 11 |

### Design Pattern Equipment
| Slot | Pattern | 中文名 | Effect |
|------|---------|--------|--------|
| Weapon | Factory Method Keyboard | 工廠方法鍵盤 | +ATK, clone hit |
| Armor | Strategy Pattern Hoodie | 策略模式帽T | +DEF, varied damage reduction |
| Accessory | Observer Pattern Earbuds | 觀察者模式耳機 | +SPD, ambush alert |
| Shield | Singleton Shield | 單例護盾 | Block status effects once |
| Special | Adapter Pattern Dongle | 轉接器模式轉接頭 | 30% damage → MP |

### Non-Combat Encounters
- **Code Review 神壇** — Trivia: correct = full heal, wrong = -20% HP
- **Stack Overflow 圖書館** — Random skill OR restore MP
- **Coffee Machine ☕** — Temp buff (+ATK or +SPD) for 5 combats
- **Technical Debt Collector 💸** — Pay HP to skip 2 encounters
- **Pair Programming Partner 👥** — NPC joins 3 combats
- **Legacy Documentation 📜** — Reveals full floor map

### Combat System
- Turn-based, SPD determines order
- Actions: Attack (free) / Skill (MP) / Item / Flee (50%)
- Damage: `ATK × multiplier × (1 ± 0.1) - DEF × 0.5`
- Critical: 10% chance, 1.5× damage

---

## FOLDER STRUCTURE

```
src/
├── app/                    # App shell, React root, providers
├── engine/                 # Canvas rendering engine (NO React)
│   ├── GameLoop.ts
│   ├── Renderer.ts
│   ├── Camera.ts
│   ├── SpriteRenderer.ts
│   ├── ParticleSystem.ts
│   ├── LightingSystem.ts
│   ├── TileRenderer.ts
│   ├── AudioSystem.ts      # SFX (14 sounds)
│   ├── MusicTypes.ts
│   ├── MusicSynth.ts
│   ├── MusicSystem.ts
│   ├── MusicTracks.ts
│   └── tracks/             # 9 track files + noteFreqs.ts
├── sprites/                # Pure data, no logic
│   ├── player.ts
│   ├── monsters/
│   ├── tiles.ts
│   ├── effects.ts
│   ├── items.ts
│   └── npc.ts
├── features/
│   ├── game/
│   ├── combat/
│   ├── map/
│   ├── inventory/
│   └── events/
├── ui/                     # React DOM overlays
│   ├── HUD.tsx
│   ├── BottomHUD.tsx
│   ├── BattleUI.tsx
│   ├── DialogueBox.tsx
│   ├── InventoryScreen.tsx
│   ├── ShopScreen.tsx
│   ├── TitleScreen.tsx
│   ├── GameOverScreen.tsx
│   ├── VictoryScreen.tsx
│   └── components/
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
    ├── random.ts
    └── constants.ts
```

---

## DEVELOPMENT PHASES

### Phase 1: Engine Foundation
1. Vite + React + TypeScript + Tailwind project setup
2. Google Fonts: Press Start 2P + Noto Sans TC
3. All TypeScript types & interfaces
4. Canvas game engine scaffolding (GameLoop, Renderer, Camera, SpriteRenderer)
5. Sprite data: Player (map + battle), 3 tile types, hit spark effect
6. Proof of concept: 10×10 tile grid with player walking (WASD/arrows/tap)
7. DOM HUD overlay: top bar + bottom bar
8. Title screen with pixel art logo

**Deliverable:** Player sprite walks on tile grid with camera follow and lighting.

### Phase 2: Dungeon & Exploration
1. BSP dungeon generator (40×30 tiles, rooms + corridors)
2. Full tileset for Floor 1 theme
3. Room type assignment + monster sprites on map
4. Fog of war + torch lighting
5. Player-monster collision → trigger combat (placeholder)
6. Interactable tiles: chests, doors
7. Minimap (small canvas in DOM overlay)
8. Stairs → floor transition → regenerate
9. Full GameState context + reducer
10. Auto-save on room change

**Deliverable:** Full dungeon exploration. Atmospheric lighting.

### Phase 3: Combat System
1. All battle sprites (player + Floor 1 monsters + boss)
2. Battle scene renderer (background, positioning, all animations)
3. Pixel dissolve death effect
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

## RESPONSE RULES
- All responses in Traditional Chinese (繁體中文)
- Explain what you're building before writing code
- After each phase, summarize what's done and what's next
- Pick tradeoffs yourself unless critical