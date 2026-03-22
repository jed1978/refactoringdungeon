import type { Equipment } from "../utils/types";

export const EQUIPMENT: readonly Equipment[] = [
  {
    id: "factory_keyboard",
    name: "工廠方法鍵盤",
    description: "攻擊後追加弱傷害",
    slot: "weapon",
    stats: { atk: 5 },
    effect: "factory_method",
  },
  {
    id: "strategy_hoodie",
    name: "策略模式帽T",
    description: "減少多樣攻擊傷害",
    slot: "armor",
    stats: { def: 5 },
    effect: "strategy_pattern",
  },
  {
    id: "observer_earbuds",
    name: "觀察者模式耳機",
    description: "提升速度，預警伏擊",
    slot: "accessory",
    stats: { spd: 3 },
    effect: "observer_pattern",
  },
  {
    id: "singleton_shield",
    name: "單例護盾",
    description: "首次受到 debuff 時免疫",
    slot: "shield",
    stats: { def: 3 },
    effect: "singleton",
  },
  {
    id: "adapter_dongle",
    name: "轉接器模式轉接頭",
    description: "受傷 30% 轉換為 MP",
    slot: "special",
    stats: {},
    effect: "adapter_pattern",
  },
];
