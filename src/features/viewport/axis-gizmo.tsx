import { GizmoHelper, useGizmoContext } from "@react-three/drei"
import type { ThreeEvent } from "@react-three/fiber"
import { useMemo, useState } from "react"
import { CanvasTexture, Euler, Vector3 } from "three"
import { GIZMO_AXIS_COLORS, GIZMO_MARGIN } from "@/features/viewport/viewport.content"

// ROS is Z-up, three.js is Y-up: the same rotation the robot model gets.
const ROS_TO_THREE = new Euler(-Math.PI / 2, 0, 0)

// Axes in the robot's own frame (same as RViz): X forward, Y left, Z up.
const AXES = [
  { label: "X", dir: [1, 0, 0] },
  { label: "Y", dir: [0, 1, 0] },
  { label: "Z", dir: [0, 0, 1] },
] as const

// Coloured disc with an optional letter, drawn once per axis head.
function useHeadTexture(color: string, label?: string) {
  return useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = 64
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.beginPath()
      ctx.arc(32, 32, 16, 0, 2 * Math.PI)
      ctx.fillStyle = color
      ctx.fill()
      if (label) {
        ctx.font = "bold 18px Inter var, Arial, sans-serif"
        ctx.textAlign = "center"
        ctx.fillStyle = "white"
        ctx.fillText(label, 32, 39)
      }
    }
    return new CanvasTexture(canvas)
  }, [color, label])
}

function AxisHead({ dir, color, label }: { dir: readonly number[]; color: string; label?: string }) {
  const { tweenCamera } = useGizmoContext()
  const texture = useHeadTexture(color, label)
  const [hover, setHover] = useState(false)
  // Look down this axis. The direction is converted to three.js space here; drei's own
  // GizmoViewport uses the raw local position (wrong once the gizmo is rotated to ROS axes).
  const lookAlong = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    tweenCamera(new Vector3(...dir).applyEuler(ROS_TO_THREE))
  }
  return (
    <sprite
      position={dir as [number, number, number]}
      scale={(label ? 1 : 0.75) * (hover ? 1.2 : 1)}
      onPointerDown={lookAlong}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHover(true)
      }}
      onPointerOut={() => setHover(false)}
    >
      <spriteMaterial map={texture} alphaTest={0.3} opacity={label ? 1 : 0.75} toneMapped={false} />
    </sprite>
  )
}

// Rotated like the robot model, so the triad reads in the robot's own frame.
function RosAxes() {
  return (
    <group rotation={ROS_TO_THREE} scale={40}>
      {AXES.map(({ label, dir }, i) => {
        const color = GIZMO_AXIS_COLORS[i]
        return (
          <group key={label}>
            {/* stem from the centre toward the labelled head */}
            <mesh position={dir.map((v) => v * 0.4) as [number, number, number]}>
              <boxGeometry args={dir.map((v) => (v ? 0.8 : 0.05)) as [number, number, number]} />
              <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
            <AxisHead dir={dir} color={color} label={label} />
            <AxisHead dir={dir.map((v) => -v)} color={color} />
          </group>
        )
      })}
    </group>
  )
}

export function AxisGizmo() {
  return (
    <GizmoHelper alignment="bottom-right" margin={GIZMO_MARGIN}>
      <RosAxes />
    </GizmoHelper>
  )
}
