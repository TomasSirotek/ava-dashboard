import { Heading } from "@/components/shared/heading"
import { overlayCard } from "@/components/shared/shared.styles"
import { CURRENT_POSE } from "@/features/overlay/overlay.content"

export function PoseCard() {
  return (
    <div className={overlayCard}>
      <Heading>Current pose</Heading>
      <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border bg-border">
        {CURRENT_POSE.map((p) => (
          <div key={p.label} className="bg-background p-2.5">
            <dt className="text-xs text-muted-foreground">{p.label}</dt>
            <dd className="mt-0.5 font-mono text-sm tabular-nums">
              {p.value.toFixed(1)}
              <span className="ml-0.5 text-xs text-muted-foreground">{p.unit}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
