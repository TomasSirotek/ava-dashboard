import { useEffect, useState } from "react"

export type JointState = { name: string[]; position: number[]; velocity: number[]; effort: number[] }
export type RobotState = { jointState: JointState; commanded: number[]; connected: boolean; latency: number; rate: number }

const names = ["shoulder_pan", "shoulder_lift", "elbow_flex", "wrist_flex", "wrist_roll", "gripper"]
const initial: RobotState = {
  jointState: { name: names, position: [12.4, -28.7, 64.2, -11.6, 38.1, 7.5], velocity: [0.02, -0.01, 0.04, 0.01, -0.02, 0], effort: [42, 94, 88, 34, 18, 7] },
  commanded: [14, -30, 62, -10, 40, 8], connected: true, latency: 18, rate: 49.8,
}
export function useMockRobot() {
  const [state, setState] = useState(initial)
  useEffect(() => { const id = window.setInterval(() => setState((s) => ({ ...s, latency: 16 + Math.round(Math.random() * 7), rate: 49 + Math.random() * 2, jointState: { ...s.jointState, position: s.jointState.position.map((v, i) => v + (s.commanded[i] - v) * .08 + (Math.random() - .5) * .12), effort: s.jointState.effort.map((v, i) => Math.max(4, Math.min(100, v + Math.sin(Date.now() / 900 + i) * .9)))} })), 180); return () => window.clearInterval(id) }, [])
  return state
}
export { names }
