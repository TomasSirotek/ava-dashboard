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
- Logs panel: timestamped events with level and source (Session, Link, Control, Demo), a search box and a level filter.
- Robot state panel: joint position and velocity of all six joints over the last 30 s (shadcn chart / Recharts, sampled at 4 Hz, own lazy chunk); an effort chart only while `/joint_states` carries effort.
- Joints table panel: servo, angle, target, URDF range and effort per joint; clicking a row highlights the joint.
- Demo timeline panel: a Gantt chart of the current or last demo cycle, one row per named step ("Grip", "Carry") on an m:ss axis. Executed steps are drawn at the times they really ran, split into move (motion or gripper-only) and hold; the running step grows up to a playhead; upcoming steps are planned outlines; steps a stopped run never reached are greyed out. Shows cycle, Running / Finished / Stopped and elapsed / cycle length. The system log now says "Demo finished" when a one-shot demo completes.
- Movable panels: drag a panel by its header onto another to swap them; an accent placeholder marks the drop spot, and the arrangement is remembered in `localStorage`.
- Streams in the right column: rosbridge round-trip time, measured `/joint_states` rate and the number of trajectory commands sent; "—" while nothing is measured.
- Toolbar status chip: All systems nominal / No joint data / Simulated · no robot / Emergency stop, derived from the link and the e-stop.
- Header shows the system time and a per-page-load session ID.
- Unit tests (Vitest, `pnpm test`), next to the code they cover: joint limits and controller joints against `ava_description` (skipped when the `public/robot` symlink is missing), built-in poses inside the joint limits, `/joint_states` mapping, slider lock rules, the trajectory message and command counter, the command throttle and e-stop hold, the demo runner and its run trace, the timeline maths, the rosbridge link lifecycle (simulation fallback, reconnect, going live, rate and round-trip measurement), the system log entries, chart history, log filter, status chip, and the panel order (swap, saved and restored).
- GitHub Actions CI (`.github/workflows/ci.yml`): dependency job (frozen lockfile, audit gate on fixable high/critical advisories, dependency report, dependency review on PRs) and build job (Biome, typecheck, unit tests with coverage, build), with test report and coverage table in the run summary; weekly scheduled run; status badge in the README. Actions pinned to commit SHAs.
- CodeQL code scanning (`.github/workflows/codeql.yml`) for the TypeScript code and the workflows.
- Dependabot (`.github/dependabot.yml`): weekly grouped update PRs for npm packages and actions, 7-day cooldown.
- Branch protection for `main` (`.github/rulesets/main.json`): pull requests with both CI jobs green, no force-push or deletion, admin bypass.
- `pnpm test:coverage` (`@vitest/coverage-v8`).
- Joint angle readout says where the number comes from: `sim` (built-in simulation), `live` (measured, Gazebo) or `cmd` (real arm: the servos report nothing back, so it is the commanded angle), with a tooltip.

