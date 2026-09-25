import type { IFieldProps } from "@/components/shared/shared.interface"
import { Label } from "@/components/ui/label"

export function Field({ label, children }: IFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  )
}
