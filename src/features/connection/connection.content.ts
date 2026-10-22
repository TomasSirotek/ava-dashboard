import type { ILinkPhaseItem, LinkPhase } from "@/features/connection/connection.interface"

// rosbridge started with `address:=127.0.0.1` (README). Override with VITE_ROSBRIDGE_URL or in the Link tab.
export const DEFAULT_ROSBRIDGE_URL: string = import.meta.env.VITE_ROSBRIDGE_URL ?? "ws://127.0.0.1:9090"
// localStorage key of the rosbridge URL set in the Link tab.
export const ROSBRIDGE_URL_KEY = "ava-rosbridge-url"

// How long the dashboard keeps trying to reach rosbridge (page load, Connect, link lost) before it shows Not connected
// and waits for the next Connect.
export const CONNECT_WINDOW_MS = 30_000

// Shown in the Link tab when the connect window ran out.
export const START_ROSBRIDGE_HINT = "ros2 launch rosbridge_server rosbridge_websocket_launch.xml address:=127.0.0.1"

export const LINK_PHASES: Record<LinkPhase, ILinkPhaseItem> = {
  connected: { label: "Connected", hint: "Linked to rosbridge", dot: "bg-green-500" },
  connecting: {
    label: "Connecting…",
    hint: "Trying to reach rosbridge; the built-in simulation runs meanwhile",
    dot: "bg-amber-500 animate-pulse",
  },
  unreachable: {
    label: "Not connected",
    hint: "rosbridge did not answer in time. No more attempts until Connect. The built-in simulation runs.",
    dot: "bg-destructive",
  },
  disconnected: { label: "Disconnected", hint: "Link switched off. The built-in simulation runs.", dot: "bg-muted-foreground/50" },
}
