import { STRINGS } from '../data/strings';

export function HUD() {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-black/70 px-3 py-2 flex items-center justify-between">
      <span
        className="text-green-400 text-xs tracking-wider"
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px' }}
      >
        {STRINGS.floor1Name}
      </span>
    </div>
  );
}
