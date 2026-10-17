export const JOINT_PILL_LABELS = ["Pan", "Lift", "Elbow", "Wrist", "Roll", "Grip"]

// Per-joint slider range in degrees, same order as JOINT_NAMES. Mirrors the joint limits in
// ava_description/urdf/ava.control.xacro (radians there), rounded inward to 0.1° so a slider at its
// end never asks for more than the URDF allows. joints.content.test.ts compares the two.
export const JOINT_LIMITS = [
  { min: -90, max: 90, step: 0.1 }, // shoulder_pan  -1.570796 .. 1.570796 rad
  { min: -12.1, max: 120, step: 0.1 }, // shoulder_lift -0.212536 .. 2.094395
  { min: -87.3, max: 92.7, step: 0.1 }, // elbow_flex  -1.523672 .. 1.617920
  { min: -150, max: 30, step: 0.1 }, // wrist_flex     -2.617994 .. 0.523599
  { min: -112.5, max: 67.5, step: 0.1 }, // wrist_roll -1.963495 .. 1.178097
  { min: -34, max: 11.3, step: 0.1 }, // gripper       -0.594434 .. 0.197952 (open .. closed)
]

// Stepper increments: arrow/button = 1°, Alt = 0.1°, Shift = 10°.
export const JOINT_STEPS = { step: 1, smallStep: 0.1, largeStep: 10 }

// Effort above this % of stall torque is shown as a warning in the joints table.
export const EFFORT_WARN = 85

// Joints table columns. `className` hides a column while the table's panel is narrow (container query on the
// panel body): Servo below 24 rem, Target below 28 rem, Range below 32 rem. Joint, Angle and Effort always show.
export const JOINT_TABLE_COLUMNS = [
  { label: "Joint", className: "" },
  { label: "Servo", className: "hidden @sm:table-cell" },
  { label: "Angle", className: "" },
  { label: "Target", className: "hidden @md:table-cell" },
  { label: "Range", className: "hidden @lg:table-cell" },
  { label: "Effort", className: "" },
]
