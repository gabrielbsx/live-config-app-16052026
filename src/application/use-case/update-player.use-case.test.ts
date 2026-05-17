import { asActorId } from "@/domain/entity/identifier.js";
import { describe, expect, it, vi } from "vitest";
import { Player } from "@/domain/entity/player.js";
import { DomainException } from "@/domain/exception/domain.exception.js";
import { NotFoundException } from "@/application/exception/not-found.exception.js";
import { PLAYER_LIMITS } from "@/domain/entity/player.constants.js";
import type { EventPublisher } from "@/domain/event/event-publisher.js";
import { InMemoryPlayerRepository } from "@/infrastructure/database/in-memory/in-memory-player.repository.js";
import { UpdatePlayerUseCase } from "./update-player.use-case.js";

const creator = { id: asActorId("creator") };
const editor = { id: asActorId("editor") };

const makePublisher = (): EventPublisher => ({
  publish: vi.fn(async () => undefined),
  subscribe: vi.fn(),
});

describe("UpdatePlayerUseCase", () => {
  it("updates existing player and stamps updatedBy", async () => {
    const repo = new InMemoryPlayerRepository();
    const publisher = makePublisher();
    const player = Player.fromInput(
      { name: "Old", nickname: "o", level: 1, evolution: "rookie" },
      creator,
    );
    await repo.save(player);

    await new UpdatePlayerUseCase(repo, publisher).execute({
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
    expect(publisher.publish).toHaveBeenCalledOnce();
  });

  it("throws NotFoundException when player missing", async () => {
    const repo = new InMemoryPlayerRepository();
    const publisher = makePublisher();
    await expect(
      new UpdatePlayerUseCase(repo, publisher).execute({
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
    const publisher = makePublisher();
    const player = Player.fromInput(
      { name: "P", nickname: "p", level: 1, evolution: "rookie" },
      creator,
    );
    await repo.save(player);

    await expect(
      new UpdatePlayerUseCase(repo, publisher).execute({
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
