// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest"
import { DEFAULT_PANEL_ORDER, PANEL_ORDER_KEY } from "@/layout/layout.content"
import { isValidOrder, swapPanels, usePanelLayoutStore } from "@/layout/layout.store"

// What the store would find in localStorage after a reload.
const reloadWith = async (order: unknown) => {
  localStorage.setItem(PANEL_ORDER_KEY, JSON.stringify({ state: { order }, version: 0 }))
  await usePanelLayoutStore.persist.rehydrate()
  return usePanelLayoutStore.getState().order
}

beforeEach(() => {
  localStorage.clear()
  usePanelLayoutStore.setState({ order: DEFAULT_PANEL_ORDER })
})

describe("panel order persistence", () => {
  it("saves a swap and restores it after a reload", async () => {
    usePanelLayoutStore.getState().swap("timeline", "viewport")
    const saved = JSON.parse(localStorage.getItem(PANEL_ORDER_KEY) ?? "{}").state.order
    usePanelLayoutStore.setState({ order: DEFAULT_PANEL_ORDER })
    expect(await reloadWith(saved)).toEqual(["timeline", "robot-state", "joints", "logs", "viewport"])
  })

  it("falls back to the default order when the stored one does not match the current panels", async () => {
    expect(await reloadWith(["viewport", "robot-state", "joints", "logs", "camera"])).toEqual(DEFAULT_PANEL_ORDER)
  })
})

describe("swapPanels", () => {
  it("exchanges the slots of the dragged and the target panel, leaving the others", () => {
    expect(swapPanels(DEFAULT_PANEL_ORDER, "timeline", "viewport")).toEqual(["timeline", "robot-state", "joints", "logs", "viewport"])
  })

  it("does nothing when a panel is dropped onto itself", () => {
    expect(swapPanels(DEFAULT_PANEL_ORDER, "logs", "logs")).toBe(DEFAULT_PANEL_ORDER)
  })
})

describe("isValidOrder", () => {
  it("accepts any arrangement of exactly the current panels", () => {
    expect(isValidOrder(["logs", "joints", "timeline", "viewport", "robot-state"])).toBe(true)
  })

  it("rejects stored orders from other versions or corrupt storage, so the default is used", () => {
    expect(isValidOrder(["viewport", "robot-state", "joints", "logs"])).toBe(false)
    expect(isValidOrder(["viewport", "robot-state", "joints", "logs", "camera"])).toBe(false)
    expect(isValidOrder(["viewport", "viewport", "joints", "logs", "timeline"])).toBe(false)
    expect(isValidOrder(null)).toBe(false)
  })
})
