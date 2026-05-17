import { describe, expect, it, vi } from "vitest";
import { BaseDomainEvent } from "@/domain/event/domain-event.js";
import { InMemoryEventPublisher } from "./in-memory-event-publisher.js";

class TestEvent extends BaseDomainEvent {
  constructor(aggregateId: string) {
    super("test.event", aggregateId);
  }
}

describe("InMemoryEventPublisher", () => {
  it("dispatches to subscribed handlers", async () => {
    const publisher = new InMemoryEventPublisher();
    const handler = vi.fn();
    publisher.subscribe("test.event", handler);

    await publisher.publish([new TestEvent("a-1")]);

    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0]?.[0].aggregateId).toBe("a-1");
  });

  it("ignores events with no subscribers", async () => {
    const publisher = new InMemoryEventPublisher();
    await expect(
      publisher.publish([new TestEvent("orphan")]),
    ).resolves.toBeUndefined();
  });

  it("isolates handler failures (one bad handler does not break others)", async () => {
    const publisher = new InMemoryEventPublisher();
    const good = vi.fn();
    publisher.subscribe("test.event", () => {
      throw new Error("boom");
    });
    publisher.subscribe("test.event", good);

    await publisher.publish([new TestEvent("a-2")]);

    expect(good).toHaveBeenCalledOnce();
  });

  it("supports multiple events", async () => {
    const publisher = new InMemoryEventPublisher();
    const handler = vi.fn();
    publisher.subscribe("test.event", handler);

    await publisher.publish([new TestEvent("1"), new TestEvent("2")]);

    expect(handler).toHaveBeenCalledTimes(2);
  });
});
