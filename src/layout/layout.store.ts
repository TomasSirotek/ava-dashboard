import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { GridPanelId, IPanelLayoutStore } from "@/layout/app-layout.interface"
import { DEFAULT_PANEL_ORDER, PANEL_ORDER_KEY } from "@/layout/layout.content"

/** `order` with panels `a` and `b` exchanged; unchanged if either is missing or they are the same. */
export const swapPanels = (order: GridPanelId[], a: GridPanelId, b: GridPanelId) => {
  const i = order.indexOf(a)
  const j = order.indexOf(b)
  if (i === -1 || j === -1 || i === j) return order
  const next = [...order]
  next[i] = b
  next[j] = a
  return next
}

/** A stored order is only used if it holds exactly the current panels (ids may change between versions). */
export const isValidOrder = (order: unknown): order is GridPanelId[] =>
  Array.isArray(order) && order.length === DEFAULT_PANEL_ORDER.length && DEFAULT_PANEL_ORDER.every((id) => order.includes(id))

// Which panel sits in which grid slot; remembered in localStorage.
export const usePanelLayoutStore = create<IPanelLayoutStore>()(
  persist(
    (set) => ({
      order: DEFAULT_PANEL_ORDER,
      swap: (a, b) => set((s) => ({ order: swapPanels(s.order, a, b) })),
    }),
    {
      name: PANEL_ORDER_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ order: s.order }),
      merge: (persisted, current) => {
        const order = (persisted as Partial<IPanelLayoutStore> | undefined)?.order
        return isValidOrder(order) ? { ...current, order } : current
      },
    },
  ),
)
