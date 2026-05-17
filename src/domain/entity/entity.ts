import { randomUUID } from "node:crypto";

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
  public props: TProps;

  constructor(props: TProps) {
    this.props = props;
  }

  static create<T extends Entity<P>, P extends EntityProps>(
    this: new (props: P) => T,
    props: CreateEntityProps<P>,
  ) {
    return new this({
      ...props,
      id: randomUUID(),
      createdAt: new Date(),
      createdBy: "system",
      updatedAt: null,
      updatedBy: null,
      deletedAt: null,
      deletedBy: null,
    } as P);
  }

  public getData() {
    return this.props;
  }
}
