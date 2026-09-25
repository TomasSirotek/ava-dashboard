import type { IAppProvidersProps } from "@/app/app.interface"
import { useGamepadWatcher } from "@/features/control/use-gamepad-watcher"
import { useDemoRunner } from "@/features/demos/use-demo-runner"
import { useCommandSender } from "@/features/robot/use-command-sender"
import { useRobotFeed } from "@/features/robot/use-robot-feed"
import { ThemeProvider } from "@/features/theme/theme-provider"

// App-wide context plus the background feeds that fill the stores.
export function AppProviders({ children }: IAppProvidersProps) {
  useRobotFeed()
  useCommandSender()
  useDemoRunner()
  useGamepadWatcher()
  return <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
}
