import { ChevronDown } from "lucide-react"
import { secondaryButton } from "@/components/shared/shared.styles"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DEMOS } from "@/features/demos/demos.content"
import type { DemoId } from "@/features/demos/demos.interface"
import { useDemoStore } from "@/features/demos/demos.store"
import { cn } from "@/lib/utils"

// Which demo Play runs. Locked while a demo runs or is paused.
export function DemoPicker() {
  const selected = useDemoStore((s) => s.selected)
  const busy = useDemoStore((s) => s.running !== null)
  const select = useDemoStore((s) => s.select)
  const { label, icon: Icon, description } = DEMOS[selected]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={busy}
        render={<Button size="sm" variant="outline" className={cn("min-w-0 justify-start", secondaryButton)} title={description} />}
      >
        <Icon />
        <span className="truncate">{label}</span>
        <ChevronDown className="ml-auto opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
        <DropdownMenuRadioGroup value={selected} onValueChange={(v) => select(v as DemoId)}>
          {Object.values(DEMOS).map(({ id, label: name, description: text, icon: ItemIcon, steps, loop }) => (
            <DropdownMenuRadioItem key={id} value={id} closeOnClick className="items-start py-1.5">
              <ItemIcon className="mt-0.5" />
              <span className="min-w-0">
                <span className="block font-medium">{name}</span>
                <span className="block text-xs text-muted-foreground">
                  {text} · {steps.length} steps{loop ? " · loops" : ""}
                </span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
