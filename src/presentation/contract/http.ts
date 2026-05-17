import type { Actor } from "@/domain/entity/actor.js";

export type Request = Readonly<{
  params: Record<string, unknown>;
  query: unknown;
  body: unknown;
  headers: Record<string, unknown>;
  actor: Actor;
}>;

export type Response = Readonly<{
  statusCode: number;
  body: unknown;
}>;
