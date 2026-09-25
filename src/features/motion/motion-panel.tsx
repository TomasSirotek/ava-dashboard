import { toast } from "sonner"
import { Field } from "@/components/shared/field"
import { Heading } from "@/components/shared/heading"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MOTION_TARGETS } from "@/features/motion/motion.content"
import type { MotionTarget } from "@/features/motion/motion.interface"
import { moveDuration, useMotionStore } from "@/features/motion/motion.store"
import { firstValue } from "@/lib/utils"

export function MotionPanel() {
  const { target, velocity, accel, duration, update } = useMotionStore()
  const moveTime = moveDuration({ target, velocity, accel, duration })
  const changeTarget = (next: MotionTarget) => {
    update({ target: next })
    if (next === "real") toast.warning("Target: Hardware", { description: "Commands go to the real arm." })
    else toast.info("Target: Simulation")
  }
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Heading>Target</Heading>
        <Tabs value={target} onValueChange={(v) => changeTarget(v as MotionTarget)}>
          <TabsList className="w-full">
            {MOTION_TARGETS.map(({ value, label }) => (
              <TabsTrigger key={value} value={value}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {target === "real" && <p className="mt-2 text-sm text-destructive">Commands go to real hardware.</p>}
      </div>
      <div className="flex flex-col gap-6">
        <Heading>Limits</Heading>
        <Field label="Velocity scale">
          <Slider value={[velocity]} max={100} onValueChange={(v) => update({ velocity: firstValue(v) })} label={`${velocity}%`} />
        </Field>
        <Field label="Acceleration scale">
          <Slider value={[accel]} max={100} onValueChange={(v) => update({ accel: firstValue(v) })} label={`${accel}%`} />
        </Field>
        <p className="-mt-4 text-xs text-muted-foreground">Used by planned (MoveIt) moves; slider moves ignore it.</p>
        <Field label="Trajectory duration (s)">
          <Input
            className="font-mono"
            type="number"
            min={0.1}
            step={0.1}
            value={duration}
            onChange={(e) => update({ duration: Math.max(0.1, Number(e.target.value) || 0.1) })}
          />
        </Field>
        <p className="-mt-4 text-xs text-muted-foreground">
          A slider move takes {moveTime.toFixed(1)} s (duration at 100% velocity, stretched by the velocity scale).
        </p>
      </div>
    </div>
  )
}
