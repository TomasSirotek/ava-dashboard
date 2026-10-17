import { useEffect, useState } from "react"

// Current time (epoch ms), refreshed every `intervalMs` while `active`; frozen otherwise, so an idle view costs nothing.
export function useNow(active: boolean, intervalMs: number) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!active) return
    setNow(Date.now())
    const timer = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(timer)
  }, [active, intervalMs])
  return now
}
