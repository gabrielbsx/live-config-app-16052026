import type { PaginationResult } from "../contract/pagination.js";

export interface Readable<TModel> {
  findById(id: string): Promise<TModel | null>;
}

export interface Paginated<TModel> {
  findByPagination(
    page: number,
    pageSize: number,
  ): Promise<PaginationResult<TModel>>;
}

export interface Writable<TModel> {
  save(model: TModel): Promise<string>;
  deleteById(id: string): Promise<void>;
}
