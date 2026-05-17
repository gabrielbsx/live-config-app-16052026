import { asActorId } from "@/domain/entity/identifier.js";
import { describe, expect, it, vi } from "vitest";
import type { EventPublisher } from "@/domain/event/event-publisher.js";
import type { PlayerRepository } from "@/domain/repository/player.repository.js";
import { CreatePlayerUseCase } from "./create-player.use-case.js";

const makeRepo = (): PlayerRepository => ({
  save: vi.fn(async (p) => p.props.id),
  findById: vi.fn(async () => null),
  findByPagination: vi.fn(async () => ({
    items: [],
    meta: { totalItems: 0, totalPages: 0, currentPage: 1, pageSize: 10 },
  })),
});

const makePublisher = (): EventPublisher => ({
  publish: vi.fn(async () => undefined),

});

const actor = { id: asActorId("tester") };

describe("CreatePlayerUseCase", () => {
  it("creates and persists player", async () => {
    const repo = makeRepo();
    const publisher = makePublisher();
    const useCase = new CreatePlayerUseCase(repo, publisher);

    const result = await useCase.execute({
      name: "Alice",
      nickname: "Aly",
      level: 1,
      evolution: "rookie",
      actor,
    });

    expect(result.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(repo.save).toHaveBeenCalledOnce();
  });

  it("propagates domain exception when level above cap", async () => {
    const repo = makeRepo();
    const publisher = makePublisher();
    const useCase = new CreatePlayerUseCase(repo, publisher);

    await expect(
      useCase.execute({
        name: "X",
        nickname: "x",
        level: 9999,
        evolution: "rookie",
        actor,
      }),
    ).rejects.toThrow();
    expect(repo.save).not.toHaveBeenCalled();
  });
});
