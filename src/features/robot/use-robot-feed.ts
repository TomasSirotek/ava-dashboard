import { useEffect } from "react"
import { Ros, Service, Topic } from "roslib"
import { useConnectionStore } from "@/features/connection/connection.store"
import { CONNECT_TIMEOUT_MS, LATENCY_PROBE_MS, MOCK_TICK_MS, RECONNECT_MS } from "@/features/robot/robot.content"
import type { IJointStateMsg } from "@/features/robot/robot.interface"
import { attachRos } from "@/features/robot/robot.ros"
import { useRobotStore } from "@/features/robot/robot.store"

// Live telemetry from rosbridge /joint_states at the Link tab's URL. While rosbridge is unreachable (or the link is
// switched off) the store falls back to simulated data (source "mock"); while enabled, the connection is retried.
export function useRobotFeed() {
  useEffect(() => {
    const store = useRobotStore.getState()
    let mock: number | undefined
    let probe: number | undefined
    let retry: number | undefined
    let ros: Ros | undefined
    let disposed = false
    // Messages received since the last rate update, and when that window started (null = not live yet).
    let received = 0
    let windowStart: number | null = null

    const startMock = () => {
      if (mock === undefined) mock = window.setInterval(store.tick, MOCK_TICK_MS)
    }
    const stopMock = () => {
      window.clearInterval(mock)
      mock = undefined
    }
    // Back to the simulation with no link stats.
    const goOffline = () => {
      attachRos(null)
      window.clearInterval(probe)
      received = 0
      windowStart = null
      store.setLink({ connected: false, source: "mock", rate: null, latency: null })
      startMock()
    }

    const connect = () => {
      const link = useConnectionStore.getState()
      if (disposed || !link.enabled || link.tryingUntil === null) return
      link.noteTry()
      const conn = new Ros({})
      ros = conn
      let opened = false
      // Events from a connection that is no longer the current one (closed on unmount, on a URL change or by
      // Disconnect, or replaced by a reconnect) must not touch shared state.
      const stale = () => disposed || ros !== conn
      const jointStates = new Topic<IJointStateMsg>({ ros: conn, name: "/joint_states", messageType: "sensor_msgs/msg/JointState" })
      const getTime = new Service({ ros: conn, name: "/rosapi/get_time", serviceType: "rosapi_msgs/srv/GetTime" })
      // Attempt over without a link: back to the simulation. A working link that dropped opens a new connect window;
      // otherwise retry while the current window lasts, and give up (Not connected) when it has run out.
      const fail = () => {
        goOffline()
        const connection = useConnectionStore.getState()
        if (opened) connection.startTrying()
        const until = useConnectionStore.getState().tryingUntil
        if (until !== null && Date.now() + RECONNECT_MS < until) retry = window.setTimeout(connect, RECONNECT_MS)
        else connection.stopTrying()
      }
      // A handshake that hangs (e.g. an unreachable host) is abandoned, at the latest when the connect window ends;
      // its late events are then stale.
      const timeout = Math.max(0, Math.min(CONNECT_TIMEOUT_MS, (link.tryingUntil ?? 0) - Date.now()))
      const giveUp = window.setTimeout(() => {
        if (stale()) return
        ros = undefined
        conn.close()
        fail()
      }, timeout)

      conn.on("connection", () => {
        window.clearTimeout(giveUp)
        if (stale()) return
        attachRos(conn)
        // Connected, but not live yet: keep simulating until /joint_states actually arrives.
        opened = true
        store.setLink({ connected: true })
        useConnectionStore.getState().stopTrying()
        let live = false
        jointStates.subscribe((msg) => {
          if (stale()) return
          if (!live) {
            // First real message: stop the simulation and start the sliders from the robot's
            // real pose, so the first drag does not yank the other joints to stale targets.
            live = true
            stopMock()
            store.setLink({ source: "ros" })
            store.applyJointState(msg)
            store.setCommandedAll(useRobotStore.getState().jointState.position, false)
            windowStart = performance.now()
            return
          }
          received++
          store.applyJointState(msg)
        })
        // Every probe: the /joint_states rate as messages counted over the window (bursts cannot skew it),
        // and the rosbridge round trip as the time a rosapi call takes.
        probe = window.setInterval(() => {
          const now = performance.now()
          if (windowStart !== null) store.setLink({ rate: (received * 1000) / (now - windowStart) })
          received = 0
          windowStart = live ? now : null
          getTime.callService({}, () => store.setLink({ latency: Math.round(performance.now() - now) }))
        }, LATENCY_PROBE_MS)
      })
      conn.on("close", () => {
        window.clearTimeout(giveUp)
        if (stale()) return
        fail()
      })
      conn.connect(link.url).catch(() => {
        // A failed connect also emits "close", which schedules the retry.
      })
    }

    // Drop the current connection (its late events are ignored as stale) and start over with the current settings.
    const restart = () => {
      window.clearTimeout(retry)
      const old = ros
      ros = undefined
      old?.close()
      goOffline()
      connect()
    }
    const offConnection = useConnectionStore.subscribe((s, prev) => {
      if (s.attempt !== prev.attempt || s.enabled !== prev.enabled) restart()
    })

    startMock()
    useConnectionStore.getState().startTrying()
    connect()
    return () => {
      disposed = true
      offConnection()
      stopMock()
      window.clearInterval(probe)
      window.clearTimeout(retry)
      ros?.close()
    }
  }, [])
}
