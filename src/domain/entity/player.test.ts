import { asActorId } from "@/domain/entity/identifier.js";
import { describe, expect, it } from "vitest";
import { DomainException } from "../exception/domain.exception.js";
import { Player } from "./player.js";
import { PLAYER_LIMITS } from "./player.constants.js";

const actor = { id: asActorId("tester") };

const validInput = {
  name: "Alice",
  nickname: "Aly",
  level: 10,
  evolution: "pro" as const,
};

describe("Player.fromInput", () => {
  it("constructs valid player", () => {
    const player = Player.fromInput(validInput, actor);
    expect(player.props.name.value).toBe("Alice");
    expect(player.props.nickname.value).toBe("Aly");
    expect(player.props.level.value).toBe(10);
    expect(player.props.evolution.value).toBe("pro");
    expect(player.props.createdBy).toBe("tester");
  });

  it("rejects level above cap", () => {
    expect(() =>
      Player.fromInput(
        { ...validInput, level: PLAYER_LIMITS.LEVEL_MAX + 1 },
        actor,
      ),
    ).toThrowError(DomainException);
  });

  it("accepts level at cap boundary", () => {
    const player = Player.fromInput(
      { ...validInput, level: PLAYER_LIMITS.LEVEL_MAX },
      actor,
    );
    expect(player.props.level.value).toBe(PLAYER_LIMITS.LEVEL_MAX);
  });

  it("stamps actor on creation", () => {
    const player = Player.fromInput(validInput, { id: asActorId("user-42") });
    expect(player.props.createdBy).toBe("user-42");
  });

  it("emits PlayerCreatedEvent on creation", () => {
    const player = Player.fromInput(validInput, actor);
    const events = player.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.name).toBe("player.created");
    expect(events[0]?.aggregateId).toBe(player.id);
  });
});

describe("Player.update", () => {
  it("touches audit and emits PlayerUpdatedEvent", () => {
    const player = Player.fromInput(validInput, actor);
    player.pullDomainEvents();

    player.update({ ...validInput, name: "Bob" }, { id: asActorId("editor") });

    expect(player.props.name.value).toBe("Bob");
    expect(player.props.updatedBy).toBe("editor");
    expect(player.props.updatedAt).toBeInstanceOf(Date);

    const events = player.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.name).toBe("player.updated");
  });
});

describe("Player.softDelete", () => {
  it("emits PlayerSoftDeletedEvent", () => {
    const player = Player.fromInput(validInput, actor);
    player.pullDomainEvents();

    player.softDelete({ id: asActorId("remover") });

    expect(player.isDeleted).toBe(true);
    const events = player.pullDomainEvents();
    expect(events.map((e) => e.name)).toEqual(["player.soft-deleted"]);
  });

  it("does not re-emit when already deleted", () => {
    const player = Player.fromInput(validInput, actor);
    player.softDelete({ id: asActorId("remover") });
    player.pullDomainEvents();

    player.softDelete({ id: asActorId("remover") });
    expect(player.pullDomainEvents()).toHaveLength(0);
  });
});
