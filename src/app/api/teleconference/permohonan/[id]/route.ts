/**
 * GET /api/teleconference/permohonan/[id]
 *
 * Server-side proxy ke Semantik API.
 * Dipakai oleh halaman History untuk sync status permohonan.
 */

import { NextResponse } from "next/server";
import { getPermohonanById } from "@/lib/semantik";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "ID tidak ditemukan" },
        { status: 400 },
      );
    }

    const result = await getPermohonanById(id);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(
      `[API] GET /teleconference/permohonan/${params.id} error:`,
      error,
    );
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
