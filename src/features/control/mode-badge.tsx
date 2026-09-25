import { CONTROL_MODES } from "@/features/control/control.content"
import { useControlStore } from "@/features/control/control.store"
import { useNavigationStore } from "@/features/navigation/navigation.store"

// Shows the current control mode; clicking it opens the Control tab.
export function ModeBadge() {
  const mode = useControlStore((s) => s.mode)
  const pad = useControlStore((s) => s.pad)
  const open = useNavigationStore((s) => s.open)
  const { label, icon: Icon } = CONTROL_MODES[mode]
  return (
    <button
      type="button"
      title="Open control settings"
      onClick={() => open("control")}
      className="flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium transition-colors hover:bg-muted"
    >
      <Icon className="size-4 text-muted-foreground" />
      {label}
      {mode === "controller" && !pad && <span className="text-muted-foreground">· not connected</span>}
    </button>
  )
}
