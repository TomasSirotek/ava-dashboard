import { type Ros, Topic } from "roslib"
import { JOINT_NAMES, TRAJECTORY_TOPIC } from "@/features/robot/robot.content"

const DEG_TO_RAD = Math.PI / 180

interface IJointTrajectoryMsg {
  header: { stamp: { sec: number; nanosec: number }; frame_id: string }
  joint_names: string[]
  points: { positions: number[]; time_from_start: { sec: number; nanosec: number } }[]
}

// The command topic of the current rosbridge connection; null while offline.
let trajectory: Topic<IJointTrajectoryMsg> | null = null

export function attachRos(ros: Ros | null) {
  trajectory = ros ? new Topic({ ros, name: TRAJECTORY_TOPIC, messageType: "trajectory_msgs/msg/JointTrajectory" }) : null
  // Announce the publisher now: ROS needs a moment to discover it, and a single command
  // (e.g. Home) published before that would be dropped.
  trajectory?.advertise()
}

/** Send a single-point trajectory to the joint_trajectory_controller. False when offline. */
export function publishJointTarget(positionsDeg: number[], durationS: number) {
  if (!trajectory) return false
  const sec = Math.floor(durationS)
  trajectory.publish({
    // Zero stamp = "start now" on the controller's own clock. Without it rosbridge stamps the
    // message with wall-clock time, which Gazebo (sim time) treats as far in the future and never runs.
    header: { stamp: { sec: 0, nanosec: 0 }, frame_id: "" },
    joint_names: JOINT_NAMES,
    points: [
      {
        positions: positionsDeg.map((d) => d * DEG_TO_RAD),
        time_from_start: { sec, nanosec: Math.round((durationS - sec) * 1e9) },
      },
    ],
  })
  return true
}
