import { DomainException } from "../exception/domain.exception.js";
import {
  PlayerCreatedEvent,
  PlayerSoftDeletedEvent,
  PlayerUpdatedEvent,
} from "../event/player-events.js";
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
    Player.assertLevelWithinCap(input.level);

    const player = Player.create(
      {
        name: input.name,
        nickname: input.nickname,
        level: input.level,
        evolution: new EvolutionValueObject(input.evolution),
      } satisfies CreateEntityProps<PlayerProps>,
      actor,
    );
    player.addDomainEvent(new PlayerCreatedEvent(player.id));
    return player;
  }

  update(input: PlayerInput, actor: Actor): void {
    Player.assertLevelWithinCap(input.level);

    this._props.name = input.name;
    this._props.nickname = input.nickname;
    this._props.level = input.level;
    this._props.evolution = new EvolutionValueObject(input.evolution);
    this.touch(actor);
    this.addDomainEvent(new PlayerUpdatedEvent(this.id));
  }

  override softDelete(actor: Actor): void {
    if (this.isDeleted) return;
    super.softDelete(actor);
    this.addDomainEvent(new PlayerSoftDeletedEvent(this.id));
  }

  private static assertLevelWithinCap(level: number): void {
    DomainException.ensure(
      level <= PLAYER_LIMITS.LEVEL_MAX,
      `Level cap exceeded (max ${PLAYER_LIMITS.LEVEL_MAX})`,
    );
  }
}
