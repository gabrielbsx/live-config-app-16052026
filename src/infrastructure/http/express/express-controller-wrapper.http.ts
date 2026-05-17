import type { Request, Response } from "express";
import type { Controller } from "@/presentation/contract/controller.js";
import { SYSTEM_ACTOR } from "@/domain/entity/actor.js";
import { logger } from "@/infrastructure/logger/logger.js";
import { errorMap, type ErrorMapEntry } from "./error-mapping.js";

type ErrorCtor = new (...args: never[]) => Error;

const entryByCtor = new Map<ErrorCtor, ErrorMapEntry>();
for (const entry of errorMap) {
  entryByCtor.set(entry.type, entry);
}

const findEntry = (error: Error): ErrorMapEntry | undefined => {
  let ctor: ErrorCtor | null = error.constructor as ErrorCtor;
  while (ctor) {
    const entry = entryByCtor.get(ctor);
    if (entry) return entry;
    const parent = Object.getPrototypeOf(ctor) as ErrorCtor | null;
    if (!parent || parent === Object.prototype) return undefined;
    ctor = parent;
  }
  return undefined;
};

export class ExpressControllerWrapperHttp {
  constructor(private readonly _controller: Controller) {}

  public handle = async (request: Request, response: Response) => {
    try {
      const { statusCode, body } = await this._controller.handle({
        body: request.body,
        params: request.params as Record<string, string>,
        query: request.query,
        actor: response.locals.actor ?? SYSTEM_ACTOR,
      });

      return response.status(statusCode).json(body);
    } catch (error) {
      return this._handleError(error, response);
    }
  };

  private _handleError(error: unknown, response: Response) {
    if (error instanceof Error) {
      const entry = findEntry(error);
      if (entry) {
        if (entry.log === "error") {
          logger.error({ err: error }, "Mapped failure");
        }
        return response.status(entry.status).json(entry.body(error));
      }
    }

    logger.error({ err: error }, "Unhandled error in controller wrapper");
    return response.status(500).json({
      error: "InternalServerError",
      message: "Unexpected error",
    });
  }
}
