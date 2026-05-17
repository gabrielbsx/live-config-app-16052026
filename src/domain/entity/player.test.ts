import { describe, expect, it } from "vitest";
import { DomainException } from "../exception/domain.exception.js";
import { Player } from "./player.js";
import { PLAYER_LIMITS } from "./player.constants.js";

const actor = { id: "tester" };

const validInput = {
  name: "Alice",
  nickname: "Aly",
  level: 10,
  evolution: "pro" as const,
};

describe("Player.fromInput", () => {
  it("constructs valid player", () => {
    const player = Player.fromInput(validInput, actor);
    expect(player.props.name).toBe("Alice");
    expect(player.props.nickname).toBe("Aly");
    expect(player.props.level).toBe(10);
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
    expect(player.props.level).toBe(PLAYER_LIMITS.LEVEL_MAX);
  });

  it("stamps actor on creation", () => {
    const player = Player.fromInput(validInput, { id: "user-42" });
    expect(player.props.createdBy).toBe("user-42");
  });
});
