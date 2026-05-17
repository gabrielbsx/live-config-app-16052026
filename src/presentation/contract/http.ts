export type Request = Readonly<{
  params: unknown[];
  query: unknown;
  body: unknown;
  headers: unknown[];
}>;

export type Response = Readonly<{
  statusCode: number;
  body: unknown;
}>;
