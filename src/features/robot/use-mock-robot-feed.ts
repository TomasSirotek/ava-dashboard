import { useEffect } from "react"
import { MOCK_TICK_MS } from "@/features/robot/robot.content"
import { useRobotStore } from "@/features/robot/robot.store"

export function useMockRobotFeed() {
  useEffect(() => {
    const id = window.setInterval(useRobotStore.getState().tick, MOCK_TICK_MS)
    return () => window.clearInterval(id)
  }, [])
}
