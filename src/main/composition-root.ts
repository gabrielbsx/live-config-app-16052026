import type { RequestHandler } from "express";
import { CreatePlayerUseCase } from "@/application/use-case/create-player.use-case.js";
import { DeletePlayerUseCase } from "@/application/use-case/delete-player.use-case.js";
import { GetPlayerUseCase } from "@/application/use-case/get-player.use-case.js";
import { ListPlayersUseCase } from "@/application/use-case/list-players.use-case.js";
import { UpdatePlayerUseCase } from "@/application/use-case/update-player.use-case.js";
import type { EventPublisher } from "@/domain/event/event-publisher.js";
import type { PlayerRepository } from "@/domain/repository/player.repository.js";
import { InMemoryPlayerRepository } from "@/infrastructure/database/in-memory/in-memory-player.repository.js";
import { InMemoryEventPublisher } from "@/infrastructure/event/in-memory-event-publisher.js";
import { ExpressControllerWrapperHttp } from "@/infrastructure/http/express/express-controller-wrapper.http.js";
import { ZodCreatePlayerValidation } from "@/infrastructure/validator/zod/zod-create-player.validation.js";
import { ZodPaginationValidation } from "@/infrastructure/validator/zod/zod-pagination.validation.js";
import { ZodPlayerIdValidation } from "@/infrastructure/validator/zod/zod-player-id.validation.js";
import { CreatePlayerController } from "@/presentation/controller/create-player.controller.js";
import { DeletePlayerController } from "@/presentation/controller/delete-player.controller.js";
import { GetPlayerController } from "@/presentation/controller/get-player.controller.js";
import { ListPlayersController } from "@/presentation/controller/list-players.controller.js";
import { UpdatePlayerController } from "@/presentation/controller/update-player.controller.js";
import type { Controller } from "@/presentation/contract/controller.js";
import { logger } from "@/infrastructure/logger/logger.js";

export type CompositionRootDeps = Readonly<{
  playerRepository?: PlayerRepository;
  eventPublisher?: EventPublisher;
}>;

export type Handlers = Readonly<{
  createPlayer: RequestHandler;
  listPlayers: RequestHandler;
  getPlayer: RequestHandler;
  updatePlayer: RequestHandler;
  deletePlayer: RequestHandler;
}>;

const wrap = (controller: Controller): RequestHandler =>
  new ExpressControllerWrapperHttp(controller).handle;

export const createCompositionRoot = (
  deps: CompositionRootDeps = {},
): Handlers => {
  const playerRepository =
    deps.playerRepository ?? new InMemoryPlayerRepository();
  const eventPublisher = deps.eventPublisher ?? buildDefaultPublisher();

  const createPlayerValidation = new ZodCreatePlayerValidation();
  const playerIdValidation = new ZodPlayerIdValidation();
  const paginationValidation = new ZodPaginationValidation();

  const createPlayerUseCase = new CreatePlayerUseCase(
    playerRepository,
    eventPublisher,
  );
  const listPlayersUseCase = new ListPlayersUseCase(playerRepository);
  const getPlayerUseCase = new GetPlayerUseCase(playerRepository);
  const updatePlayerUseCase = new UpdatePlayerUseCase(
    playerRepository,
    eventPublisher,
  );
  const deletePlayerUseCase = new DeletePlayerUseCase(
    playerRepository,
    eventPublisher,
  );

  return {
    createPlayer: wrap(
      new CreatePlayerController(createPlayerUseCase, createPlayerValidation),
    ),
    listPlayers: wrap(
      new ListPlayersController(paginationValidation, listPlayersUseCase),
    ),
    getPlayer: wrap(
      new GetPlayerController(getPlayerUseCase, playerIdValidation),
    ),
    updatePlayer: wrap(
      new UpdatePlayerController(
        updatePlayerUseCase,
        playerIdValidation,
        createPlayerValidation,
      ),
    ),
    deletePlayer: wrap(
      new DeletePlayerController(deletePlayerUseCase, playerIdValidation),
    ),
  };
};

const buildDefaultPublisher = (): EventPublisher => {
  const publisher = new InMemoryEventPublisher();
  publisher.subscribe("player.created", (e) =>
    logger.info({ event: e.name, aggregateId: e.aggregateId }, "Player created"),
  );
  publisher.subscribe("player.updated", (e) =>
    logger.info({ event: e.name, aggregateId: e.aggregateId }, "Player updated"),
  );
  publisher.subscribe("player.soft-deleted", (e) =>
    logger.info(
      { event: e.name, aggregateId: e.aggregateId },
      "Player soft-deleted",
    ),
  );
  return publisher;
};
