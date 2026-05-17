import type { DeletePlayerUseCase } from "@/application/use-case/delete-player.use-case.js";
import type { Validation } from "../contract/validation.js";
import type { Controller } from "../contract/controller.js";
import type { Request, Response } from "../contract/http.js";
import { noContent } from "../http/response.js";

export class DeletePlayerController implements Controller {
  constructor(
    private readonly _deletePlayerUseCase: DeletePlayerUseCase,
    private readonly _idValidation: Validation<{ id: string }>,
  ) {}

  async handle(request: Request): Promise<Response> {
    const { id } = this._idValidation.validate(request.params);
    await this._deletePlayerUseCase.execute({ id, actor: request.actor });
    return noContent();
  }
}
