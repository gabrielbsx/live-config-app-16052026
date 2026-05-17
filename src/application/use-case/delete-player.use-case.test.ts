import { describe, expect, it } from "vitest";
import { Player } from "@/domain/entity/player.js";
import { NotFoundException } from "@/application/exception/not-found.exception.js";
import { InMemoryPlayerRepository } from "@/infrastructure/database/in-memory/in-memory-player.repository.js";
import { DeletePlayerUseCase } from "./delete-player.use-case.js";

const actor = { id: "tester" };

describe("DeletePlayerUseCase", () => {
  it("removes existing player", async () => {
    const repo = new InMemoryPlayerRepository();
    const player = Player.fromInput(
      { name: "X", nickname: "x", level: 1, evolution: "rookie" },
      actor,
    );
    await repo.save(player);

    await new DeletePlayerUseCase(repo).execute({ id: player.props.id });

    const found = await repo.findById(player.props.id);
    expect(found).toBeNull();
  });

  it("throws NotFoundException when missing", async () => {
    const repo = new InMemoryPlayerRepository();
    await expect(
      new DeletePlayerUseCase(repo).execute({
        id: "00000000-0000-0000-0000-000000000000",
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
