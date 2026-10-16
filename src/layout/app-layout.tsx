import { Toaster } from "@/components/ui/sonner"
import type { IAppLayoutProps } from "@/layout/app-layout.interface"

// Page shell: header on top, then the toolbar and panel grid, with the right column next to them.
// On large screens the page fits the window and panels scroll inside; on small screens everything
// stacks and the page scrolls.
export function AppLayout({ header, toolbar, main, aside }: IAppLayoutProps) {
  return (
    <div className="flex h-svh flex-col">
      {header}
      <main className="flex min-h-0 flex-1 max-lg:flex-col max-lg:overflow-y-auto">
        <div className="flex min-w-0 flex-1 flex-col">
          {toolbar}
          {main}
        </div>
        <aside className="flex w-80 shrink-0 flex-col border-l max-lg:w-full max-lg:border-t max-lg:border-l-0">{aside}</aside>
      </main>
      <Toaster position="bottom-left" />
    </div>
  )
}
