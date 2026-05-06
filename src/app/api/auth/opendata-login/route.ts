import { NextResponse } from "next/server";
import https from "https";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { uid, pid, email, password } = body || {};

    const username = uid ?? email;
    const pass = pid ?? password;

    if (!username || !pass) {
      return NextResponse.json(
        { status: false, error: "Missing credentials" },
        { status: 400 }
      );
    }

    const basicUser = process.env.OPENDATA_BASIC_USER;
    const basicPass = process.env.OPENDATA_BASIC_PASS;
    const endpoint =
      process.env.OPENDATA_LOGIN_URL ??
      "https://opendatav2.tan04rangkota.go.id/services/auth/login_v2";

    if (!basicUser || !basicPass) {
      return NextResponse.json(
        {
          status: false,
          error:
            "Konfigurasi server belum diisi: OPENDATA_BASIC_USER dan OPENDATA_BASIC_PASS",
        },
        { status: 500 }
      );
    }

    if (basicUser.includes("$this->") || basicPass.includes("$this->")) {
      return NextResponse.json(
        {
          status: false,
          error:
            "OPENDATA_BASIC_USER / OPENDATA_BASIC_PASS harus diisi nilai aslinya (bukan $this->usernameopendata / $this->passwordopendata)",
        },
        { status: 500 }
      );
    }

    const authHeader =
      "Basic " +
      Buffer.from(`${basicUser}:${basicPass}`, "utf-8").toString("base64");

    const params = new URLSearchParams();
    params.set("uid", String(username));
    params.set("pid", String(pass));

    const insecure =
      String(process.env.OPENDATA_INSECURE_TLS || "").toLowerCase() === "true";
    const agent = insecure
      ? new https.Agent({ rejectUnauthorized: false })
      : undefined;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: authHeader,
      },
      body: params.toString(),
      // @ts-ignore node-fetch agent type
      agent,
    });

    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { status: false, error: "Invalid JSON from upstream", raw: text };
    }

    if (!res.ok) {
      if (res.status === 401) {
        if (typeof data === "object" && data) {
          if (typeof data.error === "string" && data.error.toLowerCase() === "unauthorized") {
            data.error = "Unauthorized (cek OPENDATA_BASIC_USER / OPENDATA_BASIC_PASS)";
          }
        } else if (String(text).trim().toLowerCase() === "unauthorized") {
          data = {
            status: false,
            error: "Unauthorized (cek OPENDATA_BASIC_USER / OPENDATA_BASIC_PASS)",
          };
        }
      }
    }

    const statusCode = res.ok ? 200 : res.status || 500;
    return NextResponse.json(data, { status: statusCode });
  } catch (err: any) {
    return NextResponse.json(
      { status: false, error: err?.message ?? "Internal error" },
      { status: 500 }
    );
  }
}

