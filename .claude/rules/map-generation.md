---
paths:
  - "src/features/map/**"
  - "src/data/monsters.ts"
  - "src/sprites/monsters/**"
---

# Map Generation & Dungeon Rules

## BossDoor Must Have Exactly One Entrance

`placeBossDoor` in `bspGenerator.ts`:
1. Collect Floor tiles just outside boss room boundary
2. BFS-group into contiguous entrance clusters
3. Keep ONE cluster → `TileType.BossDoor`
4. Seal all others → `TileType.Wall`

`validateMap` MUST be called AFTER `placeBossDoor`. `isPassable()` includes `BossDoor` so BFS reaches boss room.

## Dual Validation (Deadlock Prevention)

After map generation, TWO validations are required:

```ts
if (!validateMap(tileMap, startPos, typedRooms)) continue;

const nonBossRooms = typedRooms.filter((r) => r.type !== RoomType.Boss);
if (!validateMapNoBossDoor(tileMap, startPos, nonBossRooms)) continue;
```

- `validateMap`: BossDoor passable — all room centers reachable (including boss)
- `validateMapNoBossDoor`: BossDoor as Wall — all NON-boss rooms reachable WITHOUT BossDoor

If a non-boss room is only accessible through BossDoor → its monster can't be killed → BossDoor never unlocks → **deadlock**.

## validateMap Checks ALL Room Centers

BFS from start must reach ALL room centers, not just boss. BSP `connectLeaves()` can create unreachable "island" rooms.

## BossDoor and Stairs Progression Logic

- **BossDoor opens** when ALL non-boss monsters cleared: `floor.monsters.some(m => !m.def.behavior.startsWith("boss_"))` → if true, block
- **StairsDown unlocks** when boss dead: `floor.monsters.some(m => m.def.behavior.startsWith("boss_"))` → if true, block
- `behavior.startsWith("boss_")` is the canonical boss identifier (no `isBoss` field)

## Training Room Uses floorMonsterIndex = -1

Training Room battles set `floorMonsterIndex: -1` (sentinel). `COMBAT_END_VICTORY` MUST guard:

```ts
const updatedMonsters =
  action.floorMonsterIndex === -1
    ? state.floor.monsters          // training — nothing to remove
    : state.floor.monsters.filter((_, i) => i !== action.floorMonsterIndex);
```

Training battles never modify `floor.monsters` — never affect BossDoor unlock.

## Boss spriteId Must Be Registered

Every `MonsterDef.spriteId` MUST have a matching key in `monsterMapSprites` (`src/sprites/monsters/index.ts`). Missing key → boss is invisible on map but still collidable.

**Rule:** Adding a monster to `src/data/monsters.ts` requires TWO paired steps:
1. Create sprite file in `src/sprites/monsters/`
2. Add entry to `monsterMapSprites` in `index.ts`
