import { Navigate, Route, Routes } from "react-router"
import { AnimalsPage } from "./animals/pages/AnimalsPage"
import { AuthForm } from "./auth/pages/AuthPage"
import { CampaignsPage } from "./campaigns/pages/CampaignsPage"
import { DashboardPage } from "./dashboard/pages/DashboardPage"
import { InventoryPage } from "./inventory/pages/InventoryPage"
import { MonitoringPage } from "./monitoring/pages/MonitoringPage"
import { PrivateRoute } from "./shared/pages/PrivateRoute"
import { StablesPage } from "./stables/pages/StablesPage"
import { StaffPage } from "./staff/pages/StaffPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<AuthForm />} />

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/animals" element={<AnimalsPage />} />
        <Route path="/stables" element={<StablesPage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/monitoring" element={<MonitoringPage />} />
      </Route>
    </Routes>
  )
}

export default App
