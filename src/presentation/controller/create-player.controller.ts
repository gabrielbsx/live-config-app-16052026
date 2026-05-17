import { ok } from "node:assert";
import type { CreatePlayerUseCase } from "../../application/use-case/create-player.use-case.js";
import type { Controller } from "../contract/controller.js";
import type { Request, Response } from "../contract/http.js";
import type { CreatePlayerValidation } from "../validation/create-player.validation.js";
import { created } from "../http/response.js";

export class CreatePlayerController implements Controller {
  constructor(
    private readonly _createPlayerUseCase: CreatePlayerUseCase,
    private readonly _createPlayerValidation: CreatePlayerValidation,
  ) {}

  public async handle(request: Request): Promise<Response> {
    const payload = this._createPlayerValidation.validate(request.body);

    const id = await this._createPlayerUseCase.execute(payload);

    return created({ id });
  }
}
