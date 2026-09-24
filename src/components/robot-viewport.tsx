import { Component, Suspense, useMemo, useRef, useState } from "react"
import { Canvas, useLoader } from "@react-three/fiber"
import { Environment, Grid, Lightformer, OrbitControls, useProgress } from "@react-three/drei"
import { Box3, Vector3 } from "three"
import { USDLoader } from "three/addons/loaders/USDLoader.js"
import { Grid3X3, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

// Served from public/models/, relative to the app base so it works from any static path.
const MODEL_URL = `${import.meta.env.BASE_URL}models/demo-arm.usdz`

// Models arrive in arbitrary units; normalise to this height and stand it on the grid.
const MODEL_HEIGHT = 1

function Model() {
  const scene = useLoader(USDLoader, MODEL_URL)
  const { scale, offset } = useMemo(() => {
    const box = new Box3().setFromObject(scene)
    const size = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())
    const scale = MODEL_HEIGHT / size.y
    return { scale, offset: [-center.x * scale, -box.min.y * scale, -center.z * scale] as const }
  }, [scene])
  return (
    <group position={offset} scale={scale}>
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

export function RobotViewport({ children }: { children?: React.ReactNode }) {
  const [grid, setGrid] = useState(true)
  const [failed, setFailed] = useState(false)
  const { active } = useProgress()
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null)

  return (
    <section aria-label="3D viewport" className="relative flex-1 bg-muted/40 max-lg:min-h-[70svh]">
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
            <Model />
          </Suspense>
        </ModelBoundary>
        <OrbitControls ref={controls} makeDefault target={[0, MODEL_HEIGHT / 2, 0]} minDistance={0.5} maxDistance={8} />
      </Canvas>

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
