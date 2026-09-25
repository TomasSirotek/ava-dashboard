import { useState } from "react"
import { toast } from "sonner"
import { Field } from "@/components/shared/field"
import { Heading } from "@/components/shared/heading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DEFAULT_ROSBRIDGE_URL } from "@/features/connection/connection.content"

export function ConnectionPanel() {
  const [url, setUrl] = useState(DEFAULT_ROSBRIDGE_URL)
  return (
    <div className="flex flex-col gap-4">
      <Heading>rosbridge</Heading>
      <Field label="WebSocket URL">
        <Input className="font-mono" value={url} onChange={(e) => setUrl(e.target.value)} />
      </Field>
      <Button className="w-full" onClick={() => toast.success("Connecting to rosbridge", { description: url })}>
        Connect
      </Button>
    </div>
  )
}
