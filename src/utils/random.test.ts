import { describe, it, expect } from "vitest";
import { createRng, randomInt } from "./random";

describe("createRng", () => {
  it("same seed produces same sequence", () => {
    const a = createRng(42);
    const b = createRng(42);
    expect(a()).toBe(b());
    expect(a()).toBe(b());
    expect(a()).toBe(b());
  });

  it("different seeds produce different values", () => {
    const a = createRng(1);
    const b = createRng(2);
    const va = a();
    const vb = b();
    expect(va).not.toBe(vb);
  });

  it("returns values in [0, 1) range", () => {
    const rng = createRng(99);
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("randomInt", () => {
  it("returns value within [min, max] inclusive", () => {
    const rng = createRng(7);
    for (let i = 0; i < 200; i++) {
      const v = randomInt(rng, 1, 6);
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(6);
    }
  });

  it("can return min value", () => {
    // constRng(0) => floor(0 * 1) + 5 = 5
    const alwaysZero = () => 0;
    expect(randomInt(alwaysZero, 5, 10)).toBe(5);
  });

  it("can return max value", () => {
    // constRng(0.9999) => floor(0.9999 * 6) + 1 = 6 + 1 ... wait
    // randomInt: floor(rng() * (max - min + 1)) + min
    // rng=0.999, max-min+1=1, floor(0.999 * 1)=0, +5 = 5. Let me try a range >1
    // min=5, max=7: floor(0.999 * 3) + 5 = 2 + 5 = 7
    const nearOne = () => 0.9999;
    expect(randomInt(nearOne, 5, 7)).toBe(7);
  });
});
