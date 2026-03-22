import type {
  GameState,
  PlayerStats,
  PlayerState,
  FloorState,
  RunStats,
} from "../utils/types";
import { Direction, TileType } from "../utils/types";
import { FLOOR_THEMES } from "../utils/constants";
import { EQUIPMENT } from "../data/equipment";

const STARTING_STATS: PlayerStats = {
  hp: 100,
  maxHp: 100,
  mp: 50,
  maxMp: 50,
  atk: 10,
  def: 5,
  spd: 8,
  level: 1,
  exp: 0,
  expToNext: 30,
  gold: 0,
};

export const STARTING_PLAYER: PlayerState = {
  position: { x: 0, y: 0 },
  direction: Direction.Down,
  isMoving: false,
  stats: STARTING_STATS,
  skills: ["extract_method", "rename_variable", "inline_temp"],
  equipment: {
    weapon: null,
    armor: null,
    accessory: null,
    shield: null,
    special: null,
  },
  inventory: [],
};

const EMPTY_FLOOR: FloorState = {
  level: 1,
  theme: FLOOR_THEMES[0],
  tileMap: [[TileType.Void]],
  rooms: [],
  monsters: [],
  explored: [[false]],
};

export const INITIAL_RUN_STATS: RunStats = {
  monstersKilled: 0,
  floorsCleared: 0,
  startTime: 0,
  skillUseCounts: {},
  itemsUsed: 0,
};

const DEMO_STATS: PlayerStats = {
  hp: 300,
  maxHp: 300,
  mp: 100,
  maxMp: 100,
  atk: 30,
  def: 20,
  spd: 15,
  level: 15,
  exp: 0,
  expToNext: 999,
  gold: 500,
};

const ALL_SKILLS: readonly string[] = [
  "extract_method",
  "rename_variable",
  "inline_temp",
  "replace_magic_number",
  "move_method",
  "introduce_parameter_object",
  "replace_conditional",
  "compose_method",
];

export const DEMO_PLAYER: PlayerState = {
  position: { x: 0, y: 0 },
  direction: Direction.Down,
  isMoving: false,
  stats: DEMO_STATS,
  skills: ALL_SKILLS,
  equipment: {
    weapon: EQUIPMENT.find((e) => e.slot === "weapon") ?? null,
    armor: EQUIPMENT.find((e) => e.slot === "armor") ?? null,
    accessory: EQUIPMENT.find((e) => e.slot === "accessory") ?? null,
    shield: EQUIPMENT.find((e) => e.slot === "shield") ?? null,
    special: EQUIPMENT.find((e) => e.slot === "special") ?? null,
  },
  inventory: [],
};

export const INITIAL_GAME_STATE: GameState = {
  gameMode: { mode: "title" },
  player: STARTING_PLAYER,
  floor: EMPTY_FLOOR,
  currentFloor: 1,
  settings: { muted: false },
  runStats: INITIAL_RUN_STATS,
  flags: { tutorialMove: false, tutorialCombat: false },
  demoMode: false,
  skipEncounters: 0,
  companionCombats: 0,
};
