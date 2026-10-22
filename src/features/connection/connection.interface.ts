/** State of the rosbridge link as shown to the user. */
export type LinkPhase = "connected" | "connecting" | "unreachable" | "disconnected"

export interface ILinkPhaseItem {
  label: string
  hint: string
  /** Classes of the status dot. */
  dot: string
}

export interface IConnectionStore {
  /** rosbridge WebSocket URL the feed connects to; remembered in localStorage. */
  url: string
  /** False after Disconnect: no connection attempts until Connect. */
  enabled: boolean
  /** Bumped by every Connect, so the feed reconnects at once even when the URL is unchanged. */
  attempt: number
  /** End of the current connect window (epoch ms): the feed keeps retrying until then. Null = not trying. */
  tryingUntil: number | null
  /** Attempts made in the current connect window. */
  tries: number
  /** Switch to `url` (if valid) and connect, opening a new connect window. Returns false for an invalid URL. */
  connect: (url: string) => boolean
  disconnect: () => void
  /** Open a connect window without a Connect press (page load, link lost). Ignored after Disconnect. */
  startTrying: () => void
  /** Count one connection attempt. */
  noteTry: () => void
  /** Close the connect window: the link is up, or it did not come up in time. */
  stopTrying: () => void
}
