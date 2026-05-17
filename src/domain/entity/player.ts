import { DomainException } from "../exception/domain.exception.js";
import {
  EvolutionValueObject,
  type EvolutionStage,
} from "../value-object/evolution.js";
import type { Actor } from "./actor.js";
import { AggregateRoot } from "./aggregate-root.js";
import { type CreateEntityProps, type EntityProps } from "./entity.js";
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

export class Player extends AggregateRoot<PlayerProps> {
  static fromInput(input: PlayerInput, actor: Actor): Player {
    Player.validateInput(input);
    return Player.create(Player.toProps(input), actor);
  }

  update(input: PlayerInput, actor: Actor): void {
    Player.validateInput(input);
    this.applyChange(actor, () => {
      const next = Player.toProps(input);
      this._props.name = next.name;
      this._props.nickname = next.nickname;
      this._props.level = next.level;
      this._props.evolution = next.evolution;
    });
  }

  private static toProps(input: PlayerInput): CreateEntityProps<PlayerProps> {
    return {
      name: input.name,
      nickname: input.nickname,
      level: input.level,
      evolution: new EvolutionValueObject(input.evolution),
    };
  }

  private static validateInput(input: PlayerInput): void {
    DomainException.ensure(
      input.level <= PLAYER_LIMITS.LEVEL_MAX,
      `Level cap exceeded (max ${PLAYER_LIMITS.LEVEL_MAX})`,
    );
  }
}
