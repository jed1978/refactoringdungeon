import { useGameState, useGameDispatch } from "../state/GameContext";
import { STRINGS } from "../data/strings";

type Props = { readonly onClose: () => void };

const SLOT_LABELS: Record<string, string> = {
  weapon: "武器",
  armor: "防具",
  accessory: "配件",
  shield: "盾牌",
  special: "特殊",
};

const SLOTS = ["weapon", "armor", "accessory", "shield", "special"] as const;

export function InventoryScreen({ onClose }: Props) {
  const gs = useGameState();
  const dispatch = useGameDispatch();
  const { equipment, inventory, stats } = gs.player;

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-yellow-400 p-4 max-w-sm w-full mx-2">
        {/* Header */}
        <div
          className="flex justify-between items-center mb-3"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "18px",
          }}
        >
          <span className="text-yellow-400">{STRINGS.equipmentTitle}</span>
          <span className="text-yellow-300">💰 {stats.gold}</span>
        </div>

        {/* Equipment slots */}
        <div className="mb-3 space-y-1">
          {SLOTS.map((slot) => {
            const eq = equipment[slot];
            return (
              <div
                key={slot}
                className="flex items-center gap-2"
                style={{
                  fontFamily: "'Noto Sans TC', sans-serif",
                  fontSize: "16px",
                }}
              >
                <span className="text-gray-400 w-10 shrink-0">
                  {SLOT_LABELS[slot]}
                </span>
                <span className="text-white flex-1 truncate">
                  {eq ? eq.name : "—"}
                </span>
                {eq && (
                  <button
                    className="text-red-400 hover:text-red-300 shrink-0 px-1"
                    onClick={() => dispatch({ type: "UNEQUIP", slot })}
                    style={{
                      fontFamily: "'Noto Sans TC', sans-serif",
                      fontSize: "16px",
                    }}
                  >
                    {STRINGS.unequip}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Inventory items */}
        <div className="border-t border-gray-600 pt-2 mb-3">
          <div
            className="text-yellow-400 mb-2"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "14px",
            }}
          >
            {STRINGS.inventoryTitle}
          </div>
          {inventory.length === 0 ? (
            <div
              className="text-gray-500"
              style={{
                fontFamily: "'Noto Sans TC', sans-serif",
                fontSize: "18px",
              }}
            >
              {STRINGS.noItems}
            </div>
          ) : (
            inventory.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-1"
              >
                <span
                  className="text-white"
                  style={{
                    fontFamily: "'Noto Sans TC', sans-serif",
                    fontSize: "18px",
                  }}
                >
                  {item.name} ×{item.quantity}
                </span>
                <button
                  className="text-green-400 hover:text-green-300 px-1"
                  style={{
                    fontFamily: "'Noto Sans TC', sans-serif",
                    fontSize: "16px",
                  }}
                  onClick={() =>
                    dispatch({ type: "USE_ITEM", itemId: item.id })
                  }
                >
                  {STRINGS.use}
                </button>
              </div>
            ))
          )}
        </div>

        <button
          className="w-full text-center text-gray-400 hover:text-white border border-gray-600 py-1"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "14px",
          }}
          onClick={onClose}
        >
          {STRINGS.close}
        </button>
      </div>
    </div>
  );
}
