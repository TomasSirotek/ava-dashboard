import { Toaster } from "@/components/ui/sonner"
import type { IAppLayoutProps } from "@/layout/app-layout.interface"

// Page shell: header on top, then telemetry panel | 3D view | navigation panel.
// On small screens everything stacks: 3D view first, then the two panels.
export function AppLayout({ header, left, main, aside }: IAppLayoutProps) {
  return (
    <div className="flex h-svh flex-col">
      {header}
      <main className="flex min-h-0 flex-1 max-lg:flex-col max-lg:overflow-y-auto">
        {left}
        {main}
        {aside}
      </main>
      <Toaster position="bottom-left" />
    </div>
  )
}
