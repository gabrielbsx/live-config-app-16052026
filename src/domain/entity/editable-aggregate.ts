import type { Actor } from "./actor.js";
import { AggregateRoot } from "./aggregate-root.js";
import { Entity, type CreateEntityProps, type EntityProps } from "./entity.js";

/**
 * Aggregate root that derives its mutable state from a typed input shape.
 *
 * Subclass only needs to declare:
 *  - `mapInput(input)`     -> domain props derived from input
 *  - `validateInput(input)` (optional) -> throw DomainException on invariants
 *
 * Base provides:
 *  - `static fromInput(input, actor)` -> validate + create + emit "<aggregate>.created"
 *  - `update(input, actor)`           -> validate + patch props + touch + emit "<aggregate>.updated"
 *  - `softDelete(actor)`              -> inherited, emits "<aggregate>.soft-deleted"
 */
export abstract class EditableAggregate<
  TProps extends EntityProps,
  TInput,
> extends AggregateRoot<TProps> {
  protected abstract mapInput(input: TInput): CreateEntityProps<TProps>;

  protected validateInput(_input: TInput): void {
    // override in subclass for input invariants
  }

  update(input: TInput, actor: Actor): void {
    this.validateInput(input);
    this.applyChange(actor, () => {
      Object.assign(this._props, this.mapInput(input));
    });
  }

  static fromInput<
    T extends EditableAggregate<P, I>,
    P extends EntityProps,
    I,
  >(this: new (props: P) => T, input: I, actor: Actor): T {
    const ctor = this as unknown as {
      prototype: EditableAggregate<P, I>;
    } & typeof Entity;
    ctor.prototype.validateInput(input);
    const props = ctor.prototype.mapInput(input);
    return (ctor.create as unknown as (
      p: CreateEntityProps<P>,
      a: Actor,
    ) => T).call(ctor, props, actor);
  }
}
