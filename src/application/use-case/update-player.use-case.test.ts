import { describe, expect, it } from "vitest";
import { Player } from "@/domain/entity/player.js";
import { DomainException } from "@/domain/exception/domain.exception.js";
import { NotFoundException } from "@/domain/exception/not-found.exception.js";
import { PLAYER_LIMITS } from "@/domain/entity/player.constants.js";
import { InMemoryPlayerRepository } from "@/infrastructure/database/in-memory/in-memory-player.repository.js";
import { UpdatePlayerUseCase } from "./update-player.use-case.js";

const creator = { id: "creator" };
const editor = { id: "editor" };

describe("UpdatePlayerUseCase", () => {
  it("updates existing player and stamps updatedBy", async () => {
    const repo = new InMemoryPlayerRepository();
    const player = Player.fromInput(
      { name: "Old", nickname: "o", level: 1, evolution: "rookie" },
      creator,
    );
    await repo.save(player);

    await new UpdatePlayerUseCase(repo).execute({
      id: player.props.id,
      name: "New",
      nickname: "n",
      level: 50,
      evolution: "pro",
      actor: editor,
    });

    const updated = await repo.findById(player.props.id);
    expect(updated?.props.name).toBe("New");
    expect(updated?.props.level).toBe(50);
    expect(updated?.props.evolution.value).toBe("pro");
    expect(updated?.props.updatedBy).toBe("editor");
    expect(updated?.props.createdBy).toBe("creator");
    expect(updated?.props.updatedAt).toBeInstanceOf(Date);
  });

  it("throws NotFoundException when player missing", async () => {
    const repo = new InMemoryPlayerRepository();
    await expect(
      new UpdatePlayerUseCase(repo).execute({
        id: "00000000-0000-0000-0000-000000000000",
        name: "X",
        nickname: "x",
        level: 1,
        evolution: "rookie",
        actor: editor,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it("rejects level above cap", async () => {
    const repo = new InMemoryPlayerRepository();
    const player = Player.fromInput(
      { name: "P", nickname: "p", level: 1, evolution: "rookie" },
      creator,
    );
    await repo.save(player);

    await expect(
      new UpdatePlayerUseCase(repo).execute({
        id: player.props.id,
        name: "P",
        nickname: "p",
        level: PLAYER_LIMITS.LEVEL_MAX + 1,
        evolution: "rookie",
        actor: editor,
      }),
    ).rejects.toThrow(DomainException);
  });
});
