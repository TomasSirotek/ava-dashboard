import { useSyncExternalStore } from "react"
import { DESKTOP_QUERY } from "@/layout/layout.content"

const query = window.matchMedia(DESKTOP_QUERY)
const subscribe = (onChange: () => void) => {
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

// True on screens wide enough for the resizable layout; re-renders when the window crosses the breakpoint.
export function useIsDesktop() {
  return useSyncExternalStore(subscribe, () => query.matches)
}
