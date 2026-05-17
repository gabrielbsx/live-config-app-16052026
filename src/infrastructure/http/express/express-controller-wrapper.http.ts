import type { Request, Response } from "express";
import type { Controller } from "@/presentation/contract/controller.js";

export class ExpressControllerWrapperHttp {
  constructor(private readonly _controller: Controller) {}

  public async handle(request: Request, response: Response) {
    try {
      const { statusCode, body: data } = await this._controller.handle({
        body: request.body,
        params: request.params,
        headers: request.headers as Record<string, unknown>,
        query: request.query,
      });

      return response.status(statusCode).json(data);
    } catch (error) {
      console.error("Error in ControllerWrapperHttp:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      return response.status(500).json({ error: message });
    }
  }
}
