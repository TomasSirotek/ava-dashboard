import { CpuAi, Hand } from "lucide-react"
import type { ControlMode, IControlModeItem } from "@/features/control/control.interface"

export const CONTROL_MODES: Record<ControlMode, IControlModeItem> = {
  manual: { value: "manual", label: "Manual", icon: Hand },
  auto: { value: "auto", label: "Automatic", icon: CpuAi },
  // Controller mode (disabled): controller: { value: "controller", label: "Controller", icon: Gamepad2 },
}

export const PAD_HINT = "Plug in or pair a controller, then press any button."
