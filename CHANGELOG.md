# Changelog

All notable changes to the dashboard. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Live data from ROS over rosbridge (`/joint_states`), with rate and round-trip latency; falls back to a built-in simulation when rosbridge is unreachable.
- Control: joint sliders, Home and e-stop now move the robot — via `/joint_trajectory_controller/joint_trajectory` when connected, the built-in simulation otherwise.
- Automatic mode demos: Wave, Pick & place, Joint sweep, Home & park.
- Switching to Automatic mode asks for confirmation first (stronger warning when a live robot is connected).
- Motion tab: velocity scale and duration set the move time.
- Axis gizmo (X/Y/Z in the ROS frame) in the 3D viewport.
- Arm lengths: click an arm part to highlight it and see its lengths (printed part and joint to joint), read from the URDF; Esc clears.

### Changed
- Servo layout corrected to 2x MG996R + 4x SG90: the torque card and Parts tab listed 3x MG996R. MG996R now drives `shoulder_pan` and `shoulder_lift` only; everything from the elbow out is an SG90, matching the effort limits in `ava_description`.
- Parts catalogue lists all six servos (J5 `wrist_roll` and J6 `gripper` were missing).
- Viewport link names follow the new arm model: `forearm_link`, `gripper_base_link`, `gripper_jaw_link` (were `lower_arm_link`, `gripper_link`, `moving_jaw_link`).
- Viewport scale retuned (2 -> 1.7) for the taller arm (~0.58 m at home).
- 3D viewport loads the robot's URDF (`public/robot`, a symlink to `ava_description`) instead of the demo model.
- Joint slider ranges match the URDF joint limits.
- Status badges (Connected / No joint data / Simulated, Online / Offline, live / sim) reflect the real link state instead of fixed text.

### Fixed
- Commands now carry a zero timestamp, so the controller runs them under Gazebo's sim time.
