import type { Request, Response } from "express";
import type { Controller } from "@/presentation/contract/controller.js";
import { SYSTEM_ACTOR } from "@/domain/entity/actor.js";
import { logger } from "@/infrastructure/logger/logger.js";
import { errorMap } from "./error-mapping.js";

export class ExpressControllerWrapperHttp {
  constructor(private readonly _controller: Controller) {}

  public handle = async (request: Request, response: Response) => {
    try {
      const { statusCode, body } = await this._controller.handle({
        body: request.body,
        params: request.params,
        headers: request.headers as Record<string, unknown>,
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
      const entry = errorMap.find((e) => error instanceof e.type);
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
