import { Box3, type Material, type Mesh, type MeshPhongMaterial, type Object3D, Vector3 } from "three"
import type { URDFJoint, URDFLink } from "urdf-loader"
import { HIGHLIGHT_EMISSIVE, LINK_LABELS } from "@/features/viewport/viewport.content"
import type { IPartSelection } from "@/features/viewport/viewport.interface"

const isLink = (o: Object3D): o is URDFLink => "isURDFLink" in o
const isJoint = (o: Object3D): o is URDFJoint => "isURDFJoint" in o
const isVisual = (o: Object3D) => "isURDFVisual" in o
const isMesh = (o: Object3D): o is Mesh => "isMesh" in o

/** The nearest URDF link above a clicked mesh that has a friendly name. */
export function findLink(o: Object3D | null): URDFLink | null {
  for (let cur = o; cur; cur = cur.parent) if (isLink(cur) && cur.name in LINK_LABELS) return cur
  return null
}

// Meshes drawn by this link itself (its visuals), not by the links further down the arm.
export function ownMeshes(link: URDFLink) {
  const meshes: Mesh[] = []
  for (const v of link.children.filter(isVisual)) v.traverse((o) => isMesh(o) && meshes.push(o))
  return meshes
}

/** Lengths straight from the URDF: part = longest side of the biggest mesh, joint = axis to next moving joint. */
export function measureLink(link: URDFLink, robotScale: number): IPartSelection {
  const box = new Box3()
  const size = new Vector3()
  const scale = new Vector3()
  let partMm = 0
  for (const mesh of ownMeshes(link)) {
    mesh.geometry.computeBoundingBox()
    box.copy(mesh.geometry.boundingBox ?? box).getSize(size)
    // Mesh units -> metres: undo the viewer's own scale-up, keep the URDF mesh scale.
    size.multiply(mesh.getWorldScale(scale)).divideScalar(robotScale)
    partMm = Math.max(partMm, Math.max(size.x, size.y, size.z) * 1000)
  }
  const next = link.children.find((c) => isJoint(c) && c.jointType !== "fixed")
  return {
    link: link.name,
    label: LINK_LABELS[link.name],
    partMm: Math.round(partMm),
    jointMm: next ? Math.round(next.position.length() * 1000) : null,
  }
}

/** Orange glow on one link's own meshes; the original materials are kept and restored. */
export function setHighlight(link: URDFLink, on: boolean) {
  for (const mesh of ownMeshes(link)) {
    const data = mesh.userData as { baseMaterial?: Material }
    if (on) {
      data.baseMaterial ??= mesh.material as Material
      const glow = (data.baseMaterial as MeshPhongMaterial).clone()
      glow.emissive?.set(HIGHLIGHT_EMISSIVE)
      glow.emissiveIntensity = 0.6
      mesh.material = glow
    } else if (data.baseMaterial) {
      ;(mesh.material as Material).dispose()
      mesh.material = data.baseMaterial
      data.baseMaterial = undefined
    }
  }
}
