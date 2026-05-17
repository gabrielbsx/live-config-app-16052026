import { type Express } from "express";
import { InMemoryPlayerRepository } from "../../infrastructure/database/in-memory/in-memory-player.repository.js";
import { ZodPaginationValidation } from "../../infrastructure/validator/zod/zod-pagination.validation.js";
import { ListPlayersUseCase } from "../../application/use-case/list-players.use-case.js";
import { ListPlayersController } from "../../presentation/controller/list-players.controller.js";
import { ExpressControllerWrapperHttp } from "../../infrastructure/http/express/express-controller-wrapper.http.js";

export const listPlayersFactoryRoute = (app: Express) => {
  const inMemoryPlayerRepository = new InMemoryPlayerRepository();
  const zodPaginationValidation = new ZodPaginationValidation();
  const listPlayersUseCase = new ListPlayersUseCase(inMemoryPlayerRepository);
  const listPlayersController = new ListPlayersController(
    zodPaginationValidation,
    listPlayersUseCase,
  );
  const expressControllerWrapped = new ExpressControllerWrapperHttp(
    listPlayersController,
  );

  app.get(
    "/player",
    expressControllerWrapped.handle.bind(expressControllerWrapped),
  );
};
