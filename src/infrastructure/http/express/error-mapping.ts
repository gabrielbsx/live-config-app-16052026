import { ApplicationException } from "@/application/exception/application.exception.js";
import { NotFoundException } from "@/application/exception/not-found.exception.js";
import { DomainException } from "@/domain/exception/domain.exception.js";
import { InfrastructureException } from "@/infrastructure/exception/infrastructure.exception.js";
import { ValidationException } from "@/presentation/exception/validation.exception.js";

export type ErrorMapEntry = {
  type: new (...args: never[]) => Error;
  status: number;
  body: (error: Error) => Record<string, unknown>;
  log?: "error" | "warn";
};

const basicBody = (error: Error) => ({
  error: error.name,
  message: error.message,
});

export const errorMap: readonly ErrorMapEntry[] = [
  {
    type: ValidationException,
    status: 400,
    body: (error) => ({
      error: error.name,
      message: error.message,
      issues: (error as ValidationException).issues ?? undefined,
    }),
  },
  { type: NotFoundException, status: 404, body: basicBody },
  { type: DomainException, status: 422, body: basicBody },
  { type: ApplicationException, status: 409, body: basicBody },
  {
    type: InfrastructureException,
    status: 503,
    body: () => ({
      error: "InfrastructureException",
      message: "Service unavailable",
    }),
    log: "error",
  },
];
