import { LevelCapExceededException } from "../exception/player.exceptions.js";
import { DomainException } from "../exception/domain.exception.js";
import { PLAYER_LIMITS } from "../entity/player.constants.js";
import { ValueObject } from "./value-object.js";

export class PlayerLevel extends ValueObject<number> {
  constructor(raw: number) {
    DomainException.ensure(
      Number.isInteger(raw),
      "PlayerLevel must be an integer",
    );
    DomainException.ensure(
      raw >= PLAYER_LIMITS.LEVEL_MIN,
      `PlayerLevel must be >= ${PLAYER_LIMITS.LEVEL_MIN}`,
    );
    if (raw > PLAYER_LIMITS.LEVEL_MAX) {
      throw new LevelCapExceededException(PLAYER_LIMITS.LEVEL_MAX);
    }
    super(raw);
    this.freeze();
  }
}
