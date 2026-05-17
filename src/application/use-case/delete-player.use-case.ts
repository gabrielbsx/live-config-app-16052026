import type { UseCase } from "@/domain/contract/use-case.js";
import type { Actor } from "@/domain/entity/actor.js";
import { NotFoundException } from "@/application/exception/not-found.exception.js";
import type { EventPublisher } from "@/domain/event/event-publisher.js";
import type { PlayerRepository } from "@/domain/repository/player.repository.js";

export type DeletePlayerInput = Readonly<{ id: string; actor: Actor }>;
export type DeletePlayerOutput = void;

export class DeletePlayerUseCase implements UseCase<
  DeletePlayerInput,
  DeletePlayerOutput
> {
  constructor(
    private readonly _playerRepository: PlayerRepository,
    private readonly _eventPublisher: EventPublisher,
  ) {}

  async execute({ id, actor }: DeletePlayerInput): Promise<DeletePlayerOutput> {
    const existing = await this._playerRepository.findById(id);
    if (!existing) throw new NotFoundException("Player", id);

    existing.softDelete(actor);
    await this._playerRepository.save(existing);
    await this._eventPublisher.publish(existing.pullDomainEvents());
  }
}
