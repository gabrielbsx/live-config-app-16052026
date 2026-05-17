import type { PlayerInput } from "@/domain/entity/player.js";
import type { Validation } from "../contract/validation.js";

export type CreatePlayerValidation = Validation<PlayerInput>;
