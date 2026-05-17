import type { Actor } from "@/domain/entity/actor.js";

export type Request = Readonly<{
  params: Record<string, string>;
  query: unknown;
  body: unknown;
  actor: Actor;
}>;

export type Response = Readonly<{
  statusCode: number;
  body: unknown;
}>;
