import type {
  MonsterState,
  CombatAction,
  CombatState,
} from "../../utils/types";

export type MonsterAIResult = {
  readonly action: CombatAction;
  readonly shouldSplit: boolean;
  readonly entanglePlayer: boolean;
  readonly shouldSkip: boolean;
  readonly hitCount: number; // 1 = normal, 3 = shotgun
  readonly shouldSummon: boolean;
  readonly bigBallAbility:
    | "multi_hit"
    | "steal_heal"
    | "self_heal"
    | "heavy_hit"
    | "normal"
    | null;
};

export function chooseMonsterAction(
  monster: MonsterState,
  combatState: CombatState,
  rng: () => number,
): MonsterAIResult {
  const { behavior } = monster.def;

  // targetIndex: 0 is a placeholder; processEnemyTurn resolves the actual target
  const attackAction: CombatAction = { type: "attack", targetIndex: 0 };
  const base = {
    action: attackAction,
    shouldSplit: false,
    entanglePlayer: false,
    shouldSkip: false,
    hitCount: 1,
    shouldSummon: false,
    bigBallAbility: null as MonsterAIResult["bigBallAbility"],
  };

  switch (behavior) {
    case "split_at_half_hp": {
      const shouldSplit =
        monster.currentHp <= monster.def.hp / 2 && !hasSplitBuff(monster);
      return { ...base, shouldSplit };
    }

    case "random_damage":
      return { ...base };

    case "swarm":
      return { ...base };

    case "boss_spaghetti": {
      const turnMod = combatState.turn % 3;
      const entanglePlayer =
        turnMod === 0 || (rng() < 0.1 && combatState.bossEntangledTurns === 0);
      return { ...base, entanglePlayer };
    }

    case "long_method":
      return { ...base };

    case "feature_envy":
      return { ...base };

    case "shotgun_surgery":
      return { ...base, hitCount: 3 };

    case "boss_circular_dep":
      return { ...base };

    case "n_plus_one": {
      const shouldSummon = !hasSummonBuff(monster);
      return { ...base, shouldSummon };
    }

    case "premature_opt":
      return { ...base };

    case "leaky_abstraction":
      return { ...base };

    case "boss_big_ball": {
      // Weighted random ability selection (no longer predictable turn cycle)
      const roll = rng();
      if (roll < 0.3)
        return { ...base, hitCount: 3, bigBallAbility: "multi_hit" };
      if (roll < 0.55) return { ...base, bigBallAbility: "heavy_hit" };
      if (roll < 0.75) return { ...base, bigBallAbility: "steal_heal" };
      if (roll < 0.9) return { ...base, bigBallAbility: "self_heal" };
      return { ...base, bigBallAbility: "normal" };
    }

    case "data_clump":
      return { ...base };

    case "lazy_class":
      // Behavior handled directly in processEnemyTurn (delegate/heal/attack)
      return { ...base };

    case "boss_god_class": {
      // Phase 3 (enrage): attack twice is handled in processEnemyTurn
      const entanglePlayer =
        combatState.bossPhase >= 2 &&
        rng() < 0.3 &&
        combatState.bossEntangledTurns === 0;
      return { ...base, entanglePlayer };
    }

    default:
      return { ...base };
  }
}

function hasSplitBuff(monster: MonsterState): boolean {
  return monster.buffs.some((b) => b.id === "already_split");
}

function hasSummonBuff(monster: MonsterState): boolean {
  return monster.buffs.some((b) => b.id === "already_summoned");
}

export function getMonsterAttackMultiplier(
  monster: MonsterState,
  rng: () => number,
): number {
  const isWeakened = monster.buffs.some(
    (b) => b.id === "weakened" && b.turnsRemaining > 0,
  );
  const weakenMultiplier = isWeakened ? 0.7 : 1.0;

  switch (monster.def.behavior) {
    case "random_damage":
      // Random between 0.3× and 3× ATK
      return (0.3 + rng() * 2.7) * weakenMultiplier;
    case "leaky_abstraction":
      // Bypasses DEF by simulating a high multiplier
      return 1.4 * weakenMultiplier;
    case "boss_god_class":
      // Enrage phase: 1.5× damage
      return 1.0 * weakenMultiplier;
    case "boss_big_ball":
      // heavy_hit phase handled in processEnemyTurn via bigBallAbility
      return 1.0 * weakenMultiplier;
    default:
      return 1.0 * weakenMultiplier;
  }
}
