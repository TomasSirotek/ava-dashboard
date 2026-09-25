import { useEffect } from "react"
import { toast } from "sonner"
import { useControlStore } from "@/features/control/control.store"
import { DEMO_SETTLE_S, DEMOS } from "@/features/demos/demos.content"
import { useDemoStore } from "@/features/demos/demos.store"
import { moveDuration, useMotionStore } from "@/features/motion/motion.store"
import { useRobotStore } from "@/features/robot/robot.store"

// Plays the running demo: each step becomes the commanded pose (the same path the sliders
// use, so it works offline, in Gazebo and on hardware), then waits for the move + hold.
export function useDemoRunner() {
  useEffect(() => {
    let timer: number | undefined

    const play = (step: number) => {
      const { running, setStep, stop } = useDemoStore.getState()
      if (!running) return
      const demo = DEMOS[running]
      if (step >= demo.steps.length) {
        if (!demo.loop) {
          stop()
          toast.success(`${demo.label} finished`)
          return
        }
        step = 0
      }
      setStep(step)
      useRobotStore.getState().setCommandedAll(demo.steps[step].pose)
      const wait = moveDuration(useMotionStore.getState()) + DEMO_SETTLE_S + demo.steps[step].hold
      timer = window.setTimeout(() => play(step + 1), wait * 1000)
    }

    const offDemo = useDemoStore.subscribe((s, prev) => {
      if (s.running === prev.running) return
      window.clearTimeout(timer)
      if (s.running) play(0)
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
