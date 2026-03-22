import type { GameState } from "../utils/types";
import { INITIAL_GAME_STATE } from "./initialState";

const SAVE_KEY = "refactoring_dungeon_save";

export function saveToLocalStorage(state: GameState): boolean {
  try {
    const json = JSON.stringify(state);
    localStorage.setItem(SAVE_KEY, json);
    const verify = localStorage.getItem(SAVE_KEY);
    return verify === json;
  } catch {
    return false;
  }
}

export function loadFromLocalStorage(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GameState>;
    if (!parsed.player || !parsed.floor || !parsed.gameMode) {
      clearSave();
      return null;
    }
    return {
      ...INITIAL_GAME_STATE,
      ...parsed,
      settings: parsed.settings ?? { muted: false },
      runStats: parsed.runStats ?? INITIAL_GAME_STATE.runStats,
      flags: parsed.flags ?? { tutorialMove: false, tutorialCombat: false },
      demoMode: parsed.demoMode ?? false,
    } as GameState;
  } catch {
    clearSave();
    return null;
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // Silently fail
  }
}

export function hasSave(): boolean {
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}
