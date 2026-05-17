import { type Express } from "express";
import { UpdatePlayerUseCase } from "@/application/use-case/update-player.use-case.js";
import { ExpressControllerWrapperHttp } from "@/infrastructure/http/express/express-controller-wrapper.http.js";
import { ZodCreatePlayerValidation } from "@/infrastructure/validator/zod/zod-create-player.validation.js";
import { ZodPlayerIdValidation } from "@/infrastructure/validator/zod/zod-player-id.validation.js";
import { UpdatePlayerController } from "@/presentation/controller/update-player.controller.js";
import { inMemoryPlayerRepository } from "./composition-root.js";

export const updatePlayerFactoryRoute = (app: Express) => {
  const idValidation = new ZodPlayerIdValidation();
  const bodyValidation = new ZodCreatePlayerValidation();
  const useCase = new UpdatePlayerUseCase(inMemoryPlayerRepository);
  const controller = new UpdatePlayerController(
    useCase,
    idValidation,
    bodyValidation,
  );
  const wrapped = new ExpressControllerWrapperHttp(controller);

  app.put("/player/:id", wrapped.handle);
};
