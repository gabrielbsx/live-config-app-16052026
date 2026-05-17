import type { UseCase } from "@/domain/contract/use-case.js";
import type { Actor } from "@/domain/entity/actor.js";
import { NotFoundException } from "@/domain/exception/not-found.exception.js";
import { DomainException } from "@/domain/exception/domain.exception.js";
import { PLAYER_LIMITS } from "@/domain/entity/player.constants.js";
import { EvolutionValueObject } from "@/domain/value-object/evolution.js";
import type { CreatePlayerInput } from "@/domain/entity/player.js";
import type { PlayerRepository } from "@/domain/repository/player.repository.js";

export type UpdatePlayerInput = CreatePlayerInput &
  Readonly<{ id: string; actor: Actor }>;

export type UpdatePlayerOutput = Readonly<{ id: string }>;

export class UpdatePlayerUseCase
  implements UseCase<UpdatePlayerInput, UpdatePlayerOutput>
{
  constructor(private readonly _playerRepository: PlayerRepository) {}

  async execute(input: UpdatePlayerInput): Promise<UpdatePlayerOutput> {
    const existing = await this._playerRepository.findById(input.id);
    if (!existing) throw new NotFoundException("Player", input.id);

    if (input.level > PLAYER_LIMITS.LEVEL_MAX) {
      throw new DomainException(
        `Level cap exceeded (max ${PLAYER_LIMITS.LEVEL_MAX})`,
      );
    }

    existing.props.name = input.name;
    existing.props.nickname = input.nickname;
    existing.props.level = input.level;
    existing.props.evolution = new EvolutionValueObject(input.evolution);
    existing.props.updatedAt = new Date();
    existing.props.updatedBy = input.actor.id;

    await this._playerRepository.updateById(input.id, existing);
    return { id: input.id };
  }
}
