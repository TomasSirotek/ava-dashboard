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

/** The open panels as grid rows: two per row, an odd last one alone (full width). */
export const gridRows = (order: GridPanelId[], hidden: GridPanelId[]) => {
  const open = order.filter((id) => !hidden.includes(id))
  return Array.from({ length: Math.ceil(open.length / 2) }, (_, r) => open.slice(r * 2, r * 2 + 2))
}

// Which panel sits where and which are closed; remembered in localStorage.
export const usePanelLayoutStore = create<IPanelLayoutStore>()(
  persist(
    (set) => ({
      order: DEFAULT_PANEL_ORDER,
      hidden: [],
      swap: (a, b) => set((s) => ({ order: swapPanels(s.order, a, b) })),
      close: (id) => set((s) => (s.hidden.includes(id) ? s : { hidden: [...s.hidden, id] })),
      open: (id) =>
        set((s) =>
          s.hidden.includes(id) ? { order: [...s.order.filter((p) => p !== id), id], hidden: s.hidden.filter((p) => p !== id) } : s,
        ),
    }),
    {
      name: PANEL_ORDER_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ order: s.order, hidden: s.hidden }),
      merge: (persisted, current) => {
        const { order, hidden } = (persisted as Partial<IPanelLayoutStore> | undefined) ?? {}
        if (!isValidOrder(order)) return current
        const closed = Array.isArray(hidden) ? DEFAULT_PANEL_ORDER.filter((id) => hidden.includes(id)) : []
        return { ...current, order, hidden: closed }
      },
    },
  ),
)
