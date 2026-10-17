<h1 align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/logo-dark.svg">
    <img src="docs/logo-light.svg" alt="App logo" height="54" align="absmiddle">
  </picture>
</h1>


<p align="center"><a href="https://github.com/TomasSirotek/ava-dashboard/actions/workflows/ci.yml"><img alt="CI status" src="https://github.com/TomasSirotek/ava-dashboard/actions/workflows/ci.yml/badge.svg?branch=main"></a>&nbsp;<a href="https://github.com/TomasSirotek/ava-arm"><img alt="part of ava-arm" src="https://img.shields.io/badge/part%20of-ava--arm-ffffff?style=flat-square"></a>&nbsp;<img alt="built with Vite + React" src="https://img.shields.io/badge/built%20with-Vite%20%2B%20React-e5e5e5?style=flat-square&labelColor=000000">&nbsp;<img alt="ROS 2 Jazzy" src="https://img.shields.io/badge/ROS%202-Jazzy-ffffff?style=flat-square&labelColor=000000">&nbsp;<img alt="runs on ESP32" src="https://img.shields.io/badge/runs%20on-ESP32-ffffff?style=flat-square&labelColor=000000"></p>

<p align="center"><img src="docs/dashboard-v2.png" alt="AVA dashboard: header, status toolbar, panel grid with the 3D arm view, robot state charts, joints table, logs and demo timeline, controls on the right" width="100%"></p>

<p align="center"><sub><i>Screenshot of the work-in-progress dashboard, driving the in-house arm model — UI still evolving.</i></sub></p>

A static Vite + React SPA that talks to ROS 2 over rosbridge (WebSocket), so it
needs no server of its own.

> Status: shows and drives the robot live over rosbridge (Gazebo today, hardware
> later). Without ROS it falls back to a built-in simulation. Still placeholders:
> Solve IK, voice. See [CHANGELOG.md](CHANGELOG.md).

## Features

One page. On large screens (≥ 1024 px) it fits the window in three rows (two panels, two panels, one
full-width panel). Panels can be moved: drag one by its header (grip icon) onto another, an accent
placeholder shows where it will land, and on drop the two swap places. Every split is resizable: drag the
gap between two panels, between the rows, or the line before the right column
([react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) via shadcn `resizable`);
sizes are remembered in `localStorage`. On smaller screens everything stacks in one scrolling
column, and the header drops the environment name and the clock and shortens the e-stop to STOP.
Everything shown comes from real data: the built-in simulation, Gazebo or the arm; nothing is
made up to fill a panel.

**Header**: logo, breadcrumb (environment › robot ID), system time, this browser session's ID,
**Emergency stop / Release**, and a light / dark / system theme toggle (dark by default).

**Toolbar** (chips under the header): overall status, All systems nominal (live
`/joint_states`), No joint data (rosbridge up, no robot), Simulated · no robot (no rosbridge),
Emergency stop; the control mode (click to open the Control tab); and where the joint angles
come from (`sim`, `live` measured by Gazebo, `cmd` commanded on the real arm, which reports nothing back).

**Panel grid**: every panel has an icon + title header, an optional stats row and a maximize
button (Esc restores):

| Panel | Shows |
| --- | --- |
| 3D view | the robot's real URDF (`public/robot/urdf/ava.urdf`, see [Run](#run)) posed from the joint state: orbit controls, reset camera, grid toggle, help popover, X/Y/Z gizmo in the ROS frame (click an axis to look along it). Highlighted joints get a labelled box; clicking an arm part shows its lengths |
| Robot state | joint position and velocity of all six joints over the last 30 s (4 Hz); an effort chart (% of stall) only while `/joint_states` carries effort (Gazebo) |
| Joints | table per joint: servo, angle, target, URDF range, effort ("—" unless measured, red above 85 %). Click a row to highlight the joint. A narrow panel hides Servo, then Target, then Range (container queries); Joint, Angle and Effort always show |
| Logs | timestamped events (session, rosbridge link, live data, e-stop, control mode, demos) with level and source, a search box and a level filter; a narrow panel hides the source column |
| Demo timeline | the current or last demo cycle as a Gantt chart: one row per step on a shared m:ss axis. Executed steps sit at the times they really ran (move in orange, or green for gripper-only steps, then the hold in grey), the running step grows up to the playhead, the rest are dashed outlines at their planned times; a stopped run greys out the steps it never reached. Header: demo, cycle, Running / Finished / Stopped, elapsed / cycle length. Times are what the dashboard commanded: the servos report no "arrived" signal |

**Right column**: the controls tabs on top, details and streams below.

