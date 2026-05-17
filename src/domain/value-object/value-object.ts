export abstract class ValueObject<TValue> {
  constructor(public readonly value: TValue) {
    Object.freeze(this);
  }
}
