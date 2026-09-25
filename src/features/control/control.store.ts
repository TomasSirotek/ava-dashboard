import { toast } from "sonner"
import { create } from "zustand"
import { CONTROL_MODES, PAD_HINT } from "@/features/control/control.content"
import type { IControlStore } from "@/features/control/control.interface"

const readPad = () => Array.from(navigator.getGamepads?.() ?? []).find(Boolean)?.id ?? null

export const useControlStore = create<IControlStore>()((set, get) => ({
  mode: "manual",
  estop: false,
  pad: null,
  setMode: (mode) => {
    set({ mode })
    toast.info(`Control mode: ${CONTROL_MODES[mode].label}`)
  },
  toggleEstop: () => {
    const estop = !get().estop
    set({ estop })
    if (estop) toast.error("Emergency stop engaged", { description: "All motion halted and controls locked." })
    else toast.success("E-stop released", { description: "Arm accepts commands again." })
  },
  scanPads: () => {
    const pad = readPad()
    set({ pad })
    return pad
  },
  rescanPads: () => {
    const pad = get().scanPads()
    if (pad) toast.success("Controller connected", { description: pad })
    else toast.warning("No controller found", { description: PAD_HINT })
  },
}))

// `locked` = something other than the user's sliders is driving the arm.
export const selectLocked = (s: IControlStore) => s.estop || s.mode === "auto" || (s.mode === "controller" && s.pad !== null)
