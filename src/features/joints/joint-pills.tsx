import { Check } from "lucide-react"
import { JOINT_PILL_LABELS } from "@/features/joints/joints.content"
import { useJointHighlightStore } from "@/features/joints/joints.store"
import { JOINT_NAMES } from "@/features/robot/robot.content"

// Segmented multi-select: joined pills, selected ones get a tint and a check.
export function JointPills() {
  const highlighted = useJointHighlightStore((s) => s.highlighted)
  const toggle = useJointHighlightStore((s) => s.toggle)
  return (
    <div role="group" aria-label="Highlight joints" className="mb-5 flex divide-x overflow-hidden rounded-full border shadow-xs">
      {JOINT_NAMES.map((name, i) => {
        const on = highlighted.includes(i)
        return (
          <button
            key={name}
            type="button"
            title={`J${i + 1} ${name}`}
            aria-pressed={on}
            onClick={() => toggle(i)}
            className="flex min-w-0 flex-1 items-center justify-center gap-1 py-1.5 text-xs font-medium transition-colors hover:bg-muted aria-pressed:bg-orange-500/15 aria-pressed:text-orange-700 aria-pressed:hover:bg-orange-500/20 dark:aria-pressed:text-orange-300"
          >
            {on && <Check className="size-3 shrink-0" />}
            {JOINT_PILL_LABELS[i]}
          </button>
        )
      })}
    </div>
  )
}
