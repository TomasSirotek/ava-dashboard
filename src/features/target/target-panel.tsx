import { useState } from "react"
import { toast } from "sonner"
import { Field } from "@/components/shared/field"
import { Heading } from "@/components/shared/heading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { INITIAL_TARGET, TARGET_AXES } from "@/features/target/target.content"
import type { ITargetPosition } from "@/features/target/target.interface"

export function TargetPanel() {
  const [target, setTarget] = useState<ITargetPosition>(INITIAL_TARGET)
  const setAxis = (i: number, v: number) => setTarget((cur) => cur.map((x, j) => (j === i ? v : x)) as ITargetPosition)
  const solve = () => toast.success("IK solved", { description: `Target X ${target[0]} · Y ${target[1]} · Z ${target[2]} mm` })
  return (
    <div>
      <Heading>Target position (mm)</Heading>
      <div className="grid grid-cols-3 gap-2">
        {TARGET_AXES.map((axis, i) => (
          <Field key={axis} label={axis}>
            <Input className="font-mono" value={target[i]} onChange={(e) => setAxis(i, Number(e.target.value) || 0)} />
          </Field>
        ))}
      </div>
      <Button className="mt-4 w-full" onClick={solve}>
        Solve IK
      </Button>
    </div>
  )
}