### Changed
- Layout reworked into a dense one-page dashboard: header with breadcrumb, a toolbar of status chips, a grid of panels (3D view, robot state, joints, logs, demo timeline), each with an icon + title header, stats row and maximize button (Esc restores), and a right column with the controls tabs over details and streams. Same colours, palette and fonts.
- Resizable layout (react-resizable-panels via shadcn `resizable`): the right column's width, the three rows (two panels, two panels, a full-width bottom panel) and the splits within them can be dragged; sizes persist in `localStorage`. Below 1024 px the page stacks in one scrolling column instead (in the same panel order), the header hides the environment name and clock, and the e-stop reads STOP.
- Joints table and logs adapt to their panel's width (container queries): the table hides Servo, Target and Range in narrow panels, the logs hide the source column.
- Restyled to a dark control-room look: flat panels on a near-black background, hairline dividers, one orange accent, Poppins for all text (numbers use tabular figures; no monospace font any more). Dark theme is now the default.
- One type scale in both panels: uppercase captions (section headings, ID / Model, status cells, tabs) 11 px medium; item names (joints, torque rows, fields) 14 px medium; helper text 12 px muted; numbers 12 px.
- Segmented tabs (Control mode, Motion target, Parts filter) and the joint highlight pills share one look: outlined row, hairlines, the selected option drawn inverted (white on dark, near-black on light) like the control mode chip; the Connect button uses the same fill. Right panel tabs size to their labels, so CONTROL and MOTION no longer overlap.
- README title shows the app logo in front of "A V A" (`docs/logo-dark.svg` / `docs/logo-light.svg`, picked by GitHub's colour scheme).
- Toasts use the app's panel colours, radius and fonts; only the icon carries the status colour (previously sonner's saturated "rich colors").
- Viewport joint frame, part label and the active demo card use the theme accent instead of a hard-coded orange.
- The floating cards over the 3D view (info, torque, camera) were first merged into a left telemetry panel, then replaced by the panel grid: torque is now the effort column and chart, status and control mode are toolbar chips.
- E-stop button reads EMERGENCY STOP (red outline), solid red when engaged.
- Sliders are thin tracks with a round thumb; the value moved out of the thumb into the field header (or the number box for joints).
- Right column keeps the 320 px width; joint rows, field stacks and tab sections use one spacing scale.
- Header: system time and session ID form one outlined group split by a hairline, same height as the e-stop; the theme toggle is a matching square.
- Joint rows and the torque list show display names (Shoulder pan) instead of ROS ids (`shoulder_pan`).
- Servo layout follows the hardware: 3x MG996R (`shoulder_pan`, `shoulder_lift`, `elbow_flex`) + 3x SG90 (wrist flex, wrist roll, gripper), matching the effort limits in `ava_description`. Torque percentages use the URDF stall torques (SG90 0.157 N·m at 6 V, was 0.1765).
- Parts tab is the build's catalogue: six servos (J1–J6 with their PCA9685 channel), ESP32-C3-DevKitM-1, PCA9685 and XL4016E1 step-down, each with photo and datasheet, filterable by Servos / Control / Power.
- Effort only appears while `/joint_states` carries it (Gazebo, mock hardware). The real servos cannot measure torque and the offline simulation no longer makes it up.
- The offline simulation computes joint velocity from the position change per tick (it showed fixed start values) and no longer adds random jitter to the positions.
- Demo poses redrawn for the new arm (they used the SO-101 ranges); gripper open / closed follow the SRDF named states. Startup target pose moved inside the limits.
- Header system time and session ID are centred in their cells; the control mode chip is drawn inverted (foreground fill) and works in both themes.
- Viewport link names follow the new arm model: `forearm_link`, `gripper_base_link`, `gripper_jaw_link` (were `lower_arm_link`, `gripper_link`, `moving_jaw_link`).
- Viewport scale retuned (2 -> 1.7) for the taller arm (~0.58 m at home).
- 3D viewport loads the robot's URDF (`public/robot`, a symlink to `ava_description`) instead of the demo model.
- Joint slider ranges match the URDF joint limits of the new arm (they still had the SO-101 ranges, e.g. shoulder_lift ±100° instead of −12.1…120°), rounded inward to 0.1°.
- Status badges (Connected / No joint data / Simulated, Online / Offline, live / sim) reflect the real link state instead of fixed text.

### Removed
- Current pose card (placeholder values).
- Camera section and the Kinect from the parts list: there is no camera in the build.
- Simulated voltage, current, temperature and load readings on the part cards, and the made-up link rate / latency (shown before any connection) and torque of the offline simulation: nothing in the build measures them.
- Left telemetry panel and the header's link-stats component.
- Geist Mono font.
- Controller (gamepad) mode switched off for now: removed from the mode switch, no gamepad toasts or log entries. The code stays, commented out and marked `Controller mode (disabled)`.

### Fixed
- Commands now carry a zero timestamp, so the controller runs them under Gazebo's sim time.
- Move durations that land just under a whole second (e.g. 2.3 s at 46 % velocity) were sent as `{sec: 4, nanosec: 1000000000}` instead of `{sec: 5, nanosec: 0}`.
