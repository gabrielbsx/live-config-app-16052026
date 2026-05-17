import { describe, expect, it } from "vitest";
import { ValidationException } from "@/presentation/exception/validation.exception.js";
import { ZodPaginationValidation } from "./zod-pagination.validation.js";

const validation = new ZodPaginationValidation();

describe("ZodPaginationValidation", () => {
  it("coerces strings to numbers", () => {
    const result = validation.validate({ page: "2", limit: "20" });
    expect(result).toEqual({ page: 2, limit: 20 });
  });

  it("accepts numbers", () => {
    const result = validation.validate({ page: 1, limit: 10 });
    expect(result).toEqual({ page: 1, limit: 10 });
  });

  it("rejects zero page", () => {
    expect(() => validation.validate({ page: 0, limit: 10 })).toThrowError(
      ValidationException,
    );
  });

  it("rejects negative limit", () => {
    expect(() => validation.validate({ page: 1, limit: -5 })).toThrowError(
      ValidationException,
    );
  });

  it("rejects non-integer page", () => {
    expect(() => validation.validate({ page: 1.5, limit: 10 })).toThrowError(
      ValidationException,
    );
  });
});
