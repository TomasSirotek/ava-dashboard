import { Table2 } from "lucide-react"
import { Panel } from "@/components/shared/panel"
import type { IGridPanelProps } from "@/components/shared/shared.interface"
import { capsLabel } from "@/components/shared/shared.styles"
import { EFFORT_WARN, JOINT_LIMITS } from "@/features/joints/joints.content"
import { useJointHighlightStore } from "@/features/joints/joints.store"
import { JOINT_LABELS, JOINT_NAMES, JOINT_SERVOS } from "@/features/robot/robot.content"
import { selectReadout, useRobotStore } from "@/features/robot/robot.store"
import { cn } from "@/lib/utils"

const HEADERS = ["Joint", "Servo", "Angle", "Target", "Range", "Effort"]

// Every joint at a glance. Clicking a row highlights that joint in the 3D view (same as the joint pills).
// Effort shows "—" unless /joint_states carries it (Gazebo); the real servos cannot measure it.
export function JointsTable({ className }: IGridPanelProps) {
  const { position, effort } = useRobotStore((s) => s.jointState)
  const commanded = useRobotStore((s) => s.commanded)
  const readout = useRobotStore(selectReadout)
  const highlighted = useJointHighlightStore((s) => s.highlighted)
  const toggle = useJointHighlightStore((s) => s.toggle)
  return (
    <Panel title="Joints" icon={Table2} className={className} meta={<span>Angle source: {readout} · click a row to highlight it</span>}>
      <table className="w-full text-xs tabular-nums">
        <thead className="sticky top-0 bg-card">
          <tr className="border-b text-muted-foreground">
            {HEADERS.map((h, i) => (
              <th key={h} className={cn(capsLabel, "px-3 py-2 font-medium", i < 2 ? "text-left" : "text-right")}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {JOINT_NAMES.map((name, i) => {
            const on = highlighted.includes(i)
            const load = effort?.[i]
            return (
              <tr
                key={name}
                aria-selected={on}
                onClick={() => toggle(i)}
                className="cursor-pointer border-b last:border-0 hover:bg-muted/50 aria-selected:bg-primary/10"
              >
                <td className="px-3 py-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className={cn("size-1.5 rounded-full", on ? "bg-primary" : "bg-muted-foreground/40")} />
                    <span className="text-muted-foreground">J{i + 1}</span> {JOINT_LABELS[i]}
                  </span>
                </td>
                <td className="px-3 py-1.5 text-muted-foreground">{JOINT_SERVOS[i]}</td>
                <td className="px-3 py-1.5 text-right">{position[i].toFixed(1)}°</td>
                <td className="px-3 py-1.5 text-right text-muted-foreground">{commanded[i].toFixed(1)}°</td>
                <td className="px-3 py-1.5 text-right text-muted-foreground">
                  {JOINT_LIMITS[i].min} … {JOINT_LIMITS[i].max}°
                </td>
                <td
                  className={cn(
                    "px-3 py-1.5 text-right",
                    load === undefined && "text-muted-foreground",
                    load !== undefined && load > EFFORT_WARN && "text-destructive",
                  )}
                >
                  {load === undefined ? "—" : `${load.toFixed(0)}%`}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Panel>
  )
}
