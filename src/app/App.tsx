import { GameProvider, useGameState, useGameDispatch } from '../state/GameContext';
import { TitleScreen } from '../ui/TitleScreen';
import { GameCanvas } from '../ui/GameCanvas';
import { HUD } from '../ui/HUD';
import { BottomHUD } from '../ui/BottomHUD';
import { Minimap } from '../ui/Minimap';
import { generateFloor } from '../features/map/bspGenerator';
import { loadFromLocalStorage } from '../state/saveLoad';

function AppContent() {
  const gameState = useGameState();
  const dispatch = useGameDispatch();

  const handleStart = () => {
    const seed = Date.now();
    const floor = generateFloor(1, seed);
    const startRoom = floor.rooms.find(r => r.type === 'start');
    const startPos = startRoom
      ? { x: Math.floor(startRoom.x + startRoom.width / 2), y: Math.floor(startRoom.y + startRoom.height / 2) }
      : { x: 5, y: 5 };
    dispatch({ type: 'START_GAME', floor, startPos });
  };

  const handleContinue = () => {
    const saved = loadFromLocalStorage();
    if (saved) {
      dispatch({ type: 'LOAD_SAVE', state: { ...saved, interactionPrompt: null } });
    }
  };

  if (gameState.gameMode.mode === 'title') {
    return <TitleScreen onStart={handleStart} onContinue={handleContinue} />;
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="relative w-full max-w-3xl aspect-[240/176]">
        <GameCanvas />
        <HUD />
        <BottomHUD />
        <Minimap />
      </div>
    </div>
  );
}

export function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
