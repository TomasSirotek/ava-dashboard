<h1 align="center">◈ &nbsp;A V A &nbsp;◈</h1>

<hr>

<p align="center"><b>web dashboard for a 6-DOF desk arm · live 3D view · ROS 2 over rosbridge</b></p>

<p align="center"><a href="https://github.com/TomasSirotek/ava-arm"><img alt="part of ava-arm" src="https://img.shields.io/badge/part%20of-ava--arm-000000?style=flat-square"></a>&nbsp;<img alt="built with Vite + React" src="https://img.shields.io/badge/built%20with-Vite%20%2B%20React-e5e5e5?style=flat-square&labelColor=000000">&nbsp;<img alt="ROS 2 Jazzy" src="https://img.shields.io/badge/ROS%202-Jazzy-dc2626?style=flat-square&labelColor=000000">&nbsp;<img alt="runs on Raspberry Pi" src="https://img.shields.io/badge/runs%20on-Raspberry%20Pi-ffffff?style=flat-square&labelColor=000000"></p>

<p align="center"><img src="docs/image.png" alt="AVA dashboard: 3D arm viewport with torque and pose cards, joint controls on the right" width="100%"></p>

<p align="center"><sub><i>Screenshot of the work-in-progress dashboard — mock data, UI still evolving.</i></sub></p>

A static Vite + React SPA that talks to ROS 2 over rosbridge (WebSocket), so it
needs no server of its own.

> Status: UI driven by mock data. The 3D model loads, but it doesn't follow the
> joint sliders yet, and the ROS connection isn't wired.

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

Requires Node and pnpm.

```bash
pnpm install
pnpm dev        # dev server at http://localhost:5173
```

## Build

```bash
pnpm build      # static output in dist/
pnpm typecheck
```

`dist/` works from any static file server, e.g. on a Raspberry Pi:

```bash
cd dist && python3 -m http.server 8080
```

## Stack

Vite, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Base UI), three.js /
react-three-fiber, urdf-loader, roslib, zustand.
