declare const brand: unique symbol;

export type Brand<TBase, TBrand extends string> = TBase & {
  readonly [brand]: TBrand;
};

export const brandValue = <TBase, TBrand extends string>(
  value: TBase,
): Brand<TBase, TBrand> => value as Brand<TBase, TBrand>;
