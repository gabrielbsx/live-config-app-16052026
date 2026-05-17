import { DomainException } from "../exception/domain.exception.js";
import {
  EvolutionValueObject,
  type EvolutionStage,
} from "../value-object/evolution.js";
import { EditableAggregate } from "./editable-aggregate.js";
import type { CreateEntityProps, EntityProps } from "./entity.js";
import type { PlayerId } from "./identifier.js";
import { PLAYER_LIMITS } from "./player.constants.js";

export interface PlayerProps extends EntityProps<PlayerId> {
  name: string;
  nickname: string;
  level: number;
  evolution: EvolutionValueObject;
}

export type PlayerInput = Readonly<{
  name: string;
  nickname: string;
  level: number;
  evolution: EvolutionStage;
}>;

export class Player extends EditableAggregate<PlayerProps, PlayerInput> {
  protected mapInput(input: PlayerInput): CreateEntityProps<PlayerProps> {
    return {
      name: input.name,
      nickname: input.nickname,
      level: input.level,
      evolution: new EvolutionValueObject(input.evolution),
    };
  }

  protected override validateInput(input: PlayerInput): void {
    DomainException.ensure(
      input.level <= PLAYER_LIMITS.LEVEL_MAX,
      `Level cap exceeded (max ${PLAYER_LIMITS.LEVEL_MAX})`,
    );
  }
}
