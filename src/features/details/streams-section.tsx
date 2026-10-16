import { capsLabel } from "@/components/shared/shared.styles"
import { ROSBRIDGE_URL, TRAJECTORY_TOPIC } from "@/features/robot/robot.content"
import { useRobotStore } from "@/features/robot/robot.store"
import { clockTime, cn } from "@/lib/utils"

// The ROS connections the dashboard uses, with what is actually measured on them; "—" while there is nothing to measure.
export function StreamsSection() {
  const connected = useRobotStore((s) => s.connected)
  const live = useRobotStore((s) => s.source === "ros")
  const rate = useRobotStore((s) => s.rate)
  const latency = useRobotStore((s) => s.latency)
  const sent = useRobotStore((s) => s.commandsSent)
  const lastAt = useRobotStore((s) => s.lastCommandAt)
  const streams = [
    { name: "rosbridge", detail: ROSBRIDGE_URL, value: latency === null ? "—" : `${latency} ms RTT`, on: connected },
    { name: "/joint_states", detail: "in · sensor_msgs/JointState", value: rate === null ? "—" : `${rate.toFixed(1)} Hz`, on: live },
    {
      name: TRAJECTORY_TOPIC,
      detail: `out · ${sent} sent${lastAt === null ? "" : `, last ${clockTime.format(lastAt)}`}`,
      value: connected ? "ready" : "—",
      on: connected,
    },
  ]
  return (
    <section>
      <h3 className={cn(capsLabel, "mb-3 text-muted-foreground")}>Streams</h3>
      <ul className="flex flex-col gap-2.5 text-xs">
        {streams.map(({ name, detail, value, on }) => (
          <li key={name} className="grid grid-cols-[1fr_auto] items-center gap-x-3">
            <span className="truncate font-medium" title={name}>
              {name}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground tabular-nums">
              {value}
              <span className={cn("size-1.5 rounded-full", on ? "bg-green-500" : "bg-muted-foreground/40")} />
            </span>
            <span className="col-span-2 truncate text-[11px] text-muted-foreground tabular-nums">{detail}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
