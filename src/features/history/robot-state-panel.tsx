import { Activity } from "lucide-react"
import { lazy, Suspense } from "react"
import { Panel } from "@/components/shared/panel"
import type { IGridPanelProps } from "@/components/shared/shared.interface"
import { HISTORY_SAMPLE_MS, HISTORY_WINDOW_MS, JOINT_CHART_CONFIG } from "@/features/history/history.content"
import { READOUT_HINTS } from "@/features/robot/robot.content"
import { selectReadout, useRobotStore } from "@/features/robot/robot.store"

// Recharts is large; load the charts as their own chunk, like the 3D view.
const JointChart = lazy(() => import("@/features/history/joint-chart").then((m) => ({ default: m.JointChart })))

// Joint position and velocity over the last 30 s; effort only while /joint_states carries it (Gazebo).
export function RobotStatePanel({ className }: IGridPanelProps) {
  const readout = useRobotStore(selectReadout)
  const hasEffort = useRobotStore((s) => s.jointState.effort !== null)
  return (
    <Panel
      title="Robot state"
      icon={Activity}
      className={className}
      bodyClassName="flex flex-col overflow-hidden"
      meta={
        <>
          <span>
            Last {HISTORY_WINDOW_MS / 1000} s · {1000 / HISTORY_SAMPLE_MS} Hz
          </span>
          <span title={READOUT_HINTS[readout]}>source: {readout}</span>
          <span className="ml-auto flex flex-wrap gap-x-2">
            {Object.entries(JOINT_CHART_CONFIG).map(([key, { color }], i) => (
              <span key={key} className="flex items-center gap-1">
                <span className="h-0.5 w-2.5 rounded-full" style={{ background: color }} />J{i + 1}
              </span>
            ))}
          </span>
        </>
      }
    >
      <Suspense fallback={null}>
        <JointChart metric="position" title="Joint position" unit="°" />
        <JointChart metric="velocity" title="Joint velocity" unit="°/s" />
        {hasEffort && <JointChart metric="effort" title="Effort" unit="% of stall" />}
      </Suspense>
    </Panel>
  )
}
