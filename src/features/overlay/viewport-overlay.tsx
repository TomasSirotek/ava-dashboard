import { toast } from "sonner"
import { CameraCard } from "@/features/overlay/camera-card"
import { InfoCard } from "@/features/overlay/info-card"
import { PoseCard } from "@/features/overlay/pose-card"
import { TorqueCard } from "@/features/overlay/torque-card"

const reconnectCamera = () => toast.warning("Camera not available", { description: "No Kinect stream configured." })

export function ViewportOverlay() {
  return (
    <div className="pointer-events-none absolute inset-y-3 left-3 flex flex-col gap-3 *:pointer-events-auto *:shrink-0">
      <InfoCard />
      <TorqueCard />
      <PoseCard />
      <CameraCard onReconnect={reconnectCamera} />
    </div>
  )
}
