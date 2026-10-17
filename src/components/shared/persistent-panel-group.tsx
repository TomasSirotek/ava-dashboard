import { useDefaultLayout } from "react-resizable-panels"
import type { IPersistentPanelGroupProps } from "@/components/shared/shared.interface"
import { ResizablePanelGroup } from "@/components/ui/resizable"

// Resizable group that remembers its panel sizes in localStorage under `id` (saved when a drag ends).
// Its panels need fixed ids so a saved layout maps back onto them.
export function PersistentPanelGroup({ id, ...props }: IPersistentPanelGroupProps) {
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({ id, storage: localStorage })
  return <ResizablePanelGroup id={id} defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged} {...props} />
}
