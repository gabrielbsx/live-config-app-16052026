import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { env } from "@/infrastructure/config/env.js";
import { logger } from "@/infrastructure/logger/logger.js";
import { actorMiddleware } from "@/infrastructure/http/express/actor.middleware.js";
import { createCompositionRoot } from "./composition-root.js";
import { routes } from "./routes.js";

const SHUTDOWN_TIMEOUT_MS = 10_000;

async function main() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(","),
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "x-user-id"],
    }),
  );
  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
  app.use(express.json({ limit: "100kb" }));
  app.use(express.urlencoded({ extended: true, limit: "100kb" }));
  app.use(actorMiddleware);

  const handlers = createCompositionRoot();
  routes(app, handlers);

  const server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, "Server started");
  });

  const shutdown = (signal: string) => {
    logger.info({ signal }, "Shutting down");
    const timeout = setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
    timeout.unref();

    server.close((err) => {
      if (err) {
        logger.error({ err }, "Error during shutdown");
        process.exit(1);
      }
      logger.info("Graceful shutdown complete");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error({ reason }, "Unhandled rejection");
  });
  process.on("uncaughtException", (err) => {
    logger.fatal({ err }, "Uncaught exception");
    process.exit(1);
  });
}

main().catch((err) => {
  logger.fatal({ err }, "Fatal boot error");
  process.exit(1);
});
