import type { UseCase } from "@/domain/contract/use-case.js";
import { Player } from "@/domain/entity/player.js";
import type { PlayerRepository } from "@/domain/repository/player.repository.js";
import { EvolutionValueObject } from "@/domain/value-object/evolution.js";

export type CreatePlayerInput = Readonly<{
  name: string;
  nickname: string;
  evolution: string;
  level: number;
}>;

export type CreatePlayerOutput = Readonly<{
  id: string;
}>;

export class CreatePlayerUseCase implements UseCase<
  CreatePlayerInput,
  CreatePlayerOutput
> {
  constructor(private readonly _playerRepository: PlayerRepository) {}

  public async execute({
    name,
    nickname,
    evolution,
    level,
  }: CreatePlayerInput): Promise<CreatePlayerOutput> {
    const player = Player.create({
      name,
      nickname,
      evolution: new EvolutionValueObject(evolution),
      level,
    });

    const id = await this._playerRepository.save(player);

    return { id };
  }
}
