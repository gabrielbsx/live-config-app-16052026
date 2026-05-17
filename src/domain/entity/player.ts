import { DomainException } from "../exception/domain.exception.js";
import {
  EvolutionValueObject,
  type EvolutionStage,
} from "../value-object/evolution.js";
import type { Actor } from "./actor.js";
import { AggregateRoot } from "./aggregate-root.js";
import type { CreateEntityProps, EntityProps } from "./entity.js";
import { PLAYER_LIMITS } from "./player.constants.js";

export interface PlayerProps extends EntityProps {
  name: string;
  nickname: string;
  level: number;
  evolution: EvolutionValueObject;
}

export type CreatePlayerInput = Readonly<{
  name: string;
  nickname: string;
  level: number;
  evolution: EvolutionStage;
}>;

export class Player extends AggregateRoot<PlayerProps> {
  static fromInput(input: CreatePlayerInput, actor: Actor): Player {
    if (input.level > PLAYER_LIMITS.LEVEL_MAX) {
      throw new DomainException(
        `Level cap exceeded (max ${PLAYER_LIMITS.LEVEL_MAX})`,
      );
    }

    return Player.create(
      {
        name: input.name,
        nickname: input.nickname,
        level: input.level,
        evolution: new EvolutionValueObject(input.evolution),
      } satisfies CreateEntityProps<PlayerProps>,
      actor,
    );
  }
}
