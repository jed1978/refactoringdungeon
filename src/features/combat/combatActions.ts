import type { MonsterState, PlayerStats, CombatState } from "../../utils/types";
import { SKILLS_MAP } from "../../data/skills";
import { calculateDamage } from "./combatFormulas";
import { getMonsterAttackMultiplier } from "./monsterAI";

export type AttackResult = {
  readonly damage: number;
  readonly isCrit: boolean;
  readonly targetIndex: number;
};

export type AoeHit = {
  readonly targetIndex: number;
  readonly damage: number;
  readonly isCrit: boolean;
};

export type SkillResult =
  | {
      readonly kind: "damage";
      readonly damage: number;
      readonly isCrit: boolean;
      readonly targetIndex: number;
    }
  | { readonly kind: "reveal"; readonly targetIndex: number }
  | {
      readonly kind: "stun";
      readonly damage: number;
      readonly isCrit: boolean;
      readonly targetIndex: number;
    }
  | { readonly kind: "buff_self"; readonly buffId: string }
  | { readonly kind: "aoe"; readonly hits: readonly AoeHit[] }
  | {
      readonly kind: "weaken";
      readonly damage: number;
      readonly isCrit: boolean;
      readonly targetIndex: number;
    }
  | { readonly kind: "chain"; readonly hits: readonly AoeHit[] }
  | { readonly kind: "no_mp" };

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
  _state?: CombatState,
): SkillResult {
  const skill = SKILLS_MAP[skillId];
  if (!skill) return { kind: "no_mp" };
  if (playerStats.mp < skill.mpCost) return { kind: "no_mp" };

  switch (skill.effect) {
    case "reveal":
      return { kind: "reveal", targetIndex };

    case "damage":
    case "always_first": {
      const target = enemies[targetIndex];
      if (!target) return { kind: "no_mp" };
      let multiplier = skill.multiplier;
      if (
        skillId === "replace_magic_number" &&
        target.def.id === "magic_number"
      ) {
        multiplier = 2.0;
      }
      const result = calculateDamage(
        playerStats.atk,
        target.def.def,
        multiplier,
        rng,
      );
      return { kind: "damage", ...result, targetIndex };
    }

    case "stun": {
      const target = enemies[targetIndex];
      if (!target) return { kind: "no_mp" };
      let multiplier = skill.multiplier;
      if (
        skillId === "replace_magic_number" &&
        target.def.id === "magic_number"
      ) {
        multiplier = 2.0;
      }
      const result = calculateDamage(
        playerStats.atk,
        target.def.def,
        multiplier,
        rng,
      );
      return {
        kind: "stun",
        damage: result.damage,
        isCrit: result.isCrit,
        targetIndex,
      };
    }

    case "dodge_next":
      return { kind: "buff_self", buffId: "dodge_next" };

    case "aoe": {
      const hits: AoeHit[] = enemies
        .map((e, i) => ({ e, i }))
        .filter(({ e }) => e.currentHp > 0)
        .map(({ e, i }) => {
          const result = calculateDamage(
            playerStats.atk,
            e.def.def,
            skill.multiplier,
            rng,
          );
          return {
            targetIndex: i,
            damage: result.damage,
            isCrit: result.isCrit,
          };
        });
      return { kind: "aoe", hits };
    }

    case "weaken": {
      const target = enemies[targetIndex];
      if (!target) return { kind: "no_mp" };
      const result = calculateDamage(
        playerStats.atk,
        target.def.def,
        skill.multiplier,
        rng,
      );
      return {
        kind: "weaken",
        damage: result.damage,
        isCrit: result.isCrit,
        targetIndex,
      };
    }

    case "chain": {
      const target = enemies[targetIndex];
      if (!target) return { kind: "no_mp" };
      const hits: AoeHit[] = Array.from({ length: 3 }, () => {
        const result = calculateDamage(
          playerStats.atk,
          target.def.def,
          skill.multiplier,
          rng,
        );
        return { targetIndex, damage: result.damage, isCrit: result.isCrit };
      });
      return { kind: "chain", hits };
    }

    default: {
      const target = enemies[targetIndex];
      if (!target) return { kind: "no_mp" };
      const result = calculateDamage(
        playerStats.atk,
        target.def.def,
        skill.multiplier,
        rng,
      );
      return { kind: "damage", ...result, targetIndex };
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
