import { ArrowLeftRight, Hand, House, PackageOpen } from "lucide-react"
import type { DemoId, IDemo, IDemoStep } from "@/features/demos/demos.interface"
import { JOINT_LIMITS } from "@/features/joints/joints.content"

// Poses are degrees in JOINT_NAMES order: shoulder_pan, shoulder_lift, elbow_flex, wrist_flex,
// wrist_roll, gripper. All stay inside JOINT_LIMITS. Gripper: -60 = open, 0 = closed.
const READY = [0, -40, 60, 30, 0, 0]
const OPEN = -60

const at = (pose: number[], hold = 0.3): IDemoStep => ({ pose, hold })

// Each joint in turn to 80% of its range both ways, then back to zero.
const sweep = JOINT_LIMITS.flatMap(({ min, max }, j) =>
  [min * 0.8, max * 0.8, 0].map((v) =>
    at(
      JOINT_LIMITS.map((_, i) => (i === j ? v : 0)),
      0.2,
    ),
  ),
)

export const DEMOS: Record<DemoId, IDemo> = {
  wave: {
    id: "wave",
    label: "Wave",
    description: "Pan side to side with a wrist flick",
    icon: Hand,
    loop: true,
    steps: [at(READY), at([45, -40, 60, 10, 0, 0]), at([-45, -40, 60, 50, 0, 0])],
  },
  "pick-place": {
    id: "pick-place",
    label: "Pick & place",
    description: "Reach, grip, carry to the other side, release",
    icon: PackageOpen,
    loop: true,
    steps: [
      at([40, -30, 50, 40, 0, OPEN]), // above pick
      at([40, 10, 30, 50, 0, OPEN]), // down
      at([40, 10, 30, 50, 0, 0], 0.6), // grip
      at([40, -30, 50, 40, 0, 0]), // lift
      at([-40, -30, 50, 40, 0, 0]), // carry
      at([-40, 10, 30, 50, 0, 0]), // down
      at([-40, 10, 30, 50, 0, OPEN], 0.6), // release
      at([-40, -30, 50, 40, 0, OPEN]), // up
      at(READY, 0.8),
    ],
  },
  "joint-sweep": {
    id: "joint-sweep",
    label: "Joint sweep",
    description: "Each joint through its range - servo and limit check",
    icon: ArrowLeftRight,
    loop: false,
    steps: sweep,
  },
  "home-park": {
    id: "home-park",
    label: "Home & park",
    description: "Go to zero, then fold into the rest pose",
    icon: House,
    loop: false,
    steps: [at([0, 0, 0, 0, 0, 0], 0.8), at([0, -80, 90, 40, 0, 0])],
  },
}

// Extra wait after each move so the arm settles before the hold starts (s).
export const DEMO_SETTLE_S = 0.2
