import type { UpdatePlayerUseCase } from "@/application/use-case/update-player.use-case.js";
import type { Validation } from "../contract/validation.js";
import type { Controller } from "../contract/controller.js";
import type { Request, Response } from "../contract/http.js";
import type { CreatePlayerValidation } from "../validation/create-player.validation.js";
import { ok } from "../http/response.js";

export class UpdatePlayerController implements Controller {
  constructor(
    private readonly _updatePlayerUseCase: UpdatePlayerUseCase,
    private readonly _idValidation: Validation<{ id: string }>,
    private readonly _bodyValidation: CreatePlayerValidation,
  ) {}

  async handle(request: Request): Promise<Response> {
    const { id } = this._idValidation.validate(request.params);
    const body = this._bodyValidation.validate(request.body);

    const result = await this._updatePlayerUseCase.execute({
      ...body,
      id,
      actor: request.actor,
    });

    return ok(result);
  }
}
