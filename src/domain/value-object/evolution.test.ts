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

  it("rank reflects EVOLUTION_STAGES order", () => {
    expect(new EvolutionValueObject("rookie").rank).toBe(0);
    expect(new EvolutionValueObject("legend").rank).toBe(3);
  });

  it("canTransitionTo allows forward and same stage, blocks regression", () => {
    const pro = new EvolutionValueObject("pro");
    expect(pro.canTransitionTo("legend")).toBe(true);
    expect(pro.canTransitionTo("pro")).toBe(true);
    expect(pro.canTransitionTo("rookie")).toBe(false);
  });

  it("next() returns the next stage, null at terminal", () => {
    expect(new EvolutionValueObject("rookie").next()?.value).toBe("amateur");
    expect(new EvolutionValueObject("legend").next()).toBeNull();
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
