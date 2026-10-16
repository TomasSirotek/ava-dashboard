import { useEffect } from "react"
import { HISTORY_SAMPLE_MS } from "@/features/history/history.content"
import { useHistoryStore } from "@/features/history/history.store"
import { useRobotStore } from "@/features/robot/robot.store"

// Records the robot store's joint state at a fixed rate for the charts, independent of how often
// /joint_states (or the simulation) updates it.
export function useJointHistory() {
  useEffect(() => {
    const timer = window.setInterval(() => {
      const { position, velocity, effort } = useRobotStore.getState().jointState
      useHistoryStore.getState().push({ t: Date.now(), position, velocity, effort })
    }, HISTORY_SAMPLE_MS)
    return () => window.clearInterval(timer)
  }, [])
}
