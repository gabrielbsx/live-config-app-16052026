import type { ListPlayersUseCase } from "../../application/use-case/list-players.use-case.js";
import type { Controller } from "../contract/controller.js";
import type { Request, Response } from "../contract/http.js";
import { ok } from "../http/response.js";
import type { PaginationValidation } from "../validation/pagination.validation.js";

export class ListPlayersController implements Controller {
  constructor(
    private readonly _paginationValidation: PaginationValidation,
    private readonly _listPlayersUseCase: ListPlayersUseCase,
  ) {}

  public async handle(request: Request): Promise<Response> {
    const paginationInput = await this._paginationValidation.validate(
      request.query,
    );

    const result = await this._listPlayersUseCase.execute(paginationInput);

    return ok(result);
  }
}
