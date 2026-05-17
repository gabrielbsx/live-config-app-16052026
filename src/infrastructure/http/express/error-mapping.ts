import type { ZodIssue } from "zod";
import { ApplicationException } from "@/application/exception/application.exception.js";
import { NotFoundException } from "@/application/exception/not-found.exception.js";
import { DomainException } from "@/domain/exception/domain.exception.js";
import { InfrastructureException } from "@/infrastructure/exception/infrastructure.exception.js";
import { ValidationException } from "@/presentation/exception/validation.exception.js";

export type ErrorResponseBody = {
  error: string;
  message: string;
  issues?: readonly ZodIssue[];
};

export type ErrorMapEntry<TError extends Error = Error> = {
  type: new (...args: never[]) => TError;
  status: number;
  body: (error: TError) => ErrorResponseBody;
  log?: "error" | "warn";
};

const basicBody = <E extends Error>(error: E): ErrorResponseBody => ({
  error: error.name,
  message: error.message,
});

const validationBody = (error: ValidationException): ErrorResponseBody => ({
  error: error.name,
  message: error.message,
  ...(error.issues ? { issues: error.issues } : {}),
});

const infrastructureBody = (): ErrorResponseBody => ({
  error: "InfrastructureException",
  message: "Service unavailable",
});

export const errorMap: readonly ErrorMapEntry[] = [
  { type: ValidationException, status: 400, body: validationBody as ErrorMapEntry["body"] },
  { type: NotFoundException, status: 404, body: basicBody },
  { type: DomainException, status: 422, body: basicBody },
  { type: ApplicationException, status: 409, body: basicBody },
  {
    type: InfrastructureException,
    status: 503,
    body: infrastructureBody,
    log: "error",
  },
];
