import { Popover } from "@base-ui/react/popover"
import { CircleHelp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NAVIGATION_HELP } from "@/features/viewport/viewport.content"

export function ViewportHelp() {
  return (
    <Popover.Root>
      <div className="rounded-lg border bg-background p-1 shadow-sm">
        <Popover.Trigger render={<Button size="icon-sm" variant="ghost" title="Navigation help" />}>
          <CircleHelp />
        </Popover.Trigger>
      </div>
      <Popover.Portal>
        <Popover.Positioner side="left" align="start" sideOffset={8} className="z-50">
          <Popover.Popup className="rounded-lg bg-popover p-3 text-xs text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-none">
            <dl className="grid grid-cols-[auto_auto] gap-x-4 gap-y-1.5">
              {NAVIGATION_HELP.map(([action, input]) => (
                <div key={action} className="contents">
                  <dt className="font-medium">{action}</dt>
                  <dd className="text-muted-foreground">{input}</dd>
                </div>
              ))}
            </dl>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
