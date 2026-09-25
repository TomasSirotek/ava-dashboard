import { Activity } from "lucide-react"
import { useRobotStore } from "@/features/robot/robot.store"

export function LinkStats() {
  const rate = useRobotStore((s) => s.rate)
  const latency = useRobotStore((s) => s.latency)
  const connected = useRobotStore((s) => s.source === "ros")
  return (
    <span className="flex h-8 items-center gap-1.5 rounded-lg border px-2.5 font-mono text-xs text-muted-foreground tabular-nums">
      <Activity className="size-3.5" />
      {connected ? `${rate.toFixed(1)} Hz · ${latency} ms` : "— Hz · — ms"}
    </span>
  )
}
