import { pino } from "pino";
import { env } from "@/infrastructure/config/env.js";

const isProd = env.NODE_ENV === "production";

export const logger = pino({
  level: env.LOG_LEVEL,
  ...(isProd
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "SYS:HH:MM:ss.l" },
        },
      }),
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie", "*.password"],
    censor: "[REDACTED]",
  },
});

export type Logger = typeof logger;
