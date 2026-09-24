import { lazy, Suspense, useState } from "react"
import { Home, OctagonX } from "lucide-react"
import { useMockRobot, names, type RobotState } from "@/lib/mock-robot"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"

// three.js is large; load the 3D viewport as its own chunk so the controls render first.
const RobotViewport = lazy(() => import("@/components/robot-viewport").then((m) => ({ default: m.RobotViewport })))

const servo = ["SG90", "MG996R", "MG996R", "SG90", "SG90", "SG90"]
const pose = [
  { label: "X", value: 182.4, unit: "mm" },
  { label: "Y", value: -12.8, unit: "mm" },
  { label: "Z", value: 318.6, unit: "mm" },
  { label: "Roll", value: 0.2, unit: "°" },
  { label: "Pitch", value: 14.8, unit: "°" },
  { label: "Yaw", value: -2.1, unit: "°" },
]

const first = (v: number | readonly number[]) => (Array.isArray(v) ? v[0] : (v as number))

function Heading({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex h-7 items-center justify-between">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{children}</h3>
      {action}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  )
}

function Header({ robot }: { robot: RobotState }) {
  const [estop, setEstop] = useState(false)
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-5">
      <div className="flex items-baseline gap-3">
        <span className="text-lg font-semibold tracking-tight">AVA</span>
        <span className="text-sm text-muted-foreground">6-DOF arm</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 text-sm font-medium">
          <span className="size-2 rounded-full bg-green-500" /> Connected
        </span>
        <span className="rounded-md border px-2 py-1 font-mono text-xs text-muted-foreground tabular-nums">
          {robot.rate.toFixed(1)} Hz · {robot.latency} ms
        </span>
        <Button
          className={cn(!estop && "bg-red-600 text-white hover:bg-red-700")}
          variant={estop ? "outline" : "default"}
          onClick={() => setEstop(!estop)}
        >
          <OctagonX /> {estop ? "Release" : "Stop"}
        </Button>
        <ModeToggle />
      </div>
    </header>
  )
}

