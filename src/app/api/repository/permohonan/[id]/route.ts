import { NextRequest, NextResponse } from "next/server";
import { getRepositoryPermohonanById } from "@/lib/semantik";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const result = await getRepositoryPermohonanById(params.id);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[API /repository/permohonan/[id] GET]", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengambil detail permohonan",
      },
      { status: 500 },
    );
  }
}
