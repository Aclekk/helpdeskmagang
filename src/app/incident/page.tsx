import AppLayout from "@/components/layout/AppLayout"
import Incident from "@/pages/Incident"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

export default function IncidentPage() {
  return (
    <AppLayout>
      <ProtectedRoute>
        <Incident />
      </ProtectedRoute>
    </AppLayout>
  )
}
