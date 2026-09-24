import { useState } from "react"
import { Activity, AlignCenter, Axis3D, Bot, Box, Cable, ChevronDown, CircleAlert, Crosshair, Gauge, Grid3X3, Home, Menu, RotateCcw, Settings2, SlidersHorizontal, Wifi, Zap } from "lucide-react"
import { useMockRobot, names } from "@/lib/mock-robot"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

const servo = ["SG90", "MG996R", "MG996R", "SG90", "SG90", "SG90"]
const limits = [100, 100, 100, 100, 100, 100]

function RobotViewport() {
  const [grid, setGrid] = useState(true)
  return <section className="robot-viewport" aria-label="3D robot viewport">
    <div className={`viewport-grid ${grid ? "" : "hidden"}`} />
    <div className="viewport-crosshair"><Crosshair className="size-5" /><span>3D VIEWPORT</span></div>
    <div className="viewport-toolbar" aria-label="Viewport controls">
      <Button size="icon" variant="ghost" title="Reset camera"><RotateCcw /></Button>
      <Button size="icon" variant={grid ? "secondary" : "ghost"} title="Toggle grid" onClick={() => setGrid(!grid)}><Grid3X3 /></Button>
      <Button size="icon" variant="ghost" title="Toggle joint axes"><Axis3D /></Button>
      <Button size="icon" variant="ghost" title="Toggle collision meshes"><Box /></Button>
    </div>
    <div className="viewport-axis"><span className="axis-x">X</span><span className="axis-y">Y</span><span className="axis-z">Z</span></div>
  </section>
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return <section className="panel-section"><header className="panel-header"><span>{title}</span>{action}</header><div className="panel-content">{children}</div></section>
}

function Status({ compact = false }: { compact?: boolean }) { return <div className="status-line"><span className="status-dot" /> <span>CONNECTED</span>{!compact && <Badge variant="outline" className="status-badge">ROS 2</Badge>}</div> }

