import { z } from "zod";
import { PLAYER_LIMITS } from "@/domain/entity/player.constants.js";
import { EVOLUTION_STAGES } from "@/domain/value-object/evolution.js";
import { ZodValidation } from "./zod-validation.js";

export const zodCreatePlayerValidationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(PLAYER_LIMITS.NAME_MAX),
  nickname: z
    .string()
    .trim()
    .min(1, "Nickname is required")
    .max(PLAYER_LIMITS.NICKNAME_MAX),
  level: z
    .number()
    .int()
    .min(PLAYER_LIMITS.LEVEL_MIN)
    .max(PLAYER_LIMITS.LEVEL_MAX),
  evolution: z.enum(EVOLUTION_STAGES),
});

export class ZodCreatePlayerValidation extends ZodValidation<
  typeof zodCreatePlayerValidationSchema
> {
  constructor() {
    super(zodCreatePlayerValidationSchema);
  }
}
