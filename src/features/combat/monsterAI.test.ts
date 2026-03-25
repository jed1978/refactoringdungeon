import { describe, it, expect } from "vitest";
import { chooseMonsterAction, getMonsterAttackMultiplier } from "./monsterAI";
import {
  makeMonster,
  makeMonsterDef,
  makeCombatState,
  constRng,
} from "../../test/helpers";

describe("chooseMonsterAction", () => {
  it("lazy_class returns base result (behavior handled in enemyTurn)", () => {
    const monster = makeMonster({
      def: makeMonsterDef({ behavior: "lazy_class" }),
    });
    const result = chooseMonsterAction(
      monster,
      makeCombatState(),
      constRng(0.5),
    );
    // shouldSkip is no longer set; behavior (delegate/heal/attack) is handled inline in processEnemyTurn
    expect(result.shouldSkip).toBe(false);
    expect(result.hitCount).toBe(1);
  });

  it("shotgun_surgery has hitCount=3", () => {
    const monster = makeMonster({
      def: makeMonsterDef({ behavior: "shotgun_surgery" }),
    });
    const result = chooseMonsterAction(
      monster,
      makeCombatState(),
      constRng(0.5),
    );
    expect(result.hitCount).toBe(3);
  });

  it("normal behavior has hitCount=1, no split/summon/skip", () => {
    const monster = makeMonster({ def: makeMonsterDef({ behavior: "swarm" }) });
    const result = chooseMonsterAction(
      monster,
      makeCombatState(),
      constRng(0.5),
    );
    expect(result.hitCount).toBe(1);
    expect(result.shouldSplit).toBe(false);
    expect(result.shouldSummon).toBe(false);
    expect(result.shouldSkip).toBe(false);
  });

  it("split_at_half_hp triggers split when hp <= half and not already split", () => {
    const def = makeMonsterDef({ behavior: "split_at_half_hp", hp: 50 });
    const monster = makeMonster({ def, currentHp: 25, buffs: [] });
    const result = chooseMonsterAction(
      monster,
      makeCombatState(),
      constRng(0.5),
    );
    expect(result.shouldSplit).toBe(true);
  });

  it("split_at_half_hp does NOT split when already_split buff present", () => {
    const def = makeMonsterDef({ behavior: "split_at_half_hp", hp: 50 });
    const monster = makeMonster({
      def,
      currentHp: 25,
      buffs: [
        { id: "already_split", name: "", turnsRemaining: 99, effect: "" },
      ],
    });
    const result = chooseMonsterAction(
      monster,
      makeCombatState(),
      constRng(0.5),
    );
    expect(result.shouldSplit).toBe(false);
  });

  it("n_plus_one triggers summon when not already_summoned", () => {
    const monster = makeMonster({
      def: makeMonsterDef({ behavior: "n_plus_one" }),
      buffs: [],
    });
    const result = chooseMonsterAction(
      monster,
      makeCombatState(),
      constRng(0.5),
    );
    expect(result.shouldSummon).toBe(true);
  });

  it("boss_big_ball selects ability by weighted random rng", () => {
    const monster = makeMonster({
      def: makeMonsterDef({ behavior: "boss_big_ball" }),
    });
    const state = makeCombatState();

    // roll=0.1 (<0.30) → multi_hit
    expect(
      chooseMonsterAction(monster, state, constRng(0.1)).bigBallAbility,
    ).toBe("multi_hit");
    // roll=0.5 (0.30–0.55) → heavy_hit
    expect(
      chooseMonsterAction(monster, state, constRng(0.5)).bigBallAbility,
    ).toBe("heavy_hit");
    // roll=0.65 (0.55–0.75) → steal_heal
    expect(
      chooseMonsterAction(monster, state, constRng(0.65)).bigBallAbility,
    ).toBe("steal_heal");
    // roll=0.8 (0.75–0.90) → self_heal
    expect(
      chooseMonsterAction(monster, state, constRng(0.8)).bigBallAbility,
    ).toBe("self_heal");
    // roll=0.95 (>=0.90) → normal
    expect(
      chooseMonsterAction(monster, state, constRng(0.95)).bigBallAbility,
    ).toBe("normal");
  });
});

describe("getMonsterAttackMultiplier", () => {
  it("returns 1.0 for normal behavior", () => {
    const monster = makeMonster({ def: makeMonsterDef({ behavior: "swarm" }) });
    const mult = getMonsterAttackMultiplier(monster, constRng(0.5));
    expect(mult).toBe(1.0);
  });

  it("weakened buff reduces multiplier by 0.7x", () => {
    const monster = makeMonster({
      def: makeMonsterDef({ behavior: "swarm" }),
      buffs: [
        { id: "weakened", name: "弱化", turnsRemaining: 1, effect: "weaken" },
      ],
    });
    const mult = getMonsterAttackMultiplier(monster, constRng(0.5));
    expect(mult).toBeCloseTo(0.7);
  });

  it("leaky_abstraction returns 1.4x", () => {
    const monster = makeMonster({
      def: makeMonsterDef({ behavior: "leaky_abstraction" }),
    });
    const mult = getMonsterAttackMultiplier(monster, constRng(0.5));
    expect(mult).toBe(1.4);
  });

  it("random_damage returns value in expected range", () => {
    const monster = makeMonster({
      def: makeMonsterDef({ behavior: "random_damage" }),
    });
    for (let i = 0; i < 50; i++) {
      const rng = () => Math.random();
      const mult = getMonsterAttackMultiplier(monster, rng);
      expect(mult).toBeGreaterThanOrEqual(0.3);
      expect(mult).toBeLessThanOrEqual(3.0);
    }
  });
});
