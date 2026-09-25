import { create } from "zustand"
import { INITIAL_ROBOT_STATE } from "@/features/robot/robot.content"
import type { IRobotStore } from "@/features/robot/robot.interface"

export const useRobotStore = create<IRobotStore>()((set) => ({
  ...INITIAL_ROBOT_STATE,
  // Simulated telemetry: positions ease toward the commanded pose, effort drifts.
  tick: () =>
    set((s) => ({
      latency: 16 + Math.round(Math.random() * 7),
      rate: 49 + Math.random() * 2,
      jointState: {
        ...s.jointState,
        position: s.jointState.position.map((v, i) => v + (s.commanded[i] - v) * 0.08 + (Math.random() - 0.5) * 0.12),
        effort: s.jointState.effort.map((v, i) => Math.max(4, Math.min(100, v + Math.sin(Date.now() / 900 + i) * 0.9))),
      },
    })),
}))
