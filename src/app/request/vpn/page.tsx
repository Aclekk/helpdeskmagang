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
          className="group mb-8 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-blue-100 hover:text-blue-700 hover:shadow-md dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950 dark:hover:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Kembali ke Detail Layanan
        </Link>
        <VpnRequestForm />
      </div>
    </AppLayout>
  )
}
