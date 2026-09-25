import { useEffect } from "react"
import { useControlStore } from "@/features/control/control.store"
import { moveDuration, useMotionStore } from "@/features/motion/motion.store"
import { COMMAND_THROTTLE_MS, HOLD_S } from "@/features/robot/robot.content"
import { publishJointTarget } from "@/features/robot/robot.ros"
import { useRobotStore } from "@/features/robot/robot.store"

// Sends the commanded pose to ROS when the user changes it. Offline there is nothing to
// send: the store's simulation eases toward `commanded` on its own.
export function useCommandSender() {
  useEffect(() => {
    let timer: number | undefined
    let pending = false

    const send = () => {
      const { commanded, source } = useRobotStore.getState()
      if (source === "ros" && !useControlStore.getState().estop) publishJointTarget(commanded, moveDuration(useMotionStore.getState()))
    }
    // Throttle: send at once, then at most every COMMAND_THROTTLE_MS while a slider is dragged,
    // always finishing with the latest value.
    const schedule = () => {
      if (timer !== undefined) {
        pending = true
        return
      }
      send()
      timer = window.setTimeout(function flush() {
        if (pending) {
          pending = false
          send()
          timer = window.setTimeout(flush, COMMAND_THROTTLE_MS)
        } else timer = undefined
      }, COMMAND_THROTTLE_MS)
    }

    const offRobot = useRobotStore.subscribe((s, prev) => {
      if (s.commandId !== prev.commandId) schedule()
    })
    // E-stop: make the current pose the target, so both the robot and the offline sim stop there.
    const offControl = useControlStore.subscribe((s, prev) => {
      if (!s.estop || prev.estop) return
      window.clearTimeout(timer)
      timer = undefined
      pending = false
      const { jointState, source, setCommandedAll } = useRobotStore.getState()
      setCommandedAll(jointState.position, false)
      if (source === "ros") publishJointTarget(jointState.position, HOLD_S)
    })
    return () => {
      offRobot()
      offControl()
      window.clearTimeout(timer)
    }
  }, [])
}
