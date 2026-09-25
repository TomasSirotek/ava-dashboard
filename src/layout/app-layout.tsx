import { Toaster } from "@/components/ui/sonner"
import type { IAppLayoutProps } from "@/layout/app-layout.interface"

// Page shell: header on top, 3D view + side navigation below (stacked on small screens).
export function AppLayout({ header, main, aside }: IAppLayoutProps) {
  return (
    <div className="flex h-svh flex-col">
      {header}
      <main className="flex min-h-0 flex-1 max-lg:flex-col max-lg:overflow-y-auto">
        {main}
        {aside}
      </main>
      <Toaster position="bottom-left" richColors />
    </div>
  )
}
