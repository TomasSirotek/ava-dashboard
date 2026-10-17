import { PersistentPanelGroup } from "@/components/shared/persistent-panel-group"
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable"
import { Toaster } from "@/components/ui/sonner"
import type { IAppLayoutProps } from "@/layout/app-layout.interface"
import { LAYOUT_IDS } from "@/layout/layout.content"
import { resizeHandle } from "@/layout/layout.styles"
import { useIsDesktop } from "@/layout/use-is-desktop"
import { cn } from "@/lib/utils"

// Page shell: header on top, then the toolbar and panel grid, with the right column next to them.
// Desktop: fitted to the window, the right column's width is draggable (remembered) and panels scroll inside.
// Smaller screens: one scrolling column, the right column below the panels.
export function AppLayout({ header, toolbar, main, aside }: IAppLayoutProps) {
  const desktop = useIsDesktop()
  // Desktop: content and column fill their resizable panels. Mobile: both take their natural height in the scroll.
  const content = (
    <div className={cn("flex min-w-0 flex-col", desktop ? "h-full flex-1" : "shrink-0")}>
      {toolbar}
      {main}
    </div>
  )
  const column = <aside className={cn("flex w-full flex-col", desktop && "h-full")}>{aside}</aside>
  return (
    <div className="flex h-svh flex-col">
      {header}
      {desktop ? (
        <PersistentPanelGroup id={LAYOUT_IDS.page} orientation="horizontal" className="min-h-0 flex-1">
          <ResizablePanel id="content" minSize="50%" className="flex">
            {content}
          </ResizablePanel>
          <ResizableHandle className={cn(resizeHandle, "w-px bg-border")} />
          <ResizablePanel
            id="aside"
            defaultSize={320}
            minSize={280}
            maxSize={520}
            groupResizeBehavior="preserve-pixel-size"
            className="flex"
          >
            {column}
          </ResizablePanel>
        </PersistentPanelGroup>
      ) : (
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {content}
          <div className="shrink-0 border-t">{column}</div>
        </main>
      )}
      <Toaster position="bottom-left" />
    </div>
  )
}
