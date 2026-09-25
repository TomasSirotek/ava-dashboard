import type { ReactNode, Ref, RefObject } from "react"
import type { Object3D } from "three"

export type ModelRef = RefObject<Object3D | null>

export interface IRobotViewportProps {
  children?: ReactNode
  /** Joint indices to outline. */
  joints?: number[]
  jointLabels?: string[]
}

export interface IJointTrackerProps {
  model: ModelRef
  joints: number[]
  frames: RefObject<(HTMLDivElement | null)[]>
}

export interface IJointFrameProps {
  ref: Ref<HTMLDivElement>
  label: string
}

export interface IModelProps {
  modelRef: ModelRef
}

export interface IModelBoundaryProps {
  children: ReactNode
  onError: () => void
}

export interface IViewportToolbarProps {
  grid: boolean
  onResetCamera: () => void
  onToggleGrid: () => void
}

/** A clicked arm part and its measured lengths. */
export interface IPartSelection {
  link: string
  label: string
  /** Longest side of the part's main printed mesh, mm. */
  partMm: number
  /** Axis-to-axis distance to the next moving joint, mm (null for the last link). */
  jointMm: number | null
}

export interface IPartSelectionStore {
  selected: IPartSelection | null
  select: (part: IPartSelection) => void
  clear: () => void
}

export interface IPartLabelProps {
  ref: Ref<HTMLDivElement>
  part: IPartSelection
  onClose: () => void
}

export interface IPartTrackerProps {
  robot: RefObject<Object3D | null>
  label: RefObject<HTMLDivElement | null>
}
