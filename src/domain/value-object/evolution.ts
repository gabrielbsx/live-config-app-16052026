import { ValueObject } from "./value-object.js";

export const EVOLUTION_STAGES = ["rookie", "amateur", "pro", "legend"] as const;

export type EvolutionStage = (typeof EVOLUTION_STAGES)[number];

export class EvolutionValueObject extends ValueObject<EvolutionStage> {}
