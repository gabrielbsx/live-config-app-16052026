import type { CreatePlayerInput } from "@/domain/entity/player.js";
import type { Validation } from "../contract/validation.js";

export type CreatePlayerValidation = Validation<CreatePlayerInput>;
