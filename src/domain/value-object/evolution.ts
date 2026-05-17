import { ValueObject } from "./value-object.js";

export const EVOLUTION_STAGES = ["rookie", "amateur", "pro", "legend"] as const;

export type EvolutionStage = (typeof EVOLUTION_STAGES)[number];

const EVOLUTION_ORDER: Readonly<Record<EvolutionStage, number>> = {
  rookie: 0,
  amateur: 1,
  pro: 2,
  legend: 3,
};

export class EvolutionValueObject extends ValueObject<EvolutionStage> {
  constructor(value: EvolutionStage) {
    super(value);
    this.freeze();
  }

  get rank(): number {
    return EVOLUTION_ORDER[this.value];
  }

  canTransitionTo(next: EvolutionStage): boolean {
    return EVOLUTION_ORDER[next] >= EVOLUTION_ORDER[this.value];
  }

  next(): EvolutionValueObject | null {
    const idx = EVOLUTION_STAGES.indexOf(this.value);
    if (idx === -1 || idx === EVOLUTION_STAGES.length - 1) return null;
    return new EvolutionValueObject(EVOLUTION_STAGES[idx + 1]!);
  }
}
