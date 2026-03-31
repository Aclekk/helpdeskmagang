/**
 * Semantik API Client
 *
 * API Endpoints:
 * - OIDC Token: POST /realms/semantik/protocol/openid-connect/token
 * - Cek Pegawai: POST {api_base_url}/pegawai/ceknip
 * - Kirim Permohonan: POST {api_base_url}/teleconference/permohonan
 * - Detail Permohonan: GET {api_base_url}/teleconference/permohonan/{external_id}
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SemantikTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  scope: string;
}

export interface PegawaiResponse {
  status: boolean;
  data?: {
    nip: string;
    nama_pegawai: string;
    unit_kerja: string;
    jabatan: string;
    whatsapp?: string;
    email?: string;
  };
  message?: string;
}

export interface PermohonanRequest {
  external_id: string;
  judul_kegiatan: string;
  tanggal_pelaksanaan: string; // YYYY-MM-DD
  waktu_mulai: string; // HH:mm
  waktu_selesai?: string; // HH:mm
  jumlah_peserta: string;
  instansi: string;
  kode_unit?: string;
  nama_pemohon: string;
  jabatan_pemohon: string;
  email: string;
  whatsapp?: string;
  lokasi_acara?: string;
  perangkat_dibutuhkan?: string[];
  nama_host?: string;
  rapat_berulang?: boolean;
  recurrence?: {
    repeat_type: "daily" | "weekly" | "monthly";
    repeat_every: number;
    repeat_on_days?: string[];
    end_type: "on" | "after";
    end_on_date?: string;
    end_after_count?: number;
  } | null;
}

export interface PermohonanResponse {
  status: boolean;
  data?: {
    external_id: string;
    id_permohonan: string;
    status: "menunggu" | "disetujui" | "ditolak" | "selesai";
    jadwal?: {
      link_zoom?: string;
      meeting_id?: string;
      passcode?: string;
    }[];
  };
  message?: string;
}

export interface PermohonanDetailResponse {
  status: boolean;
  data?: {
    external_id: string;
    id_permohonan: string;
    status: "menunggu" | "disetujui" | "ditolak" | "selesai";
    judul_kegiatan: string;
    tanggal_pelaksanaan: string;
    waktu_mulai: string;
    waktu_selesai?: string;
    jumlah_peserta: string;
    instansi: string;
    kode_unit?: string;
    nama_pemohon: string;
    jabatan_pemohon: string;
    email: string;
    whatsapp?: string;
    lokasi_acara?: string;
    perangkat_dibutuhkan?: string[];
    nama_host?: string;
    rapat_berulang?: boolean;
    jadwal?: {
      link_zoom?: string;
      meeting_id?: string;
      passcode?: string;
    }[];
  };
  message?: string;
}

// ─── Config ──────────────────────────────────────────────────────────────────

const SEMANTIK_CONFIG = {
  openidConfigUrl: process.env.NEXT_PUBLIC_SEMANTIK_OPENID_CONFIG_URL,
  tokenEndpoint: "https://auth.tangerangkota.go.id/realms/semantik/protocol/openid-connect/token",
  apiBaseUrl: process.env.NEXT_PUBLIC_SEMANTIK_API_BASE_URL,
  clientId: process.env.NEXT_PUBLIC_SEMANTIK_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_SEMANTIK_CLIENT_SECRET,
  username: process.env.NEXT_PUBLIC_SEMANTIK_USERNAME,
  password: process.env.NEXT_PUBLIC_SEMANTIK_PASSWORD,
};

// ─── Token Management ────────────────────────────────────────────────────────

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get Semantik OIDC token using Keycloak
 * Caches token until expiry
 */
export async function getSemantikToken(): Promise<string> {
  // Return cached token if still valid (with 30s buffer)
  if (cachedToken && Date.now() < tokenExpiry - 30000) {
    return cachedToken;
  }

  const response = await fetch(SEMANTIK_CONFIG.tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
    },
    body: new URLSearchParams({
      grant_type: "password",
      client_id: SEMANTIK_CONFIG.clientId || "",
      client_secret: SEMANTIK_CONFIG.clientSecret || "",
      username: SEMANTIK_CONFIG.username || "",
      password: SEMANTIK_CONFIG.password || "",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get token: ${response.status} ${errorText}`);
  }

  const data: SemantikTokenResponse = await response.json();

  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in * 1000);

  return cachedToken;
}

/**
 * Clear cached token (useful for logout)
 */
export function clearSemantikToken(): void {
  cachedToken = null;
  tokenExpiry = 0;
}

// ─── API Helpers ─────────────────────────────────────────────────────────────

async function semantikFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getSemantikToken();
  const baseUrl = SEMANTIK_CONFIG.apiBaseUrl;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_SEMANTIK_API_BASE_URL is not configured");
  }

  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return response.json();
}

// ─── Pegawai API ─────────────────────────────────────────────────────────────

/**
 * Check employee data by NIP
 * POST {api_base_url}/pegawai/ceknip
 */
export async function checkPegawai(nip: string): Promise<PegawaiResponse> {
  return semantikFetch<PegawaiResponse>("/pegawai/ceknip", {
    method: "POST",
    body: JSON.stringify({ nip }),
  });
}

// ─── Teleconference API ──────────────────────────────────────────────────────

/**
 * Submit teleconference request
 * POST {api_base_url}/teleconference/permohonan
 */
export async function submitPermohonan(
  payload: PermohonanRequest
): Promise<PermohonanResponse> {
  return semantikFetch<PermohonanResponse>("/teleconference/permohonan", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Get teleconference request detail by external_id
 * GET {api_base_url}/teleconference/permohonan/{external_id}
 */
export async function getPermohonanDetail(
  externalId: string
): Promise<PermohonanDetailResponse> {
  return semantikFetch<PermohonanDetailResponse>(
    `/teleconference/permohonan/${externalId}`
  );
}

/**
 * Extract Zoom link from permohonan detail response
 * Returns jadwal[0].linkZoom if available
 */
export function extractZoomLink(
  detail: PermohonanDetailResponse | null | undefined
): string | null {
  if (!detail?.data?.jadwal?.[0]?.link_zoom) {
    return null;
  }
  return detail.data.jadwal[0].link_zoom;
}
