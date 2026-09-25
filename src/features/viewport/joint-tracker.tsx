import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useMemo } from "react"
import { Box3, Vector3 } from "three"
import { JOINT_PARTS } from "@/features/viewport/viewport.content"
import type { IJointTrackerProps } from "@/features/viewport/viewport.interface"

// Projects each selected joint's world-space bounds to screen space every frame and
// positions its DOM frame directly (no React re-render per frame).
export function JointTracker({ model, joints, frames }: IJointTrackerProps) {
  const { camera, size, invalidate } = useThree()
  // The canvas renders on demand, so redraw once when the highlighted joints change.
  useEffect(() => invalidate(), [joints, invalidate])
  const box = useMemo(() => new Box3(), [])
  const corner = useMemo(() => new Vector3(), [])
  useFrame(() => {
    JOINT_PARTS.forEach((names, j) => {
      const el = frames.current[j]
      if (!el) return
      const parts = joints.includes(j) ? names.map((n) => model.current?.getObjectByName(n)).filter((o) => o !== undefined) : []
      if (!parts.length) {
        el.hidden = true
        return
      }
      box.makeEmpty()
      // A URDF link's children include the rest of the arm; box only its own visual meshes.
      for (const o of parts) {
        const visuals = o.children.filter((c) => "isURDFVisual" in c)
        for (const v of visuals.length ? visuals : [o]) box.expandByObject(v)
      }
      let x0 = Infinity,
        y0 = Infinity,
        x1 = -Infinity,
        y1 = -Infinity
      for (let i = 0; i < 8; i++) {
        corner.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).project(camera)
        const x = ((corner.x + 1) / 2) * size.width
        const y = ((1 - corner.y) / 2) * size.height
        x0 = Math.min(x0, x)
        y0 = Math.min(y0, y)
        x1 = Math.max(x1, x)
        y1 = Math.max(y1, y)
      }
      const pad = 6
      el.hidden = false
      el.style.transform = `translate(${x0 - pad}px, ${y0 - pad}px)`
      el.style.width = `${x1 - x0 + pad * 2}px`
      el.style.height = `${y1 - y0 + pad * 2}px`
    })
  })
  return null
}
