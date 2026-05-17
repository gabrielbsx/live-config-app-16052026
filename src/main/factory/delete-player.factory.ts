import { type Express } from "express";
import { DeletePlayerUseCase } from "@/application/use-case/delete-player.use-case.js";
import { ExpressControllerWrapperHttp } from "@/infrastructure/http/express/express-controller-wrapper.http.js";
import { ZodPlayerIdValidation } from "@/infrastructure/validator/zod/zod-player-id.validation.js";
import { DeletePlayerController } from "@/presentation/controller/delete-player.controller.js";
import { inMemoryPlayerRepository } from "./composition-root.js";

export const deletePlayerFactoryRoute = (app: Express) => {
  const idValidation = new ZodPlayerIdValidation();
  const useCase = new DeletePlayerUseCase(inMemoryPlayerRepository);
  const controller = new DeletePlayerController(useCase, idValidation);
  const wrapped = new ExpressControllerWrapperHttp(controller);

  app.delete("/player/:id", wrapped.handle);
};
