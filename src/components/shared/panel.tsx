import { Maximize2, Minimize2 } from "lucide-react"
import { useEffect, useState } from "react"
import type { IPanelProps } from "@/components/shared/shared.interface"
import { cn } from "@/lib/utils"

// One tile of the dashboard grid: icon + title header with a maximize button, an optional stats row,
// then a body that fills the rest and scrolls. Maximized, it covers the page until restored or Esc.
export function Panel({ title, icon: Icon, meta, actions, className, bodyClassName, children }: IPanelProps) {
  const [maximized, setMaximized] = useState(false)
  useEffect(() => {
    if (!maximized) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMaximized(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [maximized])
  const MaxIcon = maximized ? Minimize2 : Maximize2
  return (
    <>
      {maximized && <div aria-hidden className="fixed inset-0 z-40 bg-background/80" onClick={() => setMaximized(false)} />}
      <section
        aria-label={title}
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-md border bg-card",
          maximized && "fixed inset-4 z-50",
          className,
        )}
      >
        <header className="flex h-9 shrink-0 items-center gap-2 border-b px-3">
          <Icon className="size-3.5 shrink-0 text-muted-foreground" />
          <h2 className="truncate text-xs font-medium">{title}</h2>
          <div className="ml-auto flex items-center gap-1">
            {actions}
            <button
              type="button"
              aria-label={maximized ? `Restore ${title}` : `Maximize ${title}`}
              title={maximized ? "Restore (Esc)" : "Maximize"}
              onClick={() => setMaximized(!maximized)}
              className="grid size-6 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <MaxIcon className="size-3.5" />
            </button>
          </div>
        </header>
        {meta && (
          <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 border-b px-3 py-1.5 text-[11px] text-muted-foreground tabular-nums">
            {meta}
          </div>
        )}
        <div className={cn("relative min-h-0 flex-1 overflow-auto", bodyClassName)}>{children}</div>
      </section>
    </>
  )
}
