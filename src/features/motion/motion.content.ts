import type { IMotionTargetItem } from "@/features/motion/motion.interface"

export const MOTION_TARGETS: IMotionTargetItem[] = [
  { value: "sim", label: "Simulation" },
  { value: "real", label: "Hardware" },
]

export const MOTION_DEFAULTS = { velocity: 70, accel: 45, duration: 2 }

// Velocity below this would make a move take forever; the slider floor is treated as this.
export const MIN_VELOCITY_PCT = 5
