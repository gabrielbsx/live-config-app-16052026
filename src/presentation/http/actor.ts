import { SYSTEM_ACTOR, type Actor } from "@/domain/entity/actor.js";

export const extractActor = (headers: Record<string, unknown>): Actor => {
  const userId = headers["x-user-id"];

  if (typeof userId === "string" && userId.trim().length > 0) {
    return { id: userId };
  }

  return SYSTEM_ACTOR;
};
