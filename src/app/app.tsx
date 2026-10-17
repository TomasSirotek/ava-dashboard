import { AppProviders } from "@/app/app.providers"
import { DemoTimeline } from "@/features/demos/demo-timeline"
import { DetailsPanel } from "@/features/details/details-panel"
import { Header } from "@/features/header/header"
import { RobotStatePanel } from "@/features/history/robot-state-panel"
import { JointsTable } from "@/features/joints/joints-table"
import { SystemLogs } from "@/features/logs/system-logs"
import { Navigation } from "@/features/navigation/navigation"
import { StatusBar } from "@/features/status/status-bar"
import { Viewport } from "@/features/viewport/viewport"
import { AppLayout } from "@/layout/app-layout"
import { PanelGrid } from "@/layout/panel-grid"

export function App() {
  return (
    <AppProviders>
      <AppLayout
        header={<Header />}
        toolbar={<StatusBar />}
        main={
          <PanelGrid
            panels={{
              viewport: <Viewport />,
              "robot-state": <RobotStatePanel />,
              joints: <JointsTable />,
              logs: <SystemLogs />,
              timeline: <DemoTimeline />,
            }}
          />
        }
        aside={
          <>
            <Navigation />
            <DetailsPanel />
          </>
        }
      />
    </AppProviders>
  )
}
