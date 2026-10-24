import { describe, it, expect } from "vitest";
import { clamp, makeNoise, lerpPath } from "./math";
import { MOUTH } from "./expressions";

describe("clamp", () => {
  it("mantém valores dentro dos limites", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(42, 0, 10)).toBe(10);
  });
});

describe("makeNoise", () => {
  it("produz valores contínuos no intervalo ~[-1, 1]", () => {
    const noise = makeNoise(123);
    for (let t = 0; t < 50; t += 0.37) {
      const v = noise(t);
      expect(v).toBeGreaterThanOrEqual(-1.0001);
      expect(v).toBeLessThanOrEqual(1.0001);
    }
  });

  it("é determinístico por seed", () => {
    expect(makeNoise(7)(2.5)).toBe(makeNoise(7)(2.5));
  });

  it("difere entre seeds (cada instância oscila diferente)", () => {
    expect(makeNoise(1)(2.5)).not.toBe(makeNoise(99)(2.5));
  });
});

describe("lerpPath", () => {
  it("retorna o path A quando o peso é ~0", () => {
    expect(lerpPath(MOUTH.idle, MOUTH.hyper, 0)).toBe(MOUTH.idle);
  });

  it("interpola cada número do path preservando os comandos SVG", () => {
    const out = lerpPath("M0 0 Q10 10 20 20", "M0 0 Q30 30 20 20", 0.5);
    expect(out).toBe("M0.00 0.00 Q20.00 20.00 20.00 20.00");
  });

  it("mistura MOUTH.idle → MOUTH.success a 50% (contagem de números estável)", () => {
    const nums = (s: string) => s.match(/-?\d+\.?\d*/g)!.length;
    const out = lerpPath(MOUTH.idle, MOUTH.success, 0.5);
    expect(nums(out)).toBe(nums(MOUTH.idle));
  });
});
