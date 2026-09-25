import { ChevronRight, ImageOff } from "lucide-react"
import type { IPartCardProps } from "@/features/parts/parts.interface"
import { usePartReading } from "@/features/parts/use-part-reading"
import { cn } from "@/lib/utils"

// Compact row: thumbnail, name and live readings; the datasheet folds out on demand.
export function PartCard({ part }: IPartCardProps) {
  const { voltage, current, temperature, load } = usePartReading(part)
  const live = part.status === "live"
  const readings = [
    { label: "V", value: voltage.toFixed(2) },
    { label: "A", value: current.toFixed(2), warn: current > part.maxCurrent * 0.85 },
    { label: "°C", value: temperature.toFixed(0), warn: temperature > 50 },
  ]
  return (
    <article className="rounded-xl border p-3">
      <div className="flex items-center gap-3">
        <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg border bg-muted">
          {part.image ? (
            <img src={part.image} alt={part.name} className="size-full object-cover" />
          ) : (
            <ImageOff className="size-4 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold">{part.name}</span>
            <span
              className={cn(
                "flex shrink-0 items-center gap-1 rounded-full px-1.5 py-px text-[10px] font-medium",
                live ? "bg-green-500/10 text-green-700 dark:text-green-300" : "bg-muted text-muted-foreground",
              )}
            >
              <span className={cn("size-1.5 rounded-full", live ? "bg-green-500" : "bg-muted-foreground/50")} />
              {live ? "Live" : "Offline"}
            </span>
          </div>
          <div className="truncate text-xs text-muted-foreground">{part.kind}</div>
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-lg border bg-border">
        {readings.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between bg-background px-2.5 py-1.5">
            <dd className={cn("font-mono text-sm tabular-nums", live && r.warn && "text-destructive")}>{live ? r.value : "—"}</dd>
            <dt className="text-xs text-muted-foreground">{r.label}</dt>
          </div>
        ))}
      </dl>

      {part.joint !== undefined && (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted" title={`Load ${load.toFixed(0)}%`}>
          <div
            className={cn("h-full rounded-full bg-foreground transition-[width]", load > 85 && "bg-destructive")}
            style={{ width: `${load}%` }}
          />
        </div>
      )}

      <details className="group mt-2">
        <summary className="flex cursor-pointer list-none items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ChevronRight className="size-3.5 transition-transform group-open:rotate-90" /> Specs
        </summary>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
          {part.specs.map((s) => (
            <div key={s.label} className="contents">
              <dt className="text-muted-foreground">{s.label}</dt>
              <dd className="text-right font-mono">{s.value}</dd>
            </div>
          ))}
        </dl>
      </details>
    </article>
  )
}
