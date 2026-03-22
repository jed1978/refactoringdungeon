import type { PlayerStats } from "../../utils/types";
import type { EventReward } from "../../data/events";

export type EventResult = {
  readonly newStats: PlayerStats;
  readonly message: string;
};

export function applyEventReward(
  stats: PlayerStats,
  reward: EventReward,
): EventResult {
  switch (reward.kind) {
    case "heal_hp": {
      if (reward.value === 0)
        return { newStats: stats, message: "你跳過了機會。" };
      const hp = Math.min(stats.maxHp, stats.hp + reward.value);
      return {
        newStats: { ...stats, hp },
        message: `恢復了 ${reward.value} HP！`,
      };
    }
    case "heal_mp": {
      const mp = Math.min(stats.maxMp, stats.mp + reward.value);
      return {
        newStats: { ...stats, mp },
        message: `恢復了 ${reward.value} MP！`,
      };
    }
    case "damage_hp": {
      const hp = Math.max(0, stats.hp - reward.value);
      return {
        newStats: { ...stats, hp },
        message: `受到了 ${reward.value} 點傷害...`,
      };
    }
    case "atk_buff": {
      // ATK buff stored as temporary stat boost (simplified: permanent +1)
      return {
        newStats: { ...stats, atk: stats.atk + 1 },
        message: `ATK 暫時提升！持續 ${reward.turns} 回合。`,
      };
    }
    case "skip_encounters": {
      return {
        newStats: stats,
        message: `接下來 ${reward.count} 個遭遇會被跳過！`,
      };
    }
    case "reveal_map": {
      return {
        newStats: stats,
        message: "地圖完全顯示了！",
      };
    }
    case "companion": {
      return {
        newStats: stats,
        message: `結對夥伴加入了！接下來 ${reward.combats} 場戰鬥他會幫你攻擊。`,
      };
    }
  }
}
