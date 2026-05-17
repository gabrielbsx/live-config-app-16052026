import type { Actor } from "./actor.js";
import type { ActorId } from "./identifier.js";
import { systemClock, type Clock } from "../port/clock.js";
import { cryptoIdGenerator, type IdGenerator } from "../port/id-generator.js";

export interface EntityAuditProps {
  createdAt: Date;
  createdBy: ActorId;
  updatedAt: Date | null;
  updatedBy: ActorId | null;
  deletedAt: Date | null;
  deletedBy: ActorId | null;
}

export interface EntityProps<TId extends string = string>
  extends EntityAuditProps {
  id: TId;
}

export type CreateEntityProps<TProps extends EntityProps> = Omit<
  TProps,
  keyof EntityProps
>;

let _clock: Clock = systemClock;
let _idGenerator: IdGenerator = cryptoIdGenerator;

export const configureEntityServices = (services: {
  clock?: Clock;
  idGenerator?: IdGenerator;
}): void => {
  if (services.clock) _clock = services.clock;
  if (services.idGenerator) _idGenerator = services.idGenerator;
};

export const resetEntityServices = (): void => {
  _clock = systemClock;
  _idGenerator = cryptoIdGenerator;
};

export class Entity<TProps extends EntityProps> {
  protected readonly _props: TProps;

  constructor(props: TProps) {
    this._props = props;
  }

  get props(): Readonly<TProps> {
    return this._props;
  }

  get id(): TProps["id"] {
    return this._props.id;
  }

  get isDeleted(): boolean {
    return this._props.deletedAt !== null;
  }

  equals(other: Entity<EntityProps> | null | undefined): boolean {
    if (!other) return false;
    if (other === this) return true;
    if (other.constructor !== this.constructor) return false;
    return this._props.id === other._props.id;
  }

  protected touch(actor: Actor): void {
    this._props.updatedAt = _clock.now();
    this._props.updatedBy = actor.id;
  }

  softDelete(actor: Actor): void {
    if (this.isDeleted) return;
    this._props.deletedAt = _clock.now();
    this._props.deletedBy = actor.id;
    this.onSoftDeleted();
  }

  protected onCreated(): void {
    // hook for subclasses
  }

  protected onSoftDeleted(): void {
    // hook for subclasses
  }

  static create<T extends Entity<P>, P extends EntityProps>(
    this: new (props: P) => T,
    props: CreateEntityProps<P>,
    actor: Actor,
  ): T {
    const audit: EntityAuditProps & { id: P["id"] } = {
      id: _idGenerator.next() as P["id"],
      createdAt: _clock.now(),
      createdBy: actor.id,
      updatedAt: null,
      updatedBy: null,
      deletedAt: null,
      deletedBy: null,
    };
    const entity = new this({ ...props, ...audit } as P);
    entity.onCreated();
    return entity;
  }

  static restore<T extends Entity<P>, P extends EntityProps>(
    this: new (props: P) => T,
    props: P,
  ): T {
    return new this(props);
  }
}
