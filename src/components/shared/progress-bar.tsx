import type { IProgressBarProps } from "@/components/shared/shared.interface"
import { cn } from "@/lib/utils"

// Progress bar: determinate when `value` (0..1) is given, e.g. time used of a connect window; otherwise indeterminate.
export function ProgressBar({ label, value, className }: IProgressBarProps) {
  const percent = value === undefined ? undefined : Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-busy
      aria-valuemin={percent === undefined ? undefined : 0}
      aria-valuemax={percent === undefined ? undefined : 100}
      aria-valuenow={percent}
      className={cn("relative h-1 w-full overflow-hidden rounded-full bg-muted", className)}
    >
      {percent === undefined ? (
        <div className="absolute inset-y-0 left-0 w-2/5 animate-progress rounded-full bg-primary motion-reduce:animate-pulse" />
      ) : (
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      )}
    </div>
  )
}
