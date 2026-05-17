import { CreatePlayerUseCase } from "@/application/use-case/create-player.use-case.js";
import { ExpressControllerWrapperHttp } from "@/infrastructure/http/express/express-controller-wrapper.http.js";
import { ZodCreatePlayerValidation } from "@/infrastructure/validator/zod/zod-create-player.validation.js";
import { CreatePlayerController } from "@/presentation/controller/create-player.controller.js";
import { type Express } from "express";
import { inMemoryPlayerRepository } from "./composition-root.js";

export const createPlayerFactoryRoute = (app: Express) => {
  const zodCreatePlayerValidation = new ZodCreatePlayerValidation();
  const createPlayerUseCase = new CreatePlayerUseCase(inMemoryPlayerRepository);
  const createPlayerController = new CreatePlayerController(
    createPlayerUseCase,
    zodCreatePlayerValidation,
  );
  const wrapped = new ExpressControllerWrapperHttp(createPlayerController);

  app.post("/player", wrapped.handle);
};
