import { toast } from "sonner"
import { create } from "zustand"
import { DEMOS } from "@/features/demos/demos.content"
import type { IDemoStore } from "@/features/demos/demos.interface"

export const useDemoStore = create<IDemoStore>()((set, get) => ({
  running: null,
  step: 0,
  start: (id) => {
    set({ running: id, step: 0 })
    toast.info(`Demo: ${DEMOS[id].label}`)
  },
  stop: () => {
    const { running } = get()
    if (!running) return
    set({ running: null, step: 0 })
    toast.info(`${DEMOS[running].label} stopped`)
  },
  setStep: (step) => set({ step }),
}))
