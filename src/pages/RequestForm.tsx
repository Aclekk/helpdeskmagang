'use client'

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getServiceById } from "@/data/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormRenderer from "@/components/forms/FormRenderer";
import { useToast } from "@/hooks/use-toast";
import VideoConferenceRequestForm from "@/components/services/VideoConferenceRequestForm";
import VpnRequestForm from "@/components/services/VpnRequestForm";

const RequestForm = () => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Handle params properly untuk Next.js App Router
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  // Debug: Log semua params
  console.log('RequestForm - All params:', params);
  console.log('RequestForm - Extracted ID:', id);
  
  // Hardcode test untuk VPN
  if (id === "vpn") {
    console.log('VPN detected, showing VpnRequestForm directly');
    return (
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
    );
  }

  const service = id ? getServiceById(id) : undefined;
  console.log('RequestForm - Service:', service);

  if (!service) {
    console.log('Service not found, redirecting to /services');
    router.push('/services');
    return null;
  }

  // Handle video-conference case
  if (id === "video-conference") {
    return (
      <div className="container py-10">
        <Link
          href={`/services/${id}`}
          className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Detail Layanan
        </Link>
        <VideoConferenceRequestForm />
      </div>
    );
  }

  // Handle VPN case
  if (id === "vpn") {
    return (
      <div className="container py-10">
        <Link
          href={`/services/${id}`}
          className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Detail Layanan
        </Link>
        <VpnRequestForm />
      </div>
    );
  }

  const handleSubmit = async (data: Record<string, unknown>) => {
    setIsLoading(true);

    // Simulate submission delay
    setTimeout(() => {
      // Generate ticket ID
      const ticketId = `TKT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;

      toast({
        title: "Pengajuan Berhasil!",
        description: `Nomor tiket: ${ticketId}. Kami akan memproses permintaan Anda.`,
      });

      setIsLoading(false);

      // Redirect to home page
      router.push("/");
    }, 1000);
  };

  return (
    <div className="container py-10">
      {/* Back Button */}
      <Link
        href={service.route}
        className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali ke Detail Layanan
      </Link>

      <div className="mx-auto max-w-2xl">
        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-card-foreground">
              Formulir Pengajuan: {service.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Lengkapi formulir di bawah ini untuk mengajukan {service.title}
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <FormRenderer
              fields={service.formSchema}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              submitLabel="Kirim Pengajuan"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestForm;
