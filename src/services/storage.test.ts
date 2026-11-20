import { afterEach, describe, expect, it, vi } from "vitest";
import { readItem, removeItem, writeItem } from "@/services/storage";

const KEY = "draughts.test";

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("storage", () => {
  it("writes, reads and removes an item", () => {
    writeItem(KEY, "saved");
    expect(readItem(KEY)).toBe("saved");

    removeItem(KEY);
    expect(readItem(KEY)).toBeNull();
  });

  it("reads null for an item that is not there", () => {
    expect(readItem(KEY)).toBeNull();
  });
});

// Plan section 7.2, test 20: storage that throws never breaks the game (spec section 6.6, item 10).
describe("storage that throws", () => {
  it("reads null when reading throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Blocked", "SecurityError");
    });

    expect(readItem(KEY)).toBeNull();
  });

  it("goes on when writing throws, as when storage is full", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Full", "QuotaExceededError");
    });

    expect(() => writeItem(KEY, "saved")).not.toThrow();
  });

  it("goes on when removing throws", () => {
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new DOMException("Blocked", "SecurityError");
    });

    expect(() => removeItem(KEY)).not.toThrow();
  });

  it("goes on when localStorage itself cannot be reached, as in some private windows", () => {
    vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
      throw new DOMException("Blocked", "SecurityError");
    });

    expect(readItem(KEY)).toBeNull();
    expect(() => writeItem(KEY, "saved")).not.toThrow();
    expect(() => removeItem(KEY)).not.toThrow();
  });
});
