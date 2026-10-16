import { useEffect, useState } from "react"
import { capsLabel, cellGroup } from "@/components/shared/shared.styles"
import { SESSION_ID } from "@/features/header/header.content"
import { clockTime, cn } from "@/lib/utils"

// System time (ticks every second) and this browser session's ID: two cells of one outlined group,
// split by a hairline, the same height as the e-stop button.
export function SessionClock() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  const items = [
    ["System time", clockTime.format(now)],
    ["Session ID", `#${SESSION_ID}`],
  ]
  return (
    <dl className={cn(cellGroup, "h-9")}>
      {items.map(([label, value]) => (
        <div key={label} className="flex w-28 flex-col items-center justify-center gap-1  text-center">
          <dt className={cn(capsLabel, "text-[9px] leading-none text-muted-foreground")}>{label}</dt>
          <dd className="text-xs leading-none tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
