import type { ListPlayersUseCase } from "../../application/use-case/list-players.use-case.js";
import type { Controller } from "../contract/controller.js";
import type { Request, Response } from "../contract/http.js";
import { ok } from "../http/response.js";
import type { PaginationValidation } from "../validation/pagination.validation.js";

export class ListPlayersController implements Controller {
  constructor(
    private readonly _listPlayersUseCase: ListPlayersUseCase,
    private readonly _paginationValidation: PaginationValidation,
  ) {}

  public async handle(request: Request): Promise<Response> {
    const paginationInput = this._paginationValidation.validate(request.query);
    const result = await this._listPlayersUseCase.execute(paginationInput);
    return ok(result);
  }
}
