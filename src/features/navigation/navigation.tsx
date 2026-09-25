import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavItems } from "@/features/navigation/navigation.content"
import { NAVIGATION_ID, useNavigationStore } from "@/features/navigation/navigation.store"
import { cn } from "@/lib/utils"

export function Navigation() {
  const items = useNavItems()
  const active = useNavigationStore((s) => s.active)
  const setActive = useNavigationStore((s) => s.setActive)
  return (
    <aside
      id={NAVIGATION_ID}
      className="w-96 shrink-0 overflow-y-auto border-l max-lg:w-full max-lg:overflow-visible max-lg:border-t max-lg:border-l-0"
    >
      <Tabs value={active} onValueChange={(v) => setActive(String(v))} className="gap-0">
        <div className="sticky top-0 z-10 border-b bg-background p-3">
          <TabsList className="w-full">
            {items.map(({ value, label }) => (
              <TabsTrigger key={value} value={value}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {items.map(({ value, content, className }) => (
          <TabsContent key={value} value={value} className={cn("p-5", className)}>
            {content}
          </TabsContent>
        ))}
      </Tabs>
    </aside>
  )
}
