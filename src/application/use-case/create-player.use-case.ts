import { randomUUID } from "node:crypto";
import type { UseCase } from "../../domain/contract/use-case.js";
import { Player, type PlayerProps } from "../../domain/entity/player.js";
import type { PlayerRepository } from "../../domain/repository/player.repository.js";

export type CreatePlayerInput = Readonly<{
  name: string;
  nickname: string;
  evolution: string;
}>;

export type CreatePlayerOutput = Readonly<{
  id: string;
}>;

export class CreatePlayerUseCase implements UseCase<
  CreatePlayerInput,
  unknown
> {
  constructor(private readonly _playerRepository: PlayerRepository) {}

  public async execute({
    name,
    nickname,
    evolution,
  }: CreatePlayerInput): Promise<CreatePlayerOutput> {
    const player = Player.create({
      name,
      nickname,
      evolution,
      level: 0,
    });

    const id = await this._playerRepository.save(player);

    return { id };
  }
}
