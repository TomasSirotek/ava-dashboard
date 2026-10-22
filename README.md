<h1 align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/logo-dark.svg">
    <img src="docs/logo-light.svg" alt="App logo" height="54" align="absmiddle">
  </picture>
</h1>


<p align="center"><a href="https://github.com/TomasSirotek/ava-dashboard/actions/workflows/ci.yml"><img alt="CI status" src="https://github.com/TomasSirotek/ava-dashboard/actions/workflows/ci.yml/badge.svg?branch=main"></a>&nbsp;<a href="https://github.com/TomasSirotek/ava-arm"><img alt="part of ava-arm" src="https://img.shields.io/badge/part%20of-ava--arm-ffffff?style=flat-square"></a>&nbsp;<img alt="built with Vite + React" src="https://img.shields.io/badge/built%20with-Vite%20%2B%20React-e5e5e5?style=flat-square&labelColor=000000">&nbsp;<img alt="ROS 2 Jazzy" src="https://img.shields.io/badge/ROS%202-Jazzy-ffffff?style=flat-square&labelColor=000000">&nbsp;<img alt="runs on ESP32" src="https://img.shields.io/badge/runs%20on-ESP32-ffffff?style=flat-square&labelColor=000000"></p>

<p align="center"><img src="docs/dashboard-v2.png" alt="AVA dashboard: header, status toolbar, panel grid with the 3D arm view, robot state charts, joints table, logs and demo timeline, controls on the right" width="100%"></p>


Web dashboard for the [AVA arm](https://github.com/TomasSirotek/ava-arm): a static Vite + React app that monitors and
drives the arm over rosbridge (ROS 2). Without rosbridge it runs a built-in simulation.

## Features

- **Header**: system time, session ID, emergency stop, theme toggle.
- **Toolbar**: system status, control mode, joint angle source (`sim`, `live`, `cmd`), Panels menu to reopen closed panels.
- **Panels**: drag a header onto another panel to swap them, drag the gaps to resize, maximize or close from the header
  buttons. The open panels fill the grid two per row; a reopened panel goes last. Order, closed panels and sizes are
  remembered in the browser.

| Panel | Shows |
| --- | --- |
| 3D view | the robot URDF posed from the joint state; click a part to see its lengths |
| Robot state | joint position and velocity over the last 30 s; effort while `/joint_states` carries it |
| Joints | servo, angle, target, range and effort per joint; click a row to highlight the joint |
| Logs | link, control and demo events with search and level filter |
| Demo timeline | demo picker, Play / Pause / Stop / Loop, one row per step on a time axis with a playhead; shows the selected demo's plan before it runs |

- **Right column tabs**:

| Tab | Does |
| --- | --- |
| Joints | slider and number box per joint, Home, joint highlight |
| Control | Manual / Automatic mode, voice settings (placeholder) |
| Motion | velocity scale and move duration |
| Parts | hardware catalogue with datasheets |
| Link | rosbridge status, round trip, `/joint_states` rate, URL, Connect / Disconnect with a progress bar while connecting |

- A notification pops up when the rosbridge link connects, drops or a Connect fails (attempts give up after 5 s and retry).
- Only measured or commanded values are shown; "—" when there is nothing to measure.

## Safety

- The dashboard's emergency stop holds the arm where it is and blocks commands. It does not cut servo power.
- Pause and Stop hold the arm at its current pose. Leaving Automatic mode or engaging the e-stop stops the demo.
- Play in Manual mode asks to switch to Automatic first.

## Run

Requires Node 22.12+ and pnpm.

```bash
pnpm install
pnpm dev        # http://localhost:5173
```

The robot model comes from ava-arm through a symlink (git-ignored). Inside ava-arm:

```bash
ln -s ../../ros2_ws/src/ava_description public/robot
```

The URDF and meshes are not in a fresh ava-arm clone; without them the 3D view has no model and the rest still works.

For live data, start rosbridge:

```bash
ros2 launch rosbridge_server rosbridge_websocket_launch.xml address:=127.0.0.1
```

The default URL is `ws://127.0.0.1:9090`. Change it in the Link tab (remembered in the browser) or set `VITE_ROSBRIDGE_URL`.

## Scripts

| Script | Does |
| --- | --- |
| `pnpm dev` | dev server |
| `pnpm build` | static build in `dist/` |
| `pnpm preview` | serve `dist/` |
| `pnpm typecheck` | TypeScript check |
| `pnpm check` / `pnpm check:fix` | Biome lint, format and import order (check / fix) |
| `pnpm test` / `pnpm test:watch` | Vitest unit tests |
| `pnpm test:coverage` | tests with coverage (`coverage/`) |

Before pushing: `pnpm check && pnpm typecheck && pnpm test && pnpm build`.

## Project structure

```
src/
  app/          app root and providers (background feeds)
  layout/       page shell, resizable panel grid, Panels menu
  components/
    ui/         shadcn/ui components (generated)
    shared/     Panel, Field, shared styles
  features/     one folder per feature: robot, connection, demos, joints, history, control, motion, parts, logs, ...
```

Files in a feature folder: `thing.tsx` (component), `thing.interface.ts` (types), `thing.content.ts` (static data),
`thing.store.ts` (zustand store), `use-thing.ts` (hook), `thing.test.ts` (tests). Imports use the `@/` alias.
Biome: double quotes, no semicolons, 140-column lines.

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on pushes to `main`, pull requests, weekly and on demand:

| Job | Runs |
| --- | --- |
| Dependencies | frozen-lockfile install, `pnpm audit`, dependency review on pull requests |
| Lint, typecheck, test, build | `biome ci`, `pnpm typecheck`, `pnpm test`, `pnpm build` |

Also: CodeQL scanning, weekly Dependabot updates, actions pinned to commit SHAs. The ROS contract tests need the
`public/robot` symlink and run in the ava-arm CI.

## Stack

Vite, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Base UI), three.js / react-three-fiber / drei, Recharts,
zustand, sonner, lucide-react, roslib, urdf-loader, Biome.
