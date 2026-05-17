import type {
  PaginationInput,
  PaginationResultMeta,
} from "@/domain/contract/pagination.js";
import type { UseCase } from "@/domain/contract/use-case.js";
import type { Player, PlayerProps } from "@/domain/entity/player.js";
import type { PlayerRepository } from "@/domain/repository/player.repository.js";

export type ListPlayerInput = Readonly<PaginationInput>;
export type ListPlayerOutput = Readonly<{
  data: Readonly<PlayerProps[]>;
  meta: PaginationResultMeta;
}>;

export class ListPlayersUseCase implements UseCase<
  ListPlayerInput,
  ListPlayerOutput
> {
  constructor(private readonly _playerRepository: PlayerRepository) {}

  public async execute({
    page,
    limit,
  }: ListPlayerInput): Promise<ListPlayerOutput> {
    const { items, meta } = await this._playerRepository.findByPagination(
      page,
      limit,
    );

    return {
      data: items.map((player) => player.getData()),
      meta,
    };
  }
}
