import { NumberStepper } from "@/components/shared/number-stepper"
import { Slider } from "@/components/ui/slider"
import { JOINT_LIMITS, JOINT_STEPS } from "@/features/joints/joints.content"
import type { IJointRowProps } from "@/features/joints/joints.interface"
import { useJointHighlightStore } from "@/features/joints/joints.store"
import { JOINT_NAMES } from "@/features/robot/robot.content"
import { useRobotStore } from "@/features/robot/robot.store"
import { firstValue } from "@/lib/utils"

export function JointRow({ index, value, disabled, onChange }: IJointRowProps) {
  const name = JOINT_NAMES[index]
  const limits = JOINT_LIMITS[index]
  const live = useRobotStore((s) => s.jointState.position[index])
  const source = useRobotStore((s) => s.source)
  const highlighted = useJointHighlightStore((s) => s.highlighted.includes(index))
  return (
    <div className="grid grid-cols-[1fr_5.5rem] items-center gap-x-3 gap-y-2">
      <div className="col-span-2 flex items-baseline justify-between text-sm">
        <span className="flex items-center gap-1.5 font-medium">
          {highlighted && <span className="size-1.5 rounded-full bg-orange-500" />}
          {name}
        </span>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {source === "ros" ? "live" : "sim"} {live.toFixed(1)}°
        </span>
      </div>
      <Slider
        aria-label={`${name} commanded position`}
        value={[value]}
        {...limits}
        disabled={disabled}
        onValueChange={(v) => onChange(firstValue(v))}
        label={`${value.toFixed(1)}°`}
      />
      <NumberStepper
        aria-label={`${name} degrees`}
        value={value}
        min={limits.min}
        max={limits.max}
        {...JOINT_STEPS}
        disabled={disabled}
        onValueChange={(v) => onChange(v ?? 0)}
      />
    </div>
  )
}
