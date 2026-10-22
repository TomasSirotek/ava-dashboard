import { useEffect } from "react"
import { toast } from "sonner"
import { CONNECT_WINDOW_MS } from "@/features/connection/connection.content"
import { useConnectionStore } from "@/features/connection/connection.store"
import { useRobotStore } from "@/features/robot/robot.store"

const WINDOW_S = CONNECT_WINDOW_MS / 1000

// Pops a notification when the rosbridge link comes up or drops, and when a connect window runs out without a link.
// Dropping the old link for a Connect press is not reported as lost.
export function useLinkNotifier() {
  useEffect(() => {
    const offRobot = useRobotStore.subscribe((s, prev) => {
      if (s.connected === prev.connected) return
      const { url, enabled, tryingUntil } = useConnectionStore.getState()
      if (s.connected) toast.success("Connected to rosbridge", { description: url })
      else if (tryingUntil !== null) return
      else if (enabled) toast.warning("rosbridge connection lost", { description: `Reconnecting for up to ${WINDOW_S} s…` })
      else toast.info("Disconnected from rosbridge", { description: "Showing the built-in simulation." })
    })
    const offConnection = useConnectionStore.subscribe((s, prev) => {
      if (prev.tryingUntil === null || s.tryingUntil !== null || !s.enabled || useRobotStore.getState().connected) return
      toast.error("Not connected to rosbridge", {
        description: `${s.url} did not answer within ${WINDOW_S} s. Start rosbridge, then press Connect in the Link tab.`,
      })
    })
    return () => {
      offRobot()
      offConnection()
    }
  }, [])
}
