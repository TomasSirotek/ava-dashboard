import type { IBrand, IExternalLink } from "@/features/header/header.interface"

export const BRAND: IBrand = { name: "AVA", subtitle: "Test environment" }

export const GITHUB_LINK: IExternalLink = { href: "https://github.com/TomasSirotek", label: "TomasSirotek on GitHub" }

// Identifies this browser session (one per page load) in the header and the system log; 6 hex digits.
// getRandomValues also works on plain-http origins, unlike randomUUID.
export const SESSION_ID = Array.from(crypto.getRandomValues(new Uint8Array(3)), (b) => b.toString(16).padStart(2, "0"))
  .join("")
  .toUpperCase()
