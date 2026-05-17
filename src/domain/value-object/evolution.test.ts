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
});
