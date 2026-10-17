import { capsLabel, invertedFill } from "@/components/shared/shared.styles"
import { CONTROL_MODES } from "@/features/control/control.content"
import { useControlStore } from "@/features/control/control.store"
import { useNavigationStore } from "@/features/navigation/navigation.store"
import { cn } from "@/lib/utils"

// Shows the current control mode; clicking it opens the Control tab. Toolbar chip drawn inverted
// (foreground fill): white on dark, near-black on light.
export function ModeBadge() {
  const mode = useControlStore((s) => s.mode)
  // Controller mode (disabled): const pad = useControlStore((s) => s.pad)
  const open = useNavigationStore((s) => s.open)
  const { label, icon: Icon } = CONTROL_MODES[mode]
  return (
    <button
      type="button"
      title="Open control settings"
      onClick={() => open("control")}
      className={cn(capsLabel, invertedFill, "flex h-7 items-center gap-1.5 rounded-sm px-2.5 transition-colors")}
    >
      <Icon className="size-3.5 opacity-70" />
      {label}
      {/* Controller mode (disabled): {mode === "controller" && !pad && <span className="opacity-70">· not connected</span>} */}
    </button>
  )
}
