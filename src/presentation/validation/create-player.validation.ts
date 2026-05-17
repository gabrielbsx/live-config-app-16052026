import type { CreatePlayerInput } from "../../application/use-case/create-player.use-case.js";
import type { Validation } from "../contract/validation.js";

export interface CreatePlayerValidation extends Validation<CreatePlayerInput> {}
