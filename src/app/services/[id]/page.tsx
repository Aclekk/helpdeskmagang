import AppLayout from "@/components/layout/AppLayout"
import ServiceDetail from "@/pages/ServiceDetail"

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  return (
    <AppLayout>
      <ServiceDetail />
    </AppLayout>
  )
}
