import { STRINGS } from '../data/strings';

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
        className="text-white w-6 text-right"
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}
      >
        {label}
      </span>
      <div className="w-24 h-2 bg-gray-800 rounded-sm overflow-hidden border border-gray-600">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span
        className="text-gray-300 w-16"
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}
      >
        {current}/{max}
      </span>
    </div>
  );
}

export function BottomHUD() {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/70 px-3 py-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <StatBar label="HP" current={75} max={100} color="#ef4444" />
          <StatBar label="MP" current={40} max={100} color="#3b82f6" />
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span
            className="text-yellow-300"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }}
          >
            LV.1 {STRINGS.level}
          </span>
          <span
            className="text-amber-400"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }}
          >
            {STRINGS.gold} 0
          </span>
        </div>
      </div>
    </div>
  );
}
