import { SKILLS } from "../data/skills";
import { FONT_PIXEL, FONT_UI } from "./styles";

type Props = {
  skills: readonly string[];
  mp: number;
  playerAtk: number;
  onSelect: (skillId: string) => void;
  onClose: () => void;
};

export function SkillMenu({ skills, mp, playerAtk, onSelect, onClose }: Props) {
  const available = SKILLS.filter((s) => skills.includes(s.id));

  return (
    <div
      className="bg-black bg-opacity-90 border border-gray-500 rounded"
      style={{
        padding: "6px",
        marginBottom: "4px",
        maxHeight: "45vh",
        overflowY: "auto",
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <span
          style={{
            fontSize: "18px",
            fontFamily: FONT_PIXEL,
            color: "#9ca3af",
          }}
        >
          技能
        </span>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-300"
          style={{ fontSize: "24px", lineHeight: 1 }}
        >
          ✕
        </button>
      </div>

      {available.length === 0 && (
        <div
          style={{
            fontSize: "18px",
            fontFamily: FONT_UI,
            color: "#6b7280",
          }}
        >
          沒有技能
        </div>
      )}

      {available.map((skill) => {
        const canAfford = mp >= skill.mpCost;
        const estDmg =
          skill.multiplier > 0
            ? Math.round(playerAtk * skill.multiplier)
            : null;
        return (
          <button
            key={skill.id}
            onClick={() => canAfford && onSelect(skill.id)}
            disabled={!canAfford}
            className={[
              "w-full text-left rounded mb-1",
              canAfford
                ? "hover:bg-gray-700 text-gray-200"
                : "text-gray-600 cursor-not-allowed",
            ].join(" ")}
            style={{ padding: "4px 6px" }}
          >
            {/* Row 1: skill name + MP cost */}
            <div className="flex justify-between items-center">
              <span
                style={{
                  fontSize: "18px",
                  fontFamily: FONT_UI,
                }}
              >
                {skill.name}
              </span>
              <span
                style={{
                  fontSize: "15px",
                  fontFamily: FONT_PIXEL,
                  color: canAfford ? "#3b82f6" : "#374151",
                }}
              >
                MP {skill.mpCost}
              </span>
            </div>
            {/* Row 2: damage estimate + description */}
            <div
              style={{
                fontSize: "14px",
                fontFamily: FONT_UI,
                color: canAfford ? "#9ca3af" : "#4b5563",
                marginTop: "1px",
              }}
            >
              {estDmg !== null && (
                <span
                  style={{
                    color: canAfford ? "#fbbf24" : "#4b5563",
                    marginRight: "6px",
                  }}
                >
                  ~{estDmg} DMG ·
                </span>
              )}
              {skill.description}
            </div>
          </button>
        );
      })}
    </div>
  );
}
