import type { ISettingProps } from "@/components/shared/shared.interface"

export function Setting({ icon, label, hint, children }: ISettingProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground [&_svg]:size-4">{icon}</span>
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      {children}
    </div>
  )
}
