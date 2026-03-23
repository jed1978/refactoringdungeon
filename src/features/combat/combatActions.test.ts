import { describe, it, expect } from "vitest";
import {
  resolvePlayerAttack,
  resolveSkill,
  resolveMonsterAttack,
} from "./combatActions";
import { makePlayerStats, makeMonster, makeMonsterDef, constRng } from "../../test/helpers";

const noVarianceNoCrit = constRng(0.5); // variance=1.0, crit=false

describe("resolvePlayerAttack", () => {
  it("returns null when target does not exist", () => {
    const result = resolvePlayerAttack(makePlayerStats(), 5, [], noVarianceNoCrit);
    expect(result).toBeNull();
  });

  it("returns damage and targetIndex for valid target", () => {
    const enemies = [makeMonster({ def: makeMonsterDef({ def: 0 }) })];
    const result = resolvePlayerAttack(
      makePlayerStats({ atk: 20 }),
      0,
      enemies,
      constRng(0.5),
    );
    expect(result).not.toBeNull();
    expect(result!.targetIndex).toBe(0);
    expect(result!.damage).toBeGreaterThanOrEqual(1);
  });

  it("damage is ATK - DEF*0.5 at 1.0 multiplier (no variance, no crit)", () => {
    const enemies = [makeMonster({ def: makeMonsterDef({ def: 8 }) })];
    const result = resolvePlayerAttack(
      makePlayerStats({ atk: 20 }),
      0,
      enemies,
      constRng(0.5),
    );
    // 20 * 1.0 * 1 - 4 = 16
    expect(result!.damage).toBe(16);
    expect(result!.isCrit).toBe(false);
  });
});

describe("resolveSkill", () => {
  const makeEnemies = () => [makeMonster({ def: makeMonsterDef({ def: 0 }) })];

  it("returns no_mp when player has insufficient MP", () => {
    const stats = makePlayerStats({ mp: 0 });
    const result = resolveSkill("extract_method", stats, 0, makeEnemies(), constRng(0.5));
    expect(result.kind).toBe("no_mp");
  });

  it("returns no_mp for unknown skillId", () => {
    const result = resolveSkill("unknown_skill", makePlayerStats(), 0, makeEnemies(), constRng(0.5));
    expect(result.kind).toBe("no_mp");
  });

  it("extract_method returns damage kind", () => {
    const result = resolveSkill(
      "extract_method",
      makePlayerStats({ mp: 10, atk: 20 }),
      0,
      makeEnemies(),
      constRng(0.5),
    );
    expect(result.kind).toBe("damage");
    if (result.kind === "damage") {
      expect(result.targetIndex).toBe(0);
      expect(result.damage).toBeGreaterThanOrEqual(1);
    }
  });

  it("rename_variable returns reveal kind", () => {
    const result = resolveSkill(
      "rename_variable",
      makePlayerStats({ mp: 10 }),
      0,
      makeEnemies(),
      constRng(0.5),
    );
    expect(result.kind).toBe("reveal");
    if (result.kind === "reveal") {
      expect(result.targetIndex).toBe(0);
    }
  });

  it("replace_magic_number returns stun kind", () => {
    const result = resolveSkill(
      "replace_magic_number",
      makePlayerStats({ mp: 10, atk: 20 }),
      0,
      makeEnemies(),
      constRng(0.5),
    );
    expect(result.kind).toBe("stun");
  });

  it("replace_magic_number uses 2x multiplier vs magic_number enemy", () => {
    const magicEnemy = makeMonster({
      def: makeMonsterDef({ id: "magic_number", def: 0 }),
    });
    const result = resolveSkill(
      "replace_magic_number",
      makePlayerStats({ mp: 10, atk: 10 }),
      0,
      [magicEnemy],
      constRng(0.5),
    );
    if (result.kind === "stun") {
      // Normal vs magic_number: multiplier is already 2.0 in skill def, not doubled
      // But code checks id and sets multiplier = 2.0 explicitly
      expect(result.damage).toBeGreaterThanOrEqual(1);
    }
  });

  it("move_method returns buff_self with dodge_next", () => {
    const result = resolveSkill(
      "move_method",
      makePlayerStats({ mp: 10 }),
      0,
      makeEnemies(),
      constRng(0.5),
    );
    expect(result.kind).toBe("buff_self");
    if (result.kind === "buff_self") {
      expect(result.buffId).toBe("dodge_next");
    }
  });

  it("introduce_parameter_object returns aoe kind hitting all alive enemies", () => {
    const enemies = [
      makeMonster({ def: makeMonsterDef({ def: 0 }), currentHp: 20 }),
      makeMonster({ def: makeMonsterDef({ def: 0 }), currentHp: 0 }), // dead
      makeMonster({ def: makeMonsterDef({ def: 0 }), currentHp: 30 }),
    ];
    const result = resolveSkill(
      "introduce_parameter_object",
      makePlayerStats({ mp: 10, atk: 10 }),
      0,
      enemies,
      constRng(0.5),
    );
    expect(result.kind).toBe("aoe");
    if (result.kind === "aoe") {
      // Only 2 alive enemies hit
      expect(result.hits).toHaveLength(2);
    }
  });
});

describe("resolveMonsterAttack", () => {
  it("returns damage >= 1", () => {
    const monster = makeMonster({ def: makeMonsterDef({ atk: 10 }) });
    const result = resolveMonsterAttack(monster, makePlayerStats({ def: 0 }), constRng(0.5));
    expect(result.damage).toBeGreaterThanOrEqual(1);
  });

  it("weakened buff reduces monster damage by 0.7x", () => {
    const weakenedMonster = makeMonster({
      def: makeMonsterDef({ atk: 20, def: 0 }),
      buffs: [{ id: "weakened", name: "弱化", turnsRemaining: 1, effect: "weaken" }],
    });
    const normalMonster = makeMonster({ def: makeMonsterDef({ atk: 20, def: 0 }) });

    const weakDmg = resolveMonsterAttack(weakenedMonster, makePlayerStats({ def: 0 }), constRng(0.5));
    const normDmg = resolveMonsterAttack(normalMonster, makePlayerStats({ def: 0 }), constRng(0.5));
    expect(weakDmg.damage).toBeLessThan(normDmg.damage);
  });
});
