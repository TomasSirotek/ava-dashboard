// Served from public/models/, relative to the app base so it works from any static path.
export const MODEL_URL = `${import.meta.env.BASE_URL}models/demo-arm.usdz`

// Models arrive in arbitrary units; normalise to this height and stand it on the grid.
export const MODEL_HEIGHT = 1

// The demo model is a flat, unrigged mesh export, so each joint is approximated by the meshes around it.
export const JOINT_PARTS = [
  ["Cylinder_2", "Cylinder_001_3", "Cylinder_003_4"], // shoulder_pan: turntable
  ["Cube_002_11", "Plane_003_14"], // shoulder_lift: base bracket
  ["Cube_004_17", "Plane_004_15"], // elbow_flex
  ["Cube_005_23", "Plane_006_24"], // wrist_flex
  ["Cube_006_29", "Cylinder_015_30", "Cylinder_016_31"], // wrist_roll
  ["Cylinder_017_35", "Cube_007_36", "Cylinder_018_37", "Plane_008_32", "Plane_009_33", "Plane_010_34", "Plane_011_38"], // gripper
]

// Mirrors OrbitControls defaults: Ctrl/⌘/Shift swaps rotate and pan.
export const NAVIGATION_HELP = [
  ["Rotate", "Left drag · Ctrl/⌘/Shift + right drag"],
  ["Pan", "Right drag · Ctrl/⌘/Shift + left drag"],
  ["Zoom", "Scroll · middle drag"],
  ["Touch", "1 finger rotate · 2 fingers pinch/pan"],
]
