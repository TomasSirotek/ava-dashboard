export interface IJointHighlightStore {
  /** Indices of joints outlined in the 3D view. */
  highlighted: number[]
  toggle: (joint: number) => void
}

export interface IJointRowProps {
  index: number
  value: number
  disabled: boolean
  onChange: (value: number) => void
}
