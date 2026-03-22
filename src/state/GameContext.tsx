import { createContext, useContext, useReducer, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gameReducer } from "./gameReducer";
import type { GameAction, GameStateWithPrompt } from "./gameReducer";
import { INITIAL_GAME_STATE } from "./initialState";
import { saveToLocalStorage } from "./saveLoad";

const INITIAL_STATE_WITH_PROMPT: GameStateWithPrompt = {
  ...INITIAL_GAME_STATE,
  interactionPrompt: null,
};

const GameStateCtx = createContext<GameStateWithPrompt | null>(null);
const GameDispatchCtx = createContext<((action: GameAction) => void) | null>(
  null,
);

export function useGameState(): GameStateWithPrompt {
  const v = useContext(GameStateCtx);
  if (!v) throw new Error("useGameState must be inside GameProvider");
  return v;
}

export function useGameDispatch(): (action: GameAction) => void {
  const v = useContext(GameDispatchCtx);
  if (!v) throw new Error("useGameDispatch must be inside GameProvider");
  return v;
}

type GameProviderProps = { readonly children: ReactNode };

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE_WITH_PROMPT);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced auto-save when exploring
  useEffect(() => {
    if (state.gameMode.mode !== "exploring") return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveToLocalStorage(state);
    }, 1000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state]);

  return (
    <GameStateCtx.Provider value={state}>
      <GameDispatchCtx.Provider value={dispatch}>
        {children}
      </GameDispatchCtx.Provider>
    </GameStateCtx.Provider>
  );
}
