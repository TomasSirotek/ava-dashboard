import { Activity } from "lucide-react"
import { statusCell } from "@/components/shared/shared.styles"
import { useRobotStore } from "@/features/robot/robot.store"
import { cn } from "@/lib/utils"

export function LinkStats() {
  const rate = useRobotStore((s) => s.rate)
  const latency = useRobotStore((s) => s.latency)
  const connected = useRobotStore((s) => s.source === "ros")
  return (
    <span className={cn(statusCell, "gap-1.5 tracking-normal text-muted-foreground normal-case tabular-nums")}>
      <Activity className="size-3.5" />
      {connected ? `${rate.toFixed(1)} Hz · ${latency} ms` : "— Hz · — ms"}
    </span>
  )
}
