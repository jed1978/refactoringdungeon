import type { MonsterState, CombatAction, CombatState } from '../../utils/types';

export type MonsterAIResult = {
  readonly action: CombatAction;
  readonly shouldSplit: boolean;
  readonly entanglePlayer: boolean;
};

export function chooseMonsterAction(
  monster: MonsterState,
  combatState: CombatState,
  rng: () => number,
): MonsterAIResult {
  const { behavior } = monster.def;

  switch (behavior) {
    case 'split_at_half_hp': {
      const shouldSplit = monster.currentHp <= monster.def.hp / 2
        && !hasSplitBuff(monster);
      return { action: { type: 'attack' }, shouldSplit, entanglePlayer: false };
    }

    case 'random_damage':
      return { action: { type: 'attack' }, shouldSplit: false, entanglePlayer: false };

    case 'swarm':
      return { action: { type: 'attack' }, shouldSplit: false, entanglePlayer: false };

    case 'boss_spaghetti': {
      const turnMod = combatState.turn % 3;
      const entanglePlayer = turnMod === 0
        || (rng() < 0.1 && combatState.bossEntangledTurns === 0);
      return { action: { type: 'attack' }, shouldSplit: false, entanglePlayer };
    }

    default:
      return { action: { type: 'attack' }, shouldSplit: false, entanglePlayer: false };
  }
}

function hasSplitBuff(monster: MonsterState): boolean {
  return monster.buffs.some(b => b.id === 'already_split');
}

export function getMonsterAttackMultiplier(
  monster: MonsterState,
  rng: () => number,
): number {
  switch (monster.def.behavior) {
    case 'random_damage':
      // Random between 0.3× and 3× ATK
      return 0.3 + rng() * 2.7;
    default:
      return 1.0;
  }
}