function ControlRail() {
  const robot = useMockRobot()
  const [mode, setMode] = useState("SIM")
  const [url, setUrl] = useState("ws://localhost:9090")
  const [target, setTarget] = useState([180, 0, 320])
  const [estop, setEstop] = useState(false)
  const [jointValues, setJointValues] = useState(() => robot.commanded ?? robot.jointState.position)
  const nearLimit = robot.jointState.effort.filter((v) => v >= 60).length
  const setJoint = (i: number, v: number) => setJointValues((current) => current.map((x, index) => index === i ? v : x))
  return <aside className="control-rail">
    <div className="rail-top"><div className="brand"><div className="brand-mark"><Bot /></div><div><strong>AVA</strong><span>6-DOF ARM</span></div></div><Button className={`estop ${estop ? "estop-active" : ""}`} onClick={() => setEstop(true)}><Zap data-icon="inline-start" /> E-STOP</Button></div>
    <Section title="CONNECTION"><div className="connection-row"><Status /><span className="mono dim">{robot.latency} ms</span></div><div className="field-row"><Input aria-label="WebSocket URL" value={url} onChange={(e) => setUrl(e.target.value)} className="mono" /><Button variant="outline">Connect</Button></div><div className="telemetry"><span>MESSAGE RATE <b>{robot.rate.toFixed(1)} Hz</b></span><span>TRANSPORT <b>WEBSOCKET</b></span></div></Section>
    <Section title="JOINTS" action={<div className="header-actions"><Button size="sm" variant="ghost"><Home /> Home</Button><Button size="sm" variant="ghost">Sync to live</Button></div>}><div className="joint-list">{names.map((name, i) => { const live = robot.jointState.position[i]; const command = jointValues[i]; return <div className="joint-row" key={name}><div className="joint-label"><span>{name}</span><span className="mono dim">{live.toFixed(1)}°</span></div><Slider aria-label={`${name} commanded position`} value={[command]} min={-180} max={180} step={0.1} onValueChange={(v) => setJoint(i, Array.isArray(v) ? v[0] : v)} /><div className="slider-labels"><span>-180°</span><span>180°</span></div><div className="joint-edit"><Input aria-label={`${name} degrees`} className="mono" value={command.toFixed(1)} onChange={(e) => setJoint(i, Number(e.target.value) || 0)} /><span>°</span><span className={`diverge ${Math.abs(live-command) > 2 ? "is-diverged" : ""}`} title="Live versus commanded">{Math.abs(live-command) > 2 ? "●" : "○"}</span></div></div>})}</div></Section>
    <Section title="TORQUE" action={<Badge variant="outline">SERVO EFFORT</Badge>}><div className="torque-list">{robot.jointState.effort.map((effort, i) => <div className={`torque-row ${effort > 85 ? "critical" : effort >= 60 ? "warning" : ""} ${names[i] === "shoulder_lift" ? "saturated" : ""}`} key={names[i]}><div className="torque-meta"><span>{names[i]}</span><Badge variant="secondary">{servo[i]}</Badge><b className="mono">{effort.toFixed(0)}%</b>{names[i] === "shoulder_lift" && <span className="saturation-label">SATURATED</span>}</div><div className="torque-track"><div style={{ width: `${effort}%` }} /></div></div>)}</div><div className="torque-summary"><CircleAlert /> {nearLimit} joints near limit · shoulder_lift saturated</div></Section>
    <Section title="END EFFECTOR"><div className="pose-grid">{["X","Y","Z","ROLL","PITCH","YAW"].map((label, i) => <div key={label}><label>{label}</label><div className="readout">{[182.4, -12.8, 318.6, 0.2, 14.8, -2.1][i].toFixed(1)} <span>{i < 3 ? "mm" : "°"}</span></div></div>)}</div><div className="sub-label">TARGET POSE <span>mm</span></div><div className="target-grid">{target.map((value, i) => <Input key={i} aria-label={`Target ${["X","Y","Z"][i]}`} className="mono" value={value} onChange={(e) => setTarget(target.map((x, j) => j === i ? Number(e.target.value) || 0 : x))} />)}</div><Button className="solve" variant="outline">Solve IK <AlignCenter /></Button></Section>
    <Section title="SETTINGS"><div className="mode-toggle"><button className={mode === "SIM" ? "selected" : ""} onClick={() => setMode("SIM")}>SIM</button><button className={mode === "REAL" ? "selected" : ""} onClick={() => setMode("REAL")}>REAL</button></div>{mode === "REAL" && <div className="real-warning"><CircleAlert /> Real hardware control enabled</div>}<div className="setting-slider"><div><span>VELOCITY SCALE</span><b className="mono">70%</b></div><Slider defaultValue={[70]} max={100} /></div><div className="setting-slider"><div><span>ACCELERATION SCALE</span><b className="mono">45%</b></div><Slider defaultValue={[45]} max={100} /></div><div className="field-row duration"><label>TRAJECTORY DURATION</label><Input className="mono" defaultValue="2.0" /><span>s</span></div></Section>
    <div className="mobile-tabs">{[[Gauge,"Control"],[Activity,"Simulation"],[Cable,"Diagnostics"],[Settings2,"Settings"]].map(([Icon, label]: any) => <button key={label} title={label}><Icon /><span>{label}</span></button>)}</div>
    <footer className="status-bar"><span>ROS 2 <b>JAZZY</b></span><span>CONTROLLER <b className="green">ACTIVE</b></span><span>LAST ERROR <b>—</b></span></footer>
  </aside>
}

export default function App() { return <main className="dashboard"><nav className="icon-rail"><div className="rail-logo">A</div>{[[Gauge,"Control"],[Activity,"Simulation"],[Cable,"Diagnostics"],[Settings2,"Settings"]].map(([Icon, label]: any, i) => <button key={label} className={i === 0 ? "active" : ""} title={label}><Icon /></button>)}</nav><RobotViewport /><ControlRail /><div className="mobile-control"><Menu /></div></main> }
