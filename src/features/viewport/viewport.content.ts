// public/robot is a symlink to ros2_ws/src/ava_description, so the browser sees the package
// layout and the URDF's package://ava_description/... mesh paths map onto it unchanged.
export const ROBOT_URDF_URL = `${import.meta.env.BASE_URL}robot/urdf/ava.urdf`
export const ROBOT_PACKAGES = { ava_description: `${import.meta.env.BASE_URL}robot` }

// URDF is in metres and the arm stands ~0.58 m tall at the home pose; scale it up to fit
// the MODEL_HEIGHT framing.
export const ROBOT_SCALE = 1.7

// Scene height the camera and orbit target are framed around.
export const MODEL_HEIGHT = 1

// URDF link moved by each joint (same order as JOINT_NAMES); the highlight box wraps that link's own meshes.
// Each actuated joint's child link in the export is an "axis_*"/"horn_*" stub that the
// structural part is then fixed to, so the structural link is what reads as moving.
export const JOINT_PARTS = [
  ["shoulder_link"], // shoulder_pan
  ["upper_arm_link"], // shoulder_lift
  ["forearm_link"], // elbow_flex
  ["wrist_link"], // wrist_flex
  ["gripper_base_link"], // wrist_roll
  ["gripper_jaw_link"], // gripper
]

// Friendly names for clickable URDF links.
export const LINK_LABELS: Record<string, string> = {
  base_link: "Base",
  shoulder_link: "Shoulder",
  upper_arm_link: "Upper arm",
  forearm_link: "Forearm",
  wrist_link: "Wrist",
  gripper_base_link: "Gripper",
  gripper_jaw_link: "Moving jaw",
}

// Selected part glow.
export const HIGHLIGHT_EMISSIVE = "#f97316"
// A pointer that moved more than this (px) between press and release was an orbit drag, not a click.
export const CLICK_TOLERANCE_PX = 4

// Axis gizmo (bottom-right corner): X/Y/Z in the conventional red/green/blue, offset in px.
export const GIZMO_AXIS_COLORS: [string, string, string] = ["#e5484d", "#30a46c", "#0090ff"]
export const GIZMO_MARGIN: [number, number] = [64, 64]

// WebGL renderers that run on the CPU (VMs, no GPU passthrough); the viewport drops to low-graphics mode on these.
export const SOFTWARE_RENDERER = /llvmpipe|swiftshader|softpipe|software|basic render/i

// Device-pixel-ratio range for the canvas; capped so HiDPI screens don't render 4× the pixels.
export const CANVAS_DPR: [number, number] = [1, 1.5]

// Mirrors OrbitControls defaults: Ctrl/⌘/Shift swaps rotate and pan.
export const NAVIGATION_HELP = [
  ["Rotate", "Left drag · Ctrl/⌘/Shift + right drag"],
  ["Pan", "Right drag · Ctrl/⌘/Shift + left drag"],
  ["Zoom", "Scroll · middle drag"],
  ["Touch", "1 finger rotate · 2 fingers pinch/pan"],
  ["Measure", "Click a part: highlight + lengths · Esc or click empty space to clear"],
]

// Gap (px) between a selected part and its floating label, and from the viewport edge.
export const PART_LABEL_GAP = 12
