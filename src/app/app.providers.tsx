import type { IAppProvidersProps } from "@/app/app.interface"
import { useLinkNotifier } from "@/features/connection/use-link-notifier"
// Controller mode (disabled): import { useGamepadWatcher } from "@/features/control/use-gamepad-watcher"
import { useDemoRunner } from "@/features/demos/use-demo-runner"
import { useJointHistory } from "@/features/history/use-joint-history"
import { useSystemLog } from "@/features/logs/use-system-log"
import { useCommandSender } from "@/features/robot/use-command-sender"
import { useRobotFeed } from "@/features/robot/use-robot-feed"
import { ThemeProvider } from "@/features/theme/theme-provider"

// App-wide context plus the background feeds that fill the stores.
export function AppProviders({ children }: IAppProvidersProps) {
  // First, so its store subscriptions exist before the feeds' first state changes.
  useSystemLog()
  useLinkNotifier()
  useRobotFeed()
  useCommandSender()
  useDemoRunner()
  useJointHistory()
  // Controller mode (disabled): no gamepad toasts or log entries while it is off.
  // useGamepadWatcher()
  return <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
}
