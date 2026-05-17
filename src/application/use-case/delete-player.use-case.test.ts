import { asActorId } from "@/domain/entity/identifier.js";
import { describe, expect, it, vi } from "vitest";
import { Player } from "@/domain/entity/player.js";
import { NotFoundException } from "@/application/exception/not-found.exception.js";
import type { EventPublisher } from "@/domain/event/event-publisher.js";
import { InMemoryPlayerRepository } from "@/infrastructure/database/in-memory/in-memory-player.repository.js";
import { DeletePlayerUseCase } from "./delete-player.use-case.js";

const actor = { id: asActorId("tester") };

const makePublisher = (): EventPublisher => ({
  publish: vi.fn(async () => undefined),
  subscribe: vi.fn(),
});

describe("DeletePlayerUseCase", () => {
  it("soft-deletes existing player and emits event", async () => {
    const repo = new InMemoryPlayerRepository();
    const publisher = makePublisher();
    const player = Player.fromInput(
      { name: "X", nickname: "x", level: 1, evolution: "rookie" },
      actor,
    );
    await repo.save(player);

    await new DeletePlayerUseCase(repo, publisher).execute({
      id: player.props.id,
      actor,
    });

    const found = await repo.findById(player.props.id);
    expect(found).toBeNull();
    expect(publisher.publish).toHaveBeenCalledOnce();
  });

  it("throws NotFoundException when missing", async () => {
    const repo = new InMemoryPlayerRepository();
    const publisher = makePublisher();
    await expect(
      new DeletePlayerUseCase(repo, publisher).execute({
        id: "00000000-0000-0000-0000-000000000000",
        actor,
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
