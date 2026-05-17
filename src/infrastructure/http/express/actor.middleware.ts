import type { NextFunction, Request, Response } from "express";
import { SYSTEM_ACTOR, type Actor } from "@/domain/entity/actor.js";

declare module "express-serve-static-core" {
  interface Locals {
    actor?: Actor;
  }
}

export const actorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const headerValue = req.headers["x-user-id"];
  const userId = Array.isArray(headerValue) ? headerValue[0] : headerValue;

  res.locals.actor =
    typeof userId === "string" && userId.trim().length > 0
      ? { id: userId }
      : SYSTEM_ACTOR;

  next();
};
