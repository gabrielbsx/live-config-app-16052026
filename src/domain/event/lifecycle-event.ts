import { BaseDomainEvent } from "./domain-event.js";

export type LifecycleKind = "created" | "updated" | "soft-deleted";

export class LifecycleEvent extends BaseDomainEvent {
  constructor(
    public readonly aggregateName: string,
    public readonly kind: LifecycleKind,
    aggregateId: string,
  ) {
    super(`${aggregateName.toLowerCase()}.${kind}`, aggregateId);
  }
}
