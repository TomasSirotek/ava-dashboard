import { toolbarChip } from "@/components/shared/shared.styles"
import { ModeBadge } from "@/features/control/mode-badge"
import { READOUT_HINTS } from "@/features/robot/robot.content"
import { selectReadout, useRobotStore } from "@/features/robot/robot.store"
import { SYSTEM_STATUS } from "@/features/status/status.content"
import { useSystemStatus } from "@/features/status/use-system-status"
import { PanelsMenu } from "@/layout/panels-menu"
import { cn } from "@/lib/utils"

// Toolbar under the header: overall status, control mode (opens the Control tab), where the joint angles come from,
// and the Panels menu (show / hide grid panels).
export function StatusBar() {
  const status = SYSTEM_STATUS[useSystemStatus()]
  const readout = useRobotStore(selectReadout)
  return (
    <div role="toolbar" aria-label="Status" className="flex shrink-0 flex-wrap items-center gap-2 px-2 pt-2">
      <span title={status.hint} className={cn(toolbarChip, status.className)}>
        <span className={cn("size-1.5 rounded-full", status.dot)} />
        {status.label}
      </span>
      <ModeBadge />
      <span title={READOUT_HINTS[readout]} className={cn(toolbarChip, "text-muted-foreground")}>
        Joint angles: <span className="text-foreground">{readout}</span>
      </span>
      <PanelsMenu />
    </div>
  )
}
