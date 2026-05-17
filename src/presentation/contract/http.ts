export type Request = Readonly<{
  params: Record<string, unknown>;
  query: unknown;
  body: unknown;
  headers: Record<string, unknown>;
}>;

export type Response = Readonly<{
  statusCode: number;
  body: unknown;
}>;
