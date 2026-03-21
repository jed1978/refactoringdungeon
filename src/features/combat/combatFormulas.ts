import type { PlayerStats, MonsterState, TurnOrderEntry } from '../../utils/types';
import { SKILLS } from '../../data/skills';

export type AttackResult = {
  readonly damage: number;
  readonly isCrit: boolean;
};

export function calculateDamage(
  atk: number,
  def: number,
  multiplier: number,
  rng: () => number,
): AttackResult {
  const variance = 1 + (rng() - 0.5) * 0.2; // ±10%
  const isCrit = rng() < 0.1;
  const critMult = isCrit ? 1.5 : 1;
  const raw = atk * multiplier * variance * critMult - def * 0.5;
  return { damage: Math.max(1, Math.round(raw)), isCrit };
}

export function calculateTurnOrder(
  playerSpd: number,
  enemies: readonly MonsterState[],
): TurnOrderEntry[] {
  type Entry = { readonly entry: TurnOrderEntry; readonly spd: number };
  const entries: Entry[] = [{ entry: { kind: 'player' }, spd: playerSpd }];

  enemies.forEach((e, i) => {
    entries.push({ entry: { kind: 'enemy', index: i }, spd: e.def.spd });
  });

  // Sort descending by speed
  entries.sort((a, b) => b.spd - a.spd);
  return entries.map(e => e.entry);
}

export function calculateFleeChance(rng: () => number): boolean {
  return rng() < 0.5;
}

export type LevelUpResult = {
  readonly newStats: PlayerStats;
  readonly didLevel: boolean;
  readonly unlockedSkills: readonly string[];
};

export function checkLevelUp(stats: PlayerStats): LevelUpResult {
  if (stats.exp < stats.expToNext) {
    return { newStats: stats, didLevel: false, unlockedSkills: [] };
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

  const unlockedSkills = SKILLS
    .filter(s => s.unlockLevel === newLevel)
    .map(s => s.id);

  return { newStats, didLevel: true, unlockedSkills };
}
