import { DomainException } from "../exception/domain.exception.js";
import {
  EvolutionValueObject,
  type EvolutionStage,
} from "../value-object/evolution.js";
import type { Actor } from "./actor.js";
import { Entity, type CreateEntityProps, type EntityProps } from "./entity.js";
import { PLAYER_LIMITS } from "./player.constants.js";

export interface PlayerProps extends EntityProps {
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

export class Player extends Entity<PlayerProps> {
  static fromInput(input: PlayerInput, actor: Actor): Player {
    Player.assertLevelWithinCap(input.level);

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

  update(input: PlayerInput, actor: Actor): void {
    Player.assertLevelWithinCap(input.level);

    this.props.name = input.name;
    this.props.nickname = input.nickname;
    this.props.level = input.level;
    this.props.evolution = new EvolutionValueObject(input.evolution);
    this.props.updatedAt = new Date();
    this.props.updatedBy = actor.id;
  }

  private static assertLevelWithinCap(level: number): void {
    if (level > PLAYER_LIMITS.LEVEL_MAX) {
      throw new DomainException(
        `Level cap exceeded (max ${PLAYER_LIMITS.LEVEL_MAX})`,
      );
    }
  }
}
