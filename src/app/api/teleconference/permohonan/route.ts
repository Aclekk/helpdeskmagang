/**
 * POST /api/teleconference/permohonan
 *
 * Server-side proxy ke Semantik API.
 * Token Semantik TIDAK pernah dikirim ke browser.
 */

import { NextResponse } from "next/server";
import {
  submitPermohonan,
  getPermohonanById,
  type PermohonanRequest,
} from "@/lib/semantik";

export async function POST(request: Request) {
  try {
    const body: PermohonanRequest = await request.json();

    // Validasi field wajib
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

    // DEBUG - lihat response asli dari Semantik
    console.log("RESPONSE SEMANTIK:", JSON.stringify(result, null, 2));

    // Jika Semantik return ID, fetch detail untuk ambil noTiket
    if (result.id) {
      const detail = await getPermohonanById(result.id);
      console.log("DETAIL SEMANTIK:", JSON.stringify(detail, null, 2));
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
