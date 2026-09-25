import { Mic, Volume2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Field } from "@/components/shared/field"
import { Heading } from "@/components/shared/heading"
import { Setting } from "@/components/shared/setting"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { firstValue } from "@/lib/utils"

export function VoiceSettings() {
  const [mic, setMic] = useState(true)
  const [speaker, setSpeaker] = useState(true)
  const [sensitivity, setSensitivity] = useState(60)
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-2 rounded-lg border bg-muted/40 px-4 py-6 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-background shadow-xs ring-1 ring-foreground/10">
          <Mic className="size-5" />
        </span>
        <div className="text-sm font-medium">Voice control</div>
        <p className="text-xs text-muted-foreground">Speak a command and the neural network plans the motion. Coming soon.</p>
      </div>
      <Heading>Settings</Heading>
      <Setting icon={<Mic />} label="Microphone" hint="Listen for voice commands">
        <Switch
          checked={mic}
          onCheckedChange={(v) => {
            setMic(v)
            toast.info(v ? "Microphone on" : "Microphone muted")
          }}
        />
      </Setting>
      <Setting icon={<Volume2 />} label="Speaker" hint="Spoken confirmations">
        <Switch
          checked={speaker}
          onCheckedChange={(v) => {
            setSpeaker(v)
            toast.info(v ? "Speaker on" : "Speaker muted")
          }}
        />
      </Setting>
      <Field label="Wake word">
        <Input defaultValue="Hey AVA" />
      </Field>
      <Field label="Mic sensitivity">
        <Slider value={[sensitivity]} max={100} onValueChange={(v) => setSensitivity(firstValue(v))} label={`${sensitivity}%`} />
      </Field>
    </div>
  )
}
