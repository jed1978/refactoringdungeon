import type { MonsterState, PlayerStats, CombatState } from '../../utils/types';
import { SKILLS_MAP } from '../../data/skills';
import { calculateDamage } from './combatFormulas';
import { getMonsterAttackMultiplier } from './monsterAI';

export type AttackResult = {
  readonly damage: number;
  readonly isCrit: boolean;
  readonly targetIndex: number;
};

export type SkillResult =
  | { readonly kind: 'damage'; readonly damage: number; readonly isCrit: boolean; readonly targetIndex: number }
  | { readonly kind: 'reveal'; readonly targetIndex: number }
  | { readonly kind: 'no_mp' };

export function resolvePlayerAttack(
  playerStats: PlayerStats,
  targetIndex: number,
  enemies: readonly MonsterState[],
  rng: () => number,
): AttackResult | null {
  const target = enemies[targetIndex];
  if (!target) return null;
  const result = calculateDamage(playerStats.atk, target.def.def, 1.0, rng);
  return { ...result, targetIndex };
}

export function resolveSkill(
  skillId: string,
  playerStats: PlayerStats,
  targetIndex: number,
  enemies: readonly MonsterState[],
  rng: () => number,
): SkillResult {
  const skill = SKILLS_MAP[skillId];
  if (!skill) return { kind: 'no_mp' };
  if (playerStats.mp < skill.mpCost) return { kind: 'no_mp' };

  switch (skill.effect) {
    case 'reveal':
      return { kind: 'reveal', targetIndex };

    case 'damage':
    case 'always_first': {
      const target = enemies[targetIndex];
      if (!target) return { kind: 'no_mp' };
      let multiplier = skill.multiplier;
      // Extra damage vs magic_number for replace_magic_number skill
      if (skillId === 'replace_magic_number' && target.def.id === 'magic_number') {
        multiplier = 2.0;
      }
      const result = calculateDamage(playerStats.atk, target.def.def, multiplier, rng);
      return { kind: 'damage', ...result, targetIndex };
    }

    default: {
      const target = enemies[targetIndex];
      if (!target) return { kind: 'no_mp' };
      const result = calculateDamage(playerStats.atk, target.def.def, skill.multiplier, rng);
      return { kind: 'damage', ...result, targetIndex };
    }
  }
}

export function resolveMonsterAttack(
  monster: MonsterState,
  playerStats: PlayerStats,
  rng: () => number,
): { readonly damage: number; readonly isCrit: boolean } {
  const multiplier = getMonsterAttackMultiplier(monster, rng);
  return calculateDamage(monster.def.atk, playerStats.def, multiplier, rng);
}

export function resolveInlineTempOrder(
  combatState: CombatState,
): boolean {
  // Inline temp always goes first — check if it's used before player's normal turn
  return true;
}
