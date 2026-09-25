import type { IAppProvidersProps } from "@/app/app.interface"
import { useGamepadWatcher } from "@/features/control/use-gamepad-watcher"
import { useMockRobotFeed } from "@/features/robot/use-mock-robot-feed"
import { ThemeProvider } from "@/features/theme/theme-provider"

// App-wide context plus the background feeds that fill the stores.
export function AppProviders({ children }: IAppProvidersProps) {
  useMockRobotFeed()
  useGamepadWatcher()
  return <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
}
