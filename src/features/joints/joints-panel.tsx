import { TriangleAlert } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Heading } from "@/components/shared/heading"
import { whiteButton } from "@/components/shared/shared.styles"
import { Button } from "@/components/ui/button"
import { CONTROL_MODES } from "@/features/control/control.content"
import { selectLocked, useControlStore } from "@/features/control/control.store"
import { JointPills } from "@/features/joints/joint-pills"
import { JointRow } from "@/features/joints/joint-row"
import { JOINT_NAMES } from "@/features/robot/robot.content"
import { useRobotStore } from "@/features/robot/robot.store"

export function JointsPanel() {
  const [joints, setJoints] = useState(() => useRobotStore.getState().commanded)
  const setJoint = (i: number, v: number) => setJoints((cur) => cur.map((x, j) => (j === i ? v : x)))
  const mode = useControlStore((s) => s.mode)
  const locked = useControlStore(selectLocked)
  const goHome = () => {
    setJoints(JOINT_NAMES.map(() => 0))
    toast.success("Joints reset to home")
  }
  return (
    <div>
      <Heading
        action={
          <Button size="sm" variant="outline" className={whiteButton} disabled={locked} onClick={goHome}>
            <TriangleAlert /> Home
          </Button>
        }
      >
        Joint positions
      </Heading>
      <JointPills />
      {locked && (
        <p className="-mt-2 mb-4 text-xs text-muted-foreground">
          Sliders are locked while {CONTROL_MODES[mode].label.toLowerCase()} control is driving the arm.
        </p>
      )}
      <div className="flex flex-col gap-5">
        {JOINT_NAMES.map((name, i) => (
          <JointRow key={name} index={i} value={joints[i]} disabled={locked} onChange={(v) => setJoint(i, v)} />
        ))}
      </div>
    </div>
  )
}
