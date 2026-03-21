import { useGameState, useGameDispatch } from "../state/GameContext";
import { STRINGS } from "../data/strings";
import { ITEMS } from "../data/items";
import { EQUIPMENT } from "../data/equipment";

type Props = { readonly onClose: () => void };

const SLOTS = ["weapon", "armor", "accessory", "shield", "special"] as const;
const SELL_PRICE = 10;

export function ShopScreen({ onClose }: Props) {
  const gs = useGameState();
  const dispatch = useGameDispatch();
  const { stats, equipment, inventory } = gs.player;

  const handleBuy = (itemId: string, price: number) => {
    if (stats.gold >= price) {
      dispatch({ type: "BUY_ITEM", itemId, price });
    }
  };

  const handleBuyEquip = (eq: (typeof EQUIPMENT)[number]) => {
    if (stats.gold >= 40) {
      dispatch({ type: "EQUIP", equipment: eq });
      dispatch({
        type: "UPDATE_PLAYER_STATS",
        stats: { gold: stats.gold - 40 },
      });
    }
  };

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
      <div
        className="bg-gray-900 border-2 border-yellow-400 p-4 max-w-sm w-full mx-2 overflow-y-auto"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div
          className="flex justify-between items-center mb-3"
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "12px" }}
        >
          <span className="text-yellow-400">{STRINGS.shopTitle}</span>
          <span className="text-yellow-300">💰 {stats.gold}</span>
        </div>

        {/* Buy consumable items */}
        <div
          className="text-yellow-400 mb-2"
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px" }}
        >
          道具
        </div>
        <div className="mb-3 space-y-2">
          {ITEMS.map((item) => {
            const canAfford = stats.gold >= item.price;
            const owned = inventory.find((i) => i.id === item.id);
            return (
              <div key={item.id} className="flex items-center gap-2">
                <div className="flex-1">
                  <div
                    className="text-white"
                    style={{
                      fontFamily: "'Noto Sans TC', sans-serif",
                      fontSize: "12px",
                    }}
                  >
                    {item.name}
                    {owned ? (
                      <span className="text-gray-400 ml-1">×{owned.quantity}</span>
                    ) : null}
                  </div>
                  <div
                    className="text-gray-400"
                    style={{
                      fontFamily: "'Noto Sans TC', sans-serif",
                      fontSize: "10px",
                    }}
                  >
                    {item.description}
                  </div>
                </div>
                <button
                  className={`shrink-0 px-2 py-0.5 border text-xs ${
                    canAfford
                      ? "border-yellow-400 text-yellow-400 hover:bg-yellow-400/20"
                      : "border-gray-600 text-gray-600 cursor-not-allowed"
                  }`}
                  style={{
                    fontFamily: "'Noto Sans TC', sans-serif",
                    fontSize: "10px",
                  }}
                  disabled={!canAfford}
                  onClick={() => handleBuy(item.id, item.price)}
                >
                  {item.price}💰
                </button>
              </div>
            );
          })}
        </div>

        {/* Buy equipment */}
        <div className="border-t border-gray-600 pt-2 mb-3">
          <div
            className="text-yellow-400 mb-2"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "10px",
            }}
          >
            裝備（各 40💰）
          </div>
          {EQUIPMENT.map((eq) => {
            const alreadyEquipped = equipment[eq.slot]?.id === eq.id;
            const canAfford = stats.gold >= 40;
            return (
              <div
                key={eq.id}
                className="flex items-center gap-2 mb-1"
              >
                <div className="flex-1">
                  <div
                    className="text-white"
                    style={{
                      fontFamily: "'Noto Sans TC', sans-serif",
                      fontSize: "12px",
                    }}
                  >
                    {eq.name}
                    {alreadyEquipped && (
                      <span className="text-green-400 ml-1 text-[10px]">
                        {STRINGS.equipped}
                      </span>
                    )}
                  </div>
                  <div
                    className="text-gray-400"
                    style={{
                      fontFamily: "'Noto Sans TC', sans-serif",
                      fontSize: "10px",
                    }}
                  >
                    {eq.description}
                  </div>
                </div>
                {!alreadyEquipped && (
                  <button
                    className={`shrink-0 px-2 py-0.5 border text-xs ${
                      canAfford
                        ? "border-yellow-400 text-yellow-400 hover:bg-yellow-400/20"
                        : "border-gray-600 text-gray-600 cursor-not-allowed"
                    }`}
                    style={{
                      fontFamily: "'Noto Sans TC', sans-serif",
                      fontSize: "10px",
                    }}
                    disabled={!canAfford}
                    onClick={() => handleBuyEquip(eq)}
                  >
                    40💰
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Sell equipped items */}
        <div className="border-t border-gray-600 pt-2 mb-3">
          <div
            className="text-yellow-400 mb-2"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "10px",
            }}
          >
            {STRINGS.sell}（各 +{SELL_PRICE}💰）
          </div>
          {SLOTS.map((slot) => {
            const eq = equipment[slot];
            if (!eq) return null;
            return (
              <div key={slot} className="flex justify-between items-center mb-1">
                <span
                  className="text-white"
                  style={{
                    fontFamily: "'Noto Sans TC', sans-serif",
                    fontSize: "12px",
                  }}
                >
                  {eq.name}
                </span>
                <button
                  className="border border-red-400 text-red-400 hover:bg-red-400/20 px-2 py-0.5"
                  style={{
                    fontFamily: "'Noto Sans TC', sans-serif",
                    fontSize: "10px",
                  }}
                  onClick={() =>
                    dispatch({
                      type: "SELL_EQUIPMENT",
                      slot,
                      price: SELL_PRICE,
                    })
                  }
                >
                  {STRINGS.sell} +{SELL_PRICE}💰
                </button>
              </div>
            );
          })}
          {SLOTS.every((s) => !equipment[s]) && (
            <div
              className="text-gray-500"
              style={{
                fontFamily: "'Noto Sans TC', sans-serif",
                fontSize: "12px",
              }}
            >
              沒有裝備可出售
            </div>
          )}
        </div>

        <button
          className="w-full text-center text-gray-400 hover:text-white border border-gray-600 py-1"
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px" }}
          onClick={onClose}
        >
          {STRINGS.close}
        </button>
      </div>
    </div>
  );
}
