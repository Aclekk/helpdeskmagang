import { NextResponse } from "next/server";
import { getAllInstansi } from "@/lib/semantik";

export async function GET() {
  try {
    const result = await getAllInstansi();
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] GET /instansi error:", error);
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
