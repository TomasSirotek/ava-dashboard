import { Play, Square } from "lucide-react"
import { Heading } from "@/components/shared/heading"
import { whiteButton } from "@/components/shared/shared.styles"
import { Button } from "@/components/ui/button"
import { useControlStore } from "@/features/control/control.store"
import { DEMOS } from "@/features/demos/demos.content"
import { useDemoStore } from "@/features/demos/demos.store"
import { cn } from "@/lib/utils"

export function DemoPanel() {
  const running = useDemoStore((s) => s.running)
  const step = useDemoStore((s) => s.step)
  const start = useDemoStore((s) => s.start)
  const stop = useDemoStore((s) => s.stop)
  const estop = useControlStore((s) => s.estop)
  return (
    <div>
      <Heading>Demos</Heading>
      <div className="flex flex-col gap-2">
        {Object.values(DEMOS).map(({ id, label, description, icon: Icon, loop, steps }) => {
          const active = running === id
          return (
            <div
              key={id}
              className={cn("flex items-center gap-3 rounded-lg border px-3 py-2.5", active && "border-orange-500/50 bg-orange-500/5")}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-md bg-muted">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{label}</div>
                <p className="truncate text-xs text-muted-foreground">
                  {active ? `Step ${step + 1}/${steps.length}${loop ? " · looping" : ""}` : description}
                </p>
              </div>
              {active ? (
                <Button size="sm" variant="outline" className={whiteButton} onClick={stop}>
                  <Square /> Stop
                </Button>
              ) : (
                <Button size="sm" variant="outline" className={whiteButton} disabled={estop} onClick={() => start(id)}>
                  <Play /> Run
                </Button>
              )}
            </div>
          )
        })}
      </div>
      {estop && <p className="mt-2 text-xs text-destructive">Release the e-stop to run a demo.</p>}
    </div>
  )
}
