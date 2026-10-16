import { create } from "zustand"
import { HISTORY_WINDOW_MS } from "@/features/history/history.content"
import type { IHistoryStore, IJointSample, JointMetric } from "@/features/history/history.interface"

/** Adds a sample and drops the ones older than the window, measured from the new sample's time. */
export const appendSample = (samples: IJointSample[], sample: IJointSample, windowMs = HISTORY_WINDOW_MS) => {
  const cutoff = sample.t - windowMs
  const first = samples.findIndex((s) => s.t >= cutoff)
  return [...(first === -1 ? [] : samples.slice(first)), sample]
}

/**
 * Recharts rows for one metric: `t` in seconds relative to the newest sample (negative = past) and
 * j0..j5 per joint. Samples without that metric (effort while nothing measures it) are left out.
 */
export const toChartRows = (samples: IJointSample[], metric: JointMetric) => {
  const now = samples.at(-1)?.t ?? 0
  return samples.flatMap((s) => {
    const values = s[metric]
    if (!values) return []
    return [Object.fromEntries([["t", (s.t - now) / 1000], ...values.map((v, i) => [`j${i}`, v])])]
  })
}

export const useHistoryStore = create<IHistoryStore>()((set) => ({
  samples: [],
  push: (sample) => set((s) => ({ samples: appendSample(s.samples, sample) })),
}))
