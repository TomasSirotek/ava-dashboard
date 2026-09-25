import { lazy, Suspense } from "react"
import { useJointHighlightStore } from "@/features/joints/joints.store"
import { ViewportOverlay } from "@/features/overlay/viewport-overlay"
import { JOINT_NAMES } from "@/features/robot/robot.content"
import { useRobotStore } from "@/features/robot/robot.store"

// three.js is large; load the 3D viewport as its own chunk so the controls render first.
const RobotViewport = lazy(() => import("@/features/viewport/robot-viewport").then((m) => ({ default: m.RobotViewport })))

export function Viewport() {
  const highlighted = useJointHighlightStore((s) => s.highlighted)
  const positions = useRobotStore((s) => s.jointState.position)
  const jointLabels = JOINT_NAMES.map((name, i) => `J${i + 1} ${name} · ${positions[i].toFixed(1)}°`)
  return (
    <Suspense
      fallback={
        <section className="relative flex-1 overflow-hidden bg-muted/40 max-lg:min-h-[70svh]">
          <ViewportOverlay />
        </section>
      }
    >
      <RobotViewport joints={highlighted} jointLabels={jointLabels}>
        <ViewportOverlay />
      </RobotViewport>
    </Suspense>
  )
}
