declare const brand: unique symbol;

export type Brand<TBase, TBrand extends string> = TBase & {
  readonly [brand]: TBrand;
};
