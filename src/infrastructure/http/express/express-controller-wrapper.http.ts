import type { Request, Response } from "express";
import type { Controller } from "@/presentation/contract/controller.js";
import { ValidationException } from "@/presentation/exception/validation.exception.js";
import { NotFoundException } from "@/domain/exception/not-found.exception.js";
import { DomainException } from "@/domain/exception/domain.exception.js";
import { ApplicationException } from "@/domain/exception/application.exception.js";
import { InfrastructureException } from "@/domain/exception/infrastructure.exception.js";
import { logger } from "@/infrastructure/logger/logger.js";

export class ExpressControllerWrapperHttp {
  constructor(private readonly _controller: Controller) {}

  public handle = async (request: Request, response: Response) => {
    try {
      const { statusCode, body } = await this._controller.handle({
        body: request.body,
        params: request.params,
        headers: request.headers as Record<string, unknown>,
        query: request.query,
      });

      return response.status(statusCode).json(body);
    } catch (error) {
      return this._handleError(error, response);
    }
  };

  private _handleError(error: unknown, response: Response) {
    if (error instanceof ValidationException) {
      return response.status(400).json({
        error: error.name,
        message: error.message,
        issues: error.issues ?? undefined,
      });
    }

    if (error instanceof NotFoundException) {
      return response.status(404).json({
        error: error.name,
        message: error.message,
      });
    }

    if (error instanceof DomainException) {
      return response.status(422).json({
        error: error.name,
        message: error.message,
      });
    }

    if (error instanceof ApplicationException) {
      return response.status(409).json({
        error: error.name,
        message: error.message,
      });
    }

    if (error instanceof InfrastructureException) {
      logger.error({ err: error }, "Infrastructure failure");
      return response.status(503).json({
        error: error.name,
        message: "Service unavailable",
      });
    }

    logger.error({ err: error }, "Unhandled error in controller wrapper");
    return response.status(500).json({
      error: "InternalServerError",
      message: "Unexpected error",
    });
  }
}
