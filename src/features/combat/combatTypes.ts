import type { MonsterState, PlayerStats } from "../../utils/types";
import type { CombatState } from "../../utils/types";

export type CombatEvent =
  | {
      readonly kind: "damage_dealt";
      readonly targetIndex: number;
      readonly damage: number;
      readonly isCrit: boolean;
    }
  | {
      readonly kind: "damage_received";
      readonly damage: number;
      readonly isCrit: boolean;
    }
  | { readonly kind: "monster_died"; readonly index: number }
  | {
      readonly kind: "monster_split";
      readonly sourceIndex: number;
      readonly clone: MonsterState;
    }
  | {
      readonly kind: "skill_used";
      readonly skillId: string;
      readonly mpCost: number;
    }
  | { readonly kind: "reveal"; readonly index: number }
  | { readonly kind: "fled" }
  | { readonly kind: "flee_failed"; readonly damage: number }
  | {
      readonly kind: "buff_applied";
      readonly buffId: string;
      readonly turns: number;
      readonly target: "player" | number;
    }
  | {
      readonly kind: "combat_won";
      readonly expGained: number;
      readonly goldGained: number;
    }
  | { readonly kind: "combat_lost" }
  | {
      readonly kind: "level_up";
      readonly newLevel: number;
      readonly unlockedSkills: readonly string[];
    }
  | { readonly kind: "damage_reflected"; readonly damage: number }
  | {
      readonly kind: "monster_summon";
      readonly newMonster: MonsterState;
    }
  | { readonly kind: "buff_stolen"; readonly buffId: string }
  | { readonly kind: "boss_phase_shift"; readonly newPhase: number }
  | { readonly kind: "boss_enrage" }
  | {
      readonly kind: "item_used";
      readonly itemId: string;
      readonly value: number;
    }
  | {
      readonly kind: "companion_attack";
      readonly damage: number;
      readonly targetIndex: number;
    }
  | { readonly kind: "boss_absorb_attack"; readonly abilityName: string };

export type CombatResult = {
  readonly state: CombatState;
  readonly events: readonly CombatEvent[];
  readonly newPlayerStats?: PlayerStats;
  readonly logEntries: readonly string[];
};
