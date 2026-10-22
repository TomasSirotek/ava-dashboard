import { ChevronDown, LayoutGrid } from "lucide-react"
import { toolbarChip } from "@/components/shared/shared.styles"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DEFAULT_PANEL_ORDER, GRID_PANELS } from "@/layout/layout.content"
import { usePanelLayoutStore } from "@/layout/layout.store"
import { cn } from "@/lib/utils"

// Toolbar menu listing the grid panels: untick to close one, tick to reopen it as the last panel in the grid.
export function PanelsMenu() {
  const hidden = usePanelLayoutStore((s) => s.hidden)
  const { open, close } = usePanelLayoutStore.getState()
  const shown = DEFAULT_PANEL_ORDER.length - hidden.length
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            title="Show or hide panels"
            className={cn(toolbarChip, "text-muted-foreground transition-colors hover:bg-muted")}
          />
        }
      >
        <LayoutGrid className="size-3.5" />
        Panels:{" "}
        <span className="text-foreground tabular-nums">
          {shown}/{DEFAULT_PANEL_ORDER.length}
        </span>
        <ChevronDown className="size-3.5 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Panels</DropdownMenuLabel>
          {DEFAULT_PANEL_ORDER.map((id) => {
            const { label, icon: Icon } = GRID_PANELS[id]
            const visible = !hidden.includes(id)
            return (
              <DropdownMenuCheckboxItem key={id} checked={visible} onCheckedChange={(on) => (on ? open(id) : close(id))}>
                <Icon />
                {label}
              </DropdownMenuCheckboxItem>
            )
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
