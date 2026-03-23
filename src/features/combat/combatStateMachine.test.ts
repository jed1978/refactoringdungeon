import { describe, it, expect } from "vitest";
import { initCombat, processPlayerAction, processEnemyTurn } from "./combatStateMachine";
import {
  makePlayerStats,
  makeMonster,
  makeMonsterDef,
  makeCombatState,
  constRng,
} from "../../test/helpers";
import type { MonsterState } from "../../utils/types";

// RNG that alternates: first call for flee = succeed (0.1 < 0.5)
const fleeSuccessRng = constRng(0.1);
// RNG that makes flee fail (0.9 >= 0.5), but still needs variance for counter-attack
let failCallCount = 0;
const fleeFailRng = () => {
  failCallCount++;
  // First call = flee check = 0.9 (fail), subsequent = damage calc values
  if (failCallCount === 1) return 0.9;
  return 0.5; // neutral variance, no crit
};

function resetFleeFailRng() {
  failCallCount = 0;
}

describe("initCombat", () => {
  it("initializes turn 1 and correct player turn based on speed", () => {
    const enemies = [makeMonster({ def: makeMonsterDef({ spd: 5 }) })];
    const state = initCombat(enemies, makePlayerStats({ spd: 10 }));
    expect(state.turn).toBe(1);
    expect(state.isPlayerTurn).toBe(true);
    expect(state.phase).toBe("selecting");
  });

  it("enemy goes first when faster", () => {
    const enemies = [makeMonster({ def: makeMonsterDef({ spd: 20 }) })];
    const state = initCombat(enemies, makePlayerStats({ spd: 5 }));
    expect(state.isPlayerTurn).toBe(false);
    expect(state.phase).toBe("enemy_turn");
  });

  it("includes all enemies in initial state", () => {
    const enemies = [makeMonster(), makeMonster()];
    const state = initCombat(enemies, makePlayerStats());
    expect(state.enemies).toHaveLength(2);
  });

  it("starts with empty log and no revealed enemies", () => {
    const state = initCombat([makeMonster()], makePlayerStats());
    expect(state.log.entries).toHaveLength(0);
    expect(state.revealedEnemies).toHaveLength(0);
  });
});

describe("processPlayerAction — attack", () => {
  it("emits damage_dealt event with correct targetIndex", () => {
    const combat = makeCombatState();
    const result = processPlayerAction(
      combat,
      { type: "attack", targetIndex: 0 },
      makePlayerStats(),
      constRng(0.5),
    );
    const dmgEvent = result.events.find((e) => e.kind === "damage_dealt");
    expect(dmgEvent).toBeDefined();
    if (dmgEvent?.kind === "damage_dealt") {
      expect(dmgEvent.targetIndex).toBe(0);
      expect(dmgEvent.damage).toBeGreaterThanOrEqual(1);
    }
  });

  it("enemy HP decreases after attack", () => {
    const combat = makeCombatState();
    const initialHp = combat.enemies[0]!.currentHp;
    const result = processPlayerAction(
      combat,
      { type: "attack", targetIndex: 0 },
      makePlayerStats(),
      constRng(0.5),
    );
    expect(result.state.enemies[0]!.currentHp).toBeLessThan(initialHp);
  });

  it("emits monster_died when enemy HP reaches 0", () => {
    const weakEnemy = makeMonster({
      def: makeMonsterDef({ hp: 1, def: 0 }),
      currentHp: 1,
    });
    const combat = makeCombatState({ enemies: [weakEnemy] });
    const result = processPlayerAction(
      combat,
      { type: "attack", targetIndex: 0 },
      makePlayerStats({ atk: 100 }),
      constRng(0.5),
    );
    const diedEvent = result.events.find((e) => e.kind === "monster_died");
    expect(diedEvent).toBeDefined();
  });

  it("emits combat_won with exp/gold when all enemies die", () => {
    const weakEnemy = makeMonster({
      def: makeMonsterDef({ hp: 1, def: 0, exp: 20, gold: 10 }),
      currentHp: 1,
    });
    const combat = makeCombatState({ enemies: [weakEnemy] });
    const result = processPlayerAction(
      combat,
      { type: "attack", targetIndex: 0 },
      makePlayerStats({ atk: 100 }),
      constRng(0.5),
    );
    const wonEvent = result.events.find((e) => e.kind === "combat_won");
    expect(wonEvent).toBeDefined();
    if (wonEvent?.kind === "combat_won") {
      expect(wonEvent.expGained).toBe(20);
      expect(wonEvent.goldGained).toBe(10);
    }
  });

  it("falls back to first alive enemy when targeted enemy is dead", () => {
    const dead: MonsterState = makeMonster({ currentHp: 0 });
    const alive: MonsterState = makeMonster({ currentHp: 30 });
    const combat = makeCombatState({
      enemies: [dead, alive],
      turnOrder: [
        { kind: "player" },
        { kind: "enemy", index: 0 },
        { kind: "enemy", index: 1 },
      ],
    });
    const result = processPlayerAction(
      combat,
      { type: "attack", targetIndex: 0 }, // target dead enemy
      makePlayerStats(),
      constRng(0.5),
    );
    const dmgEvent = result.events.find((e) => e.kind === "damage_dealt");
    if (dmgEvent?.kind === "damage_dealt") {
      // Should have hit enemy at index 1 (first alive)
      expect(dmgEvent.targetIndex).toBe(1);
    }
  });
});

