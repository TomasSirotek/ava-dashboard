import { create } from "zustand"
import type { IJointHighlightStore } from "@/features/joints/joints.interface"

export const useJointHighlightStore = create<IJointHighlightStore>()((set) => ({
  highlighted: [],
  toggle: (joint) =>
    set((s) => ({
      highlighted: s.highlighted.includes(joint) ? s.highlighted.filter((j) => j !== joint) : [...s.highlighted, joint].sort(),
    })),
}))
