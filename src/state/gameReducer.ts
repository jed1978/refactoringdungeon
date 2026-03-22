import type {
  GameState,
  GameMode,
  PlayerState,
  FloorState,
  Position,
  MonsterState,
  PlayerStats,
  CombatState,
  Equipment,
  EquipmentSlots,
} from "../utils/types";
import { TileType } from "../utils/types";
import { initCombat } from "../features/combat/combatStateMachine";
import { ITEMS_MAP } from "../data/items";
import {
  STARTING_PLAYER,
  DEMO_PLAYER,
  INITIAL_RUN_STATS,
} from "./initialState";

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
  | { readonly type: "RETURN_TO_TITLE" }
  | { readonly type: "EQUIP"; readonly equipment: Equipment }
  | { readonly type: "UNEQUIP"; readonly slot: keyof EquipmentSlots }
  | { readonly type: "USE_ITEM"; readonly itemId: string }
  | {
      readonly type: "ADD_ITEM";
      readonly itemId: string;
      readonly quantity: number;
    }
  | {
      readonly type: "BUY_ITEM";
      readonly itemId: string;
      readonly price: number;
    }
  | {
      readonly type: "SELL_EQUIPMENT";
      readonly slot: keyof EquipmentSlots;
      readonly price: number;
    }
  | { readonly type: "CONSUME_ITEM"; readonly itemId: string }
  | { readonly type: "TOGGLE_MUTE" }
  | { readonly type: "DISMISS_TUTORIAL"; readonly which: "move" | "combat" }
  | {
      readonly type: "START_DEMO";
      readonly floor: FloorState;
      readonly startPos: Position;
    }
  | { readonly type: "INCREMENT_KILLS" }
  | { readonly type: "INCREMENT_ITEMS_USED" }
  | { readonly type: "INCREMENT_SKILL_USE"; readonly skillId: string }
  | { readonly type: "SET_FLOOR_CLEARED"; readonly floor: number };

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
        player: { ...STARTING_PLAYER, position: action.startPos },
        currentFloor: action.floor.level,
        interactionPrompt: null,
        runStats: { ...INITIAL_RUN_STATS, startTime: Date.now() },
        flags: { tutorialMove: false, tutorialCombat: false },
        demoMode: false,
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

    case "EQUIP": {
      const eq = action.equipment;
      return {
        ...state,
        player: {
          ...state.player,
          equipment: { ...state.player.equipment, [eq.slot]: eq },
        },
      };
    }

    case "UNEQUIP":
      return {
        ...state,
        player: {
          ...state.player,
          equipment: { ...state.player.equipment, [action.slot]: null },
        },
      };

    case "USE_ITEM": {
      const itemDef = ITEMS_MAP[action.itemId];
      if (!itemDef) return state;
      const newInventory = state.player.inventory
        .map((it) =>
          it.id === action.itemId ? { ...it, quantity: it.quantity - 1 } : it,
        )
        .filter((it) => it.quantity > 0);
      const s = state.player.stats;
      let newStats = s;
      if (itemDef.effect === "heal_hp") {
        newStats = { ...s, hp: Math.min(s.maxHp, s.hp + itemDef.value) };
      } else if (itemDef.effect === "heal_mp") {
        newStats = { ...s, mp: Math.min(s.maxMp, s.mp + itemDef.value) };
      } else if (itemDef.effect === "max_hp") {
        newStats = {
          ...s,
          maxHp: s.maxHp + itemDef.value,
          hp: s.hp + itemDef.value,
        };
      }
      return {
        ...state,
        player: {
          ...state.player,
          stats: newStats,
          inventory: newInventory,
        },
      };
    }

    case "ADD_ITEM": {
      const exists = state.player.inventory.find(
        (it) => it.id === action.itemId,
      );
      const itemDef = ITEMS_MAP[action.itemId];
      if (!itemDef) return state;
      const newInventory = exists
        ? state.player.inventory.map((it) =>
            it.id === action.itemId
              ? { ...it, quantity: it.quantity + action.quantity }
              : it,
          )
        : [
            ...state.player.inventory,
            {
              id: itemDef.id,
              name: itemDef.name,
              description: itemDef.description,
              quantity: action.quantity,
            },
          ];
      return {
        ...state,
        player: { ...state.player, inventory: newInventory },
      };
    }

    case "BUY_ITEM": {
      if (state.player.stats.gold < action.price) return state;
      const itemDef = ITEMS_MAP[action.itemId];
      if (!itemDef) return state;
      const exists = state.player.inventory.find(
        (it) => it.id === action.itemId,
      );
      const newInventory = exists
        ? state.player.inventory.map((it) =>
            it.id === action.itemId ? { ...it, quantity: it.quantity + 1 } : it,
          )
        : [
            ...state.player.inventory,
            {
              id: itemDef.id,
              name: itemDef.name,
              description: itemDef.description,
              quantity: 1,
            },
          ];
      return {
        ...state,
        player: {
          ...state.player,
          stats: {
            ...state.player.stats,
            gold: state.player.stats.gold - action.price,
          },
          inventory: newInventory,
        },
      };
    }

    case "SELL_EQUIPMENT": {
      const eq = state.player.equipment[action.slot];
      if (!eq) return state;
      return {
        ...state,
        player: {
          ...state.player,
          equipment: { ...state.player.equipment, [action.slot]: null },
          stats: {
            ...state.player.stats,
            gold: state.player.stats.gold + action.price,
          },
        },
      };
    }

    case "CONSUME_ITEM": {
      const newInventory = state.player.inventory
        .map((it) =>
          it.id === action.itemId ? { ...it, quantity: it.quantity - 1 } : it,
        )
        .filter((it) => it.quantity > 0);
      return {
        ...state,
        player: { ...state.player, inventory: newInventory },
      };
    }

    case "TOGGLE_MUTE":
      return {
        ...state,
        settings: { ...state.settings, muted: !state.settings.muted },
      };

    case "DISMISS_TUTORIAL":
      return {
        ...state,
        flags: {
          ...state.flags,
          ...(action.which === "move"
            ? { tutorialMove: true }
            : { tutorialCombat: true }),
        },
      };

    case "START_DEMO":
      return {
        ...state,
        gameMode: { mode: "exploring" },
        floor: action.floor,
        player: { ...DEMO_PLAYER, position: action.startPos },
        currentFloor: action.floor.level,
        interactionPrompt: null,
        runStats: { ...INITIAL_RUN_STATS, startTime: Date.now() },
        flags: { tutorialMove: true, tutorialCombat: true },
        demoMode: true,
      };

    case "INCREMENT_KILLS":
      return {
        ...state,
        runStats: {
          ...state.runStats,
          monstersKilled: state.runStats.monstersKilled + 1,
        },
      };

    case "INCREMENT_ITEMS_USED":
      return {
        ...state,
        runStats: {
          ...state.runStats,
          itemsUsed: state.runStats.itemsUsed + 1,
        },
      };

    case "INCREMENT_SKILL_USE":
      return {
        ...state,
        runStats: {
          ...state.runStats,
          skillUseCounts: {
            ...state.runStats.skillUseCounts,
            [action.skillId]:
              (state.runStats.skillUseCounts[action.skillId] ?? 0) + 1,
          },
        },
      };

    case "SET_FLOOR_CLEARED":
      return {
        ...state,
        runStats: {
          ...state.runStats,
          floorsCleared: Math.max(state.runStats.floorsCleared, action.floor),
        },
      };

    default:
      return state;
  }
}
