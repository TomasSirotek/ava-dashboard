import { OctagonX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useControlStore } from "@/features/control/control.store"
import { cn } from "@/lib/utils"

export function EstopButton() {
  const estop = useControlStore((s) => s.estop)
  const toggleEstop = useControlStore((s) => s.toggleEstop)
  return (
    <Button
      className={cn(!estop && "bg-red-600 text-white hover:bg-red-700")}
      variant={estop ? "outline" : "default"}
      onClick={toggleEstop}
    >
      <OctagonX /> {estop ? "Release" : "Stop"}
    </Button>
  )
}
