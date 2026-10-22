import { describe, expect, it } from "vitest"
import { isWsUrl, linkPhase } from "@/features/connection/connection.store"

describe("linkPhase", () => {
  it("shows Connecting while a connect window is open", () => {
    expect(linkPhase(false, true, true)).toBe("connecting")
  })

  it("shows Not connected once the window ran out without a link", () => {
    expect(linkPhase(false, true, false)).toBe("unreachable")
  })

  it("prefers a working link, and shows Disconnected after Disconnect", () => {
    expect(linkPhase(true, true, true)).toBe("connected")
    expect(linkPhase(false, false, false)).toBe("disconnected")
  })
})

describe("isWsUrl", () => {
  it("accepts ws:// and wss:// with a host only", () => {
    expect(isWsUrl("ws://127.0.0.1:9090")).toBe(true)
    expect(isWsUrl(" wss://robot.local ")).toBe(true)
    expect(isWsUrl("http://127.0.0.1:9090")).toBe(false)
    expect(isWsUrl("127.0.0.1:9090")).toBe(false)
  })
})
