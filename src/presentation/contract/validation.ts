export interface Validation<TOutput> {
  validate(input: unknown): TOutput;
}
