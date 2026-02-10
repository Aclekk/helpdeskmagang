import AppLayout from "@/components/layout/AppLayout"
import RequestForm from "@/pages/RequestForm"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

export default function DynamicRequestPage({ params }: { params: { id: string } }) {
  // VPN adalah public service - tidak perlu login
  const isVpn = params.id === "vpn"
  
  return (
    <AppLayout>
      {isVpn ? (
        <RequestForm />
      ) : (
        <ProtectedRoute>
          <RequestForm />
        </ProtectedRoute>
      )}
    </AppLayout>
  )
}
