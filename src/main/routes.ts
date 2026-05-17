import { type Express } from "express";
import { createPlayerFactoryRoute } from "./factory/create-player.factory.js";
import { listPlayersFactoryRoute } from "./factory/list-players.factory.js";

export const routes = (app: Express) => {
  app.get("/health", (_req, res) => {
    console.log("health");
    res.status(200).json({ status: "ok" });
  });

  createPlayerFactoryRoute(app);
  listPlayersFactoryRoute(app);
};
