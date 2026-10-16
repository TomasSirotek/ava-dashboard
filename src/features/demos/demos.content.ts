import { ArrowLeftRight, Hand, House, PackageOpen } from "lucide-react"
import type { DemoId, IDemo, IDemoStep } from "@/features/demos/demos.interface"
import { JOINT_LIMITS } from "@/features/joints/joints.content"

// Poses are degrees in JOINT_NAMES order: shoulder_pan, shoulder_lift, elbow_flex, wrist_flex,
// wrist_roll, gripper. All stay inside JOINT_LIMITS (demos.content.test.ts checks it).
// shoulder_lift > 0 raises the arm, elbow_flex > 0 bends the forearm forward, wrist_flex < 0 tips the
// gripper down. Gripper open / closed follow the SRDF named states (-0.59 / 0.19 rad).
const OPEN = -30
const CLOSED = 10
const READY = [0, 50, 70, -40, 0, CLOSED]
const ABOVE = [30, 70, -50, 0] // shoulder_lift .. wrist_roll over a pick spot
const DOWN = [15, 75, -60, 0] // lowered onto it

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
    steps: [at(READY), at([45, 50, 70, -10, 0, CLOSED]), at([-45, 50, 70, -70, 0, CLOSED])],
  },
  "pick-place": {
    id: "pick-place",
    label: "Pick & place",
    description: "Reach, grip, carry to the other side, release",
    icon: PackageOpen,
    loop: true,
    steps: [
      at([40, ...ABOVE, OPEN]), // above pick
      at([40, ...DOWN, OPEN]), // down
      at([40, ...DOWN, CLOSED], 0.6), // grip
      at([40, ...ABOVE, CLOSED]), // lift
      at([-40, ...ABOVE, CLOSED]), // carry
      at([-40, ...DOWN, CLOSED]), // down
      at([-40, ...DOWN, OPEN], 0.6), // release
      at([-40, ...ABOVE, OPEN]), // up
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
    steps: [at([0, 0, 0, 0, 0, 0], 0.8), at([0, 0, 90, -90, 0, CLOSED])],
  },
}

// Extra wait after each move so the arm settles before the hold starts (s).
export const DEMO_SETTLE_S = 0.2
