import type { IFieldProps } from "@/components/shared/shared.interface"
import { Label } from "@/components/ui/label"

export function Field({ label, value, children }: IFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <Label className="text-sm">{label}</Label>
        {value !== undefined && <span className="text-xs text-muted-foreground tabular-nums">{value}</span>}
      </div>
      {children}
    </div>
  )
}
