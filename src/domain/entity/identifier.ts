import type { Brand } from "../contract/brand.js";

export type EntityId<TName extends string> = Brand<string, `${TName}Id`>;

export type PlayerId = EntityId<"Player">;
export type ActorId = EntityId<"Actor">;

export const asPlayerId = (value: string): PlayerId => value as PlayerId;
export const asActorId = (value: string): ActorId => value as ActorId;
