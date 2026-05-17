import { describe, expect, it } from "vitest";
import { ValidationException } from "@/presentation/exception/validation.exception.js";
import { ZodCreatePlayerValidation } from "./zod-create-player.validation.js";

const validation = new ZodCreatePlayerValidation();

const valid = {
  name: "Alice",
  nickname: "Aly",
  level: 10,
  evolution: "pro",
};

describe("ZodCreatePlayerValidation", () => {
  it("parses valid input", () => {
    const result = validation.validate(valid);
    expect(result).toEqual(valid);
  });

  it("trims string fields", () => {
    const result = validation.validate({
      ...valid,
      name: "  Alice  ",
      nickname: "  Aly  ",
    });
    expect(result.name).toBe("Alice");
    expect(result.nickname).toBe("Aly");
  });

  it("rejects empty name", () => {
    expect(() => validation.validate({ ...valid, name: "" })).toThrowError(
      ValidationException,
    );
  });

  it("rejects level below 1", () => {
    expect(() => validation.validate({ ...valid, level: 0 })).toThrowError(
      ValidationException,
    );
  });

  it("rejects level above 999", () => {
    expect(() => validation.validate({ ...valid, level: 1000 })).toThrowError(
      ValidationException,
    );
  });

  it("rejects unknown evolution", () => {
    expect(() =>
      validation.validate({ ...valid, evolution: "god" }),
    ).toThrowError(ValidationException);
  });

  it("aggregates multiple errors", () => {
    try {
      validation.validate({
        name: "",
        nickname: "",
        level: -1,
        evolution: "x",
      });
      expect.fail("should have thrown");
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationException);
      const ve = e as ValidationException;
      const issues = ve.issues as Array<{ path: string[] }>;
      expect(issues.length).toBeGreaterThanOrEqual(3);
    }
  });
});
