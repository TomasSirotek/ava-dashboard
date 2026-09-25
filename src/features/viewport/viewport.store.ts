import { create } from "zustand"
import type { IPartSelectionStore } from "@/features/viewport/viewport.interface"

export const usePartSelectionStore = create<IPartSelectionStore>()((set) => ({
  selected: null,
  select: (part) => set({ selected: part }),
  clear: () => set({ selected: null }),
}))