| Tab | What it does |
| --- | --- |
| Joints | Slider and number box per joint (ranges = URDF limits), Home, joint highlight pills, Cartesian target + Solve IK (placeholder) |
| Control | Manual / Automatic (demos: Wave, Pick & place, Joint sweep, Home & park; voice mocked). Controller (gamepad) mode is disabled for now: its code is kept, commented out, marked `Controller mode (disabled)` |
| Motion | Velocity scale and trajectory duration (set how fast slider moves and demos run); acceleration and Simulation/Hardware are not applied yet |
| Parts | The build's hardware, filterable by Servos / Control / Power: photo, role, PCA9685 channel and a folding datasheet. No live readings: the build has no voltage, current or temperature sensors |
| Link | rosbridge WebSocket URL and Connect |

- **Details**: robot ID, model, servo count per model, when the page was loaded.
- **Streams**: rosbridge (round-trip ms), `/joint_states` (measured Hz) and the trajectory
  command topic (commands sent, last one); "—" while there is nothing to measure.

The joint sliders lock while the e-stop is engaged or in Automatic mode. Every action confirms itself with a
toast (sonner, panel-coloured; the icon shows success, info, warning or error).

## Architecture

- **Feature folders.** Code is grouped by feature under `src/features/`, not by
  file type. Everything for one feature sits flat in its folder.
- **State in zustand stores.** Shared state lives in small stores (`*.store.ts`):
  robot telemetry, control mode and e-stop, highlighted joints. Components
  subscribe to single values with selectors, so a telemetry tick only re-renders
  the numbers that changed. Purely local UI state stays in `useState`.
- **Background feeds as hooks.** `app.providers.tsx` runs the hooks that fill the
  stores (the rosbridge feed, the command sender, the demo runner, the joint
  history sampler for the charts) and the theme context.
- **One command path.** Sliders and demos set `commanded` in the robot store.
  With rosbridge it is sent to `/joint_trajectory_controller/joint_trajectory`;
  without it the built-in simulation eases toward it (`robot.store.ts`).
- **Layout separate from content.** `layout/app-layout.tsx` is the page shell
  (header, toolbar, main, right column, toaster) and `layout/panel-grid.tsx` the
  grid of panels; both switch between resizable groups (desktop) and a stacked
  column (`useIsDesktop`, `layout/layout.content.ts`). `app/app.tsx` fills the
  slots; every panel uses the shared `components/shared/panel.tsx`, whose body is a
  size container, so content adapts to the panel's width, not the window's.
- **Lazy 3D and charts.** three.js and Recharts load as their own chunks, so the
  controls render first.
- **React 19 idioms**: `<Context value>` and `use()`, ref as a prop (no
  `forwardRef`). The one class component is the model's error boundary, which
  React still has no hook for.

## Project structure

```
src/
  main.tsx                  mounts <App />
  index.css                 Tailwind v4 theme tokens (Poppins, dark control-room palette)
  app/                      app root and providers
  layout/                   page shell, resizable panel grid, movable panel slots, desktop breakpoint
  components/
    ui/                     shadcn/ui components (generated, not hand-edited), incl. chart (Recharts)
    shared/                 Panel, Heading, Field, Setting, NumberStepper, shared styles
  lib/utils.ts              cn(), firstValue(), clockTime
  features/
    header/                 header bar: logo, breadcrumb, clock and session ID, e-stop
    status/                 toolbar: system status, control mode, angle source
    navigation/             controls tabs of the right column
    details/                details and streams under the tabs
    joints/                 joint sliders, highlight pills, joints table
    history/                joint history sampler and the robot state charts
    target/                 Cartesian target + IK
    control/                control modes, voice settings, gamepad (disabled)
    motion/                 sim / hardware target, limits
    parts/                  hardware parts catalogue
    connection/             rosbridge URL
    logs/                   system log store, event feed and logs panel
    viewport/               three.js canvas, model, joint tracker, toolbar
    robot/                  robot store, rosbridge feed, command sender
    demos/                  automatic-mode demos, their runner and the timeline
    theme/                  theme provider and toggle
```

### File naming

Inside a feature folder every file is named after what it holds:

| File | Holds |
| --- | --- |
| `thing.tsx` | a component (kebab-case, one per file) |
| `thing.interface.ts` | types and interfaces, prefixed `I` (`IPart`, `IJointRowProps`) |
| `thing.content.ts(x)` | static data and config: labels, defaults, lists, `useNavItems()` |
| `thing.store.ts` | zustand store and selectors |
| `use-thing.ts` | a hook |
| `thing.context.ts` | a React context |
| `thing.test.ts` | Vitest unit tests for the file next to it (e.g. `robot.store.test.ts` tests `robot.store.ts`) |

Imports always use the `@/` alias (`@/features/parts/parts.content`), never
relative `./` or `../` paths.

## Clone

Standalone:

