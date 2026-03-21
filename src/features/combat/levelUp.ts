import type { PlayerState, PlayerStats } from '../../utils/types';
import { SKILLS } from '../../data/skills';

export type LevelUpResult = {
  readonly newPlayer: PlayerState;
  readonly didLevel: boolean;
  readonly unlockedSkills: readonly string[];
};

export function applyLevelUpIfEarned(player: PlayerState): LevelUpResult {
  const stats = player.stats;
  if (stats.exp < stats.expToNext) {
    return { newPlayer: player, didLevel: false, unlockedSkills: [] };
  }

  const newLevel = stats.level + 1;
  const newStats: PlayerStats = {
    ...stats,
    level: newLevel,
    exp: stats.exp - stats.expToNext,
    expToNext: Math.floor(stats.expToNext * 1.5),
    maxHp: stats.maxHp + 10,
    hp: Math.min(stats.hp + 10, stats.maxHp + 10),
    maxMp: stats.maxMp + 5,
    mp: Math.min(stats.mp + 5, stats.maxMp + 5),
    atk: stats.atk + 2,
    def: stats.def + 1,
    spd: stats.spd + 1,
  };

  const newSkills = SKILLS
    .filter(s => s.unlockLevel === newLevel && !player.skills.includes(s.id))
    .map(s => s.id);

  return {
    newPlayer: {
      ...player,
      stats: newStats,
      skills: [...player.skills, ...newSkills],
    },
    didLevel: true,
    unlockedSkills: newSkills,
  };
}
