import { useGameState } from '../state/GameContext';
import { FLOOR_THEMES } from '../utils/constants';

export function HUD() {
  const { currentFloor } = useGameState();
  const themeIndex = Math.min(currentFloor - 1, FLOOR_THEMES.length - 1);
  const theme = FLOOR_THEMES[themeIndex];
  const floorName = `${currentFloor}F ${theme.name}`;

  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-black/70 px-3 py-2 flex items-center justify-between">
      <span
        className="text-green-400 text-xs tracking-wider"
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px' }}
      >
        {floorName}
      </span>
    </div>
  );
}
