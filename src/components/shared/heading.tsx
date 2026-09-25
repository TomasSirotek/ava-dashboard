import type { IHeadingProps } from "@/components/shared/shared.interface"

export function Heading({ children, action }: IHeadingProps) {
  return (
    <div className="mb-3 flex h-7 items-center justify-between">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{children}</h3>
      {action}
    </div>
  )
}
