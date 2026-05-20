import { NextRequest, NextResponse } from "next/server";
import {
  submitRepositoryPermohonan,
  getAllRepositoryPermohonan,
  RepositoryPermohonanRequest,
} from "@/lib/semantik";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ─── Mapping: Form field → API field ─────────────────────────────────
    const payload: RepositoryPermohonanRequest = {
      namaAplikasi: body.namaAplikasi ?? "",
      jenisAplikasi: body.jenisAplikasi ?? "",
      unitKerjaPengelola: body.unitKerjaPengelola ?? "",
      namaPic: body.picNama ?? "", // ⚠️ renamed
      nomorKontakPic: body.picNomorKontak ?? "", // ⚠️ renamed
      subdomain: body.subdomain ?? "",
      // spesifikasiTeknis di-flatten dari nested object
      bahasaPemrograman: body.spesifikasiTeknis?.bahasaPemrograman ?? "",
      framework: body.spesifikasiTeknis?.framework ?? "",
      database: body.spesifikasiTeknis?.database ?? "",
      webServer: body.spesifikasiTeknis?.webServer ?? "",
      modulLainnya: body.spesifikasiTeknis?.modulLainnya ?? "",
      tanggalPermohonan: body.tanggalPermohonan ?? "",
      tanggalRencanaPublikasi: body.tanggalRencanaPublikasi ?? "",
      namaProyek: body.namaProyek ?? "",
      tujuanPembuatan: body.tujuanPembuatan ?? "",
      namaRepository: body.namaRepositori ?? "", // ⚠️ renamed (i→y)
      tanggalBerakhir: body.tanggalBerakhir ?? "",
      jenisDomain: body.jenisDomain ?? "",
      usulanNamaDomain: body.usulanNamaDomain ?? "",
      jenisAkses: body.jenisAkses ?? "",
      // personil → persons, nama → namaPersonil
      persons: (body.personil ?? [])
        .filter((p: { nama?: string }) => p.nama?.trim()) // skip baris kosong
        .map(
          (p: {
            nama: string;
            usernameGitlab: string;
            jabatanPeran: string;
            keterangan: string;
          }) => ({
            namaPersonil: p.nama, // ⚠️ renamed
            usernameGitlab: p.usernameGitlab,
            jabatanPeran: p.jabatanPeran,
            keterangan: p.keterangan,
          }),
        ),
    };

    const result = await submitRepositoryPermohonan(payload);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[API /repository/permohonan POST]", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengirim permohonan",
      },
      { status: 500 },
    );
  }
}
export async function GET() {
  try {
    const result = await getAllRepositoryPermohonan();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[API /repository/permohonan GET]", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data permohonan",
      },
      { status: 500 },
    );
  }
}
