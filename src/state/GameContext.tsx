import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { gameReducer } from './gameReducer';
import type { GameAction, GameStateWithPrompt } from './gameReducer';
import { INITIAL_GAME_STATE } from './initialState';
import { saveToLocalStorage } from './saveLoad';

const INITIAL_STATE_WITH_PROMPT: GameStateWithPrompt = {
  ...INITIAL_GAME_STATE,
  interactionPrompt: null,
};

const GameStateContext = createContext<GameStateWithPrompt>(INITIAL_STATE_WITH_PROMPT);
const GameDispatchContext = createContext<React.Dispatch<GameAction>>(() => {});

export function useGameState(): GameStateWithPrompt {
  return useContext(GameStateContext);
}

export function useGameDispatch(): React.Dispatch<GameAction> {
  return useContext(GameDispatchContext);
}

type GameProviderProps = { readonly children: ReactNode };

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE_WITH_PROMPT);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced auto-save when exploring
  useEffect(() => {
    if (state.gameMode.mode !== 'exploring') return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveToLocalStorage(state);
    }, 1000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state]);

  return (
    <GameStateContext value={state}>
      <GameDispatchContext value={dispatch}>
        {children}
      </GameDispatchContext>
    </GameStateContext>
  );
}
