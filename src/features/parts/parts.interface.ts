export type PartCategory = "servo" | "controller" | "power"

export interface IPartSpec {
  label: string
  value: string
}

/** One part of the build, with its datasheet values. Nothing here is measured: the build has no sensors. */
export interface IPart {
  id: string
  name: string
  kind: string
  category: PartCategory
  /** Photo under public/parts/; a placeholder is shown until it exists. */
  image?: string
  specs: IPartSpec[]
}

export interface IPartCategoryItem {
  value: PartCategory | "all"
  label: string
}

export interface IPartCardProps {
  part: IPart
}
