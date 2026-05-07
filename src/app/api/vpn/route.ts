import { NextRequest, NextResponse } from "next/server";
import { getSemantikToken } from "@/lib/semantik";

export async function POST(req: NextRequest) {
  try {
    // ← pakai legacy token untuk lokal, fallback ke OIDC
    const legacyToken = process.env.SEMANTIK_LEGACY_TOKEN;
    const token = await getSemantikToken(); // ← balik ke OIDC
const baseUrl = process.env.SEMANTIK_LOCAL_BASE_URL ?? process.env.SEMANTIK_API_BASE_URL;
    if (!baseUrl) throw new Error("SEMANTIK_LOCAL_BASE_URL belum dikonfigurasi");

    const formData = await req.formData();

    console.log("[DEBUG] FormData received from client:");
    for (const [key, value] of formData.entries()) {
      if (key !== "signature") console.log(`  ${key}: "${value}"`);
    }

    const required = [
      "tanggalPermohonan",
      "jenisPermohonan",
      "tujuanPermohonan",
      "namaPemohon",
      "email",
      "instansi",
      "jabatanPemohon",
      "statusPegawai",
      "nomorTelepon",
    ];

    for (const field of required) {
      if (!formData.get(field)) {
        return NextResponse.json(
          { message: `Field '${field}' wajib diisi` },
          { status: 400 },
        );
      }
    }

    const outForm = new FormData();

    const textFields = [
      "tanggalPermohonan",
      "jenisPermohonan",
      "tujuanPermohonan",
      "namaPemohon",
      "email",
      "instansi",
      "jabatanPemohon",
      "statusPegawai",
      "nip",
      "tanggalAkhirKontrak",
      "nomorTelepon",
    ];

    for (const field of textFields) {
      const val = formData.get(field);
      if (val !== null && val !== "") {
        outForm.append(field, val as string);
      }
    }

    console.log("[DEBUG] FormData yang dikirim ke Semantik LOKAL:");
    for (const [key, value] of outForm.entries()) {
      if (key !== "signature") console.log(`  ${key}: "${value}"`);
    }

    const signatureRaw = formData.get("signature");
    if (signatureRaw && typeof signatureRaw === "string") {
      const base64Data = signatureRaw.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const blob = new Blob([buffer], { type: "image/png" });
      outForm.append("signature", blob, "signature.png");
    }

    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/vpn`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: outForm,
    });

    const responseText = await response.text();

    let responseData: unknown;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: responseText };
    }

    if (!response.ok) {
      console.error(
        "[API] POST /vpn Semantik LOKAL error:",
        response.status,
        responseText,
      );
      return NextResponse.json(
        {
          message: `Gagal kirim permohonan: ${response.status}`,
          detail: responseData,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error("[API] POST /vpn error:", error);
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