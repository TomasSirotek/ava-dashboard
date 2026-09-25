import { useEffect } from "react"
import { Ros, Service, Topic } from "roslib"
import { LATENCY_PROBE_MS, MOCK_TICK_MS, RECONNECT_MS, ROSBRIDGE_URL } from "@/features/robot/robot.content"
import type { IJointStateMsg } from "@/features/robot/robot.interface"
import { attachRos } from "@/features/robot/robot.ros"
import { useRobotStore } from "@/features/robot/robot.store"

// Live telemetry from rosbridge /joint_states. While rosbridge is unreachable the store
// falls back to simulated data (source "mock") and the connection is retried.
export function useRobotFeed() {
  useEffect(() => {
    const store = useRobotStore.getState()
    let mock: number | undefined
    let probe: number | undefined
    let retry: number | undefined
    let ros: Ros | undefined
    let disposed = false
    let lastMsg = 0

    const startMock = () => {
      if (mock === undefined) mock = window.setInterval(store.tick, MOCK_TICK_MS)
    }
    const stopMock = () => {
      window.clearInterval(mock)
      mock = undefined
    }

    const connect = () => {
      const conn = new Ros({})
      ros = conn
      // Events from a connection that is no longer the current one (closed on unmount, or
      // replaced by a reconnect) must not touch shared state.
      const stale = () => disposed || ros !== conn
      const jointStates = new Topic<IJointStateMsg>({ ros: conn, name: "/joint_states", messageType: "sensor_msgs/msg/JointState" })
      const getTime = new Service({ ros: conn, name: "/rosapi/get_time", serviceType: "rosapi_msgs/srv/GetTime" })

      conn.on("connection", () => {
        if (stale()) return
        attachRos(conn)
        // Connected, but not live yet: keep simulating until /joint_states actually arrives.
        store.setLink({ connected: true })
        let live = false
        jointStates.subscribe((msg) => {
          if (stale()) return
          const now = performance.now()
          if (!live) {
            // First real message: stop the simulation and start the sliders from the robot's
            // real pose, so the first drag does not yank the other joints to stale targets.
            live = true
            stopMock()
            store.setLink({ source: "ros" })
            store.applyJointState(msg)
            store.setCommandedAll(useRobotStore.getState().jointState.position, false)
            lastMsg = now
            return
          }
          // Exponential moving average of the message rate.
          store.setLink({ rate: useRobotStore.getState().rate * 0.9 + (1000 / (now - lastMsg)) * 0.1 })
          lastMsg = now
          store.applyJointState(msg)
        })
        probe = window.setInterval(() => {
          const sent = performance.now()
          getTime.callService({}, () => store.setLink({ latency: Math.round(performance.now() - sent) }))
        }, LATENCY_PROBE_MS)
      })
      conn.on("close", () => {
        if (stale()) return
        attachRos(null)
        window.clearInterval(probe)
        lastMsg = 0
        store.setLink({ connected: false, source: "mock" })
        startMock()
        if (!disposed) retry = window.setTimeout(connect, RECONNECT_MS)
      })
      conn.connect(ROSBRIDGE_URL).catch(() => {
        // A failed connect also emits "close", which schedules the retry.
      })
    }

    startMock()
    connect()
    return () => {
      disposed = true
      stopMock()
      window.clearInterval(probe)
      window.clearTimeout(retry)
      ros?.close()
    }
  }, [])
}
