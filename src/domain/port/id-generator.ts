export interface IdGenerator {
  next(): string;
}

export const cryptoIdGenerator: IdGenerator = {
  next: () => globalThis.crypto.randomUUID(),
};
