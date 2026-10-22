// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest"
import { DEFAULT_PANEL_ORDER, PANEL_ORDER_KEY } from "@/layout/layout.content"
import { gridRows, isValidOrder, swapPanels, usePanelLayoutStore } from "@/layout/layout.store"

// What the store would find in localStorage after a reload.
const reloadWith = async (order: unknown, hidden?: unknown) => {
  localStorage.setItem(PANEL_ORDER_KEY, JSON.stringify({ state: { order, hidden }, version: 0 }))
  await usePanelLayoutStore.persist.rehydrate()
  return usePanelLayoutStore.getState().order
}
const layout = () => usePanelLayoutStore.getState()

beforeEach(() => {
  localStorage.clear()
  usePanelLayoutStore.setState({ order: DEFAULT_PANEL_ORDER, hidden: [] })
})

describe("panel order persistence", () => {
  it("saves a swap and restores it after a reload", async () => {
    usePanelLayoutStore.getState().swap("timeline", "viewport")
    const saved = JSON.parse(localStorage.getItem(PANEL_ORDER_KEY) ?? "{}").state.order
    usePanelLayoutStore.setState({ order: DEFAULT_PANEL_ORDER })
    expect(await reloadWith(saved)).toEqual(["timeline", "robot-state", "joints", "logs", "viewport"])
  })

  it("saves closed panels and restores them after a reload, dropping unknown ids", async () => {
    layout().close("logs")
    const saved = JSON.parse(localStorage.getItem(PANEL_ORDER_KEY) ?? "{}").state
    expect(saved.hidden).toEqual(["logs"])
    usePanelLayoutStore.setState({ hidden: [] })
    await reloadWith(saved.order, [...saved.hidden, "camera"])
    expect(layout().hidden).toEqual(["logs"])
  })

  it("opens every panel when the saved state has no closed list (older version)", async () => {
    usePanelLayoutStore.setState({ hidden: ["logs"] })
    await reloadWith(DEFAULT_PANEL_ORDER)
    expect(layout().hidden).toEqual([])
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

describe("closing and reopening panels", () => {
  it("closing keeps the panel's place; reopening puts it last in the grid", () => {
    layout().close("joints")
    expect(gridRows(layout().order, layout().hidden)).toEqual([
      ["viewport", "robot-state"],
      ["logs", "timeline"],
    ])
    layout().open("joints")
    expect(layout()).toMatchObject({ hidden: [], order: ["viewport", "robot-state", "logs", "timeline", "joints"] })
  })

  it("ignores opening an open panel and closing a closed one", () => {
    layout().open("logs")
    expect(layout().order).toBe(DEFAULT_PANEL_ORDER)
    layout().close("logs")
    layout().close("logs")
    expect(layout().hidden).toEqual(["logs"])
  })
})

describe("gridRows", () => {
  it("fills rows two at a time, an odd last panel alone", () => {
    expect(gridRows(DEFAULT_PANEL_ORDER, [])).toEqual([["viewport", "robot-state"], ["joints", "logs"], ["timeline"]])
    expect(gridRows(DEFAULT_PANEL_ORDER, ["robot-state", "logs"])).toEqual([["viewport", "joints"], ["timeline"]])
    expect(gridRows(DEFAULT_PANEL_ORDER, ["viewport", "robot-state", "joints", "logs"])).toEqual([["timeline"]])
    expect(gridRows(DEFAULT_PANEL_ORDER, DEFAULT_PANEL_ORDER)).toEqual([])
  })
})
