import { STRINGS } from '../data/strings';
import { useGameState } from '../state/GameContext';

type StatBarProps = {
  readonly label: string;
  readonly current: number;
  readonly max: number;
  readonly color: string;
};

function StatBar({ label, current, max, color }: StatBarProps) {
  const pct = Math.round((current / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <span
        className="text-white w-8 text-right"
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '18px' }}
      >
        {label}
      </span>
      <div className="w-24 h-3 bg-gray-800 rounded-sm overflow-hidden border border-gray-600">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span
        className="text-gray-300 w-20"
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '18px' }}
      >
        {current}/{max}
      </span>
    </div>
  );
}

export function BottomHUD() {
  const { player, interactionPrompt } = useGameState();
  const { stats } = player;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/70 px-3 py-2">
      {interactionPrompt && (
        <div
          className="text-center text-yellow-300 mb-1"
          style={{ fontFamily: "'Noto Sans TC', sans-serif", fontSize: '30px' }}
        >
          {interactionPrompt}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <StatBar label="HP" current={stats.hp} max={stats.maxHp} color="#ef4444" />
          <StatBar label="MP" current={stats.mp} max={stats.maxMp} color="#3b82f6" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className="text-yellow-300"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '21px' }}
          >
            LV.{stats.level} {STRINGS.level}
          </span>
          <span
            className="text-amber-400"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '21px' }}
          >
            {STRINGS.gold} {stats.gold}
          </span>
        </div>
      </div>
    </div>
  );
}
