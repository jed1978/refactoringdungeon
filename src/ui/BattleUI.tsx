import { useState } from "react";
import type { CombatAction } from "../utils/types";
import { useGameState } from "../state/GameContext";
import { SkillMenu } from "./SkillMenu";

type Props = {
  onAction: (action: CombatAction) => void;
};

export function BattleUI({ onAction }: Props) {
  const gameState = useGameState();
  const [showSkills, setShowSkills] = useState(false);

  if (gameState.gameMode.mode !== "combat") return null;

  const { combat } = gameState.gameMode;
  const { stats, skills } = gameState.player;
  const isAnimatingPhase =
    combat.phase === "animating" || combat.phase === "enemy_turn";
  const disabled =
    isAnimatingPhase || combat.phase === "victory" || combat.phase === "defeat";

  const handleAttack = () => {
    if (disabled) return;
    setShowSkills(false);
    onAction({ type: "attack" });
  };

  const handleSkill = () => {
    if (disabled) return;
    setShowSkills((s) => !s);
  };

  const handleSkillSelect = (skillId: string) => {
    setShowSkills(false);
    onAction({ type: "skill", skillId });
  };

  const handleFlee = () => {
    if (disabled) return;
    setShowSkills(false);
    onAction({ type: "flee" });
  };

  const hpPct = stats.maxHp > 0 ? stats.hp / stats.maxHp : 0;
  const mpPct = stats.maxMp > 0 ? stats.mp / stats.maxMp : 0;
  const hpColor =
    hpPct > 0.5 ? "#22c55e" : hpPct > 0.25 ? "#eab308" : "#ef4444";

  const logEntries = combat.log.entries.slice(-4);

  return (
    <>
      {/* Combat log — top overlay */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{ padding: "6px 8px" }}
      >
        <div
          className="bg-black bg-opacity-70 border border-gray-600 rounded"
          style={{ padding: "6px 8px", minHeight: "52px" }}
        >
          {logEntries.map((entry, i) => (
            <div
              key={i}
              className="text-white leading-tight"
              style={{
                fontSize: "18px",
                fontFamily: "'Noto Sans TC', sans-serif",
                lineHeight: "1.4",
              }}
            >
              {entry}
            </div>
          ))}
        </div>
      </div>

      {/* Action panel — bottom overlay */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ padding: "4px 6px" }}
      >
        <div
          className="bg-black bg-opacity-80 border border-gray-500 rounded"
          style={{ padding: "6px" }}
        >
          {/* HP/MP bars */}
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span
                  style={{
                    fontSize: "15px",
                    fontFamily: "'Press Start 2P', monospace",
                    color: "#9ca3af",
                  }}
                >
                  HP
                </span>
                <span
                  style={{
                    fontSize: "15px",
                    fontFamily: "'Press Start 2P', monospace",
                    color: "#9ca3af",
                  }}
                >
                  {stats.hp}/{stats.maxHp}
                </span>
              </div>
              <div
                className="w-full bg-gray-800 rounded-full"
                style={{ height: "8px" }}
              >
                <div
                  className="rounded-full h-full transition-all"
                  style={{ width: `${hpPct * 100}%`, backgroundColor: hpColor }}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span
                  style={{
                    fontSize: "15px",
                    fontFamily: "'Press Start 2P', monospace",
                    color: "#9ca3af",
                  }}
                >
                  MP
                </span>
                <span
                  style={{
                    fontSize: "15px",
                    fontFamily: "'Press Start 2P', monospace",
                    color: "#9ca3af",
                  }}
                >
                  {stats.mp}/{stats.maxMp}
                </span>
              </div>
              <div
                className="w-full bg-gray-800 rounded-full"
                style={{ height: "8px" }}
              >
                <div
                  className="rounded-full h-full transition-all"
                  style={{
                    width: `${mpPct * 100}%`,
                    backgroundColor: "#3b82f6",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <BattleButton
              label="⚔ 攻擊"
              disabled={disabled}
              onClick={handleAttack}
            />
            <BattleButton
              label="🔧 技能"
              disabled={disabled}
              onClick={handleSkill}
              active={showSkills}
            />
            <BattleButton
              label="🏃 逃跑"
              disabled={disabled}
              onClick={handleFlee}
            />
          </div>
        </div>

        {/* Skill submenu */}
        {showSkills && (
          <SkillMenu
            skills={skills}
            mp={stats.mp}
            onSelect={handleSkillSelect}
            onClose={() => setShowSkills(false)}
          />
        )}
      </div>
    </>
  );
}

type ButtonProps = {
  label: string;
  disabled: boolean;
  onClick: () => void;
  active?: boolean;
};

function BattleButton({ label, disabled, onClick, active }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex-1 rounded border transition-colors",
        "text-center select-none",
        disabled
          ? "border-gray-700 bg-gray-900 text-gray-600 cursor-not-allowed"
          : active
            ? "border-yellow-400 bg-yellow-900 text-yellow-200 hover:bg-yellow-800"
            : "border-gray-500 bg-gray-800 text-gray-200 hover:bg-gray-700 active:bg-gray-600",
      ].join(" ")}
      style={{
        padding: "6px 4px",
        fontSize: "21px",
        fontFamily: "'Noto Sans TC', sans-serif",
      }}
    >
      {label}
    </button>
  );
}
