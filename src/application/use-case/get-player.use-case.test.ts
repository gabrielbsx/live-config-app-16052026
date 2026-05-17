import { describe, expect, it } from "vitest";
import { Player } from "@/domain/entity/player.js";
import { NotFoundException } from "@/domain/exception/not-found.exception.js";
import { InMemoryPlayerRepository } from "@/infrastructure/database/in-memory/in-memory-player.repository.js";
import { GetPlayerUseCase } from "./get-player.use-case.js";

const actor = { id: "tester" };

describe("GetPlayerUseCase", () => {
  it("returns DTO when found", async () => {
    const repo = new InMemoryPlayerRepository();
    const player = Player.fromInput(
      { name: "A", nickname: "a", level: 1, evolution: "rookie" },
      actor,
    );
    await repo.save(player);

    const result = await new GetPlayerUseCase(repo).execute({
      id: player.props.id,
    });

    expect(result.id).toBe(player.props.id);
    expect(result.name).toBe("A");
    expect(result).not.toHaveProperty("createdBy");
  });

  it("throws NotFoundException when missing", async () => {
    const repo = new InMemoryPlayerRepository();
    await expect(
      new GetPlayerUseCase(repo).execute({
        id: "00000000-0000-0000-0000-000000000000",
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
