import { type Express } from "express";
import { logger } from "@/infrastructure/logger/logger.js";
import type { Handlers } from "./composition-root.js";

export const routes = (app: Express, handlers: Handlers) => {
  app.get("/health", (_req, res) => {
    logger.debug("health check");
    res.status(200).json({ status: "ok" });
  });

  app.post("/player", handlers.createPlayer);
  app.get("/player", handlers.listPlayers);
  app.get("/player/:id", handlers.getPlayer);
  app.put("/player/:id", handlers.updatePlayer);
  app.delete("/player/:id", handlers.deletePlayer);

  app.use((_req, res) => {
    res.status(404).json({ error: "NotFound", message: "Route not found" });
  });
};
