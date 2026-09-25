import { AppProviders } from "@/app/app.providers"
import { Header } from "@/features/header/header"
import { Navigation } from "@/features/navigation/navigation"
import { Viewport } from "@/features/viewport/viewport"
import { AppLayout } from "@/layout/app-layout"

export function App() {
  return (
    <AppProviders>
      <AppLayout header={<Header />} main={<Viewport />} aside={<Navigation />} />
    </AppProviders>
  )
}
