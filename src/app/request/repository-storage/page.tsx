import AppLayout from "@/components/layout/AppLayout"
import RequestForm from "@/pages/RequestForm"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

export default function RepositoryStorageRequestPage() {
  return (
    <AppLayout>
      <ProtectedRoute>
        <RequestForm />
      </ProtectedRoute>
    </AppLayout>
  )
}
