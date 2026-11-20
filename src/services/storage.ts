// localStorage, wrapped so that a failure never breaks the game (plan section 3.4, "Storage failures").
// Some private windows block storage, and a full store refuses writes. Then the game runs without saving
// (spec section 6.6, item 10), so each failure is caught and the game goes on.

// The "v1" lets a later version discard old saves (plan section 2).
export const SAVED_GAME_KEY = "draughts.game.v1";

// The stored text, or null when there is none or storage cannot be read.
export function readItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage is blocked or full: the game goes on without saving.
  }
}

export function removeItem(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Storage is blocked: there is nothing to remove.
  }
}
