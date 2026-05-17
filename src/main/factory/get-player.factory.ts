import { type Express } from "express";
import { GetPlayerUseCase } from "@/application/use-case/get-player.use-case.js";
import { ExpressControllerWrapperHttp } from "@/infrastructure/http/express/express-controller-wrapper.http.js";
import { ZodPlayerIdValidation } from "@/infrastructure/validator/zod/zod-player-id.validation.js";
import { GetPlayerController } from "@/presentation/controller/get-player.controller.js";
import { inMemoryPlayerRepository } from "./composition-root.js";

export const getPlayerFactoryRoute = (app: Express) => {
  const idValidation = new ZodPlayerIdValidation();
  const useCase = new GetPlayerUseCase(inMemoryPlayerRepository);
  const controller = new GetPlayerController(useCase, idValidation);
  const wrapped = new ExpressControllerWrapperHttp(controller);

  app.get("/player/:id", wrapped.handle);
};
