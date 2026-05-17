export abstract class ValueObject<TValue> {
  constructor(public readonly value: TValue) {
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
    const ka = Object.keys(a as object);
    const kb = Object.keys(b as object);
    if (ka.length !== kb.length) return false;
    return ka.every((k) =>
      ValueObject.deepEqual(
        (a as Record<string, unknown>)[k],
        (b as Record<string, unknown>)[k],
      ),
    );
  }
}
