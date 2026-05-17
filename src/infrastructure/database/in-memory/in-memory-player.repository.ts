import type { PaginationResult } from "@/domain/contract/pagination.js";
import type { Player } from "@/domain/entity/player.js";
import type { PlayerRepository } from "@/domain/repository/player.repository.js";

export class InMemoryPlayerRepository implements PlayerRepository {
  private players: Player[] = [];

  async findById(id: string): Promise<Player | null> {
    return this.players.find((p) => p.props.id === id) ?? null;
  }

  async findByPagination(
    page: number,
    pageSize: number,
  ): Promise<PaginationResult<Player>> {
    const total = this.players.length;
    const items = this.players.slice((page - 1) * pageSize, page * pageSize);
    return {
      items,
      meta: {
        totalItems: total,
        totalPages: pageSize > 0 ? Math.ceil(total / pageSize) : 0,
        currentPage: page,
        pageSize,
      },
    };
  }

  async save(model: Player): Promise<string> {
    const index = this.players.findIndex((p) => p.props.id === model.props.id);
    if (index !== -1) {
      this.players[index] = model;
    } else {
      this.players.push(model);
    }
    return model.props.id;
  }

  async updateById(id: string, model: Player): Promise<void> {
    const index = this.players.findIndex((p) => p.props.id === id);
    if (index === -1) return;
    this.players[index] = model;
  }

  async deleteById(id: string): Promise<void> {
    this.players = this.players.filter((p) => p.props.id !== id);
  }
}
