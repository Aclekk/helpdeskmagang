import { NextResponse } from "next/server";
import { getVpnById } from "@/lib/semantik";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await getVpnById(params.id);
    return NextResponse.json(data);
  } catch (error) {
    console.error(`[GET /api/vpn/${params.id}] Error:`, error);
    return NextResponse.json(
      { error: "Gagal mengambil detail VPN", detail: String(error) },
      { status: 500 }
    );
  }
}
