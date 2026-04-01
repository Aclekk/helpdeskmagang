import { NextResponse } from "next/server";
import { checkPegawai } from "@/lib/semantik";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nip } = body;

    if (!nip) {
      return NextResponse.json(
        { status: false, message: "NIP tidak ditemukan" },
        { status: 400 },
      );
    }

    const result = await checkPegawai(nip);

    // Mapping field dari response Semantik ke format standar
    return NextResponse.json({
      status: true,
      data: {
        nama_pegawai: result.nama_pegawai || "",
        whatsapp: result.nomor_hp || "",
        email: result.email || "",
        unit_kerja: result.nama_unor || "",
        jabatan: result.nomenklatur_jabatan || "",
        kode_unor: result.kode_unor || "",
        nip: result.nip_baru || result.nip || "",
      },
    });
  } catch (error) {
    console.error("[API] POST /pegawai/ceknip error:", error);
    return NextResponse.json(
      {
        status: false,
        message: error instanceof Error ? error.message : "Terjadi kesalahan",
      },
      { status: 500 },
    );
  }
}
