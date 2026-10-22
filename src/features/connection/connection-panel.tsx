import { LoaderCircle } from "lucide-react"
import { useState } from "react"
import { Field } from "@/components/shared/field"
import { Heading } from "@/components/shared/heading"
import { ProgressBar } from "@/components/shared/progress-bar"
import { invertedFill, secondaryButton } from "@/components/shared/shared.styles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CONNECT_WINDOW_MS, DEFAULT_ROSBRIDGE_URL, LINK_PHASES, START_ROSBRIDGE_HINT } from "@/features/connection/connection.content"
import { isWsUrl, linkPhase, useConnectionStore } from "@/features/connection/connection.store"
import { useNow } from "@/features/demos/use-now"
import { useRobotStore } from "@/features/robot/robot.store"
import { cn } from "@/lib/utils"

// rosbridge link: live state and stats, the URL to use, Connect / Disconnect. While a connect window runs, a bar shows
// how much of it is used, with the attempt count and the time left; when it runs out, Not connected says what to do.
export function ConnectionPanel() {
  const url = useConnectionStore((s) => s.url)
  const enabled = useConnectionStore((s) => s.enabled)
  const connect = useConnectionStore((s) => s.connect)
  const disconnect = useConnectionStore((s) => s.disconnect)
  const tryingUntil = useConnectionStore((s) => s.tryingUntil)
  const tries = useConnectionStore((s) => s.tries)
  const connected = useRobotStore((s) => s.connected)
  const live = useRobotStore((s) => s.source === "ros")
  const latency = useRobotStore((s) => s.latency)
  const rate = useRobotStore((s) => s.rate)
  const [draft, setDraft] = useState(url)
  const valid = isWsUrl(draft)
  const phaseKey = linkPhase(connected, enabled, tryingUntil !== null)
  const phase = LINK_PHASES[phaseKey]
  const connecting = phaseKey === "connecting"
  const now = useNow(connecting, 250)
  const leftMs = tryingUntil === null ? 0 : Math.max(0, tryingUntil - now)
  const stats = [
    { label: "Round trip", value: latency === null ? "—" : `${latency} ms` },
    { label: "/joint_states", value: rate === null ? (live ? "…" : "—") : `${rate.toFixed(1)} Hz` },
    { label: "Joint data", value: live ? "Live" : "Simulated" },
  ]
  return (
    <div className="flex flex-col gap-4">
      <Heading>rosbridge</Heading>
      <div title={phase.hint} className="flex items-center gap-2 text-sm font-medium" aria-live="polite">
        <span className={cn("size-2 rounded-full", phase.dot)} />
        {phase.label}
        <span className="truncate text-xs font-normal text-muted-foreground">{url}</span>
      </div>
      {connecting && (
        <div className="-mt-2 flex flex-col gap-1.5">
          <ProgressBar label={`Connecting to ${url}`} value={1 - leftMs / CONNECT_WINDOW_MS} />
          <p className="text-xs text-muted-foreground tabular-nums">
            Attempt {Math.max(1, tries)} · gives up in {Math.ceil(leftMs / 1000)} s
          </p>
        </div>
      )}
      {phaseKey === "unreachable" && (
        <div role="alert" className="-mt-2 rounded-sm border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs">
          <p className="font-medium text-destructive">
            rosbridge did not answer within {CONNECT_WINDOW_MS / 1000} s. The built-in simulation runs.
          </p>
          <p className="mt-1 text-muted-foreground">Start rosbridge on the robot computer, then press Connect:</p>
          <code className="mt-1 block break-all text-[11px]">{START_ROSBRIDGE_HINT}</code>
        </div>
      )}
      <dl className="grid grid-cols-3 gap-2 text-xs">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-sm border px-2 py-1.5">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-medium tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <Field label="WebSocket URL">
        <Input value={draft} aria-invalid={!valid} placeholder={DEFAULT_ROSBRIDGE_URL} onChange={(e) => setDraft(e.target.value)} />
      </Field>
      {!valid && <p className="-mt-2 text-xs text-destructive">Use ws:// or wss:// with a host, e.g. {DEFAULT_ROSBRIDGE_URL}</p>}
      <div className="flex gap-2">
        <Button className={cn("flex-1", invertedFill)} disabled={!valid || connecting} onClick={() => connect(draft)}>
          {connecting ? (
            <>
              <LoaderCircle className="animate-spin" /> Connecting…
            </>
          ) : connected && draft.trim() === url ? (
            "Reconnect"
          ) : (
            "Connect"
          )}
        </Button>
        <Button variant="outline" className={cn("flex-1", secondaryButton)} disabled={!enabled} onClick={disconnect}>
          {connecting ? "Stop" : "Disconnect"}
        </Button>
      </div>
    </div>
  )
}
