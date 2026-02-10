'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { getServiceById } from "@/data/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormRenderer from "@/components/forms/FormRenderer";
import { useToast } from "@/hooks/use-toast";

const Incident = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const incidentService = getServiceById("laporan-insiden");

  if (!incidentService) {
    return null;
  }

  const handleSubmit = async (data: Record<string, unknown>) => {
    setIsLoading(true);

    // Simulate submission delay
    setTimeout(() => {
      // Generate incident ticket ID
      const ticketId = `INC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;

      toast({
        title: "Laporan Terkirim!",
        description: `Nomor tiket: ${ticketId}. Tim akan segera menindaklanjuti.`,
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
        href="/"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali ke Beranda
      </Link>

      <div className="mx-auto max-w-2xl">
        {/* Alert Banner */}
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="font-medium text-foreground">Laporkan Insiden TIK</p>
            <p className="text-sm text-muted-foreground">
              Gunakan formulir ini untuk melaporkan gangguan atau insiden pada
              sistem TIK. Tim kami akan segera menindaklanjuti.
            </p>
          </div>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-card-foreground">
              Formulir Laporan Insiden
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Berikan informasi selengkap mungkin agar kami dapat menangani
              dengan cepat
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <FormRenderer
              fields={incidentService.formSchema}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              submitLabel="Kirim Laporan"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Incident;
