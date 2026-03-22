import { useState, memo } from "react";
import type { CombatAction } from "../utils/types";
import { useGameState } from "../state/GameContext";
import { SkillMenu } from "./SkillMenu";
import { STRINGS } from "../data/strings";
import { getDefaultEnemyPositions, MONSTER_Y } from "../engine/BattleRenderer";
import { VIEWPORT } from "../utils/constants";

type Props = {
  onAction: (action: CombatAction) => void;
};

type PendingType = "attack" | "skill" | null;

function BattleUIComponent({ onAction }: Props) {
  const gameState = useGameState();
  const [showSkills, setShowSkills] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [pendingSkillId, setPendingSkillId] = useState<string | null>(null);
  // null = not selecting; otherwise waiting for target click
  const [pendingAction, setPendingAction] = useState<PendingType>(null);

  if (gameState.gameMode.mode !== "combat") return null;

  const { combat } = gameState.gameMode;
  const { stats, skills, inventory } = gameState.player;
  const isAnimatingPhase =
    combat.phase === "animating" || combat.phase === "enemy_turn";
  const disabled =
    isAnimatingPhase || combat.phase === "victory" || combat.phase === "defeat";

  const aliveEnemies = combat.enemies
    .map((e, i) => ({ enemy: e, index: i }))
    .filter(({ enemy }) => enemy.currentHp > 0);

  // Execute action with resolved target
  const fireAction = (targetIndex: number) => {
    setPendingAction(null);
    setShowSkills(false);
    if (pendingAction === "skill" && pendingSkillId) {
      onAction({ type: "skill", skillId: pendingSkillId, targetIndex });
      setPendingSkillId(null);
    } else {
      onAction({ type: "attack", targetIndex });
    }
  };

  const handleAttack = () => {
    if (disabled) return;
    setShowSkills(false);
    if (aliveEnemies.length === 1 && aliveEnemies[0]) {
      // Single target — fire immediately
      onAction({ type: "attack", targetIndex: aliveEnemies[0].index });
    } else if (aliveEnemies.length > 1) {
      // Multiple targets — enter selection mode
      setPendingAction("attack");
    }
  };

  const handleSkill = () => {
    if (disabled) return;
    setShowSkills((s) => !s);
    setShowItems(false);
    setPendingAction(null);
  };

  const handleItem = () => {
    if (disabled) return;
    setShowItems((s) => !s);
    setShowSkills(false);
    setPendingAction(null);
  };

  const handleItemUse = (itemId: string) => {
    setShowItems(false);
    onAction({ type: "item", itemId });
  };

  const handleSkillSelect = (skillId: string) => {
    setShowSkills(false);
    if (aliveEnemies.length === 1 && aliveEnemies[0]) {
      onAction({ type: "skill", skillId, targetIndex: aliveEnemies[0].index });
    } else if (aliveEnemies.length > 1) {
      setPendingSkillId(skillId);
      setPendingAction("skill");
    }
  };

  const handleFlee = () => {
    if (disabled) return;
    setPendingAction(null);
    setShowSkills(false);
    setShowItems(false);
    onAction({ type: "flee" });
  };

  const handleEnemyClick = (index: number) => {
    if (pendingAction) {
      fireAction(index);
    }
  };

  const hpPct = stats.maxHp > 0 ? stats.hp / stats.maxHp : 0;
  const mpPct = stats.maxMp > 0 ? stats.mp / stats.maxMp : 0;
  const hpColor =
    hpPct > 0.5 ? "#22c55e" : hpPct > 0.25 ? "#eab308" : "#ef4444";

  const logEntries = combat.log.entries.slice(-2);
  const enemyPositions = getDefaultEnemyPositions(combat.enemies.length);

  return (
    <>
      {/* Monster names — DOM overlay, clickable when selecting target */}
      {combat.enemies.map((enemy, i) => {
        if (enemy.currentHp <= 0) return null; // hide dead enemies
        const size = enemy.def.spriteSize;
        const pos = enemyPositions[i];
        if (!pos) return null;
        const centerXPct = ((pos.x + size / 2) / VIEWPORT.logicalWidth) * 100;
        // Position name above the HP bar (HP bar is drawn at MONSTER_Y - 8)
        const nameYPct = ((MONSTER_Y - 10) / VIEWPORT.logicalHeight) * 100;
        const isClickable = pendingAction !== null;
        return (
          <div
            key={`${enemy.def.id}-${i}`}
            className="absolute"
            onClick={() => handleEnemyClick(i)}
            style={{
              left: `${centerXPct}%`,
              top: `${nameYPct}%`,
              transform: "translate(-50%, -100%)",
              backgroundColor: isClickable
                ? "rgba(234,179,8,0.85)"
                : "rgba(0,0,0,0.75)",
              padding: "2px 5px",
              borderRadius: "2px",
              fontSize: "18px",
              fontFamily: "'Noto Sans TC', sans-serif",
              color: isClickable ? "#1a1100" : "#fde68a",
              whiteSpace: "nowrap",
              cursor: isClickable ? "pointer" : "default",
              outline: isClickable ? "1px solid #eab308" : "none",
              pointerEvents: isClickable ? "auto" : "none",
            }}
          >
            {isClickable ? `▶ ${enemy.def.name}` : enemy.def.name}
          </div>
        );
      })}

      {/* Target selection prompt */}
      {pendingAction && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: "58%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(0,0,0,0.8)",
            padding: "4px 10px",
            borderRadius: "3px",
            fontSize: "13px",
            fontFamily: "'Noto Sans TC', sans-serif",
            color: "#eab308",
            whiteSpace: "nowrap",
          }}
        >
          選擇目標
        </div>
      )}

      {/* Bottom overlay — combat log row + action panel */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ padding: "4px 6px 6px" }}
      >
        {/* Combat log — left 65%, leaves right side clear for player sprite */}
        <div className="pointer-events-none" style={{ marginBottom: "4px" }}>
          <div
            className="bg-black bg-opacity-70 border border-gray-600 rounded"
            style={{
              width: "65%",
              padding: "4px 8px",
              minHeight: "32px",
              maxHeight: "52px",
              overflow: "hidden",
            }}
          >
            {logEntries.map((entry, i) => (
              <div
                key={combat.log.entries.length - logEntries.length + i}
                className="text-white leading-tight"
                style={{
                  fontSize: "14px",
                  fontFamily: "'Noto Sans TC', sans-serif",
                  lineHeight: "1.4",
                }}
              >
                {entry}
              </div>
            ))}
          </div>
        </div>

        {/* Action panel */}
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
              label={`⚔ ${STRINGS.combatAttack}`}
              disabled={disabled || pendingAction !== null}
              onClick={handleAttack}
            />
            <BattleButton
              label={`🔧 ${STRINGS.combatSkill}`}
              disabled={disabled || pendingAction !== null}
              onClick={handleSkill}
              active={showSkills}
            />
            <BattleButton
              label={`💊 ${STRINGS.combatItem}`}
              disabled={disabled || pendingAction !== null}
              onClick={handleItem}
              active={showItems}
            />
            <BattleButton
              label={`🏃 ${STRINGS.combatFlee}`}
              disabled={disabled || pendingAction !== null}
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

        {/* Item submenu */}
        {showItems && (
          <div
            className="bg-gray-900 border border-yellow-600 rounded mt-1"
            style={{ padding: "6px 8px" }}
          >
            {inventory.length === 0 ? (
              <div
                style={{
                  fontSize: "14px",
                  fontFamily: "'Noto Sans TC', sans-serif",
                  color: "#6b7280",
                  padding: "2px 0",
                }}
              >
                {STRINGS.noItems}
              </div>
            ) : (
              inventory.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemUse(item.id)}
                  className="w-full text-left hover:bg-gray-700 rounded px-2 py-1 flex justify-between items-center"
                  style={{
                    fontSize: "14px",
                    fontFamily: "'Noto Sans TC', sans-serif",
                    color: "#e5e7eb",
                  }}
                >
                  <span>{item.name}</span>
                  <span style={{ color: "#9ca3af" }}>×{item.quantity}</span>
                </button>
              ))
            )}
            <button
              onClick={() => setShowItems(false)}
              className="w-full text-center text-gray-500 hover:text-gray-300 mt-1"
              style={{
                fontSize: "12px",
                fontFamily: "'Press Start 2P', monospace",
                paddingTop: "4px",
                borderTop: "1px solid #374151",
              }}
            >
              {STRINGS.combatBack}
            </button>
          </div>
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

function BattleButtonComponent({
  label,
  disabled,
  onClick,
  active,
}: ButtonProps) {
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

const BattleButton = memo(BattleButtonComponent);

export const BattleUI = memo(BattleUIComponent);
