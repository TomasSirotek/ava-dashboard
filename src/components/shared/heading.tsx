import type { IHeadingProps } from "@/components/shared/shared.interface"
import { capsLabel } from "@/components/shared/shared.styles"
import { cn } from "@/lib/utils"

export function Heading({ children, action }: IHeadingProps) {
  return (
    <div className="mb-3 flex h-7 items-center justify-between">
      <h3 className={cn(capsLabel, "text-muted-foreground")}>{children}</h3>
      {action}
    </div>
  )
}