describe("processPlayerAction — flee (Note 6 regression)", () => {
  it("emits fled event on success", () => {
    const result = processPlayerAction(
      makeCombatState(),
      { type: "flee" },
      makePlayerStats(),
      fleeSuccessRng,
    );
    const fled = result.events.find((e) => e.kind === "fled");
    expect(fled).toBeDefined();
  });

  it("flee_failed: phase returns to 'selecting', NOT 'enemy_turn' (Note 6)", () => {
    resetFleeFailRng();
    const result = processPlayerAction(
      makeCombatState(),
      { type: "flee" },
      makePlayerStats(),
      fleeFailRng,
    );
    const failedEvent = result.events.find((e) => e.kind === "flee_failed");
    expect(failedEvent).toBeDefined();
    // Critical: phase must be "selecting" not "enemy_turn"
    expect(result.state.phase).toBe("selecting");
    expect(result.state.isPlayerTurn).toBe(true);
  });
});

describe("processPlayerAction — stun skill (Note 12 regression)", () => {
  it("buff_applied event comes BEFORE damage_dealt event", () => {
    const combat = makeCombatState({
      enemies: [makeMonster({ def: makeMonsterDef({ def: 0 }) })],
    });
    const result = processPlayerAction(
      combat,
      { type: "skill", skillId: "replace_magic_number", targetIndex: 0 },
      makePlayerStats({ mp: 10, atk: 10 }),
      constRng(0.5),
    );
    const buffIdx = result.events.findIndex((e) => e.kind === "buff_applied");
    const dmgIdx = result.events.findIndex((e) => e.kind === "damage_dealt");
    expect(buffIdx).toBeGreaterThanOrEqual(0);
    expect(dmgIdx).toBeGreaterThanOrEqual(0);
    expect(buffIdx).toBeLessThan(dmgIdx);
  });
});

describe("processPlayerAction — item usage", () => {
  it("emits item_used event and heals player HP", () => {
    const player = makePlayerStats({ hp: 50, maxHp: 100 });
    const result = processPlayerAction(
      makeCombatState(),
      { type: "item", itemId: "hp_potion" },
      player,
      constRng(0.5),
    );
    const itemEvent = result.events.find((e) => e.kind === "item_used");
    expect(itemEvent).toBeDefined();
    expect(result.newPlayerStats!.hp).toBe(80); // 50 + 30
  });
});

describe("processPlayerAction — companion", () => {
  it("emits companion_attack event when companionCombats > 0", () => {
    const result = processPlayerAction(
      makeCombatState(),
      { type: "attack", targetIndex: 0 },
      makePlayerStats({ atk: 10 }),
      constRng(0.5),
      false,
      1, // companionCombats
    );
    const companionEvent = result.events.find((e) => e.kind === "companion_attack");
    expect(companionEvent).toBeDefined();
  });

  it("does NOT emit companion_attack on flee action", () => {
    const result = processPlayerAction(
      makeCombatState(),
      { type: "flee" },
      makePlayerStats(),
      fleeSuccessRng,
      false,
      1,
    );
    const companionEvent = result.events.find((e) => e.kind === "companion_attack");
    expect(companionEvent).toBeUndefined();
  });
});

