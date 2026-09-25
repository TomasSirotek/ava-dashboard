import { create } from "zustand"
import { useMotionStore } from "@/features/motion/motion.store"
import { INITIAL_ROBOT_STATE, JOINT_NAMES, JOINT_SERVOS, SERVO_STALL_NM } from "@/features/robot/robot.content"
import type { IRobotStore } from "@/features/robot/robot.interface"

const RAD_TO_DEG = 180 / Math.PI

export const useRobotStore = create<IRobotStore>()((set) => ({
  ...INITIAL_ROBOT_STATE,
  // Offline simulation: positions ease toward the commanded pose (faster at higher
  // velocity scale), effort drifts.
  tick: () =>
    set((s) => {
      const ease = 0.02 + 0.13 * (useMotionStore.getState().velocity / 100)
      return {
        latency: 16 + Math.round(Math.random() * 7),
        rate: 49 + Math.random() * 2,
        jointState: {
          ...s.jointState,
          position: s.jointState.position.map((v, i) => v + (s.commanded[i] - v) * ease + (Math.random() - 0.5) * 0.12),
          effort: s.jointState.effort.map((v, i) => Math.max(4, Math.min(100, v + Math.sin(Date.now() / 900 + i) * 0.9))),
        },
      }
    }),
  // Live /joint_states: reorder by name into JOINT_NAMES, convert to the UI's units
  // (degrees, effort as % of stall). Joints missing from the message keep their last value;
  // a message without effort (e.g. Gazebo, position-only) shows 0%.
  applyJointState: (msg) =>
    set((s) => {
      const index = new Map(msg.name.map((n, i) => [n, i]))
      const pick = (arr: number[], prev: number[], map: (v: number, i: number) => number) =>
        JOINT_NAMES.map((n, i) => {
          const k = index.get(n)
          return k === undefined ? prev[i] : map(arr[k] ?? 0, i)
        })
      return {
        jointState: {
          name: JOINT_NAMES,
          position: pick(msg.position, s.jointState.position, (v) => v * RAD_TO_DEG),
          velocity: pick(msg.velocity, s.jointState.velocity, (v) => v * RAD_TO_DEG),
          effort: pick(msg.effort, s.jointState.effort, (v, i) => Math.min(100, (Math.abs(v) / SERVO_STALL_NM[JOINT_SERVOS[i]]) * 100)),
        },
      }
    }),
  setCommanded: (index, deg) => set((s) => ({ commanded: s.commanded.map((v, i) => (i === index ? deg : v)), commandId: s.commandId + 1 })),
  setCommandedAll: (deg, fromUser = true) => set((s) => ({ commanded: [...deg], commandId: fromUser ? s.commandId + 1 : s.commandId })),
  setLink: (link) => set(link),
}))
