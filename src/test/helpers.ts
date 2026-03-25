import { createRng } from "../utils/random";
import type {
  MonsterState,
  PlayerStats,
  CombatState,
  MonsterDef,
  TurnOrderEntry,
} from "../utils/types";

export function makeRng(seed = 42) {
  return createRng(seed);
}

// RNG that always returns a fixed value (0.0 – 1.0 exclusive)
export function constRng(value: number) {
  return () => value;
}

export function makePlayerStats(overrides?: Partial<PlayerStats>): PlayerStats {
  return {
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    atk: 15,
    def: 8,
    spd: 10,
    level: 1,
    exp: 0,
    expToNext: 30,
    gold: 0,
    ...overrides,
  };
}

export function makeMonsterDef(overrides?: Partial<MonsterDef>): MonsterDef {
  return {
    id: "test_monster",
    name: "Test Monster",
    description: "A test monster",
    hp: 50,
    atk: 10,
    def: 5,
    spd: 8,
    exp: 10,
    gold: 5,
    behavior: "swarm",
    spriteId: "test",
    spriteSize: 32,
    ...overrides,
  };
}

export function makeMonster(overrides?: Partial<MonsterState>): MonsterState {
  return {
    def: makeMonsterDef(),
    currentHp: 50,
    position: { x: 0, y: 0 },
    buffs: [],
    stunResistance: 0,
    ...overrides,
  };
}

export function makeCombatState(overrides?: Partial<CombatState>): CombatState {
  const turnOrder: TurnOrderEntry[] = [
    { kind: "player" },
    { kind: "enemy", index: 0 },
  ];
  return {
    enemies: [makeMonster()],
    turn: 1,
    isPlayerTurn: true,
    log: { entries: [] },
    phase: "selecting",
    turnOrder,
    currentTurnIndex: 0,
    selectedTarget: 0,
    revealedEnemies: [],
    bossEntangledTurns: 0,
    floorMonsterIndex: 0,
    playerDodgeTurns: 0,
    bossPhase: 0,
    ...overrides,
  };
}
