import type { PaginationResult } from "@/domain/contract/pagination.js";
import type { Player } from "@/domain/entity/player.js";
import type { PlayerRepository } from "@/domain/repository/player.repository.js";

export class InMemoryPlayerRepository implements PlayerRepository {
  static players: Player[] = [];

  async create(player: Player): Promise<Player> {
    InMemoryPlayerRepository.players.push(player);
    return player;
  }

  async findById(id: string): Promise<Player | null> {
    const player = InMemoryPlayerRepository.players.find(
      (player) => player.props.id === id,
    );
    return player || null;
  }

  async findByPagination(
    page: number,
    pageSize: number,
  ): Promise<PaginationResult<Player>> {
    const total = InMemoryPlayerRepository.players.length;
    const items = InMemoryPlayerRepository.players.slice(
      (page - 1) * pageSize,
      page * pageSize,
    );
    return {
      items,
      meta: {
        totalItems: total,
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
        pageSize,
      },
    };
  }

  async updateById(id: string, player: Player): Promise<void> {
    const index = InMemoryPlayerRepository.players.findIndex(
      (player) => player.props.id === id,
    );
    if (index !== -1) {
      InMemoryPlayerRepository.players[index] = player;
    }
  }

  async deleteById(id: string): Promise<void> {
    InMemoryPlayerRepository.players = InMemoryPlayerRepository.players.filter(
      (player) => player.props.id !== id,
    );
  }

  async save(model: Player): Promise<string> {
    const existingIndex = InMemoryPlayerRepository.players.findIndex(
      (player) => player.props.id === model.props.id,
    );

    if (existingIndex !== -1) {
      InMemoryPlayerRepository.players[existingIndex] = model;
    } else {
      InMemoryPlayerRepository.players.push(model);
    }

    return model.props.id;
  }
}
