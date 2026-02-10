'use client'

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  Mail,
  PenTool,
  Shield,
  Video,
  Globe,
  GitBranch,
  HardDrive,
  AlertTriangle,
  HelpCircle,
  ArrowLeft,
  Clock,
  CheckCircle,
  LucideIcon,
  FileText,
  Users,
  Calendar,
  Lock,
} from "lucide-react";
import { getServiceById, categories } from "@/data/services";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const iconMap: Record<string, LucideIcon> = {
  Mail,
  PenTool,
  Shield,
  Video,
  Globe,
  GitBranch,
  HardDrive,
  AlertTriangle,
  HelpCircle,
};

const ServiceDetail = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const service = params.id ? getServiceById(params.id as string) : undefined;

  if (!service) {
    router.push('/services');
    return null;
  }

  const IconComponent = iconMap[service.icon] || HelpCircle;
  const category = categories.find((c) => c.id === service.category);

  // ✅ Check apakah layanan butuh login atau tidak
  // VPN adalah satu-satunya layanan yang PUBLIC (ga perlu login)
  const isPublicService = service.id === "vpn";
  const isTteService = service.id === "tanda-tangan-elektronik";

  const displayFields =
    service.id === "video-conference"
      ? [
          { name: "tanggalPermohonan", label: "Tanggal Permohonan", required: false },
          { name: "judulKegiatan", label: "Judul Kegiatan", required: true },
          { name: "tanggalPelaksanaan", label: "Tanggal Pelaksanaan", required: true },
          { name: "rapatBerulang", label: "Rapat berulang", required: false },
          { name: "jumlahPeserta", label: "Jumlah Peserta", required: false },
          { name: "waktuMulai", label: "Waktu Mulai", required: true },
          { name: "waktuSelesai", label: "Waktu Selesai", required: false },
          { name: "instansi", label: "Instansi", required: true },
          { name: "kodeUnit", label: "Kode unit organisasi", required: false },
          { name: "namaPemohon", label: "Nama Pemohon", required: true },
          { name: "jabatanPemohon", label: "Jabatan Pemohon", required: true },
          { name: "email", label: "Email", required: true },
          { name: "whatsapp", label: "No. Whatsapp", required: false },
          { name: "lokasiAcara", label: "Lokasi Acara", required: false },
          { name: "perangkatDibutuhkan", label: "Perangkat yang dibutuhkan", required: false },
          { name: "jenisKegiatan", label: "Jenis Kegiatan", required: false },
          { name: "keterangan", label: "Keterangan", required: false },
        ]
      : service.formSchema.map((f) => ({
          name: f.name,
          label: f.label,
          required: f.required,
        }));

  const handleResetPassphrase = () => {
    const targetEmail = user?.email ?? "";
    console.log({ action: "reset_passphrase", email: targetEmail });
    alert(`Link reset passphrase akan dikirim ke email ${targetEmail || "Anda"}`);
  };

  // Handler untuk tombol "Ajukan Sekarang"
  const handleRequestService = () => {
    // Kalau layanan public (VPN) atau user sudah login, langsung ke form
    if (isPublicService || isAuthenticated) {
      router.push(`/request/${service.id}`);
    } else {
      // User belum login, redirect ke login dengan save path
      localStorage.setItem('redirectPath', `/request/${service.id}`);
      router.push('/login');
    }
  };

  return (
    <div className="container py-10">
      {/* 🔙 Back Button - Premium Style */}
      <Link
        href="/services"
        className="group mb-8 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-blue-100 hover:text-blue-700 hover:shadow-md dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950 dark:hover:text-blue-400"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Kembali ke Katalog
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* 📄 Main Content - Left Side (2/3 width) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Header Card */}
          <Card className="overflow-hidden border-slate-200/60 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/20 shadow-lg dark:border-slate-800/60 dark:from-slate-900/80 dark:via-blue-950/20 dark:to-cyan-950/10">
            <CardHeader className="border-b border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/60">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                {/* Icon Box - Premium */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-2xl" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-100 to-blue-50 shadow-lg dark:border-blue-800/50 dark:from-blue-950/60 dark:to-blue-900/40">
                    <IconComponent className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                {/* Title & Meta */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-start gap-3">
                    <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                      {service.title}
                    </CardTitle>
                    {category && (
                      <Badge
                        variant="secondary"
                        className="border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
                      >
                        {category.label}
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                    {service.description}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {isTteService ? (
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="overflow-hidden border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/50">
                    <div className="h-1.5 w-full bg-blue-600" />
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-50">
                        Data Tanda Tangan Elektronik
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        Status Sertifikat Anda ISSUE berlaku sampai 19 Juni 2026
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        dengan email resmi yang terdaftar di BSrE {user?.email ?? "-"}
                      </p>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Untuk merubah Passphrase anda dapat klik link berikut
                      </div>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="w-fit bg-emerald-600 hover:bg-emerald-700">
                            Ubah passphrase
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="sm:max-w-md">
                          <AlertDialogHeader>
                            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full border-2 border-orange-300">
                              <AlertTriangle className="h-7 w-7 text-orange-500" />
                            </div>
                            <AlertDialogTitle className="text-center">
                              Anda yakin ingin merubah Passphrase anda?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-center">
                              Link untuk mereset Passphrase akan dikirim ke email
                              <div className="mt-1 font-semibold text-slate-900 dark:text-slate-50">
                                {user?.email ?? "-"}
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="sm:justify-center">
                            <AlertDialogAction onClick={handleResetPassphrase}>
                              Ya
                            </AlertDialogAction>
                            <AlertDialogCancel className="bg-red-600 text-white hover:bg-red-700 hover:text-white">
                              Cancel
                            </AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/50">
                    <div className="h-1.5 w-full bg-blue-600" />
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-50">
                        Basis Pengetahuan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="tte-status" className="border-b-0">
                          <AccordionTrigger className="bg-blue-100/70 px-4 py-3 text-left text-sm font-medium text-slate-900 hover:no-underline dark:bg-blue-950/40 dark:text-slate-50">
                            Status Tanda Tangan Elektronik
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pt-3 text-slate-600 dark:text-slate-400">
                            lorem ipsum
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="passphrase-apa" className="border-b-0">
                          <AccordionTrigger className="bg-blue-100/70 px-4 py-3 text-left text-sm font-medium text-slate-900 hover:no-underline dark:bg-blue-950/40 dark:text-slate-50">
                            Apa itu Passphrase
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pt-3 text-slate-600 dark:text-slate-400">
                            lorem ipsum
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="tte-dipakai" className="border-b-0">
                          <AccordionTrigger className="bg-blue-100/70 px-4 py-3 text-left text-sm font-medium text-slate-900 hover:no-underline dark:bg-blue-950/40 dark:text-slate-50">
                            Dimana Tanda Tangan Elektronik digunakan
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pt-3 text-slate-600 dark:text-slate-400">
                            lorem ipsum
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="lupa-passphrase" className="border-b-0">
                          <AccordionTrigger className="bg-blue-100/70 px-4 py-3 text-left text-sm font-medium text-slate-900 hover:no-underline dark:bg-blue-950/40 dark:text-slate-50">
                            Bagaimana jika lupa passphrase
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pt-3 text-slate-600 dark:text-slate-400">
                            lorem ipsum
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <>
                  {/* Informasi Layanan */}
                  <div>
                    <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-50">
                      Informasi Layanan
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-4 rounded-xl border border-slate-200/60 bg-white/80 p-5 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/50">
                        <CheckCircle className="mt-0.5 h-6 w-6 shrink-0 text-green-600 dark:text-green-400" />
                        <div className="flex-1">
                          <p className="mb-1 font-semibold text-slate-900 dark:text-slate-50">
                            Persyaratan
                          </p>
                          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                            Lengkapi seluruh formulir pengajuan dengan data yang
                            valid dan akurat. Pastikan informasi yang diisi sesuai
                            dengan kebutuhan layanan.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 rounded-xl border border-slate-200/60 bg-white/80 p-5 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/50">
                        <Clock className="mt-0.5 h-6 w-6 shrink-0 text-blue-600 dark:text-blue-400" />
                        <div className="flex-1">
                          <p className="mb-1 font-semibold text-slate-900 dark:text-slate-50">
                            Proses Pengajuan
                          </p>
                          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                            Setelah pengajuan diterima, tim TIK akan melakukan
                            verifikasi dan proses lebih lanjut. Anda akan mendapat
                            notifikasi melalui email mengenai status pengajuan.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {!isTteService && (
                <div>
                  <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-50">
                    Field yang Diperlukan
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {displayFields.map((field) => (
                      <div
                        key={field.name}
                        className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50"
                      >
                        <CheckCircle className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                        <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                          {field.label}
                        </span>
                        {field.required && (
                          <Badge variant="destructive" className="text-xs">
                            Wajib
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 📌 Sidebar - Right Side (1/3 width) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* CTA Card */}
            {!isTteService && (
              <Card className="border-slate-200/60 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg dark:border-slate-800/60 dark:from-blue-950/30 dark:to-cyan-950/20">
                <CardContent className="space-y-4 pt-6">
                  <div className="text-center">
                    <div className="mb-4 inline-flex items-center justify-center rounded-full bg-blue-100 p-4 dark:bg-blue-950/50">
                      <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-50">
                      Ajukan Layanan
                    </h3>

                    {!isPublicService && !isAuthenticated && (
                      <div className="mb-3 flex items-center justify-center gap-2 rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-950/20">
                        <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                          Perlu Login
                        </span>
                      </div>
                    )}

                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {!isPublicService && !isAuthenticated
                        ? "Anda perlu login terlebih dahulu untuk mengajukan layanan ini."
                        : `Klik tombol di bawah untuk mengisi formulir pengajuan ${service.title}.`}
                    </p>
                  </div>

                  <Button
                    onClick={handleRequestService}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 py-6 text-base font-semibold shadow-lg hover:from-blue-700 hover:to-blue-600 hover:shadow-xl dark:from-blue-500 dark:to-blue-600"
                  >
                    {!isPublicService && !isAuthenticated ? (
                      <>
                        <Lock className="mr-2 h-5 w-5" />
                        Login untuk Ajukan
                      </>
                    ) : (
                      <>
                        Ajukan Sekarang
                        <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Help Card */}
            <Card className="border-slate-200/60 bg-white dark:border-slate-800/60 dark:bg-slate-900/50">
              <CardContent className="space-y-3 pt-6">
                <h4 className="font-semibold text-slate-900 dark:text-slate-50">
                  Butuh Bantuan?
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Hubungi helpdesk TIK untuk informasi lebih lanjut.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <span className="font-medium">Email:</span>
                    <span>tik@tangerangkota.go.id</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <span className="font-medium">Telp:</span>
                    <span>(021) 5517744</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