describe("processPlayerAction — boss circular_dep reflect", () => {
  it("emits damage_reflected after damaging circular_dep boss", () => {
    const boss = makeMonster({
      def: makeMonsterDef({ behavior: "boss_circular_dep", hp: 200, def: 0 }),
      currentHp: 200,
    });
    const combat = makeCombatState({ enemies: [boss] });
    const result = processPlayerAction(
      combat,
      { type: "attack", targetIndex: 0 },
      makePlayerStats({ atk: 10 }),
      constRng(0.5),
    );
    const reflectEvent = result.events.find((e) => e.kind === "damage_reflected");
    expect(reflectEvent).toBeDefined();
  });
});

describe("processPlayerAction — boss god_class phase shift", () => {
  it("emits boss_phase_shift at <75% HP", () => {
    const bossMaxHp = 200;
    const boss = makeMonster({
      def: makeMonsterDef({ behavior: "boss_god_class", hp: bossMaxHp, def: 0, atk: 5 }),
      currentHp: 149, // just under 75% (150)
    });
    const combat = makeCombatState({ enemies: [boss], bossPhase: 0 });
    // Do 1 point of damage to trigger threshold check
    const result = processPlayerAction(
      combat,
      { type: "attack", targetIndex: 0 },
      makePlayerStats({ atk: 1 }),
      constRng(0.5),
    );
    const phaseShift = result.events.find((e) => e.kind === "boss_phase_shift");
    expect(phaseShift).toBeDefined();
  });
});

describe("processEnemyTurn", () => {
  it("dead enemy skip returns empty events (Note 17)", () => {
    const dead = makeMonster({ currentHp: 0 });
    const combat = makeCombatState({
      enemies: [dead],
      isPlayerTurn: false,
      phase: "enemy_turn",
    });
    const result = processEnemyTurn(combat, 0, makePlayerStats(), constRng(0.5));
    expect(result.events).toHaveLength(0);
  });

  it("stunned enemy skips attack", () => {
    const stunned = makeMonster({
      buffs: [{ id: "stunned", name: "眩暈", turnsRemaining: 1, effect: "stunned" }],
    });
    const combat = makeCombatState({
      enemies: [stunned],
      isPlayerTurn: false,
      phase: "enemy_turn",
    });
    const result = processEnemyTurn(combat, 0, makePlayerStats(), constRng(0.5));
    // No damage_received event
    const dmgEvent = result.events.find((e) => e.kind === "damage_received");
    expect(dmgEvent).toBeUndefined();
    // Stun buff should be decremented
    const buffEvent = result.events.find(
      (e) => e.kind === "buff_applied" && e.kind === "buff_applied" && (e as { buffId: string }).buffId === "stunned",
    );
    expect(buffEvent).toBeDefined();
  });

  it("alive enemy deals damage to player", () => {
    const monster = makeMonster({ def: makeMonsterDef({ atk: 20, behavior: "swarm" }) });
    const combat = makeCombatState({
      enemies: [monster],
      isPlayerTurn: false,
      phase: "enemy_turn",
    });
    const result = processEnemyTurn(combat, 0, makePlayerStats({ def: 0 }), constRng(0.5));
    const dmgEvent = result.events.find((e) => e.kind === "damage_received");
    expect(dmgEvent).toBeDefined();
  });

  it("demo mode keeps player HP at minimum 1 (Note 13)", () => {
    const monster = makeMonster({ def: makeMonsterDef({ atk: 9999, behavior: "swarm" }) });
    const combat = makeCombatState({
      enemies: [monster],
      isPlayerTurn: false,
      phase: "enemy_turn",
    });
    const result = processEnemyTurn(
      combat,
      0,
      makePlayerStats({ hp: 100, def: 0 }),
      constRng(0.5),
      true, // isDemoMode
    );
    // Player should not die in demo mode — HP stays at 1
    expect(result.newPlayerStats?.hp).toBeGreaterThanOrEqual(1);
    const lostEvent = result.events.find((e) => e.kind === "combat_lost");
    expect(lostEvent).toBeUndefined();
  });

  it("combat_lost emitted when player HP reaches 0 (non-demo)", () => {
    const monster = makeMonster({ def: makeMonsterDef({ atk: 9999, behavior: "swarm" }) });
    const combat = makeCombatState({
      enemies: [monster],
      isPlayerTurn: false,
      phase: "enemy_turn",
    });
    const result = processEnemyTurn(
      combat,
      0,
      makePlayerStats({ hp: 1, def: 0 }),
      constRng(0.5),
      false,
    );
    const lostEvent = result.events.find((e) => e.kind === "combat_lost");
    expect(lostEvent).toBeDefined();
  });
});
