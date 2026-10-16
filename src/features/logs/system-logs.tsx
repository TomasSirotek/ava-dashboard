import { useEffect, useRef } from "react"
import { Heading } from "@/components/shared/heading"
import { LOG_LEVEL_STYLES } from "@/features/logs/logs.content"
import { useLogStore } from "@/features/logs/logs.store"
import { clockTime, cn } from "@/lib/utils"

// Terminal-style event log: newest at the bottom, follows new entries.
export function SystemLogs() {
  const entries = useLogStore((s) => s.entries)
  const list = useRef<HTMLOListElement>(null)
  // Follow the newest entry.
  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight })
  }, [entries.length])
  return (
    <section className="flex min-h-48 flex-1 flex-col">
      <Heading>System logs</Heading>
      <ol
        ref={list}
        aria-live="polite"
        className="min-h-0 flex-1 overflow-y-auto rounded-sm border bg-muted/40 p-3 text-[11px] leading-5 tabular-nums"
      >
        {entries.map(({ id, time, level, message }) => (
          <li key={id} className="grid grid-cols-[auto_1fr] gap-3">
            <time className="text-muted-foreground tabular-nums">{clockTime.format(time)}</time>
            <span className={cn("break-words", level === "error" && "text-destructive")}>
              <span className={cn("mr-2", LOG_LEVEL_STYLES[level].className)}>{LOG_LEVEL_STYLES[level].label}</span>
              {message}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
