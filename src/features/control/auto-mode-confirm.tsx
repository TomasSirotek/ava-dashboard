import { AlertDialog } from "@base-ui/react/alert-dialog"
import { TriangleAlert } from "lucide-react"
import { invertedFill } from "@/components/shared/shared.styles"
import { Button } from "@/components/ui/button"
import type { IAutoModeConfirmProps } from "@/features/control/control.interface"
import { useRobotStore } from "@/features/robot/robot.store"

// Automatic mode takes the arm out of the user's hands, so switching to it asks first.
export function AutoModeConfirm({ open, onConfirm, onCancel }: IAutoModeConfirmProps) {
  const live = useRobotStore((s) => s.source === "ros")
  return (
    <AlertDialog.Root open={open} onOpenChange={(next) => !next && onCancel()}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-black/40" />
        <AlertDialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-popover p-5 text-popover-foreground shadow-lg outline-none">
          <div className="flex gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-black dark:bg-white text-white dark:text-black">
              <TriangleAlert className="size-5" />
            </span>
            <div className="flex flex-col gap-2">
              <AlertDialog.Title className="font-medium">Switch to Automatic mode?</AlertDialog.Title>
              <AlertDialog.Description className="text-sm text-muted-foreground">
                The arm will be driven by demos instead of you, and the joint sliders lock.{" "}
                {live ? (
                  <span className="font-medium text-foreground">
                    A live robot is connected - it will move on its own. Make sure the area around it is clear.
                  </span>
                ) : (
                  "No robot is connected, so only the built-in simulation moves."
                )}{" "}
                The red E-stop button always halts it.
              </AlertDialog.Description>
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <AlertDialog.Close render={<Button variant="outline" />}>Cancel</AlertDialog.Close>
            <Button className={`${invertedFill}`} onClick={onConfirm}>
              Switch to Automatic
            </Button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
