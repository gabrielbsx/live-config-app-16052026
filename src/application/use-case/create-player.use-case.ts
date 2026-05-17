import type { UseCase } from "@/domain/contract/use-case.js";
import type { Actor } from "@/domain/entity/actor.js";
import {
  Player,
  type CreatePlayerInput as DomainCreatePlayerInput,
} from "@/domain/entity/player.js";
import type { PlayerRepository } from "@/domain/repository/player.repository.js";

export type CreatePlayerInput = DomainCreatePlayerInput &
  Readonly<{ actor: Actor }>;

export type CreatePlayerOutput = Readonly<{
  id: string;
}>;

export class CreatePlayerUseCase
  implements UseCase<CreatePlayerInput, CreatePlayerOutput>
{
  constructor(private readonly _playerRepository: PlayerRepository) {}

  public async execute(input: CreatePlayerInput): Promise<CreatePlayerOutput> {
    const { actor, ...domainInput } = input;
    const player = Player.fromInput(domainInput, actor);

    const id = await this._playerRepository.save(player);

    return { id };
  }
}
