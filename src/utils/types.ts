// Pixel art types
export type PixelColor = string | null;
export type SpriteFrame = PixelColor[][];
export type SpriteSheet = {
  readonly frames: readonly SpriteFrame[];
  readonly frameWidth: number;
  readonly frameHeight: number;
  readonly frameDuration: number;
};

// Direction & Tile enums
export enum Direction {
  Down = 0,
  Up = 1,
  Left = 2,
  Right = 3,
}

export enum TileType {
  Void = 0,
  Floor = 1,
  Wall = 2,
  DoorLocked = 3,
  DoorOpen = 4,
  StairsDown = 5,
  ChestClosed = 6,
  ChestOpen = 7,
  ShopCounter = 8,
  Shrine = 9,
  Bookshelf = 10,
  CoffeeMachine = 11,
  NpcMarker = 12,
  Fog = 13,
  BossDoor = 14,
  DebtCollector = 15,
  PairProgrammer = 16,
  LegacyDocs = 17,
}

// Map types
export type TileMap = readonly (readonly TileType[])[];

export type Position = {
  readonly x: number;
  readonly y: number;
};

export type Room = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly type: RoomType;
};

export enum RoomType {
  Empty = "empty",
  Monster = "monster",
  Event = "event",
  Treasure = "treasure",
  Shop = "shop",
  Boss = "boss",
  Start = "start",
}

// Player types
export type PlayerStats = {
  readonly hp: number;
  readonly maxHp: number;
  readonly mp: number;
  readonly maxMp: number;
  readonly atk: number;
  readonly def: number;
  readonly spd: number;
  readonly level: number;
  readonly exp: number;
  readonly expToNext: number;
  readonly gold: number;
};

export type PlayerState = {
  readonly position: Position;
  readonly direction: Direction;
  readonly isMoving: boolean;
  readonly stats: PlayerStats;
  readonly skills: readonly string[];
  readonly equipment: EquipmentSlots;
  readonly inventory: readonly Item[];
};

// Equipment
export type EquipmentSlots = {
  readonly weapon: Equipment | null;
  readonly armor: Equipment | null;
  readonly accessory: Equipment | null;
  readonly shield: Equipment | null;
  readonly special: Equipment | null;
};

export type Equipment = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly slot: keyof EquipmentSlots;
  readonly stats: Partial<Pick<PlayerStats, "atk" | "def" | "spd">>;
  readonly effect: string;
};

export type Item = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly quantity: number;
};

// Monster
export type MonsterDef = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly hp: number;
  readonly atk: number;
  readonly def: number;
  readonly spd: number;
  readonly exp: number;
  readonly gold: number;
  readonly behavior: string;
  readonly spriteId: string;
  readonly spriteSize: 32 | 48;
};

export type MonsterState = {
  readonly def: MonsterDef;
  readonly currentHp: number;
  readonly position: Position;
  readonly buffs: readonly Buff[];
};

export type Buff = {
  readonly id: string;
  readonly name: string;
  readonly turnsRemaining: number;
  readonly effect: string;
};

// Skills
export type Skill = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly mpCost: number;
  readonly multiplier: number;
  readonly effect: string;
  readonly unlockLevel: number;
};

// Floor
export type FloorTheme = {
  readonly id: number;
  readonly name: string;
  readonly floorColor: string;
  readonly wallColor: string;
  readonly accent: string;
  readonly atmosphere: string;
};

export type FloorState = {
  readonly level: number;
  readonly theme: FloorTheme;
  readonly tileMap: TileMap;
  readonly rooms: readonly Room[];
  readonly monsters: readonly MonsterState[];
  readonly explored: readonly (readonly boolean[])[];
};

// Combat
export type CombatAction =
  | { readonly type: "attack"; readonly targetIndex: number }
  | {
      readonly type: "skill";
      readonly skillId: string;
      readonly targetIndex: number;
    }
  | { readonly type: "item"; readonly itemId: string }
  | { readonly type: "flee" };

export type CombatLog = {
  readonly entries: readonly string[];
};

export type CombatPhase =
  | "selecting"
  | "animating"
  | "enemy_turn"
  | "victory"
  | "defeat";

export type TurnOrderEntry =
  | { readonly kind: "player" }
  | { readonly kind: "enemy"; readonly index: number };

export type CombatState = {
  readonly enemies: readonly MonsterState[];
  readonly turn: number;
  readonly isPlayerTurn: boolean;
  readonly log: CombatLog;
  readonly phase: CombatPhase;
  readonly turnOrder: readonly TurnOrderEntry[];
  readonly currentTurnIndex: number;
  readonly selectedTarget: number;
  readonly revealedEnemies: readonly number[];
  readonly bossEntangledTurns: number;
  readonly floorMonsterIndex: number;
  readonly playerDodgeTurns: number;
  readonly bossPhase: number; // 0=initial, 1=<75%, 2=<50%, 3=<25% (enrage)
};

// Game mode discriminated union
export type GameMode =
  | { readonly mode: "title" }
  | { readonly mode: "exploring" }
  | { readonly mode: "combat"; readonly combat: CombatState }
  | { readonly mode: "event"; readonly eventId: string }
  | { readonly mode: "shop" }
  | { readonly mode: "game_over" }
  | { readonly mode: "victory" };

// Run statistics
export type RunStats = {
  readonly monstersKilled: number;
  readonly floorsCleared: number;
  readonly startTime: number;
  readonly skillUseCounts: Readonly<Record<string, number>>;
  readonly itemsUsed: number;
};

// Complete game state
export type GameState = {
  readonly gameMode: GameMode;
  readonly player: PlayerState;
  readonly floor: FloorState;
  readonly currentFloor: number;
  readonly settings: { readonly muted: boolean };
  readonly runStats: RunStats;
  readonly flags: {
    readonly tutorialMove: boolean;
    readonly tutorialCombat: boolean;
  };
  readonly demoMode: boolean;
  readonly skipEncounters: number;
  readonly companionCombats: number;
};

// Rendering
export type Viewport = {
  readonly widthTiles: number;
  readonly heightTiles: number;
  readonly logicalWidth: number;
  readonly logicalHeight: number;
};

export type CameraState = {
  readonly x: number;
  readonly y: number;
  readonly targetX: number;
  readonly targetY: number;
};
