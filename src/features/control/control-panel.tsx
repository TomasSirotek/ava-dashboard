import { useState } from "react"
import { Heading } from "@/components/shared/heading"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AutoModeConfirm } from "@/features/control/auto-mode-confirm"
import { CONTROL_MODES } from "@/features/control/control.content"
import type { ControlMode } from "@/features/control/control.interface"
import { useControlStore } from "@/features/control/control.store"
import { ControllerStatus } from "@/features/control/controller-status"
import { VoiceSettings } from "@/features/control/voice-settings"
import { DemoPanel } from "@/features/demos/demo-panel"

export function ControlPanel() {
  const mode = useControlStore((s) => s.mode)
  const setMode = useControlStore((s) => s.setMode)
  const [confirming, setConfirming] = useState(false)
  // Going into Automatic asks first; every other switch (the safe direction) is immediate.
  const changeMode = (next: ControlMode) => {
    if (next === "auto" && mode !== "auto") setConfirming(true)
    else setMode(next)
  }
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Heading>Control mode</Heading>
        <Tabs value={mode} onValueChange={(v) => changeMode(v as ControlMode)}>
          <TabsList className="w-full">
            {Object.values(CONTROL_MODES).map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value}>
                <Icon /> {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <AutoModeConfirm
        open={confirming}
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false)
          setMode("auto")
        }}
      />

      {mode === "manual" && (
        <p className="text-sm text-muted-foreground">Move the arm with the sliders and target position in the Joints tab.</p>
      )}
      {mode === "auto" && (
        <>
          <DemoPanel />
          <VoiceSettings />
        </>
      )}
      {mode === "controller" && <ControllerStatus />}
    </div>
  )
}
