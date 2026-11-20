// Sets the player's light or dark choice on <html> before the page is drawn, so a page never shows the device's
// mode first (spec section 6.4.1, item 2). index.html loads it as a classic script in <head>, which runs before the
// first paint. The app's own code loads later, as a module. useTheme then keeps the choice up to date.
// The key is THEME_KEY in src/services/storage.ts.
try {
  const chosen = window.localStorage.getItem("draughts.theme");
  if (chosen === "light" || chosen === "dark") {
    document.documentElement.dataset.theme = chosen;
  }
} catch {
  // Storage is blocked, so the page follows the device.
}
