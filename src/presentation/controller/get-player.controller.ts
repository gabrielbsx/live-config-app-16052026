import type { GetPlayerUseCase } from "@/application/use-case/get-player.use-case.js";
import type { Validation } from "../contract/validation.js";
import type { Controller } from "../contract/controller.js";
import type { Request, Response } from "../contract/http.js";
import { ok } from "../http/response.js";

export class GetPlayerController implements Controller {
  constructor(
    private readonly _getPlayerUseCase: GetPlayerUseCase,
    private readonly _idValidation: Validation<{ id: string }>,
  ) {}

  async handle(request: Request): Promise<Response> {
    const { id } = this._idValidation.validate(request.params);
    const player = await this._getPlayerUseCase.execute({ id });
    return ok(player);
  }
}
