import { ChevronRight } from "lucide-react"
import { AppLogo } from "@/features/header/app-logo"
import { EstopButton } from "@/features/header/estop-button"
import { BRAND } from "@/features/header/header.content"
import { SessionClock } from "@/features/header/session-clock"
import { ROBOT_ID } from "@/features/robot/robot.content"
import { ThemeToggle } from "@/features/theme/theme-toggle"

export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-5">
      <div className="flex min-w-0 items-center gap-4">
        <AppLogo />
        <span className="h-4 w-px bg-border" />
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
          <span className="text-muted-foreground">{BRAND.subtitle}</span>
          <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate font-medium">{ROBOT_ID}</span>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <SessionClock />
        <EstopButton />
        <ThemeToggle />
      </div>
    </header>
  )
}
