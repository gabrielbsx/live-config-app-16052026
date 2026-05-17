import { CreatePlayerUseCase } from "../../application/use-case/create-player.use-case.js";
import { InMemoryPlayerRepository } from "../../infrastructure/database/in-memory/in-memory-player.repository.js";
import { ExpressControllerWrapperHttp } from "../../infrastructure/http/express/express-controller-wrapper.http.js";
import { ZodCreatePlayerValidation } from "../../infrastructure/validator/zod/zod-create-player.validation.js";
import { CreatePlayerController } from "../../presentation/controller/create-player.controller.js";
import { type Express } from "express";

export const createPlayerFactoryRoute = (app: Express) => {
  const inMemoryPlayerRepository = new InMemoryPlayerRepository();
  const zodCreatePlayerValidation = new ZodCreatePlayerValidation();
  const createPlayerUseCase = new CreatePlayerUseCase(inMemoryPlayerRepository);
  const createPlayerController = new CreatePlayerController(
    createPlayerUseCase,
    zodCreatePlayerValidation,
  );
  const expressControllerWrapped = new ExpressControllerWrapperHttp(
    createPlayerController,
  );

  app.post(
    "/player",
    expressControllerWrapped.handle.bind(expressControllerWrapped),
  );
};
