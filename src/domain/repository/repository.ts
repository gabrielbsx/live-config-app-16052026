import type { PaginationResult } from "../contract/pagination.js";

export interface Repository<TModel> {
  create(model: TModel): Promise<TModel>;
  save(model: TModel): Promise<string>;
  findById(id: string): Promise<TModel | null>;
  findByPagination(
    page: number,
    pageSize: number,
  ): Promise<PaginationResult<TModel>>;
  updateById(id: string, model: TModel): Promise<void>;
  deleteById(id: string): Promise<void>;
}
