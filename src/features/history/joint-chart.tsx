import { useMemo } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { HISTORY_WINDOW_MS, JOINT_CHART_CONFIG } from "@/features/history/history.content"
import type { IJointChartProps } from "@/features/history/history.interface"
import { toChartRows, useHistoryStore } from "@/features/history/history.store"
import { JOINT_NAMES } from "@/features/robot/robot.content"

// One metric of all six joints over the history window; no animation, so it can redraw 10 times a second.
export function JointChart({ metric, title, unit }: IJointChartProps) {
  const samples = useHistoryStore((s) => s.samples)
  const rows = useMemo(() => toChartRows(samples, metric), [samples, metric])
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-3 pt-2 text-[11px] text-muted-foreground">
        {title} <span className="opacity-70">({unit})</span>
      </div>
      <ChartContainer config={JOINT_CHART_CONFIG} className="aspect-auto min-h-0 flex-1 pr-3">
        <LineChart data={rows} margin={{ top: 6, right: 0, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="t"
            type="number"
            domain={[-HISTORY_WINDOW_MS / 1000, 0]}
            ticks={[-30, -20, -10, 0]}
            tickFormatter={(t: number) => (t === 0 ? "now" : `${t}s`)}
            tickLine={false}
            axisLine={false}
            fontSize={10}
          />
          <YAxis
            width={40}
            tickLine={false}
            axisLine={false}
            fontSize={10}
            // One decimal for small values so near-zero velocity ticks stay distinct; String(-0) is "0".
            tickFormatter={(v: number) => String(Math.abs(v) < 10 ? Number(v.toFixed(1)) : Math.round(v))}
          />
          <ChartTooltip
            isAnimationActive={false}
            content={<ChartTooltipContent labelFormatter={(_, payload) => `${Number(payload[0]?.payload.t).toFixed(1)} s`} />}
          />
          {JOINT_NAMES.map((name, i) => (
            <Line
              key={name}
              dataKey={`j${i}`}
              type="linear"
              stroke={`var(--color-j${i})`}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  )
}
