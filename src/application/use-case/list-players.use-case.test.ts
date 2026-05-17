import { describe, expect, it } from "vitest";
import { Player } from "@/domain/entity/player.js";
import { InMemoryPlayerRepository } from "@/infrastructure/database/in-memory/in-memory-player.repository.js";
import { ListPlayersUseCase } from "./list-players.use-case.js";

const actor = { id: "tester" };

describe("ListPlayersUseCase", () => {
  it("returns paginated DTOs without audit leak", async () => {
    const repo = new InMemoryPlayerRepository();
    await repo.save(
      Player.fromInput(
        { name: "A", nickname: "a", level: 1, evolution: "rookie" },
        actor,
      ),
    );
    await repo.save(
      Player.fromInput(
        { name: "B", nickname: "b", level: 2, evolution: "pro" },
        actor,
      ),
    );

    const useCase = new ListPlayersUseCase(repo);
    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.data).toHaveLength(2);
    expect(result.meta.totalItems).toBe(2);

    const first = result.data[0]!;
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("name");
    expect(first).toHaveProperty("evolution");
    expect(first).not.toHaveProperty("createdBy");
    expect(first).not.toHaveProperty("deletedAt");
  });

  it("returns empty when no players", async () => {
    const repo = new InMemoryPlayerRepository();
    const useCase = new ListPlayersUseCase(repo);
    const result = await useCase.execute({ page: 1, limit: 10 });
    expect(result.data).toEqual([]);
  });
});
