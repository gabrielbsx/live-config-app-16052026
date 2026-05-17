import type { PaginationInput } from "../../domain/contract/pagination.js";
import type { Validation } from "../contract/validation.js";

export interface PaginationValidation extends Validation<PaginationInput> {}
