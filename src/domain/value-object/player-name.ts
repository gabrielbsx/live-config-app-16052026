import { DomainException } from "../exception/domain.exception.js";
import { PLAYER_LIMITS } from "../entity/player.constants.js";
import { ValueObject } from "./value-object.js";

export class PlayerName extends ValueObject<string> {
  constructor(raw: string) {
    const trimmed = raw.trim();
    DomainException.ensure(trimmed.length >= 1, "PlayerName cannot be empty");
    DomainException.ensure(
      trimmed.length <= PLAYER_LIMITS.NAME_MAX,
      `PlayerName cannot exceed ${PLAYER_LIMITS.NAME_MAX} chars`,
    );
    super(trimmed);
    this.freeze();
  }
}
