import { useEffect } from "react"
import { toast } from "sonner"
import { useControlStore } from "@/features/control/control.store"

// Keeps the control store in sync with the browser Gamepad API.
export function useGamepadWatcher() {
  useEffect(() => {
    const { scanPads } = useControlStore.getState()
    scanPads()
    const onConnect = (e: GamepadEvent) => {
      scanPads()
      toast.success("Controller connected", { description: e.gamepad.id })
    }
    const onDisconnect = () => {
      scanPads()
      toast.warning("Controller disconnected")
    }
    window.addEventListener("gamepadconnected", onConnect)
    window.addEventListener("gamepaddisconnected", onDisconnect)
    return () => {
      window.removeEventListener("gamepadconnected", onConnect)
      window.removeEventListener("gamepaddisconnected", onDisconnect)
    }
  }, [])
}
