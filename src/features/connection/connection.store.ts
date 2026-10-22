import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { CONNECT_WINDOW_MS, DEFAULT_ROSBRIDGE_URL, ROSBRIDGE_URL_KEY } from "@/features/connection/connection.content"
import type { IConnectionStore, LinkPhase } from "@/features/connection/connection.interface"

/** A rosbridge address: ws:// or wss:// with a host. */
export const isWsUrl = (url: string) => {
  try {
    const parsed = new URL(url.trim())
    return (parsed.protocol === "ws:" || parsed.protocol === "wss:") && parsed.hostname !== ""
  } catch {
    return false
  }
}

export const useConnectionStore = create<IConnectionStore>()(
  persist(
    (set) => ({
      url: DEFAULT_ROSBRIDGE_URL,
      enabled: true,
      attempt: 0,
      tryingUntil: null,
      tries: 0,
      connect: (url) => {
        if (!isWsUrl(url)) return false
        set((s) => ({
          url: url.trim(),
          enabled: true,
          attempt: s.attempt + 1,
          tryingUntil: Date.now() + CONNECT_WINDOW_MS,
          tries: 0,
        }))
        return true
      },
      disconnect: () => set({ enabled: false, tryingUntil: null }),
      startTrying: () => set((s) => (s.enabled ? { tryingUntil: Date.now() + CONNECT_WINDOW_MS, tries: 0 } : s)),
      noteTry: () => set((s) => ({ tries: s.tries + 1 })),
      stopTrying: () => set({ tryingUntil: null }),
    }),
    {
      name: ROSBRIDGE_URL_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ url: s.url }),
      merge: (persisted, current) => {
        const url = (persisted as Partial<IConnectionStore> | undefined)?.url
        return typeof url === "string" && isWsUrl(url) ? { ...current, url } : current
      },
    },
  ),
)

/** Connected; trying within a connect window; gave up (Not connected) until the next Connect; or switched off. */
export const linkPhase = (connected: boolean, enabled: boolean, trying: boolean): LinkPhase =>
  connected ? "connected" : trying ? "connecting" : enabled ? "unreachable" : "disconnected"
