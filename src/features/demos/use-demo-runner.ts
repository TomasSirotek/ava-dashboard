import { useEffect } from "react"
import { toast } from "sonner"
import { useControlStore } from "@/features/control/control.store"
import { DEMO_SETTLE_S, DEMOS } from "@/features/demos/demos.content"
import { useDemoStore } from "@/features/demos/demos.store"
import { moveDuration, useMotionStore } from "@/features/motion/motion.store"
import { useRobotStore } from "@/features/robot/robot.store"

// Plays the running demo: each step becomes the commanded pose (the same path the sliders
// use, so it works offline, in Gazebo and on hardware), then waits for the move + hold.
// Pause and Stop make the current pose the target (the arm stops where it is); resume repeats the interrupted step.
export function useDemoRunner() {
  useEffect(() => {
    let timer: number | undefined

    const command = (step: number) => {
      const { running } = useDemoStore.getState()
      if (!running) return
      const pose = DEMOS[running].steps[step].pose
      useRobotStore.getState().setCommandedAll(pose)
      const wait = moveDuration(useMotionStore.getState()) + DEMO_SETTLE_S + DEMOS[running].steps[step].hold
      timer = window.setTimeout(() => play(step + 1), wait * 1000)
    }

    const play = (step: number) => {
      const { running, run, beginStep, finish } = useDemoStore.getState()
      if (!running || run?.status !== "running") return
      const demo = DEMOS[running]
      if (step >= demo.steps.length) {
        if (!run.loop) {
          finish()
          toast.success(`${demo.label} finished`)
          return
        }
        step = 0
      }
      beginStep(step)
      command(step)
    }

    // The arm stops where it is: its current pose becomes the target.
    const hold = () => {
      const { jointState, setCommandedAll } = useRobotStore.getState()
      setCommandedAll(jointState.position)
    }

    const offDemo = useDemoStore.subscribe((s, prev) => {
      if (s.running !== prev.running) {
        window.clearTimeout(timer)
        if (s.running) play(0)
        else if (s.run?.status === "stopped" && prev.run?.status === "running") hold()
        return
      }
      const status = s.run?.status
      if (status === prev.run?.status) return
      if (status === "paused") {
        window.clearTimeout(timer)
        hold()
      } else if (status === "running" && prev.run?.status === "paused") command(s.step)
    })
    // Leaving automatic mode or hitting the e-stop ends the demo.
    const offControl = useControlStore.subscribe((s) => {
      if (s.estop || s.mode !== "auto") useDemoStore.getState().stop()
    })
    return () => {
      offDemo()
      offControl()
      window.clearTimeout(timer)
    }
  }, [])
}
