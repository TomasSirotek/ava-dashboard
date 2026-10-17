import { Box } from "lucide-react"
import { lazy, Suspense } from "react"
import { Panel } from "@/components/shared/panel"
import type { IGridPanelProps } from "@/components/shared/shared.interface"
import { useJointHighlightStore } from "@/features/joints/joints.store"
import { JOINT_NAMES } from "@/features/robot/robot.content"
import { useRobotStore } from "@/features/robot/robot.store"

// three.js is large; load the 3D viewport as its own chunk so the controls render first.
const RobotViewport = lazy(() => import("@/features/viewport/robot-viewport").then((m) => ({ default: m.RobotViewport })))

export function Viewport({ className }: IGridPanelProps) {
  const highlighted = useJointHighlightStore((s) => s.highlighted)
  const positions = useRobotStore((s) => s.jointState.position)
  const jointLabels = JOINT_NAMES.map((name, i) => `J${i + 1} ${name} · ${positions[i].toFixed(1)}°`)
  return (
    <Panel title="3D view · ava.urdf" icon={Box} className={className} bodyClassName="overflow-hidden">
      <Suspense fallback={<div className="absolute inset-0 bg-muted/40" />}>
        <RobotViewport joints={highlighted} jointLabels={jointLabels} />
      </Suspense>
    </Panel>
  )
}
