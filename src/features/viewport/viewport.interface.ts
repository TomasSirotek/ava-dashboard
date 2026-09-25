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
