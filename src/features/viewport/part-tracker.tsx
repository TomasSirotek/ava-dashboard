import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useMemo } from "react"
import { Box3, Vector3 } from "three"
import type { URDFRobot } from "urdf-loader"
import { ownMeshes } from "@/features/viewport/part-measure"
import { PART_LABEL_GAP } from "@/features/viewport/viewport.content"
import type { IPartTrackerProps } from "@/features/viewport/viewport.interface"
import { usePartSelectionStore } from "@/features/viewport/viewport.store"

// Keeps the floating part label next to the selected part: to its right, or to its left
// when there is no room, vertically centred on it and always inside the viewport.
export function PartTracker({ robot, label }: IPartTrackerProps) {
  const { camera, size, invalidate } = useThree()
  const selected = usePartSelectionStore((s) => s.selected)
  // The canvas renders on demand: draw once so the label gets placed right after a click.
  useEffect(() => invalidate(), [selected, invalidate])
  const box = useMemo(() => new Box3(), [])
  const corner = useMemo(() => new Vector3(), [])
  useFrame(() => {
    const el = label.current
    const link = selected && (robot.current?.children[0] as URDFRobot | undefined)?.links?.[selected.link]
    if (!el) return
    if (!link) {
      el.hidden = true
      return
    }
    box.makeEmpty()
    for (const mesh of ownMeshes(link)) box.expandByObject(mesh)
    let x0 = Infinity
    let y0 = Infinity
    let x1 = -Infinity
    let y1 = -Infinity
    for (let i = 0; i < 8; i++) {
      corner.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).project(camera)
      const x = ((corner.x + 1) / 2) * size.width
      const y = ((1 - corner.y) / 2) * size.height
      x0 = Math.min(x0, x)
      y0 = Math.min(y0, y)
      x1 = Math.max(x1, x)
      y1 = Math.max(y1, y)
    }
    el.hidden = false
    const w = el.offsetWidth
    const h = el.offsetHeight
    const g = PART_LABEL_GAP
    let x = x1 + g
    if (x + w > size.width - g) x = x0 - g - w // no room on the right: go left of the part
    x = Math.min(Math.max(x, g), size.width - w - g)
    const y = Math.min(Math.max((y0 + y1) / 2 - h / 2, g), size.height - h - g)
    el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`
  })
  return null
}
