import { describe, expect, it } from "vitest";
import {
  EVOLUTION_STAGES,
  Evolution,
  type EvolutionStage,
} from "./evolution.js";

describe("Evolution", () => {
  it.each(EVOLUTION_STAGES)("wraps stage '%s'", (stage) => {
    const vo = new Evolution(stage);
    expect(vo.value).toBe(stage);
  });

  it("is frozen (immutable)", () => {
    const vo = new Evolution("pro");
    expect(Object.isFrozen(vo)).toBe(true);
    expect(() => {
      (vo as unknown as { value: EvolutionStage }).value = "legend";
    }).toThrow();
  });

  it("rank reflects EVOLUTION_STAGES order", () => {
    expect(new Evolution("rookie").rank).toBe(0);
    expect(new Evolution("legend").rank).toBe(3);
  });

  it("canTransitionTo allows forward and same stage, blocks regression", () => {
    const pro = new Evolution("pro");
    expect(pro.canTransitionTo("legend")).toBe(true);
    expect(pro.canTransitionTo("pro")).toBe(true);
    expect(pro.canTransitionTo("rookie")).toBe(false);
  });

  it("next() returns the next stage, null at terminal", () => {
    expect(new Evolution("rookie").next()?.value).toBe("amateur");
    expect(new Evolution("legend").next()).toBeNull();
  });

  it("equals other VO with same value", () => {
    const a = new Evolution("pro");
    const b = new Evolution("pro");
    expect(a.equals(b)).toBe(true);
  });

  it("not equal to VO with different value", () => {
    const a = new Evolution("pro");
    const b = new Evolution("rookie");
    expect(a.equals(b)).toBe(false);
  });

  it("not equal to null/undefined", () => {
    const a = new Evolution("pro");
    expect(a.equals(null)).toBe(false);
    expect(a.equals(undefined)).toBe(false);
  });
});
