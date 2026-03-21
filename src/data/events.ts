export type EventReward =
  | { readonly kind: 'heal_hp'; readonly value: number }
  | { readonly kind: 'heal_mp'; readonly value: number }
  | { readonly kind: 'damage_hp'; readonly value: number }
  | { readonly kind: 'atk_buff'; readonly turns: number }
  | { readonly kind: 'skip_encounters'; readonly count: number }
  | { readonly kind: 'reveal_map' };

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
    id: 'shrine',
    title: 'Code Review 神壇',
    portrait: '📋',
    text: '神壇散發著程式碼的光芒。\n接受 Code Review，通過則得到祝福，失敗則受到懲罰。',
    choices: [
      { label: '接受 Code Review', reward: { kind: 'heal_hp', value: 50 } },
      { label: '直接跳過', reward: { kind: 'heal_hp', value: 0 } },
    ],
  },
  bookshelf: {
    id: 'bookshelf',
    title: 'Stack Overflow 圖書館',
    portrait: '📚',
    text: '滿滿的技術文章和被接受的答案。\n也許能找到有用的知識？',
    choices: [
      { label: '查閱 — 恢復 MP', reward: { kind: 'heal_mp', value: 30 } },
      { label: '隨手複製貼上（+ATK 3 回合）', reward: { kind: 'atk_buff', turns: 3 } },
    ],
  },
  coffee: {
    id: 'coffee',
    title: '咖啡機',
    portrait: '☕',
    text: '香氣四溢。一杯好咖啡能讓思路清晰。\n要來一杯嗎？',
    choices: [
      { label: '喝一杯（+ATK 5 回合）', reward: { kind: 'atk_buff', turns: 5 } },
      { label: '不用了，我喝水就好', reward: { kind: 'heal_hp', value: 10 } },
    ],
  },
};
