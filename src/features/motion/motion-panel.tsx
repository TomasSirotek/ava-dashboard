import { useState } from "react"
import { toast } from "sonner"
import { Field } from "@/components/shared/field"
import { Heading } from "@/components/shared/heading"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MOTION_DEFAULTS, MOTION_TARGETS } from "@/features/motion/motion.content"
import type { MotionTarget } from "@/features/motion/motion.interface"
import { firstValue } from "@/lib/utils"

export function MotionPanel() {
  const [target, setTarget] = useState<MotionTarget>("sim")
  const [velocity, setVelocity] = useState(MOTION_DEFAULTS.velocity)
  const [accel, setAccel] = useState(MOTION_DEFAULTS.accel)
  const changeTarget = (next: MotionTarget) => {
    setTarget(next)
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
          <Slider value={[velocity]} max={100} onValueChange={(v) => setVelocity(firstValue(v))} label={`${velocity}%`} />
        </Field>
        <Field label="Acceleration scale">
          <Slider value={[accel]} max={100} onValueChange={(v) => setAccel(firstValue(v))} label={`${accel}%`} />
        </Field>
        <Field label="Trajectory duration (s)">
          <Input className="font-mono" defaultValue={MOTION_DEFAULTS.duration} />
        </Field>
      </div>
    </div>
  )
}
