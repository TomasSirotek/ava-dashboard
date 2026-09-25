import { NumberField } from "@base-ui/react/number-field"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { INumberStepperProps } from "@/components/shared/shared.interface"
import { cn } from "@/lib/utils"

const stepButton =
  "grid flex-1 place-items-center px-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"

// Number input with up/down steppers. Keyboard: ↑/↓ step, Shift = largeStep, Alt = smallStep, Home/End = min/max.
export function NumberStepper({ className, fractionDigits = 1, ...props }: INumberStepperProps) {
  return (
    <NumberField.Root
      format={{ minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits, useGrouping: false }}
      {...props}
    >
      <NumberField.Group
        className={cn(
          "flex h-8 overflow-hidden rounded-lg border border-input transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 data-disabled:opacity-50 dark:bg-input/30",
          className,
        )}
      >
        <NumberField.Input className="w-full min-w-0 bg-transparent px-2 text-right font-mono text-xs tabular-nums outline-none" />
        <div className="flex w-5 shrink-0 flex-col border-l border-input">
          <NumberField.Increment aria-label="Increase" className={stepButton}>
            <ChevronUp className="size-3" />
          </NumberField.Increment>
          <NumberField.Decrement aria-label="Decrease" className={cn(stepButton, "border-t border-input")}>
            <ChevronDown className="size-3" />
          </NumberField.Decrement>
        </div>
      </NumberField.Group>
    </NumberField.Root>
  )
}
