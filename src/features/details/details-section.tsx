import { capsLabel } from "@/components/shared/shared.styles"
import { DETAILS_STARTED_AT } from "@/features/details/details.content"
import { JOINT_SERVOS, ROBOT_ID, ROBOT_MODEL } from "@/features/robot/robot.content"
import { clockTime, cn } from "@/lib/utils"

// Servo count per model, e.g. "3× MG996R · 3× SG90".
const SERVO_SUMMARY = [...new Set(JOINT_SERVOS)].map((model) => `${JOINT_SERVOS.filter((s) => s === model).length}× ${model}`).join(" · ")

// Static facts about the robot and this page load (session ID and mode are in the header and toolbar).
export function DetailsSection() {
  const rows = [
    ["Robot ID", ROBOT_ID],
    ["Model", ROBOT_MODEL],
    ["Servos", SERVO_SUMMARY],
    ["Page loaded", clockTime.format(DETAILS_STARTED_AT)],
  ]
  return (
    <section>
      <h3 className={cn(capsLabel, "mb-3 text-muted-foreground")}>Details</h3>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="truncate text-right tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
