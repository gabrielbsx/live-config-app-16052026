import { describe, expect, it, vi } from "vitest";
import type { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { ApplicationException } from "@/application/exception/application.exception.js";
import { NotFoundException } from "@/application/exception/not-found.exception.js";
import { DomainException } from "@/domain/exception/domain.exception.js";
import { InfrastructureException } from "@/infrastructure/exception/infrastructure.exception.js";
import { ValidationException } from "@/presentation/exception/validation.exception.js";
import type { Controller } from "@/presentation/contract/controller.js";
import { ExpressControllerWrapperHttp } from "./express-controller-wrapper.http.js";

const fakeRequest = (): ExpressRequest =>
  ({
    body: {},
    params: {},
    headers: {},
    query: {},
  }) as unknown as ExpressRequest;

const fakeResponse = (): ExpressResponse => {
  const res: Partial<ExpressResponse> = {
    locals: {},
  };
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as ExpressResponse;
};

const wrapThrower = (error: Error) => {
  const controller: Controller = {
    handle: vi.fn().mockRejectedValue(error),
  };
  return new ExpressControllerWrapperHttp(controller);
};

describe("ExpressControllerWrapperHttp error mapping", () => {
  it.each([
    [new ValidationException("bad", [{ path: "name" }]), 400],
    [new NotFoundException("Player", "abc"), 404],
    [new DomainException("rule broken"), 422],
    [new ApplicationException("conflict"), 409],
    [new InfrastructureException("db down"), 503],
  ])("maps %s to status %i", async (error, expected) => {
    const wrapper = wrapThrower(error);
    const res = fakeResponse();

    await wrapper.handle(fakeRequest(), res);

    expect(res.status).toHaveBeenCalledWith(expected);
  });

  it("includes issues for ValidationException body", async () => {
    const issues = [{ path: ["x"], message: "nope" }];
    const wrapper = wrapThrower(new ValidationException("bad", issues));
    const res = fakeResponse();

    await wrapper.handle(fakeRequest(), res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ issues }),
    );
  });

  it("falls back to 500 for unknown errors", async () => {
    const wrapper = wrapThrower(new Error("boom"));
    const res = fakeResponse();

    await wrapper.handle(fakeRequest(), res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "InternalServerError" }),
    );
  });

  it("hides infrastructure error details", async () => {
    const wrapper = wrapThrower(new InfrastructureException("internal SQL X"));
    const res = fakeResponse();

    await wrapper.handle(fakeRequest(), res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Service unavailable" }),
    );
  });
});
