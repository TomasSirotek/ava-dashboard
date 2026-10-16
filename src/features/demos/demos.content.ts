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

const at = (label: string, pose: number[], hold = 0.3): IDemoStep => ({ label, pose, hold })

// Each joint in turn to 80% of its range both ways, then back to zero.
const sweep = JOINT_LIMITS.flatMap(({ min, max }, j) =>
  (
    [
      ["min", min * 0.8],
      ["max", max * 0.8],
      ["zero", 0],
    ] as const
  ).map(([end, v]) =>
    at(
      `J${j + 1} ${end}`,
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
    steps: [at("Ready", READY), at("Left", [45, 50, 70, -10, 0, CLOSED]), at("Right", [-45, 50, 70, -70, 0, CLOSED])],
  },
  "pick-place": {
    id: "pick-place",
    label: "Pick & place",
    description: "Reach, grip, carry to the other side, release",
    icon: PackageOpen,
    loop: true,
    steps: [
      at("Above pick", [40, ...ABOVE, OPEN]),
      at("Down", [40, ...DOWN, OPEN]),
      at("Grip", [40, ...DOWN, CLOSED], 0.6),
      at("Lift", [40, ...ABOVE, CLOSED]),
      at("Carry", [-40, ...ABOVE, CLOSED]),
      at("Down", [-40, ...DOWN, CLOSED]),
      at("Release", [-40, ...DOWN, OPEN], 0.6),
      at("Up", [-40, ...ABOVE, OPEN]),
      at("Ready", READY, 0.8),
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
    steps: [at("Home", [0, 0, 0, 0, 0, 0], 0.8), at("Park", [0, 0, 90, -90, 0, CLOSED])],
  },
}

// Extra wait after each move so the arm settles before the hold starts (s).
export const DEMO_SETTLE_S = 0.2
