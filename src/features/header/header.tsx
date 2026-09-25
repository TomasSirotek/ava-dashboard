import { ModeBadge } from "@/features/control/mode-badge"
import { ConnectionStatus } from "@/features/header/connection-status"
import { EstopButton } from "@/features/header/estop-button"
import { GitHubIcon } from "@/features/header/github-icon"
import { BRAND, GITHUB_LINK } from "@/features/header/header.content"
import { LinkStats } from "@/features/header/link-stats"
import { ThemeToggle } from "@/features/theme/theme-toggle"

export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-5">
      <div className="flex items-baseline gap-3">
        <span className="text-lg font-semibold tracking-tight">{BRAND.name}</span>
        <span className="text-md text-muted-foreground">{BRAND.subtitle}</span>
        <a
          href={GITHUB_LINK.href}
          target="_blank"
          rel="noreferrer"
          aria-label={GITHUB_LINK.label}
          title={GITHUB_LINK.label}
          className="self-center text-muted-foreground transition-colors hover:text-foreground"
        >
          <GitHubIcon className="size-4" />
        </a>
      </div>
      <div className="flex items-center gap-3">
        <ConnectionStatus />
        <ModeBadge />
        <LinkStats />
        <EstopButton />
        <ThemeToggle />
      </div>
    </header>
  )
}
