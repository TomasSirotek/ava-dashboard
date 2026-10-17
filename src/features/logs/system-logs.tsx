import { ChevronDown, ScrollText } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Panel } from "@/components/shared/panel"
import type { IGridPanelProps } from "@/components/shared/shared.interface"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { LOG_LEVEL_FILTERS, LOG_LEVEL_STYLES, LOG_SOURCE_LABELS } from "@/features/logs/logs.content"
import type { LogLevelFilter } from "@/features/logs/logs.interface"
import { filterLogs, useLogStore } from "@/features/logs/logs.store"
import { clockTime, cn } from "@/lib/utils"

// Event log: time, level, source, message; newest at the bottom, follows new entries.
// Search matches message and source; the level menu narrows to one level.
export function SystemLogs({ className }: IGridPanelProps) {
  const entries = useLogStore((s) => s.entries)
  const [query, setQuery] = useState("")
  const [level, setLevel] = useState<LogLevelFilter>("all")
  const visible = useMemo(() => filterLogs(entries, level, query), [entries, level, query])
  const list = useRef<HTMLOListElement>(null)
  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight })
  }, [visible.length])
  const levelLabel = LOG_LEVEL_FILTERS.find((f) => f.value === level)?.label
  return (
    <Panel
      title="Logs"
      icon={ScrollText}
      className={className}
      bodyClassName="overflow-hidden flex flex-col"
      meta={
        <>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search logs…"
            className="h-7 min-w-24 flex-1 basis-32 text-xs"
          />
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="h-7 gap-1 rounded-sm text-xs" />}>
              {levelLabel} <ChevronDown className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={level} onValueChange={(v) => setLevel(v as LogLevelFilter)}>
                {LOG_LEVEL_FILTERS.map(({ value, label }) => (
                  <DropdownMenuRadioItem key={value} value={value}>
                    {label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="shrink-0">
            {visible.length}/{entries.length}
          </span>
        </>
      }
    >
      <ol ref={list} aria-live="polite" className="min-h-0 flex-1 overflow-y-auto px-3 py-2 text-[11px] leading-5 tabular-nums">
        {visible.map(({ id, time, level, source, message }) => (
          // Below 24 rem of panel width the source column is dropped; the search still matches it.
          <li key={id} className="grid grid-cols-[auto_2.75rem_1fr] gap-3 @sm:grid-cols-[auto_2.75rem_3.5rem_1fr]">
            <time className="text-muted-foreground">{clockTime.format(time)}</time>
            <span className={LOG_LEVEL_STYLES[level].className}>{LOG_LEVEL_STYLES[level].label}</span>
            <span className="hidden text-muted-foreground @sm:inline">{LOG_SOURCE_LABELS[source]}</span>
            <span className={cn("break-words", level === "error" && "text-destructive")}>{message}</span>
          </li>
        ))}
        {visible.length === 0 && <li className="text-muted-foreground">No entries match.</li>}
      </ol>
    </Panel>
  )
}
