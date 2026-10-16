import type { ChartConfig } from "@/components/ui/chart"
import { JOINT_NAMES } from "@/features/robot/robot.content"

// The charts show the last 30 s of the joint state, sampled 4 times a second (120 points per line).
// Each sample redraws every chart, so this rate is the main cost of the panel; 4 Hz looks smooth enough.
export const HISTORY_WINDOW_MS = 30_000
export const HISTORY_SAMPLE_MS = 250

// One colour per joint, J1..J6, from the theme's chart palette plus the log's info blue.
const JOINT_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-4)", "var(--chart-5)", "oklch(0.68 0.15 237)", "var(--chart-3)"]

// Keys j0..j5 match the data rows built by toChartRows.
export const JOINT_CHART_CONFIG: ChartConfig = Object.fromEntries(
  JOINT_NAMES.map((name, i) => [`j${i}`, { label: `J${i + 1} ${name}`, color: JOINT_COLORS[i] }]),
)
