import { statusCell } from "@/components/shared/shared.styles"
import { CONTROL_MODES } from "@/features/control/control.content"
import { useControlStore } from "@/features/control/control.store"
import { useNavigationStore } from "@/features/navigation/navigation.store"
import { cn } from "@/lib/utils"

// Shows the current control mode; clicking it opens the Control tab. One cell of the status block,
// drawn inverted (foreground fill): white on dark, near-black on light.
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
      className={cn(statusCell, "w-full gap-1.5 bg-foreground text-background transition-colors hover:bg-foreground/90")}
    >
      <Icon className="size-3.5 opacity-70" />
      {label}
      {/* Controller mode (disabled): {mode === "controller" && !pad && <span className="opacity-70">· not connected</span>} */}
    </button>
  )
}
