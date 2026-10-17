import { HOLD_STYLE, STEP_KIND_STYLES } from "@/features/demos/demos.content"
import type { IStepBarProps } from "@/features/demos/demos.interface"
import { formatSeconds } from "@/features/demos/demos.store"
import { cn } from "@/lib/utils"

const pct = (s: number, total: number) => `${(s / total) * 100}%`

// One timeline row's bar: the move (coloured by kind) then the hold. Planned steps are outlines, skipped ones faint.
export function StepBar({ row, total }: IStepBarProps) {
  const executed = row.state === "done" || row.state === "active"
  return (
    <div
      title={`${row.label}: ${formatSeconds(row.start)} – ${formatSeconds(row.end)} (${(row.end - row.start).toFixed(1)} s)`}
      className={cn(
        "absolute inset-y-1 flex overflow-hidden rounded-sm",
        !executed && "border border-dashed border-muted-foreground/50",
        row.state === "skipped" && "opacity-40",
        row.state === "active" && "ring-1 ring-foreground/60",
      )}
      style={{ left: pct(row.start, total), width: pct(Math.max(row.end - row.start, 0.05), total) }}
    >
      {executed && (
        <>
          <span className={STEP_KIND_STYLES[row.kind].className} style={{ flexGrow: row.moveEnd - row.start }} />
          <span className={HOLD_STYLE.className} style={{ flexGrow: row.end - row.moveEnd }} />
        </>
      )}
    </div>
  )
}
