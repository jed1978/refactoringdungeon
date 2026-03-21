import type {
  GameState,
  GameMode,
  PlayerState,
  FloorState,
  Position,
  MonsterState,
  PlayerStats,
  CombatState,
} from "../utils/types";
import { TileType } from "../utils/types";
import { initCombat } from "../features/combat/combatStateMachine";

export type GameAction =
  | {
      readonly type: "START_GAME";
      readonly floor: FloorState;
      readonly startPos: Position;
    }
  | { readonly type: "LOAD_SAVE"; readonly state: GameState }
  | {
      readonly type: "SET_FLOOR";
      readonly floor: FloorState;
      readonly startPos: Position;
    }
  | { readonly type: "MOVE_PLAYER"; readonly position: Position }
  | {
      readonly type: "UPDATE_EXPLORED";
      readonly explored: readonly (readonly boolean[])[];
    }
  | { readonly type: "OPEN_CHEST"; readonly position: Position }
  | { readonly type: "DEFEAT_MONSTER"; readonly monsterIndex: number }
  | {
      readonly type: "TRIGGER_COMBAT";
      readonly monsters: readonly MonsterState[];
      readonly floorMonsterIndex: number;
    }
  | {
      readonly type: "APPLY_COMBAT_RESULT";
      readonly newCombat: CombatState;
      readonly newPlayerStats?: PlayerStats;
    }
  | {
      readonly type: "COMBAT_END_VICTORY";
      readonly newPlayerStats: PlayerStats;
      readonly unlockedSkills?: readonly string[];
    }
  | { readonly type: "COMBAT_END_DEFEAT" }
  | {
      readonly type: "CHANGE_FLOOR";
      readonly floor: FloorState;
      readonly startPos: Position;
    }
  | { readonly type: "SET_GAME_MODE"; readonly gameMode: GameMode }
  | { readonly type: "SET_INTERACTION_PROMPT"; readonly prompt: string | null }
  | {
      readonly type: "UPDATE_PLAYER_STATS";
      readonly stats: Partial<PlayerState["stats"]>;
    }
  | { readonly type: "RETURN_TO_TITLE" };

export type GameStateWithPrompt = GameState & {
  readonly interactionPrompt: string | null;
};

export function gameReducer(
  state: GameStateWithPrompt,
  action: GameAction,
): GameStateWithPrompt {
  switch (action.type) {
    case "START_GAME":
      return {
        ...state,
        gameMode: { mode: "exploring" },
        floor: action.floor,
        player: { ...state.player, position: action.startPos },
        currentFloor: action.floor.level,
        interactionPrompt: null,
      };

    case "LOAD_SAVE":
      return { ...action.state, interactionPrompt: null };

    case "SET_FLOOR":
      return {
        ...state,
        floor: action.floor,
        player: { ...state.player, position: action.startPos },
        currentFloor: action.floor.level,
      };

    case "MOVE_PLAYER":
      return {
        ...state,
        player: { ...state.player, position: action.position },
      };

    case "UPDATE_EXPLORED":
      return { ...state, floor: { ...state.floor, explored: action.explored } };

    case "OPEN_CHEST": {
      const newTileMap = state.floor.tileMap.map((row, y) =>
        y === action.position.y
          ? row.map((tile, x) =>
              x === action.position.x && tile === TileType.ChestClosed
                ? TileType.ChestOpen
                : tile,
            )
          : row,
      );
      return {
        ...state,
        floor: { ...state.floor, tileMap: newTileMap },
        player: {
          ...state.player,
          stats: { ...state.player.stats, gold: state.player.stats.gold + 15 },
        },
      };
    }

    case "DEFEAT_MONSTER": {
      const defeated = state.floor.monsters[action.monsterIndex];
      if (!defeated) return state;
      return {
        ...state,
        floor: {
          ...state.floor,
          monsters: state.floor.monsters.filter(
            (_, i) => i !== action.monsterIndex,
          ),
        },
        player: {
          ...state.player,
          stats: {
            ...state.player.stats,
            exp: state.player.stats.exp + defeated.def.exp,
            gold: state.player.stats.gold + defeated.def.gold,
          },
        },
      };
    }

    case "TRIGGER_COMBAT": {
      const combat = initCombat(action.monsters, state.player.stats);
      return {
        ...state,
        gameMode: {
          mode: "combat",
          combat: { ...combat, floorMonsterIndex: action.floorMonsterIndex },
        },
        interactionPrompt: null,
      };
    }

    case "APPLY_COMBAT_RESULT": {
      if (state.gameMode.mode !== "combat") return state;
      return {
        ...state,
        gameMode: { mode: "combat", combat: action.newCombat },
        player: action.newPlayerStats
          ? { ...state.player, stats: action.newPlayerStats }
          : state.player,
      };
    }

    case "COMBAT_END_VICTORY": {
      if (state.gameMode.mode !== "combat") return state;
      const idx = state.gameMode.combat.floorMonsterIndex;
      const newSkills =
        action.unlockedSkills && action.unlockedSkills.length > 0
          ? [
              ...state.player.skills,
              ...action.unlockedSkills.filter(
                (s) => !state.player.skills.includes(s),
              ),
            ]
          : state.player.skills;
      return {
        ...state,
        gameMode: { mode: "exploring" },
        floor: {
          ...state.floor,
          monsters: state.floor.monsters.filter((_, i) => i !== idx),
        },
        player: {
          ...state.player,
          stats: action.newPlayerStats,
          skills: newSkills,
        },
        interactionPrompt: null,
      };
    }

    case "COMBAT_END_DEFEAT":
      return {
        ...state,
        gameMode: { mode: "game_over" },
        interactionPrompt: null,
      };

    case "CHANGE_FLOOR":
      return {
        ...state,
        gameMode: { mode: "exploring" },
        floor: action.floor,
        player: { ...state.player, position: action.startPos },
        currentFloor: action.floor.level,
        interactionPrompt: null,
      };

    case "SET_GAME_MODE":
      return { ...state, gameMode: action.gameMode };

    case "SET_INTERACTION_PROMPT":
      return { ...state, interactionPrompt: action.prompt };

    case "UPDATE_PLAYER_STATS":
      return {
        ...state,
        player: {
          ...state.player,
          stats: { ...state.player.stats, ...action.stats },
        },
      };

    case "RETURN_TO_TITLE":
      return { ...state, gameMode: { mode: "title" }, interactionPrompt: null };

    default:
      return state;
  }
}
