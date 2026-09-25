import type { ITargetPosition } from "@/features/target/target.interface"

export const TARGET_AXES = ["X", "Y", "Z"] as const

export const INITIAL_TARGET: ITargetPosition = [180, 0, 320]
