# Changelog

All notable changes to the dashboard. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Live data from ROS over rosbridge (`/joint_states`), with rate and round-trip latency; falls back to a built-in simulation when rosbridge is unreachable.
- Control: joint sliders, Home and e-stop now move the robot — via `/joint_trajectory_controller/joint_trajectory` when connected, the built-in simulation otherwise.
- Automatic mode demos: Wave, Pick & place, Joint sweep, Home & park.
- Motion tab: velocity scale and duration set the move time.
- Axis gizmo (X/Y/Z in the ROS frame) in the 3D viewport.

### Changed
- 3D viewport loads the robot's URDF (`public/robot`, a symlink to `ava_description`) instead of the demo model.
- Joint slider ranges match the URDF joint limits.
- Status badges (Connected / No joint data / Simulated, Online / Offline, live / sim) reflect the real link state instead of fixed text.

### Fixed
- Commands now carry a zero timestamp, so the controller runs them under Gazebo's sim time.
