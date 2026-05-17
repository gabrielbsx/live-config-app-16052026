export const ok = <TBody>(body: TBody) => ({
  statusCode: 200,
  body,
});

export const created = <TBody>(body: TBody) => ({
  statusCode: 201,
  body,
});
