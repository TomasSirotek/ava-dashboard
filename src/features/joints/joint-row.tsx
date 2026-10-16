import { NumberStepper } from "@/components/shared/number-stepper"
import { Slider } from "@/components/ui/slider"
import { JOINT_LIMITS, JOINT_STEPS } from "@/features/joints/joints.content"
import type { IJointRowProps } from "@/features/joints/joints.interface"
import { useJointHighlightStore } from "@/features/joints/joints.store"
import { JOINT_LABELS, READOUT_HINTS } from "@/features/robot/robot.content"
import { selectReadout, useRobotStore } from "@/features/robot/robot.store"
import { firstValue } from "@/lib/utils"

// Label line (name, current angle and where it comes from), then the slider and the number box on one row.
export function JointRow({ index, value, disabled, onChange }: IJointRowProps) {
  const label = JOINT_LABELS[index]
  const limits = JOINT_LIMITS[index]
  const angle = useRobotStore((s) => s.jointState.position[index])
  const readout = useRobotStore(selectReadout)
  const highlighted = useJointHighlightStore((s) => s.highlighted.includes(index))
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="flex items-center gap-1.5 text-sm font-medium">
          {highlighted && <span className="size-1.5 rounded-full bg-primary" />}
          {label}
        </span>
        <span title={READOUT_HINTS[readout]} className="text-xs text-muted-foreground tabular-nums">
          {readout} {angle.toFixed(1)}°
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Slider
          aria-label={`${label} commanded position`}
          className="flex-1"
          value={[value]}
          {...limits}
          disabled={disabled}
          onValueChange={(v) => onChange(firstValue(v))}
        />
        <NumberStepper
          aria-label={`${label} degrees`}
          className="h-7 w-20"
          value={value}
          min={limits.min}
          max={limits.max}
          {...JOINT_STEPS}
          disabled={disabled}
          onValueChange={(v) => onChange(v ?? 0)}
        />
      </div>
    </div>
  )
}
