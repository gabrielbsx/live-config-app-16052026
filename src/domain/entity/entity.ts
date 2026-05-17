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
    return new this({ ...props, ...audit } as P);
  }
}
