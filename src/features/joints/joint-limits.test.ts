import { describe, expect, it } from "vitest"
import { DEMOS } from "@/features/demos/demos.content"
import { JOINT_LIMITS } from "@/features/joints/joints.content"
import { INITIAL_ROBOT_STATE, JOINT_NAMES } from "@/features/robot/robot.content"

// Every pose the dashboard commands on its own (no slider involved) must stay inside the joint limits:
// on hardware an out-of-range target drives a servo into the frame.
const poses: [string, number[]][] = [
  ["startup target", INITIAL_ROBOT_STATE.commanded],
  ["Home button", JOINT_NAMES.map(() => 0)],
  ...Object.values(DEMOS).flatMap((demo) => demo.steps.map((step, i): [string, number[]] => [`${demo.label} step ${i + 1}`, step.pose])),
]

describe("built-in poses", () => {
  it.each(poses)("%s has one value per joint, inside JOINT_LIMITS", (_, pose) => {
    expect(pose).toHaveLength(JOINT_NAMES.length)
    pose.forEach((v, i) => {
      expect(v, JOINT_NAMES[i]).toBeGreaterThanOrEqual(JOINT_LIMITS[i].min)
      expect(v, JOINT_NAMES[i]).toBeLessThanOrEqual(JOINT_LIMITS[i].max)
    })
  })
})
