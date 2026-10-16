import { useEffect } from "react"
import { CONTROL_MODES } from "@/features/control/control.content"
import { useControlStore } from "@/features/control/control.store"
import { DEMOS } from "@/features/demos/demos.content"
import { useDemoStore } from "@/features/demos/demos.store"
import { useLogStore } from "@/features/logs/logs.store"
import { ROSBRIDGE_URL } from "@/features/robot/robot.content"
import { useRobotStore } from "@/features/robot/robot.store"

// Writes state transitions (link, e-stop, control mode, gamepad, demos) to the system log.
export function useSystemLog() {
  useEffect(() => {
    const { add } = useLogStore.getState()
    const unsubscribers = [
      useRobotStore.subscribe((s, prev) => {
        if (s.connected !== prev.connected)
          add(s.connected ? "info" : "warn", s.connected ? `rosbridge connected (${ROSBRIDGE_URL})` : "rosbridge unreachable, simulating")
        if (s.source !== prev.source)
          add(s.source === "ros" ? "success" : "warn", s.source === "ros" ? "Live /joint_states" : "No /joint_states, simulated data")
      }),
      useControlStore.subscribe((s, prev) => {
        if (s.estop !== prev.estop) add(s.estop ? "error" : "success", s.estop ? "Emergency stop engaged" : "E-stop released")
        if (s.mode !== prev.mode) add("info", `Control mode: ${CONTROL_MODES[s.mode].label}`)
        if (s.pad !== prev.pad) add(s.pad ? "success" : "warn", s.pad ? `Controller connected: ${s.pad}` : "Controller disconnected")
      }),
      useDemoStore.subscribe((s, prev) => {
        if (s.running === prev.running) return
        if (s.running) add("info", `Demo started: ${DEMOS[s.running].label}`)
        else if (prev.running) add("info", `Demo stopped: ${DEMOS[prev.running].label}`)
      }),
    ]
    return () => {
      for (const unsubscribe of unsubscribers) unsubscribe()
    }
  }, [])
}
