import { SKILLS } from '../data/skills';

type Props = {
  skills: readonly string[];
  mp: number;
  onSelect: (skillId: string) => void;
  onClose: () => void;
};

export function SkillMenu({ skills, mp, onSelect, onClose }: Props) {
  const available = SKILLS.filter(s => skills.includes(s.id));

  return (
    <div
      className="absolute bottom-full left-0 right-0 mb-1 bg-black bg-opacity-90 border border-gray-500 rounded"
      style={{ padding: '4px' }}
    >
      <div className="flex justify-between items-center mb-1">
        <span style={{ fontSize: '6px', fontFamily: "'Press Start 2P', monospace", color: '#9ca3af' }}>技能</span>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-300"
          style={{ fontSize: '8px', lineHeight: 1 }}
        >
          ✕
        </button>
      </div>

      {available.length === 0 && (
        <div style={{ fontSize: '6px', fontFamily: "'Noto Sans TC', sans-serif", color: '#6b7280' }}>
          沒有技能
        </div>
      )}

      {available.map(skill => {
        const canAfford = mp >= skill.mpCost;
        return (
          <button
            key={skill.id}
            onClick={() => canAfford && onSelect(skill.id)}
            disabled={!canAfford}
            className={[
              'w-full text-left rounded mb-0.5 flex justify-between items-center',
              canAfford
                ? 'hover:bg-gray-700 text-gray-200'
                : 'text-gray-600 cursor-not-allowed',
            ].join(' ')}
            style={{ padding: '2px 4px' }}
          >
            <span style={{ fontSize: '6px', fontFamily: "'Noto Sans TC', sans-serif" }}>
              {skill.name}
            </span>
            <span
              style={{
                fontSize: '5px',
                fontFamily: "'Press Start 2P', monospace",
                color: canAfford ? '#3b82f6' : '#374151',
              }}
            >
              MP {skill.mpCost}
            </span>
          </button>
        );
      })}
    </div>
  );
}
