# ava-dashboard

Browser dashboard for the [ava-arm](https://github.com/TomasSirotek/ava-arm) 6-DOF arm.
A static Vite + React SPA that talks to ROS 2 over rosbridge (WebSocket), so it
needs no server of its own.

> Status: UI only, driven by mock data. 3D viewport and ROS connection are not wired yet.

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
