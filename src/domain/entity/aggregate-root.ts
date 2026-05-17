import { Entity, type EntityProps } from "./entity.js";

export class AggregateRoot<TProps extends EntityProps> extends Entity<TProps> {}
