// The Content Security Policy for the built site (plan section 6).
// GitHub Pages cannot set response headers, so the policy is written into index.html as a meta tag at build time.

export function contentSecurityPolicy(apiBaseUrl: string): string {
  const connectSources = ["'self'"];
  const apiOrigin = originOf(apiBaseUrl);
  if (apiOrigin) {
    connectSources.push(apiOrigin);
  }

  return [
    "default-src 'self'",
    `connect-src ${connectSources.join(" ")}`,
    "img-src 'self' data:",
    // The pieces are placed with inline style attributes.
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "script-src 'self'",
    "base-uri 'self'",
    "form-action 'none'",
  ].join("; ");
}

// A relative base URL, such as "/api", is on the site itself, so 'self' already covers it.
function originOf(apiBaseUrl: string): string | null {
  if (apiBaseUrl.trim() === "") {
    throw new Error("VITE_API_BASE_URL is empty. Set it in the .env file for this mode (plan section 2).");
  }
  if (apiBaseUrl.startsWith("/")) {
    return null;
  }
  return new URL(apiBaseUrl).origin;
}
