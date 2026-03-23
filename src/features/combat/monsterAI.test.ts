import { describe, it, expect } from "vitest";
import { chooseMonsterAction, getMonsterAttackMultiplier } from "./monsterAI";
import { makeMonster, makeMonsterDef, makeCombatState, constRng } from "../../test/helpers";

describe("chooseMonsterAction", () => {
  it("lazy_class always skips turn", () => {
    const monster = makeMonster({ def: makeMonsterDef({ behavior: "lazy_class" }) });
    const result = chooseMonsterAction(monster, makeCombatState(), constRng(0.5));
    expect(result.shouldSkip).toBe(true);
  });

  it("shotgun_surgery has hitCount=3", () => {
    const monster = makeMonster({ def: makeMonsterDef({ behavior: "shotgun_surgery" }) });
    const result = chooseMonsterAction(monster, makeCombatState(), constRng(0.5));
    expect(result.hitCount).toBe(3);
  });

  it("normal behavior has hitCount=1, no split/summon/skip", () => {
    const monster = makeMonster({ def: makeMonsterDef({ behavior: "swarm" }) });
    const result = chooseMonsterAction(monster, makeCombatState(), constRng(0.5));
    expect(result.hitCount).toBe(1);
    expect(result.shouldSplit).toBe(false);
    expect(result.shouldSummon).toBe(false);
    expect(result.shouldSkip).toBe(false);
  });

  it("split_at_half_hp triggers split when hp <= half and not already split", () => {
    const def = makeMonsterDef({ behavior: "split_at_half_hp", hp: 50 });
    const monster = makeMonster({ def, currentHp: 25, buffs: [] });
    const result = chooseMonsterAction(monster, makeCombatState(), constRng(0.5));
    expect(result.shouldSplit).toBe(true);
  });

  it("split_at_half_hp does NOT split when already_split buff present", () => {
    const def = makeMonsterDef({ behavior: "split_at_half_hp", hp: 50 });
    const monster = makeMonster({
      def,
      currentHp: 25,
      buffs: [{ id: "already_split", name: "", turnsRemaining: 99, effect: "" }],
    });
    const result = chooseMonsterAction(monster, makeCombatState(), constRng(0.5));
    expect(result.shouldSplit).toBe(false);
  });

  it("n_plus_one triggers summon when not already_summoned", () => {
    const monster = makeMonster({ def: makeMonsterDef({ behavior: "n_plus_one" }), buffs: [] });
    const result = chooseMonsterAction(monster, makeCombatState(), constRng(0.5));
    expect(result.shouldSummon).toBe(true);
  });

  it("boss_big_ball uses correct ability based on turn modulo", () => {
    const monster = makeMonster({ def: makeMonsterDef({ behavior: "boss_big_ball" }) });

    // turn=0 → multi_hit
    const s0 = makeCombatState({ turn: 0 });
    expect(chooseMonsterAction(monster, s0, constRng(0.5)).bigBallAbility).toBe("multi_hit");

    // turn=2 → self_heal
    const s2 = makeCombatState({ turn: 2 });
    expect(chooseMonsterAction(monster, s2, constRng(0.5)).bigBallAbility).toBe("self_heal");

    // turn=4 → normal
    const s4 = makeCombatState({ turn: 4 });
    expect(chooseMonsterAction(monster, s4, constRng(0.5)).bigBallAbility).toBe("normal");
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
      buffs: [{ id: "weakened", name: "弱化", turnsRemaining: 1, effect: "weaken" }],
    });
    const mult = getMonsterAttackMultiplier(monster, constRng(0.5));
    expect(mult).toBeCloseTo(0.7);
  });

  it("leaky_abstraction returns 1.4x", () => {
    const monster = makeMonster({ def: makeMonsterDef({ behavior: "leaky_abstraction" }) });
    const mult = getMonsterAttackMultiplier(monster, constRng(0.5));
    expect(mult).toBe(1.4);
  });

  it("random_damage returns value in expected range", () => {
    const monster = makeMonster({ def: makeMonsterDef({ behavior: "random_damage" }) });
    for (let i = 0; i < 50; i++) {
      const rng = () => Math.random();
      const mult = getMonsterAttackMultiplier(monster, rng);
      expect(mult).toBeGreaterThanOrEqual(0.3);
      expect(mult).toBeLessThanOrEqual(3.0);
    }
  });
});
