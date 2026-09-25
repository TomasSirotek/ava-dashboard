import { useLoader } from "@react-three/fiber"
import { useMemo } from "react"
import { Box3, Vector3 } from "three"
import { USDLoader } from "three/addons/loaders/USDLoader.js"
import { MODEL_HEIGHT, MODEL_URL } from "@/features/viewport/viewport.content"
import type { IModelProps } from "@/features/viewport/viewport.interface"

export function Model({ modelRef }: IModelProps) {
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
