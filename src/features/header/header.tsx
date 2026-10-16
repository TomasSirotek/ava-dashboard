import { AppLogo } from "@/features/header/app-logo"
import { EstopButton } from "@/features/header/estop-button"
import { BRAND } from "@/features/header/header.content"
import { SessionClock } from "@/features/header/session-clock"
import { ThemeToggle } from "@/features/theme/theme-toggle"

export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-5">
      <div className="flex items-center gap-4">
        <AppLogo />
        <span className="h-4 w-px bg-border" />
        <span className="text-sm text-muted-foreground">{BRAND.subtitle}</span>
      </div>
      <div className="flex items-center gap-3">
        <SessionClock />
        <EstopButton />
        <ThemeToggle />
      </div>
    </header>
  )
}
