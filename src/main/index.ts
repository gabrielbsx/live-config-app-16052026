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
const FATAL_FLUSH_MS = 200;

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

  let isShuttingDown = false;
  const shutdown = (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    logger.info({ signal }, "Shutting down");
    const timeout = setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
    timeout.unref();

    server.close((err) => {
      clearTimeout(timeout);
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

  const fatalExit = (err: unknown) => {
    logger.fatal({ err }, "Uncaught exception");
    logger.flush();
    server.close();
    setTimeout(() => process.exit(1), FATAL_FLUSH_MS).unref();
  };
  process.on("uncaughtException", fatalExit);
}

main().catch((err) => {
  logger.fatal({ err }, "Fatal boot error");
  logger.flush?.();
  setTimeout(() => process.exit(1), 200).unref();
});
