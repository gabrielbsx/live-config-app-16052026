import type { UseCase } from "@/domain/contract/use-case.js";
import type { Player } from "@/domain/entity/player.js";
import type { Readable } from "@/domain/repository/repository.js";
import { NotFoundException } from "@/application/exception/not-found.exception.js";
import { toPlayerDto, type PlayerDto } from "../dto/player.dto.js";

export type GetPlayerInput = Readonly<{ id: string }>;
export type GetPlayerOutput = PlayerDto;

export class GetPlayerUseCase implements UseCase<
  GetPlayerInput,
  GetPlayerOutput
> {
  constructor(private readonly _playerRepository: Readable<Player>) {}

  async execute({ id }: GetPlayerInput): Promise<GetPlayerOutput> {
    const player = await this._playerRepository.findById(id);
    if (!player) throw new NotFoundException("Player", id);
    return toPlayerDto(player);
  }
}
