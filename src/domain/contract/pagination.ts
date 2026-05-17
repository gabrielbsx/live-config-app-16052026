export type PaginationResultMeta = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

export type PaginationResult<TModel> = {
  items: readonly TModel[];
  meta: PaginationResultMeta;
};

export type PaginationInput = Readonly<{
  page: number;
  limit: number;
}>;
