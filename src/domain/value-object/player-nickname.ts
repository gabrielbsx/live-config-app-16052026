import { DomainException } from "../exception/domain.exception.js";
import { PLAYER_LIMITS } from "../entity/player.constants.js";
import { ValueObject } from "./value-object.js";

export class PlayerNickname extends ValueObject<string> {
  constructor(raw: string) {
    const trimmed = raw.trim();
    DomainException.ensure(
      trimmed.length >= 1,
      "PlayerNickname cannot be empty",
    );
    DomainException.ensure(
      trimmed.length <= PLAYER_LIMITS.NICKNAME_MAX,
      `PlayerNickname cannot exceed ${PLAYER_LIMITS.NICKNAME_MAX} chars`,
    );
    super(trimmed);
    this.freeze();
  }
}
