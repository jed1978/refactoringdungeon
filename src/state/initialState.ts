import type { GameState, PlayerStats, PlayerState, FloorState } from '../utils/types';
import { Direction, TileType, RoomType } from '../utils/types';
import { FLOOR_THEMES } from '../utils/constants';

export const STARTING_STATS: PlayerStats = {
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
  skills: ['extract_method', 'rename_variable', 'inline_temp'],
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

export const INITIAL_GAME_STATE: GameState = {
  gameMode: { mode: 'title' },
  player: STARTING_PLAYER,
  floor: EMPTY_FLOOR,
  currentFloor: 1,
};
