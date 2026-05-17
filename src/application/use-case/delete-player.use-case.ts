import type { UseCase } from "@/domain/contract/use-case.js";
import { NotFoundException } from "@/application/exception/not-found.exception.js";
import type { PlayerRepository } from "@/domain/repository/player.repository.js";

export type DeletePlayerInput = Readonly<{ id: string }>;
export type DeletePlayerOutput = void;

export class DeletePlayerUseCase implements UseCase<
  DeletePlayerInput,
  DeletePlayerOutput
> {
  constructor(private readonly _playerRepository: PlayerRepository) {}

  async execute({ id }: DeletePlayerInput): Promise<DeletePlayerOutput> {
    const existing = await this._playerRepository.findById(id);
    if (!existing) throw new NotFoundException("Player", id);
    await this._playerRepository.deleteById(id);
  }
}
