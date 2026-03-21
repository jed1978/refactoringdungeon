export const ITEMS = [
  {
    id: "hp_potion",
    name: "回血藥水",
    description: "恢復 30 HP",
    price: 20,
    effect: "heal_hp",
    value: 30,
  },
  {
    id: "mp_potion",
    name: "重構能量劑",
    description: "恢復 20 MP",
    price: 15,
    effect: "heal_mp",
    value: 20,
  },
  {
    id: "max_hp_potion",
    name: "架構強化劑",
    description: "永久提升最大 HP +10",
    price: 50,
    effect: "max_hp",
    value: 10,
  },
  {
    id: "attack_scroll",
    name: "攻擊捲軸",
    description: "戰鬥中使用，ATK ×1.5 持續 3 回合",
    price: 30,
    effect: "atk_boost",
    value: 3,
  },
] as const;

export type ItemDef = (typeof ITEMS)[number];

export const ITEMS_MAP: Record<string, ItemDef> = Object.fromEntries(
  ITEMS.map((i) => [i.id, i]),
);
