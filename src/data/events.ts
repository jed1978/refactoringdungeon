export type EventReward =
  | { readonly kind: "heal_hp"; readonly value: number }
  | { readonly kind: "heal_mp"; readonly value: number }
  | { readonly kind: "damage_hp"; readonly value: number }
  | { readonly kind: "atk_buff"; readonly turns: number }
  | { readonly kind: "skip_encounters"; readonly count: number }
  | { readonly kind: "reveal_map" }
  | { readonly kind: "companion"; readonly combats: number };

export type EventChoice = {
  readonly label: string;
  readonly reward: EventReward;
};

export type GameEvent = {
  readonly id: string;
  readonly title: string;
  readonly text: string;
  readonly portrait: string; // npc icon char
  readonly choices: readonly EventChoice[];
};

export const EVENTS: Record<string, GameEvent> = {
  shrine: {
    id: "shrine",
    title: "Code Review 神壇",
    portrait: "📋",
    text: "神壇散發著程式碼的光芒。\n接受 Code Review，通過則得到祝福，失敗則受到懲罰。",
    choices: [
      { label: "接受 Code Review", reward: { kind: "heal_hp", value: 50 } },
      { label: "直接跳過", reward: { kind: "heal_hp", value: 0 } },
    ],
  },
  bookshelf: {
    id: "bookshelf",
    title: "Stack Overflow 圖書館",
    portrait: "📚",
    text: "滿滿的技術文章和被接受的答案。\n也許能找到有用的知識？",
    choices: [
      { label: "查閱 — 恢復 MP", reward: { kind: "heal_mp", value: 30 } },
      {
        label: "隨手複製貼上（+ATK 3 回合）",
        reward: { kind: "atk_buff", turns: 3 },
      },
    ],
  },
  coffee: {
    id: "coffee",
    title: "咖啡機",
    portrait: "☕",
    text: "香氣四溢。一杯好咖啡能讓思路清晰。\n要來一杯嗎？",
    choices: [
      {
        label: "喝一杯（+ATK 5 回合）",
        reward: { kind: "atk_buff", turns: 5 },
      },
      { label: "不用了，我喝水就好", reward: { kind: "heal_hp", value: 10 } },
    ],
  },
  debt_collector: {
    id: "debt_collector",
    title: "技術債催收員 💸",
    portrait: "💸",
    text: "一個西裝筆挺的人攔住了你。\n「貴公司積欠的技術債已到期，請立即還款。」\n付出 30% 心智值，跳過接下來 2 場遭遇。",
    choices: [
      {
        label: "還款（-30% HP，跳過 2 場遭遇）",
        reward: { kind: "skip_encounters", count: 2 },
      },
      {
        label: "拒絕繳款（繼續承受後果）",
        reward: { kind: "heal_hp", value: 0 },
      },
    ],
  },
  pair_programmer: {
    id: "pair_programmer",
    title: "結對程式設計夥伴 👥",
    portrait: "👥",
    text: "一位工程師走來：「要一起結對嗎？\n兩個臭皮匠勝過一個諸葛亮！」\n接受後，接下來 3 場戰鬥他會自動幫你攻擊。",
    choices: [
      {
        label: "接受結對（3 場戰鬥有夥伴）",
        reward: { kind: "companion", combats: 3 },
      },
      { label: "我偏好單幹", reward: { kind: "heal_hp", value: 0 } },
    ],
  },
  legacy_docs: {
    id: "legacy_docs",
    title: "遺留文件 📜",
    portrait: "📜",
    text: "一份泛黃的文件，上面寫著這層地城的完整地圖。\n雖然格式是 Word 97，但內容似乎還堪用。",
    choices: [
      { label: "閱讀文件（揭露整層地圖）", reward: { kind: "reveal_map" } },
      { label: "Word 97？算了", reward: { kind: "heal_hp", value: 0 } },
    ],
  },
};
