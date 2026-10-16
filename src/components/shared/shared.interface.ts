import type { NumberField } from "@base-ui/react/number-field"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

export interface IPanelProps {
  title: string
  icon: LucideIcon
  /** Small stats row under the header, e.g. "Last 30 s · 10 Hz". */
  meta?: ReactNode
  /** Extra header controls, placed left of the maximize button. */
  actions?: ReactNode
  /** Grid placement and size of the panel. */
  className?: string
  /** Body classes; the body already fills the panel and scrolls. */
  bodyClassName?: string
  children: ReactNode
}

/** Dashboard panels take their grid placement from the page layout. */
export interface IGridPanelProps {
  className?: string
}

export interface IHeadingProps {
  children: ReactNode
  action?: ReactNode
}

export interface IFieldProps {
  label: string
  /** Current value shown right-aligned next to the label (e.g. a slider's percentage). */
  value?: ReactNode
  children: ReactNode
}

export interface ISettingProps {
  icon: ReactNode
  label: string
  hint?: string
  children: ReactNode
}

export interface INumberStepperProps extends Omit<NumberField.Root.Props, "format" | "className"> {
  className?: string
  /** Decimal places shown. */
  fractionDigits?: number
}
