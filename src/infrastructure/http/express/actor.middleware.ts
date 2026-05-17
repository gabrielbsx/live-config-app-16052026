import type { NextFunction, Request, Response } from "express";
import { SYSTEM_ACTOR, type Actor } from "@/domain/entity/actor.js";
import { asActorId } from "@/domain/entity/identifier.js";

const ACTOR_ID_MAX_LENGTH = 128;

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

  if (
    typeof userId === "string" &&
    userId.trim().length > 0 &&
    userId.length <= ACTOR_ID_MAX_LENGTH
  ) {
    res.locals.actor = { id: asActorId(userId.trim()) };
  } else {
    res.locals.actor = SYSTEM_ACTOR;
  }

  next();
};
