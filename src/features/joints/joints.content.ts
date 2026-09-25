export const JOINT_PILL_LABELS = ["Pan", "Lift", "Elbow", "Wrist", "Roll", "Grip"]

// Per-joint slider range in degrees, same order as JOINT_NAMES. Mirrors the URDF limits in
// ava_description/urdf/ava.control.xacro - the controller rejects targets outside them.
export const JOINT_LIMITS = [
  { min: -110, max: 110, step: 0.1 }, // shoulder_pan  ±1.91986 rad
  { min: -100, max: 100, step: 0.1 }, // shoulder_lift ±1.74533
  { min: -96.8, max: 96.8, step: 0.1 }, // elbow_flex  ±1.69
  { min: -95, max: 95, step: 0.1 }, // wrist_flex      ±1.65806
  { min: -157.2, max: 162.8, step: 0.1 }, // wrist_roll -2.74385 .. 2.84121
  { min: -100, max: 10, step: 0.1 }, // gripper        -1.74533 .. 0.174533
]

// Stepper increments: arrow/button = 1°, Alt = 0.1°, Shift = 10°.
export const JOINT_STEPS = { step: 1, smallStep: 0.1, largeStep: 10 }
