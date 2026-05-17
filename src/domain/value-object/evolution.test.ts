import { describe, expect, it } from "vitest";
import {
  EVOLUTION_STAGES,
  EvolutionValueObject,
  type EvolutionStage,
} from "./evolution.js";

describe("EvolutionValueObject", () => {
  it.each(EVOLUTION_STAGES)("wraps stage '%s'", (stage) => {
    const vo = new EvolutionValueObject(stage);
    expect(vo.value).toBe(stage);
  });

  it("is frozen (immutable)", () => {
    const vo = new EvolutionValueObject("pro");
    expect(Object.isFrozen(vo)).toBe(true);
    expect(() => {
      (vo as unknown as { value: EvolutionStage }).value = "legend";
    }).toThrow();
  });

  it("equals other VO with same value", () => {
    const a = new EvolutionValueObject("pro");
    const b = new EvolutionValueObject("pro");
    expect(a.equals(b)).toBe(true);
  });

  it("not equal to VO with different value", () => {
    const a = new EvolutionValueObject("pro");
    const b = new EvolutionValueObject("rookie");
    expect(a.equals(b)).toBe(false);
  });

  it("not equal to null/undefined", () => {
    const a = new EvolutionValueObject("pro");
    expect(a.equals(null)).toBe(false);
    expect(a.equals(undefined)).toBe(false);
  });
});
