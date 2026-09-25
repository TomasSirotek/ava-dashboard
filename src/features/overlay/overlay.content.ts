import type { IPoseValue } from "@/features/overlay/overlay.interface"

// Placeholder until forward kinematics is wired to the live joint state.
export const CURRENT_POSE: IPoseValue[] = [
  { label: "X", value: 182.4, unit: "mm" },
  { label: "Y", value: -12.8, unit: "mm" },
  { label: "Z", value: 318.6, unit: "mm" },
  { label: "Roll", value: 0.2, unit: "°" },
  { label: "Pitch", value: 14.8, unit: "°" },
  { label: "Yaw", value: -2.1, unit: "°" },
]

// Effort above this is shown as a warning.
export const TORQUE_WARN = 85
