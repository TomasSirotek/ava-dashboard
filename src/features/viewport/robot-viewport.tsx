import { Environment, Grid, Lightformer, OrbitControls, useProgress } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Suspense, useRef, useState } from "react"
import { toast } from "sonner"
import type { Object3D } from "three"
import { JointFrame } from "@/features/viewport/joint-frame"
import { JointTracker } from "@/features/viewport/joint-tracker"
import { Model } from "@/features/viewport/model"
import { ModelBoundary } from "@/features/viewport/model-boundary"
import { JOINT_PARTS, MODEL_HEIGHT } from "@/features/viewport/viewport.content"
import type { IRobotViewportProps } from "@/features/viewport/viewport.interface"
import { ViewportToolbar } from "@/features/viewport/viewport-toolbar"

export function RobotViewport({ children, joints = [], jointLabels = [] }: IRobotViewportProps) {
  const model = useRef<Object3D>(null)
  const frames = useRef<(HTMLDivElement | null)[]>([])
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null)
  const [grid, setGrid] = useState(true)
  const [failed, setFailed] = useState(false)
  const { active } = useProgress()

  const resetCamera = () => {
    controls.current?.reset()
    toast.info("Camera view reset")
  }
  const toggleGrid = () => {
    setGrid(!grid)
    toast.info(grid ? "Grid hidden" : "Grid shown")
  }

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
        {grid && <Grid infiniteGrid cellSize={0.05} sectionSize={0.25} cellColor="#a3a3a3" sectionColor="#737373" fadeDistance={10} />}
        <ModelBoundary onError={() => setFailed(true)}>
          <Suspense fallback={null}>
            <Model modelRef={model} />
          </Suspense>
        </ModelBoundary>
        <OrbitControls ref={controls} makeDefault target={[0, MODEL_HEIGHT / 2, 0]} minDistance={0.5} maxDistance={8} />
        <JointTracker model={model} joints={joints} frames={frames} />
      </Canvas>

      {JOINT_PARTS.map((_, j) => (
        <JointFrame
          key={j}
          ref={(el) => {
            frames.current[j] = el
          }}
          label={jointLabels[j] ?? ""}
        />
      ))}

      {(failed || active) && (
        <p className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-muted-foreground">
          {failed ? "Could not load models/demo-arm.usdz" : "Loading model…"}
        </p>
      )}

      {children}

      <ViewportToolbar grid={grid} onResetCamera={resetCamera} onToggleGrid={toggleGrid} />
    </section>
  )
}
