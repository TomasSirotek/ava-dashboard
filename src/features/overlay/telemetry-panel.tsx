import { panelStack, sidePanel } from "@/components/shared/shared.styles"
import { SystemLogs } from "@/features/logs/system-logs"
import { InfoCard } from "@/features/overlay/info-card"
import { TorqueCard } from "@/features/overlay/torque-card"
import { cn } from "@/lib/utils"

// Left side panel: one flat column (status, torque when measured, system logs) separated by hairlines,
// mirroring the right panel. On small screens it drops below the 3D view.
export function TelemetryPanel() {
  return (
    <aside
      aria-label="Telemetry"
      className={cn(
        panelStack,
        sidePanel,
        "overflow-y-auto border-r max-lg:order-1 max-lg:w-full max-lg:overflow-visible max-lg:border-t max-lg:border-r-0",
      )}
    >
      <InfoCard />
      <TorqueCard />
      <SystemLogs />
    </aside>
  )
}
