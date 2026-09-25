import { create } from "zustand"
import type { INavigationStore } from "@/features/navigation/navigation.interface"

export const NAVIGATION_ID = "sidebar-navigation"
export const DEFAULT_NAV_ITEM = "joints"

export const useNavigationStore = create<INavigationStore>()((set) => ({
  active: DEFAULT_NAV_ITEM,
  setActive: (active) => set({ active }),
  open: (active) => {
    set({ active })
    // On small screens the sidebar sits below the viewport, so bring it into view.
    document.getElementById(NAVIGATION_ID)?.scrollIntoView({ behavior: "smooth", block: "start" })
  },
}))
