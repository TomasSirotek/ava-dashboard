import { capsLabel, panelStack } from "@/components/shared/shared.styles"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavItems } from "@/features/navigation/navigation.content"
import { NAVIGATION_ID, useNavigationStore } from "@/features/navigation/navigation.store"
import { cn } from "@/lib/utils"

// Controls at the top of the right column: tab bar stays put, the open tab scrolls.
// Each top-level element of a tab's content is one section, separated by hairlines.
export function Navigation() {
  const items = useNavItems()
  const active = useNavigationStore((s) => s.active)
  const setActive = useNavigationStore((s) => s.setActive)
  return (
    <Tabs id={NAVIGATION_ID} value={active} onValueChange={(v) => setActive(String(v))} className="min-h-0 flex-1 gap-0">
      <div className="border-b px-3 pt-2 pb-1.5">
        <TabsList variant="line" className="w-full">
          {items.map(({ value, label }) => (
            <TabsTrigger key={value} value={value} className={cn(capsLabel, "flex-auto px-1")}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {items.map(({ value, content }) => (
        <TabsContent key={value} value={value} className={cn(panelStack, "min-h-0 overflow-y-auto max-lg:overflow-visible")}>
          {content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
