export type PartCategory = "servo" | "controller" | "sensor"

export type PartStatus = "live" | "offline"

export interface IPartSpec {
  label: string
  value: string
}

export interface IPart {
  id: string
  name: string
  kind: string
  category: PartCategory
  status: PartStatus
  /** Joint index this part drives, if any; its load comes from that joint's effort. */
  joint?: number
  /** Photo under public/parts/; a placeholder is shown until it exists. */
  image?: string
  specs: IPartSpec[]
  /** Nominal supply voltage and current range, used for the mock live readings. */
  nominalVoltage: number
  idleCurrent: number
  maxCurrent: number
}

export interface IPartCategoryItem {
  value: PartCategory | "all"
  label: string
}

export interface IPartReading {
  voltage: number
  current: number
  temperature: number
  /** 0–100, only meaningful for parts that drive a joint. */
  load: number
}

export interface IPartCardProps {
  part: IPart
}
