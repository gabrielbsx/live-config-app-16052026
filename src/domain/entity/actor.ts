import { asActorId, type ActorId } from "./identifier.js";

export type Actor = Readonly<{
  id: ActorId;
}>;

export const SYSTEM_ACTOR: Actor = { id: asActorId("system") };