```bash
git clone git@github.com:TomasSirotek/ava-dashboard.git
cd ava-dashboard
```

Or as part of ava-arm, where it lives at `dashboard/`:

```bash
git clone --recurse-submodules git@github.com:TomasSirotek/ava-arm.git
cd ava-arm/dashboard
```

## Run

Requires Node 22.12+ and pnpm.

```bash
pnpm install
pnpm dev        # dev server at http://localhost:5173
```

The robot model comes from the ROS repo through a symlink (git-ignored), so the
URDF and meshes have one source of truth. Inside ava-arm:

```bash
ln -s ../../ros2_ws/src/ava_description public/robot
```

> `ava.urdf` and the meshes are git-ignored in ava-arm, so the symlink points at files
> that are not in a fresh clone. Without them the viewport falls back to its built-in
> simulation; the rest of the dashboard works. See the
> [ava-arm README](https://github.com/TomasSirotek/ava-arm#the-arm-model-files-are-supplied-locally).

For live data, run rosbridge (`ros2 launch rosbridge_server rosbridge_websocket_launch.xml`,
default `ws://localhost:9090`; override with `VITE_ROSBRIDGE_URL`). See the
[ava-arm README](https://github.com/TomasSirotek/ava-arm#run).

## Scripts

| Script | Does |
| --- | --- |
| `pnpm dev` | dev server |
| `pnpm build` | static output in `dist/` |
| `pnpm preview` | serve the built `dist/` |
| `pnpm typecheck` | TypeScript check |
| `pnpm check` | Biome: lint + format + import order, no changes |
| `pnpm check:fix` | Biome: apply safe fixes and formatting |
| `pnpm test` | Vitest unit tests (`src/**/*.test.ts`), once |
| `pnpm test:watch` | Vitest in watch mode |
| `pnpm test:coverage` | Vitest once with coverage: table in the terminal, HTML in `coverage/` |
| `pnpm lint` | Biome lint only |
| `pnpm format` | Biome format only |

Biome config is in `biome.json`: double quotes, no semicolons, 2-space indent,
140-column lines.

`dist/` works from any static file server, e.g. on a Raspberry Pi:

```bash
cd dist && python3 -m http.server 8080
```

## CI

GitHub Actions ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs on every push to
`main`, on pull requests, weekly (Monday 06:00 UTC, to catch new advisories) and on demand.
The badge at the top shows the latest run on `main`.

| Job | Steps | Fails when |
| --- | --- | --- |
| Dependencies | install with the frozen lockfile, `pnpm audit`, dependency report; on pull requests also GitHub's dependency review | `pnpm-lock.yaml` is out of date, a high or critical advisory has a fixed version, or a PR adds a dependency with a high or critical advisory |
| Lint, typecheck, test, build | `biome ci`, `pnpm typecheck`, `pnpm test`, `pnpm build` | any of them fails (all run, so one run lists every problem) |

Reports: each run's **Summary** page has the Vitest test report, a coverage table and the
dependency report (all advisories, including ones with no fix yet, and outdated packages).
Failing tests and Biome errors show as annotations on the code; the JUnit file and the
HTML coverage report are downloadable as the `test-report` artifact. Coverage has no
minimum: the 3D view and most components are deliberately untested. The ROS contract
tests are skipped in CI, because `public/robot` links into the ava-arm checkout; run
`pnpm test` inside ava-arm to include them.

Also in `.github/`:

- **CodeQL** ([`workflows/codeql.yml`](.github/workflows/codeql.yml)): static security analysis of
  the TypeScript code and the workflow files, same triggers; findings land under
  Security → Code scanning.
- **Dependabot** ([`dependabot.yml`](.github/dependabot.yml)): one grouped pull request a week
  for npm packages and one for the workflow actions, skipping releases younger than 7 days.
  Security-fix PRs are enabled in the repo settings and open as soon as a fix exists.
- **Pinned actions**: every action is pinned to a commit SHA with its version as a comment;
  Dependabot bumps both.
- **Branch protection** ([`rulesets/main.json`](.github/rulesets/main.json), applied in the repo
  settings): `main` takes changes through pull requests that pass both CI jobs; force-push and
  deleting `main` are blocked. Repository admins can bypass (push directly). To change the
  rules, edit the file and apply it with
  `gh api -X PUT repos/TomasSirotek/ava-dashboard/rulesets/<id> --input .github/rulesets/main.json`
  (`gh api repos/TomasSirotek/ava-dashboard/rulesets` lists the id).

Before pushing, the same checks locally: `pnpm check && pnpm typecheck && pnpm test && pnpm build`
(`pnpm test:coverage` for the coverage table).

## Stack

Vite, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Base UI), three.js /
react-three-fiber / drei, zustand, sonner, lucide-react, roslib, urdf-loader, Biome.
