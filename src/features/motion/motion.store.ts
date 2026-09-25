import { create } from "zustand"
import { MIN_VELOCITY_PCT, MOTION_DEFAULTS } from "@/features/motion/motion.content"
import type { IMotionSettings, IMotionStore } from "@/features/motion/motion.interface"

export const useMotionStore = create<IMotionStore>()((set) => ({
  target: "sim",
  ...MOTION_DEFAULTS,
  update: (patch) => set(patch),
}))

// Seconds a commanded move takes: the base duration stretched by the velocity scale.
export const moveDuration = ({ duration, velocity }: IMotionSettings) => (duration * 100) / Math.max(velocity, MIN_VELOCITY_PCT)
