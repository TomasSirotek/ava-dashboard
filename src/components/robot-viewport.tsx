import { Component, Suspense, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { Environment, Grid, Lightformer, OrbitControls, useProgress } from "@react-three/drei"
import { Box3, Vector3, type Object3D } from "three"
import { USDLoader } from "three/addons/loaders/USDLoader.js"
import { Grid3X3, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

// Served from public/models/, relative to the app base so it works from any static path.
const MODEL_URL = `${import.meta.env.BASE_URL}models/demo-arm.usdz`

// Models arrive in arbitrary units; normalise to this height and stand it on the grid.
const MODEL_HEIGHT = 1

// The demo model is a flat, unrigged mesh export, so each joint is approximated by the meshes around it.
const JOINT_PARTS = [
  ["Cylinder_2", "Cylinder_001_3", "Cylinder_003_4"], // shoulder_pan: turntable
  ["Cube_002_11", "Plane_003_14"], // shoulder_lift: base bracket
  ["Cube_004_17", "Plane_004_15"], // elbow_flex
  ["Cube_005_23", "Plane_006_24"], // wrist_flex
  ["Cube_006_29", "Cylinder_015_30", "Cylinder_016_31"], // wrist_roll
  ["Cylinder_017_35", "Cube_007_36", "Cylinder_018_37", "Plane_008_32", "Plane_009_33", "Plane_010_34", "Plane_011_38"], // gripper
]

type ModelRef = React.RefObject<Object3D | null>

// Projects each selected joint's world-space bounds to screen space every frame and
// positions its DOM frame directly (no React re-render per frame).
function JointTracker({ model, joints, frames }: { model: ModelRef; joints: number[]; frames: React.RefObject<(HTMLDivElement | null)[]> }) {
  const { camera, size } = useThree()
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
      for (const o of parts) box.expandByObject(o)
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
      for (let i = 0; i < 8; i++) {
        corner.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).project(camera)
        const x = ((corner.x + 1) / 2) * size.width
        const y = ((1 - corner.y) / 2) * size.height
        x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y)
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

// Computer-vision style detection box: corner brackets, faint outline, label tag.
function JointFrame({ ref, label }: { ref: React.Ref<HTMLDivElement>; label: string }) {
  const bracket = "absolute size-3 border-orange-500"
  return (
    <div ref={ref} hidden className="pointer-events-none absolute top-0 left-0">
      <div className="absolute inset-0 border border-orange-500/40 bg-orange-500/5" />
      <span className={`${bracket} -top-px -left-px border-t-2 border-l-2`} />
      <span className={`${bracket} -top-px -right-px border-t-2 border-r-2`} />
      <span className={`${bracket} -bottom-px -left-px border-b-2 border-l-2`} />
      <span className={`${bracket} -right-px -bottom-px border-r-2 border-b-2`} />
      <span className="absolute bottom-full left-0 mb-1 rounded-sm bg-orange-500 px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap text-white tabular-nums">
        {label}
      </span>
    </div>
  )
}

function Model({ modelRef }: { modelRef: ModelRef }) {
  const scene = useLoader(USDLoader, MODEL_URL)
  const { scale, offset } = useMemo(() => {
    const box = new Box3().setFromObject(scene)
    const size = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())
    const scale = MODEL_HEIGHT / size.y
    return { scale, offset: [-center.x * scale, -box.min.y * scale, -center.z * scale] as const }
  }, [scene])
  return (
    <group ref={modelRef} position={offset} scale={scale}>
      <primitive object={scene} />
    </group>
  )
}

// Lives inside the Canvas; reports failures up so the message renders as plain DOM.
class ModelBoundary extends Component<{ children: React.ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export function RobotViewport({
  children,
  joints = [],
  jointLabels = [],
}: {
  children?: React.ReactNode
  joints?: number[]
  jointLabels?: string[]
}) {
  const model = useRef<Object3D>(null)
  const frames = useRef<(HTMLDivElement | null)[]>([])
  const [grid, setGrid] = useState(true)
  const [failed, setFailed] = useState(false)
  const { active } = useProgress()
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null)

  return (
    <section aria-label="3D viewport" className="relative flex-1 overflow-hidden bg-muted/40 max-lg:min-h-[70svh]">
      <Canvas camera={{ position: [1.6, 1.2, 1.6], fov: 45, near: 0.01, far: 100 }} className="absolute! inset-0">
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 2]} intensity={2} />
        <hemisphereLight args={["#ffffff", "#8a8a8a", 0.8]} />
        {/* Metallic PBR materials need something to reflect; built locally so it works offline. */}
        <Environment resolution={256} environmentIntensity={1.6}>
          <Lightformer form="rect" intensity={3} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
          <Lightformer form="rect" intensity={1.5} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[10, 3, 1]} />
          <Lightformer form="rect" intensity={1.5} position={[5, 1, -2]} rotation-y={-Math.PI / 2} scale={[10, 3, 1]} />
          <Lightformer form="rect" intensity={1} position={[0, 1, 5]} scale={[10, 3, 1]} />
        </Environment>
        {grid && (
          <Grid
            infiniteGrid
            cellSize={0.05}
            sectionSize={0.25}
            cellColor="#a3a3a3"
            sectionColor="#737373"
            fadeDistance={10}
          />
        )}
        <ModelBoundary onError={() => setFailed(true)}>
          <Suspense fallback={null}>
            <Model modelRef={model} />
          </Suspense>
        </ModelBoundary>
        <OrbitControls ref={controls} makeDefault target={[0, MODEL_HEIGHT / 2, 0]} minDistance={0.5} maxDistance={8} />
        <JointTracker model={model} joints={joints} frames={frames} />
      </Canvas>

      {JOINT_PARTS.map((_, j) => (
        <JointFrame key={j} ref={(el) => { frames.current[j] = el }} label={jointLabels[j] ?? ""} />
      ))}

      {(failed || active) && (
        <p className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-muted-foreground">
          {failed ? "Could not load models/demo-arm.usdz" : "Loading model…"}
        </p>
      )}

      {children}

      <div className="absolute top-4 right-4 flex gap-1 rounded-lg border bg-background p-1 shadow-sm">
        <Button size="icon-sm" variant="ghost" title="Reset camera" onClick={() => controls.current?.reset()}>
          <RotateCcw />
        </Button>
        <Button size="icon-sm" variant={grid ? "secondary" : "ghost"} title="Toggle grid" onClick={() => setGrid(!grid)}>
          <Grid3X3 />
        </Button>
      </div>
    </section>
  )
}
