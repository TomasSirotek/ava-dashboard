import { describe, expect, it } from "vitest"
import type { IJointSample } from "@/features/history/history.interface"
import { appendSample, toChartRows } from "@/features/history/history.store"

const sample = (t: number, effort: number[] | null = null): IJointSample => ({
  t,
  position: [t, 0, 0, 0, 0, 0],
  velocity: [1, 0, 0, 0, 0, 0],
  effort,
})

describe("appendSample", () => {
  it("keeps only samples inside the window, measured from the newest one", () => {
    let samples: IJointSample[] = []
    for (const t of [0, 1000, 2000, 3000, 4000]) samples = appendSample(samples, sample(t), 2000)
    expect(samples.map((s) => s.t)).toEqual([2000, 3000, 4000])
  })

  it("drops everything older after a long gap (e.g. the tab was in the background)", () => {
    const samples = appendSample([sample(0), sample(100)], sample(60_000), 2000)
    expect(samples.map((s) => s.t)).toEqual([60_000])
  })
})

describe("toChartRows", () => {
  it("puts time in seconds before the newest sample and one key per joint", () => {
    const rows = toChartRows([sample(1000), sample(1500)], "position")
    expect(rows).toEqual([
      { t: -0.5, j0: 1000, j1: 0, j2: 0, j3: 0, j4: 0, j5: 0 },
      { t: 0, j0: 1500, j1: 0, j2: 0, j3: 0, j4: 0, j5: 0 },
    ])
  })

  it("leaves out samples that have no effort instead of plotting zeros", () => {
    const rows = toChartRows([sample(0), sample(250, [10, 20, 30, 40, 50, 60]), sample(500)], "effort")
    expect(rows).toEqual([{ t: -0.25, j0: 10, j1: 20, j2: 30, j3: 40, j4: 50, j5: 60 }])
  })
})
