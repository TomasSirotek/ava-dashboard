import type { Ros } from "roslib"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { JOINT_NAMES, TRAJECTORY_TOPIC } from "@/features/robot/robot.content"
import { attachRos, publishJointTarget } from "@/features/robot/robot.ros"

// Capture what would go out over rosbridge instead of opening a socket.
const topic = vi.hoisted(() => ({ options: undefined as unknown, advertise: vi.fn(), publish: vi.fn() }))
vi.mock("roslib", () => ({
  Topic: class {
    advertise = topic.advertise
    publish = topic.publish
    constructor(options: unknown) {
      topic.options = options
    }
  },
}))

const sent = () => topic.publish.mock.lastCall?.[0]

beforeEach(() => {
  topic.advertise.mockClear()
  topic.publish.mockClear()
  attachRos({} as Ros)
})

describe("publishJointTarget", () => {
  it("does nothing while offline", () => {
    attachRos(null)
    expect(publishJointTarget([0, 0, 0, 0, 0, 0], 1)).toBe(false)
    expect(topic.publish).not.toHaveBeenCalled()
  })

  it("advertises a JointTrajectory publisher on the controller topic as soon as rosbridge connects", () => {
    expect(topic.options).toMatchObject({ name: TRAJECTORY_TOPIC, messageType: "trajectory_msgs/msg/JointTrajectory" })
    expect(topic.advertise).toHaveBeenCalledOnce()
  })

  it("sends one point in radians with the dashboard's joint names and a zero stamp", () => {
    expect(publishJointTarget([90, -45, 0, 180, 0, 10], 2.5)).toBe(true)
    const msg = sent()
    expect(msg.header.stamp).toEqual({ sec: 0, nanosec: 0 }) // zero = start now on the controller's (sim) clock
    expect(msg.joint_names).toEqual(JOINT_NAMES)
    expect(msg.points).toHaveLength(1)
    const expected = [Math.PI / 2, -Math.PI / 4, 0, Math.PI, 0, (10 * Math.PI) / 180]
    msg.points[0].positions.forEach((v: number, i: number) => expect(v).toBeCloseTo(expected[i], 9))
    expect(msg.points[0].time_from_start).toEqual({ sec: 2, nanosec: 500_000_000 })
  })

  it.each([
    [4.999999999999999, 5, 0], // 2.3 s at 46 % velocity: floating point lands just under 5
    [0.1, 0, 100_000_000],
    [3, 3, 0],
  ])("splits %s s into a valid duration (nanosec below 1e9)", (seconds, sec, nanosec) => {
    publishJointTarget([0, 0, 0, 0, 0, 0], seconds)
    expect(sent().points[0].time_from_start).toEqual({ sec, nanosec })
  })
})
