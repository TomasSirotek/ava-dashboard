import type { NumberField } from "@base-ui/react/number-field"
import type { ReactNode } from "react"

export interface IHeadingProps {
  children: ReactNode
  action?: ReactNode
}

export interface IFieldProps {
  label: string
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
