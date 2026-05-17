import { describe, expect, it } from "vitest";
import { Entity, type EntityProps } from "./entity.js";

interface ThingProps extends EntityProps {
  label: string;
}

class Thing extends Entity<ThingProps> {}

describe("Entity.create", () => {
  it("generates uuid, audit fields and stamps actor", () => {
    const thing = Thing.create({ label: "x" }, { id: "user-1" });

    expect(thing.props.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
    expect(thing.props.label).toBe("x");
    expect(thing.props.createdBy).toBe("user-1");
    expect(thing.props.createdAt).toBeInstanceOf(Date);
    expect(thing.props.updatedAt).toBeNull();
    expect(thing.props.updatedBy).toBeNull();
    expect(thing.props.deletedAt).toBeNull();
    expect(thing.props.deletedBy).toBeNull();
  });

  it("uses system actor when passed explicitly", () => {
    const thing = Thing.create({ label: "y" }, { id: "system" });
    expect(thing.props.createdBy).toBe("system");
  });

  it("generates unique ids", () => {
    const a = Thing.create({ label: "a" }, { id: "u" });
    const b = Thing.create({ label: "b" }, { id: "u" });
    expect(a.props.id).not.toBe(b.props.id);
  });
});
