/**
 * Base for value objects. Equality is by value (deep for nested objects).
 *
 * NOTE: this base does NOT call Object.freeze. If your subclass adds fields,
 * freeze at the end of its own constructor (or call this.freeze()) so the
 * extra fields are initialised before the object becomes immutable.
 */
export abstract class ValueObject<TValue> {
  constructor(public readonly value: TValue) {}

  protected freeze(): void {
    Object.freeze(this);
  }

  equals(other: ValueObject<TValue> | null | undefined): boolean {
    if (!other) return false;
    if (other.constructor !== this.constructor) return false;
    return ValueObject.deepEqual(this.value, other.value);
  }

  private static deepEqual(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (typeof a !== "object" || typeof b !== "object") return false;
    const ka = Object.keys(a as Record<string, unknown>);
    const kb = Object.keys(b as Record<string, unknown>);
    if (ka.length !== kb.length) return false;
    return ka.every((k) =>
      ValueObject.deepEqual(
        (a as Record<string, unknown>)[k],
        (b as Record<string, unknown>)[k],
      ),
    );
  }
}
