import { ConnectionPanel } from "@/features/connection/connection-panel"
import { ControlPanel } from "@/features/control/control-panel"
import { JointsPanel } from "@/features/joints/joints-panel"
import { MotionPanel } from "@/features/motion/motion-panel"
import type { INavItem } from "@/features/navigation/navigation.interface"
import { PartsPanel } from "@/features/parts/parts-panel"
import { TargetPanel } from "@/features/target/target-panel"

export function useNavItems(): INavItem[] {
  return [
    {
      value: "joints",
      label: "Joints",
      className: "flex flex-col gap-8",
      content: (
        <>
          <JointsPanel />
          <TargetPanel />
        </>
      ),
    },
    { value: "control", label: "Control", content: <ControlPanel /> },
    { value: "motion", label: "Motion", content: <MotionPanel /> },
    { value: "parts", label: "Parts", content: <PartsPanel /> },
    { value: "connection", label: "Link", content: <ConnectionPanel /> },
  ]
}
