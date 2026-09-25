import type { LucideIcon } from "lucide-react"

export type ControlMode = "manual" | "auto" | "controller"

export interface IControlModeItem {
  value: ControlMode
  label: string
  icon: LucideIcon
}

export interface IControlStore {
  mode: ControlMode
  estop: boolean
  /** Connected gamepad id, or null. */
  pad: string | null
  setMode: (mode: ControlMode) => void
  toggleEstop: () => void
  scanPads: () => string | null
  rescanPads: () => void
}

export interface IAutoModeConfirmProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}
