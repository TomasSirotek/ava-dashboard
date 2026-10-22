import { create } from "zustand"
import { useMotionStore } from "@/features/motion/motion.store"
import { INITIAL_ROBOT_STATE, JOINT_NAMES, JOINT_SERVOS, MOCK_TICK_MS, SERVO_STALL_NM } from "@/features/robot/robot.content"
import type { IRobotState, IRobotStore, JointReadout } from "@/features/robot/robot.interface"

const RAD_TO_DEG = 180 / Math.PI

export const useRobotStore = create<IRobotStore>()((set) => ({
  ...INITIAL_ROBOT_STATE,
  // Offline simulation: positions ease toward the commanded pose (faster at higher velocity scale), and
  // velocity is the position change per tick. No noise and no effort: it shows exactly what it computes.
  tick: () =>
    set((s) => {
      const ease = 0.02 + 0.13 * (useMotionStore.getState().velocity / 100)
      const position = s.jointState.position.map((v, i) => v + (s.commanded[i] - v) * ease)
      return {
        jointState: {
          ...s.jointState,
          position,
          velocity: position.map((v, i) => (v - s.jointState.position[i]) / (MOCK_TICK_MS / 1000)),
        },
      }
    }),
  // Live /joint_states: reorder by name into JOINT_NAMES, convert to the UI's units
  // (degrees, effort as % of stall). Joints missing from the message keep their last value.
  // A message without measured effort (the real arm) clears it, so no torque is shown. ros2_control's
  // joint_state_broadcaster fills effort with NaN there, which rosbridge sends as null.
  applyJointState: (msg) =>
    set((s) => {
      const index = new Map(msg.name.map((n, i) => [n, i]))
      const pick = (arr: number[], prev: number[] | null, map: (v: number, i: number) => number) =>
        JOINT_NAMES.map((n, i) => {
          const k = index.get(n)
          return k === undefined ? (prev?.[i] ?? 0) : map(arr[k] ?? 0, i)
        })
      return {
        jointState: {
          name: JOINT_NAMES,
          position: pick(msg.position, s.jointState.position, (v) => v * RAD_TO_DEG),
          velocity: pick(msg.velocity, s.jointState.velocity, (v) => v * RAD_TO_DEG),
          effort: !msg.effort.some(Number.isFinite)
            ? null
            : pick(msg.effort, s.jointState.effort, (v, i) => Math.min(100, (Math.abs(v) / SERVO_STALL_NM[JOINT_SERVOS[i]]) * 100)),
        },
      }
    }),
  setCommanded: (index, deg) => set((s) => ({ commanded: s.commanded.map((v, i) => (i === index ? deg : v)), commandId: s.commandId + 1 })),
  setCommandedAll: (deg, fromUser = true) => set((s) => ({ commanded: [...deg], commandId: fromUser ? s.commandId + 1 : s.commandId })),
  setLink: (link) => set(link),
  countCommand: () => set((s) => ({ commandsSent: s.commandsSent + 1, lastCommandAt: Date.now() })),
}))

// Where the joint angles shown next to the sliders come from:
// - sim: the built-in simulation (no rosbridge or no /joint_states)
// - live: measured, by Gazebo or ros2_control's mock hardware; both also publish effort
// - cmd: the real arm. Its hobby servos report nothing back, so ava_hardware publishes the commanded angle
//   (clamped and rate-limited) and no measured effort. That is how the real arm is told apart.
export const selectReadout = (s: IRobotState): JointReadout => (s.source === "mock" ? "sim" : s.jointState.effort ? "live" : "cmd")
