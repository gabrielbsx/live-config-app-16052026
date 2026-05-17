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

describe("Entity.equals", () => {
  it("returns true for same id, same class", () => {
    const a = Thing.create({ label: "a" }, { id: "u" });
    const b = Thing.restore({ ...a.props });
    expect(a.equals(b)).toBe(true);
  });

  it("returns false for different ids", () => {
    const a = Thing.create({ label: "a" }, { id: "u" });
    const b = Thing.create({ label: "a" }, { id: "u" });
    expect(a.equals(b)).toBe(false);
  });

  it("returns false for null/undefined", () => {
    const a = Thing.create({ label: "a" }, { id: "u" });
    expect(a.equals(null)).toBe(false);
    expect(a.equals(undefined)).toBe(false);
  });
});

describe("Entity.softDelete", () => {
  it("stamps deletedAt and deletedBy", () => {
    const thing = Thing.create({ label: "x" }, { id: "u" });
    thing.softDelete({ id: "remover" });
    expect(thing.isDeleted).toBe(true);
    expect(thing.props.deletedAt).toBeInstanceOf(Date);
    expect(thing.props.deletedBy).toBe("remover");
  });

  it("is idempotent (does not overwrite)", () => {
    const thing = Thing.create({ label: "x" }, { id: "u" });
    thing.softDelete({ id: "first" });
    const firstStamp = thing.props.deletedAt;
    thing.softDelete({ id: "second" });
    expect(thing.props.deletedAt).toBe(firstStamp);
    expect(thing.props.deletedBy).toBe("first");
  });
});

describe("Entity.restore", () => {
  it("rehydrates without regenerating id or audit", () => {
    const props: ThingProps = {
      id: "00000000-0000-0000-0000-000000000001",
      label: "x",
      createdAt: new Date("2020-01-01"),
      createdBy: "u",
      updatedAt: null,
      updatedBy: null,
      deletedAt: null,
      deletedBy: null,
    };
    const thing = Thing.restore(props);
    expect(thing.props.id).toBe(props.id);
    expect(thing.props.createdAt).toBe(props.createdAt);
  });
});
