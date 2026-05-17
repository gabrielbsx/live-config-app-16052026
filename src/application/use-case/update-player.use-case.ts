import type { UseCase } from "@/domain/contract/use-case.js";
import type { Actor } from "@/domain/entity/actor.js";
import { NotFoundException } from "@/application/exception/not-found.exception.js";
import type { PlayerInput } from "@/domain/entity/player.js";
import type { EventPublisher } from "@/domain/event/event-publisher.js";
import type { PlayerRepository } from "@/domain/repository/player.repository.js";

export type UpdatePlayerInput = PlayerInput &
  Readonly<{ id: string; actor: Actor }>;

export type UpdatePlayerOutput = Readonly<{ id: string }>;

export class UpdatePlayerUseCase implements UseCase<
  UpdatePlayerInput,
  UpdatePlayerOutput
> {
  constructor(
    private readonly _playerRepository: PlayerRepository,
    private readonly _eventPublisher: EventPublisher,
  ) {}

  async execute(input: UpdatePlayerInput): Promise<UpdatePlayerOutput> {
    const existing = await this._playerRepository.findById(input.id);
    if (!existing) throw new NotFoundException("Player", input.id);

    const { id, actor, ...patch } = input;
    existing.update(patch, actor);

    await this._playerRepository.save(existing);
    await this._eventPublisher.publish(existing.pullDomainEvents());
    return { id };
  }
}
