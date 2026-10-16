import { ChevronRight, ImageOff } from "lucide-react"
import type { IPartCardProps } from "@/features/parts/parts.interface"

// Compact row: thumbnail, name and role; the datasheet folds out on demand.
// No live readings: the build has no voltage, current or temperature sensors.
export function PartCard({ part }: IPartCardProps) {
  return (
    <article className="rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg border bg-muted">
          {part.image ? (
            <img src={part.image} alt={part.name} className="size-full object-cover" />
          ) : (
            <ImageOff className="size-4 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{part.name}</div>
          <div className="truncate text-xs text-muted-foreground">{part.kind}</div>
        </div>
      </div>

      <details className="group mt-2">
        <summary className="flex cursor-pointer list-none items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ChevronRight className="size-3.5 transition-transform group-open:rotate-90" /> Specs
        </summary>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
          {part.specs.map((s) => (
            <div key={s.label} className="contents">
              <dt className="text-muted-foreground">{s.label}</dt>
              <dd className="text-right">{s.value}</dd>
            </div>
          ))}
        </dl>
      </details>
    </article>
  )
}
