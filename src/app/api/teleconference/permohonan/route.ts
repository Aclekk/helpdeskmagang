import { NextResponse } from "next/server";
import {
  submitPermohonan,
  getPermohonanByIdLocal,
  getAllPermohonanLocal, // ← ganti ke lokal
  type PermohonanRequest,
} from "@/lib/semantik";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : undefined;
    const offset = searchParams.get("offset")
      ? Number(searchParams.get("offset"))
      : undefined;
    const search = searchParams.get("search") ?? undefined;

    // ← ambil dari LOKAL
    const result = await getAllPermohonanLocal({ limit, offset, search });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[API] GET /teleconference/permohonan error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan pada server",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: PermohonanRequest = await request.json();

    if (
      !body.judulKegiatan ||
      !body.tanggalPelaksanaan ||
      !body.waktuMulai ||
      !body.namaPemohon ||
      !body.email ||
      !body.instansi
    ) {
      return NextResponse.json(
        { message: "Field wajib tidak lengkap" },
        { status: 400 },
      );
    }

    const result = await submitPermohonan(body);

    console.log("RESPONSE SEMANTIK:", JSON.stringify(result, null, 2));

    if (result.id) {
      const detail = await getPermohonanByIdLocal(result.id);
      console.log("DETAIL SEMANTIK LOKAL:", JSON.stringify(detail, null, 2));
      return NextResponse.json(
        { ...result, noTiket: detail.noTiket },
        { status: 201 },
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[API] POST /teleconference/permohonan error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan pada server",
      },
      { status: 500 },
    );
  }
}