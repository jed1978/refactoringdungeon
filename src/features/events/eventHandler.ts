import type { PlayerStats, PlayerBuff } from "../../utils/types";
import type { EventReward } from "../../data/events";

export type EventResult = {
  readonly newStats: PlayerStats;
  readonly message: string;
  readonly buff?: PlayerBuff;
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
      return {
        newStats: stats, // base stats unchanged; buff applied separately
        message: `ATK +${reward.value}，持續 ${reward.turns} 場戰鬥！`,
        buff: {
          id: `atk_buff_${Date.now()}`,
          stat: "atk" as const,
          value: reward.value,
          combatsRemaining: reward.turns,
        },
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
