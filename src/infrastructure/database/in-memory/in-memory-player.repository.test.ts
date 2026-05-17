import { beforeEach, describe, expect, it } from "vitest";
import { Player } from "@/domain/entity/player.js";
import { InMemoryPlayerRepository } from "./in-memory-player.repository.js";

const actor = { id: "tester" };

const makePlayer = (overrides: Partial<{ level: number }> = {}) =>
  Player.fromInput(
    {
      name: "P",
      nickname: "p",
      level: 1,
      evolution: "rookie",
      ...overrides,
    },
    actor,
  );

describe("InMemoryPlayerRepository", () => {
  let repo: InMemoryPlayerRepository;

  beforeEach(() => {
    repo = new InMemoryPlayerRepository();
  });

  describe("save", () => {
    it("inserts new player and returns id", async () => {
      const player = makePlayer();
      const id = await repo.save(player);
      expect(id).toBe(player.props.id);
    });

    it("updates existing player when id matches", async () => {
      const player = makePlayer();
      await repo.save(player);

      player.props.level = 5;
      await repo.save(player);

      const { items } = await repo.findByPagination(1, 10);
      expect(items).toHaveLength(1);
      expect(items[0]?.props.level).toBe(5);
    });
  });

  describe("findByPagination", () => {
    it("returns empty result when no players", async () => {
      const result = await repo.findByPagination(1, 10);
      expect(result.items).toEqual([]);
      expect(result.meta).toEqual({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 10,
      });
    });

    it("paginates correctly", async () => {
      for (let i = 0; i < 25; i++) {
        await repo.save(makePlayer({ level: i + 1 }));
      }
      const page1 = await repo.findByPagination(1, 10);
      const page3 = await repo.findByPagination(3, 10);

      expect(page1.items).toHaveLength(10);
      expect(page3.items).toHaveLength(5);
      expect(page1.meta.totalPages).toBe(3);
      expect(page1.meta.totalItems).toBe(25);
    });
  });
});
