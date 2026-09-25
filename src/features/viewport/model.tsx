import { useThree } from "@react-three/fiber"
import { use, useEffect } from "react"
import URDFLoader, { type URDFRobot } from "urdf-loader"
import { JOINT_NAMES } from "@/features/robot/robot.content"
import { useRobotStore } from "@/features/robot/robot.store"
import { ROBOT_PACKAGES, ROBOT_SCALE, ROBOT_URDF_URL } from "@/features/viewport/viewport.content"
import type { IModelProps } from "@/features/viewport/viewport.interface"

const DEG_TO_RAD = Math.PI / 180

// Meshes stream in after the URDF itself resolves; the canvas renders on demand,
// so whichever Model is mounted redraws as each mesh lands.
let onMeshLoaded = () => {}

// Loaded once per page and shared across remounts; use() suspends until the URDF is parsed.
let robotPromise: Promise<URDFRobot> | undefined
function loadRobot() {
  if (!robotPromise) {
    const loader = new URDFLoader()
    loader.packages = ROBOT_PACKAGES
    loader.loadMeshCb = (path, manager, material, done) =>
      loader.defaultMeshLoader(path, manager, material, (mesh, err) => {
        done(mesh, err)
        onMeshLoaded()
      })
    robotPromise = loader.loadAsync(ROBOT_URDF_URL)
  }
  return robotPromise
}

export function Model({ modelRef }: IModelProps) {
  const robot = use(loadRobot())
  const invalidate = useThree((s) => s.invalidate)

  // Drive the URDF joints from the store (degrees in the UI, radians in the URDF).
  useEffect(() => {
    onMeshLoaded = invalidate
    const apply = (position: number[]) => {
      JOINT_NAMES.forEach((name, i) => {
        robot.setJointValue(name, position[i] * DEG_TO_RAD)
      })
      invalidate()
    }
    apply(useRobotStore.getState().jointState.position)
    const unsubscribe = useRobotStore.subscribe((s, prev) => {
      if (s.jointState.position !== prev.jointState.position) apply(s.jointState.position)
    })
    return () => {
      unsubscribe()
      onMeshLoaded = () => {}
    }
  }, [robot, invalidate])

  // ROS is Z-up, three.js is Y-up.
  return (
    <group ref={modelRef} rotation-x={-Math.PI / 2} scale={ROBOT_SCALE}>
      <primitive object={robot} />
    </group>
  )
}