function TorqueCard({ robot }: { robot: RobotState }) {
  return (
    <div className="w-72 rounded-xl border bg-background/90 p-4 shadow-sm backdrop-blur">
      <Heading>Torque</Heading>
      <div className="flex flex-col gap-3">
        {robot.jointState.effort.map((effort, i) => (
          <div key={names[i]}>
            <div className="mb-1.5 flex items-baseline text-sm">
              <span>{names[i]}</span>
              <span className="ml-2 text-xs text-muted-foreground">{servo[i]}</span>
              <span className={cn("ml-auto font-mono tabular-nums", effort > 85 && "text-destructive")}>
                {effort.toFixed(0)}%
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full bg-foreground transition-[width]", effort > 85 && "bg-destructive")}
                style={{ width: `${effort}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PoseCard() {
  return (
    <div className="w-72 rounded-xl border bg-background/90 p-4 shadow-sm backdrop-blur">
      <Heading>Current pose</Heading>
      <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border bg-border">
        {pose.map((p) => (
          <div key={p.label} className="bg-background p-2.5">
            <dt className="text-xs text-muted-foreground">{p.label}</dt>
            <dd className="mt-0.5 font-mono text-sm tabular-nums">
              {p.value.toFixed(1)}<span className="ml-0.5 text-xs text-muted-foreground">{p.unit}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function Viewport({ robot }: { robot: RobotState }) {
  const overlay = (
    <div className="pointer-events-none absolute top-4 left-4 flex flex-col gap-3 *:pointer-events-auto">
      <TorqueCard robot={robot} />
      <PoseCard />
    </div>
  )
  return (
    <Suspense fallback={<section className="relative flex-1 bg-muted/40 max-lg:min-h-[70svh]">{overlay}</section>}>
      <RobotViewport>{overlay}</RobotViewport>
    </Suspense>
  )
}

function JointsTab({ robot }: { robot: RobotState }) {
  const [joints, setJoints] = useState(() => robot.commanded)
  const setJoint = (i: number, v: number) => setJoints((cur) => cur.map((x, j) => (j === i ? v : x)))
  return (
    <div>
      <Heading action={<Button size="sm" variant="ghost" onClick={() => setJoints(names.map(() => 0))}><Home /> Home</Button>}>
        Joint positions
      </Heading>
      <div className="flex flex-col gap-5">
        {names.map((name, i) => (
          <div key={name} className="grid grid-cols-[1fr_4.5rem] items-center gap-x-3 gap-y-2">
            <div className="col-span-2 flex items-baseline justify-between text-sm">
              <span className="font-medium">{name}</span>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                live {robot.jointState.position[i].toFixed(1)}°
              </span>
            </div>
            <Slider
              aria-label={`${name} commanded position`}
              value={[joints[i]]}
              min={-180}
              max={180}
              step={0.1}
              onValueChange={(v) => setJoint(i, first(v))}
              label={`${joints[i].toFixed(1)}°`}
            />
            <Input
              aria-label={`${name} degrees`}
              className="h-7 text-right font-mono text-xs"
              value={joints[i].toFixed(1)}
              onChange={(e) => setJoint(i, Number(e.target.value) || 0)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function TargetTab() {
  const [target, setTarget] = useState([180, 0, 320])
  return (
    <div>
      <div>
        <Heading>Target position (mm)</Heading>
        <div className="grid grid-cols-3 gap-2">
          {target.map((value, i) => (
            <Field key={i} label={"XYZ"[i]}>
              <Input
                className="font-mono"
                value={value}
                onChange={(e) => setTarget(target.map((x, j) => (j === i ? Number(e.target.value) || 0 : x)))}
              />
            </Field>
          ))}
        </div>
        <Button className="mt-4 w-full">Solve IK</Button>
      </div>
    </div>
  )
}

function MotionTab() {
  const [mode, setMode] = useState("sim")
  const [velocity, setVelocity] = useState(70)
  const [accel, setAccel] = useState(45)
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Heading>Target</Heading>
        <Tabs value={mode} onValueChange={(v) => setMode(String(v))}>
          <TabsList className="w-full">
            <TabsTrigger value="sim">Simulation</TabsTrigger>
            <TabsTrigger value="real">Hardware</TabsTrigger>
          </TabsList>
        </Tabs>
        {mode === "real" && <p className="mt-2 text-sm text-destructive">Commands go to real hardware.</p>}
      </div>
      <div className="flex flex-col gap-6">
        <Heading>Limits</Heading>
        <Field label="Velocity scale">
          <Slider value={[velocity]} max={100} onValueChange={(v) => setVelocity(first(v))} label={`${velocity}%`} />
        </Field>
        <Field label="Acceleration scale">
          <Slider value={[accel]} max={100} onValueChange={(v) => setAccel(first(v))} label={`${accel}%`} />
        </Field>
        <Field label="Trajectory duration (s)">
          <Input className="font-mono" defaultValue="2.0" />
        </Field>
      </div>
    </div>
  )
}

function ConnectionTab() {
  const [url, setUrl] = useState("ws://localhost:9090")
  return (
    <div className="flex flex-col gap-4">
      <Heading>rosbridge</Heading>
      <Field label="WebSocket URL">
        <Input className="font-mono" value={url} onChange={(e) => setUrl(e.target.value)} />
      </Field>
      <Button className="w-full">Connect</Button>
    </div>
  )
}

function Sidebar({ robot }: { robot: RobotState }) {
  return (
    <aside className="w-96 shrink-0 overflow-y-auto border-l max-lg:w-full max-lg:overflow-visible max-lg:border-t max-lg:border-l-0">
      <Tabs defaultValue="joints" className="gap-0">
        <div className="sticky top-0 z-10 border-b bg-background p-3">
          <TabsList className="w-full">
            <TabsTrigger value="joints">Joints</TabsTrigger>
            <TabsTrigger value="motion">Motion</TabsTrigger>
            <TabsTrigger value="connection">Link</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="joints" className="flex flex-col gap-8 p-5">
          <JointsTab robot={robot} />
          <TargetTab />
        </TabsContent>
        <TabsContent value="motion" className="p-5"><MotionTab /></TabsContent>
        <TabsContent value="connection" className="p-5"><ConnectionTab /></TabsContent>
      </Tabs>
    </aside>
  )
}

export default function App() {
  const robot = useMockRobot()
  return (
    <div className="flex h-svh flex-col">
      <Header robot={robot} />
      <main className="flex min-h-0 flex-1 max-lg:flex-col max-lg:overflow-y-auto">
        <Viewport robot={robot} />
        <Sidebar robot={robot} />
      </main>
    </div>
  )
}
