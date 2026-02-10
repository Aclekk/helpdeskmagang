import AppLayout from "@/components/layout/AppLayout"
import VpnRequestForm from "@/components/services/VpnRequestForm"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function VpnRequestPage() {
  return (
    <AppLayout>
      <div className="container py-10">
        <Link
          href="/services/vpn"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Detail Layanan
        </Link>
        <VpnRequestForm />
      </div>
    </AppLayout>
  )
}
