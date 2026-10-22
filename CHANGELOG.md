# Changelog

All notable changes to the dashboard. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Live joint data from ROS over rosbridge (`/joint_states`) with measured rate and round trip; built-in simulation when rosbridge is unreachable.
- Joint sliders, Home and e-stop drive the robot via `/joint_trajectory_controller/joint_trajectory`.
- Automatic mode demos: Wave, Pick & place, Joint sweep, Home & park.
- Confirmation dialog before switching to Automatic mode.
- Demo timeline: demo picker, Play / Pause / Stop / Loop transport, per-step rows with a playhead, plan shown before a run.
- Link tab: live connection status, round trip, `/joint_states` rate, editable URL (remembered), Connect / Disconnect.
- Notifications when the rosbridge link connects, drops or does not come up within the connect window.
- Connect window: keeps trying rosbridge for 30 s (page load, Connect, lost link) with a progress bar, attempt count and time left, then shows Not connected with how to start rosbridge; toolbar chip shows Connecting…
- Panels: 3D view, robot state charts, joints table, logs, demo timeline.
- Movable and resizable panels; layout remembered in `localStorage`.
- Close button on every panel; the rest fill the space. Toolbar Panels menu reopens a panel as the last one; closed panels are remembered.
- Logs panel with search and level filter.
- Streams section: rosbridge round trip, `/joint_states` rate, trajectory commands sent.
- Toolbar status chips: system status, control mode, joint angle source.
- Header system time and session ID.
- Axis gizmo and arm part lengths in the 3D view.
- Motion tab: velocity scale and move duration.
- Parts tab: the build's servos, controller and power parts with datasheets.
- Unit tests (Vitest), including ROS contract tests against `ava_description`.
- CI: dependency audit, Biome, typecheck, tests, build; CodeQL; Dependabot; branch protection ruleset.

### Changed
- Default rosbridge URL is `ws://127.0.0.1:9090`.
- Demos are picked and run from the Demo timeline; the Control tab shows voice settings only in Automatic mode.
- Pause and Stop hold the arm at its current pose.
- One-page dark dashboard layout with Poppins for all text.
- Selected tabs, pills and main buttons use one inverted fill.
- Servo layout 3× MG996R + 3× SG90, matching `ava_description`.
- Joint ranges, demo poses and viewport link names follow the new arm model.
- 3D view loads the robot URDF from `public/robot`.
- Effort is shown only when `/joint_states` carries it.

### Removed
- Run buttons for demos in the Control tab.
- Monospace font.
- Placeholder readings: current pose card, voltage, current, temperature, simulated torque and link stats.
- Camera section.
- Controller (gamepad) mode, disabled for now.

### Fixed
- Real arm: effort that ros2_control publishes as NaN is no longer shown as 0 % and the angle source reads `cmd`, not `live`.
- Commands use a zero timestamp, so they run under Gazebo sim time.
- Move durations just under a whole second are sent with correct `sec` / `nanosec`.
