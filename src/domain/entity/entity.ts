import { randomUUID } from "node:crypto";
import type { Actor } from "./actor.js";

export interface EntityAuditProps {
  createdAt: Date;
  createdBy: string;
  updatedAt: Date | null;
  updatedBy: string | null;
  deletedAt: Date | null;
  deletedBy: string | null;
}

export interface EntityProps extends EntityAuditProps {
  id: string;
}

export type CreateEntityProps<TProps extends EntityProps> = Omit<
  TProps,
  keyof EntityProps
>;

export class Entity<TProps extends EntityProps> {
  protected readonly _props: TProps;

  constructor(props: TProps) {
    this._props = props;
  }

  get props(): Readonly<TProps> {
    return this._props;
  }

  get id(): string {
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
    this._props.updatedAt = new Date();
    this._props.updatedBy = actor.id;
  }

  softDelete(actor: Actor): void {
    if (this.isDeleted) return;
    this._props.deletedAt = new Date();
    this._props.deletedBy = actor.id;
    this.onSoftDeleted();
  }

  protected onCreated(): void {
    // hook for subclasses (e.g. AggregateRoot emits lifecycle event)
  }

  protected onSoftDeleted(): void {
    // hook for subclasses
  }

  static create<T extends Entity<P>, P extends EntityProps>(
    this: new (props: P) => T,
    props: CreateEntityProps<P>,
    actor: Actor,
  ): T {
    const audit: EntityAuditProps & { id: string } = {
      id: randomUUID(),
      createdAt: new Date(),
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
