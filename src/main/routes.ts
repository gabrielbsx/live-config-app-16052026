import { type Express } from "express";
import { logger } from "@/infrastructure/logger/logger.js";
import { createPlayerFactoryRoute } from "./factory/create-player.factory.js";
import { listPlayersFactoryRoute } from "./factory/list-players.factory.js";
import { getPlayerFactoryRoute } from "./factory/get-player.factory.js";
import { updatePlayerFactoryRoute } from "./factory/update-player.factory.js";
import { deletePlayerFactoryRoute } from "./factory/delete-player.factory.js";

export const routes = (app: Express) => {
  app.get("/health", (_req, res) => {
    logger.debug("health check");
    res.status(200).json({ status: "ok" });
  });

  createPlayerFactoryRoute(app);
  listPlayersFactoryRoute(app);
  getPlayerFactoryRoute(app);
  updatePlayerFactoryRoute(app);
  deletePlayerFactoryRoute(app);

  app.use((_req, res) => {
    res.status(404).json({ error: "NotFound", message: "Route not found" });
  });
};
