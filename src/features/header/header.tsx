import { AppLogo } from "@/features/header/app-logo"
import { EstopButton } from "@/features/header/estop-button"
import { BRAND } from "@/features/header/header.content"
import { SessionClock } from "@/features/header/session-clock"
import { ROBOT_ID } from "@/features/robot/robot.content"
import { ThemeToggle } from "@/features/theme/theme-toggle"

// Small screens keep the logo, robot ID, e-stop and theme toggle; the environment name and the clock drop out.
export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b px-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <AppLogo />
        <span className="h-4 w-px shrink-0 bg-border" />
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
          <span className="shrink-0 text-muted-foreground max-md:hidden">{BRAND.subtitle}</span>
          <span className="shrink-0 text-muted-foreground max-md:hidden">/</span>
          <span className="truncate font-medium">{ROBOT_ID}</span>
        </nav>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="max-lg:hidden">
          <SessionClock />
        </div>
        <EstopButton />
        <ThemeToggle />
      </div>
    </header>
  )
}
