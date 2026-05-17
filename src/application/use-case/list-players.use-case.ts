import type {
  PaginationInput,
  PaginationResultMeta,
} from "@/domain/contract/pagination.js";
import type { UseCase } from "@/domain/contract/use-case.js";
import type { Player } from "@/domain/entity/player.js";
import type { Paginated } from "@/domain/repository/repository.js";
import { toPlayerDto, type PlayerDto } from "@/application/dto/player.dto.js";

export type ListPlayerInput = Readonly<PaginationInput>;
export type ListPlayerOutput = Readonly<{
  data: readonly PlayerDto[];
  meta: PaginationResultMeta;
}>;

export class ListPlayersUseCase implements UseCase<
  ListPlayerInput,
  ListPlayerOutput
> {
  constructor(private readonly _playerRepository: Paginated<Player>) {}

  public async execute({
    page,
    limit,
  }: ListPlayerInput): Promise<ListPlayerOutput> {
    const { items, meta } = await this._playerRepository.findByPagination(
      page,
      limit,
    );

    return {
      data: items.map(toPlayerDto),
      meta,
    };
  }
}
