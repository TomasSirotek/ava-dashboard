import { capsLabel, panelStack, sidePanel } from "@/components/shared/shared.styles"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavItems } from "@/features/navigation/navigation.content"
import { NAVIGATION_ID, useNavigationStore } from "@/features/navigation/navigation.store"
import { cn } from "@/lib/utils"

// Right side panel. Each top-level element of a tab's content is one section, separated by hairlines.
export function Navigation() {
  const items = useNavItems()
  const active = useNavigationStore((s) => s.active)
  const setActive = useNavigationStore((s) => s.setActive)
  return (
    <aside
      id={NAVIGATION_ID}
      className={cn(
        sidePanel,
        "overflow-y-auto border-l max-lg:order-2 max-lg:w-full max-lg:overflow-visible max-lg:border-t max-lg:border-l-0",
      )}
    >
      <Tabs value={active} onValueChange={(v) => setActive(String(v))} className="gap-0">
        <div className="sticky top-0 z-10 border-b bg-background px-3 pt-2 pb-1.5">
          <TabsList variant="line" className="w-full">
            {items.map(({ value, label }) => (
              <TabsTrigger key={value} value={value} className={cn(capsLabel, "flex-auto px-1")}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {items.map(({ value, content }) => (
          <TabsContent key={value} value={value} className={panelStack}>
            {content}
          </TabsContent>
        ))}
      </Tabs>
    </aside>
  )
}
