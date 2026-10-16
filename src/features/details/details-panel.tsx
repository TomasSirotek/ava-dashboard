import { panelStack } from "@/components/shared/shared.styles"
import { DetailsSection } from "@/features/details/details-section"
import { StreamsSection } from "@/features/details/streams-section"
import { cn } from "@/lib/utils"

// Bottom of the right column, always visible under the controls tabs.
export function DetailsPanel() {
  return (
    <div className={cn(panelStack, "shrink-0 border-t")}>
      <DetailsSection />
      <StreamsSection />
    </div>
  )
}
