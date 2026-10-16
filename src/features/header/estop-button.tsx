import { OctagonX } from "lucide-react"
import { capsLabel } from "@/components/shared/shared.styles"
import { Button } from "@/components/ui/button"
import { useControlStore } from "@/features/control/control.store"
import { cn } from "@/lib/utils"

// Armed: red outline. Engaged: solid red so a stopped arm is impossible to miss.
// Width grows with the label (no fixed width, so the text can't overflow); min width keeps it steady when the label changes.
export function EstopButton() {
  const estop = useControlStore((s) => s.estop)
  const toggleEstop = useControlStore((s) => s.toggleEstop)
  return (
    <Button
      variant="outline"
      className={cn(
        capsLabel,
        "h-9 min-w-48 gap-2 rounded-sm px-4 text-xs",
        // dark: variants are repeated because the outline variant sets its own dark:border/bg.
        estop
          ? "border-destructive bg-destructive text-white hover:bg-destructive/90 hover:text-white dark:border-destructive dark:bg-destructive dark:hover:bg-destructive/90"
          : "border-destructive/60 bg-destructive/5 text-destructive hover:bg-destructive/15 hover:text-destructive dark:border-destructive/60 dark:bg-destructive/5 dark:hover:bg-destructive/15",
      )}
      onClick={toggleEstop}
    >
      <OctagonX /> {estop ? "Release" : "Emergency stop"}
    </Button>
  )
}
