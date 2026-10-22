/** Overall state shown in the toolbar chip, from the rosbridge link, /joint_states and the e-stop. */
export type SystemStatus = "nominal" | "estop" | "no-data" | "connecting" | "simulated"

export interface IStatusStyle {
  label: string
  /** Tooltip explaining the state. */
  hint: string
  /** Text colour of the chip. */
  className: string
  /** Colour of the dot. */
  dot: string
}
