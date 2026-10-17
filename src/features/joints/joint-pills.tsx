import { JOINT_PILL_LABELS } from "@/features/joints/joints.content"
import { useJointHighlightStore } from "@/features/joints/joints.store"
import { JOINT_LABELS, JOINT_NAMES } from "@/features/robot/robot.content"
import { cn } from "@/lib/utils"

// Segmented multi-select, same look as the segmented tabs: selected pills are drawn inverted (foreground fill).
// No check icon, so the labels never shift when a pill is toggled.
export function JointPills() {
  const highlighted = useJointHighlightStore((s) => s.highlighted)
  const toggle = useJointHighlightStore((s) => s.toggle)
  return (
    <div role="group" aria-label="Highlight joints" className="mb-4 flex h-8 divide-x overflow-hidden rounded-sm border">
      {JOINT_NAMES.map((name, i) => (
        <button
          key={name}
          type="button"
          title={`J${i + 1} ${JOINT_LABELS[i]}`}
          aria-pressed={highlighted.includes(i)}
          onClick={() => toggle(i)}
          className={cn(
            "flex min-w-0 flex-1 items-center justify-center px-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            "aria-pressed:bg-foreground aria-pressed:text-background aria-pressed:hover:bg-foreground/90",
          )}
        >
          {JOINT_PILL_LABELS[i]}
        </button>
      ))}
    </div>
  )
}
