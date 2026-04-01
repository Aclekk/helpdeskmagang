/**
 * Semantik API Client
 *
 * Endpoints yang digunakan:
 * - OIDC Token  : POST https://auth.tangerangkota.go.id/realms/semantik/protocol/openid-connect/token
 * - Cek Pegawai : POST {api_base_url}/pegawai/ceknip
 * - Submit Permohonan : POST {api_base_url}/teleconference/permohonan
 * - Get Permohonan by ID : GET {api_base_url}/teleconference/permohonan/{id}
 * - Get All Permohonan : GET {api_base_url}/teleconference/permohonan
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SemantikTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  scope: string;
}

export interface PegawaiResponse {
  status?: boolean;
  message?: string;
  // Field langsung dari OpenData/Semantik
  id?: string;
  id_pegawai?: string;
  nip?: string;
  nip_baru?: string;
  nama_pegawai?: string;
  nomenklatur_jabatan?: string;
  kode_unor?: string;
  nama_unor?: string;
  nomor_hp?: string;
  email?: string;
  foto?: string;
  // fallback wrapped response
  data?: {
    nama_pegawai?: string;
    whatsapp?: string;
    email?: string;
    unit_kerja?: string;
    jabatan?: string;
    kode_unor?: string;
    nip?: string;
  };
}

// ─── Request body untuk POST /teleconference/permohonan ──────────────────────
export interface PermohonanRequest {
  tanggalPermohonan: string; // "YYYY-MM-DD"
  instansi: string;
  kodeUnor?: string;
  namaPemohon: string;
  jabatanPemohon: string;
  email: string;
  nomorTelepon?: string;
  judulKegiatan: string;
  lokasiAcara?: string;
  tanggalPelaksanaan: string; // "YYYY-MM-DD"
  waktuMulai: string; // "HH:mm"
  durasiMenit: number;
  jumlahPeserta: string;
  perangkatDibutuhkan?: string;
  jenisKegiatan?: string;
  keterangan?: string;
  acaraBerulang: boolean;
  pengulangan?: "harian" | "mingguan" | "bulanan";
  ulangSetiap?: number;
  hariMingguan?: string[];
  jenisBerakhir?: "date" | "count";
  tanggalBerakhir?: string;
  jumlahPenyelenggaraan?: number;
}

// ─── Response POST /teleconference/permohonan ────────────────────────────────
export interface PermohonanResponse {
  id?: number;
  noTiket?: string;
  status?: string;
  message?: string;
  // fallback jika server wrap dalam { status, data }
  data?: {
    id?: number;
    noTiket?: string;
    status?: string;
  };
}

// ─── Response GET /teleconference/permohonan/{id} ────────────────────────────
export interface JadwalItem {
  id: number;
  permohonanId: number;
  tanggal: string;
  waktuMulai: string;
  waktuSelesai: string;
  linkZoom?: string;
  hostEmail?: string;
  hostUserId?: string;
  status: string;
}

export interface PermohonanDetail {
  id: number;
  noTiket: string;
  tanggalPermohonan: string;
  instansi: string;
  kodeUnor?: string;
  namaPemohon: string;
  jabatanPemohon: string;
  email: string;
  nomorTelepon?: string;
  judulKegiatan: string;
  lokasiAcara?: string;
  tanggalMulai: string;
  waktuMulai: string;
  durasiMenit: number;
  jumlahPeserta: string;
  perangkatDibutuhkan?: string;
  jenisKegiatan?: string;
  keterangan?: string;
  status: "menunggu" | "disetujui" | "ditolak" | "selesai" | string;
  isRecurring: boolean;
  recurrenceFreq?: string;
  recurrenceInterval?: number;
  recurrenceDays?: string;
  recurrenceEndType?: string;
  recurrenceEndDate?: string;
  recurrenceCount?: number;
  createdAt: string;
  updatedAt: string;
  jadwal: JadwalItem[];
}
export interface InstansiItem {
  idUnor: string;
  jenis: string;
  namaUnor: string;
  namaUnorAlias?: string;
  kodeUnor: string;
  kodeEse?: string;
  namaEse?: string;
}
export async function getAllInstansi(): Promise<InstansiItem[]> {
  return semantikFetch<InstansiItem[]>("/instansi");
}

// ─── Config ───────────────────────────────────────────────────────────────────
// Semua env tanpa NEXT_PUBLIC_ agar tidak bocor ke browser.
// Gunakan di server-side (API Routes) saja.
const SEMANTIK_CONFIG = {
  tokenEndpoint:
    "https://auth.tangerangkota.go.id/realms/semantik/protocol/openid-connect/token",
  apiBaseUrl: process.env.SEMANTIK_API_BASE_URL,
  clientId: process.env.SEMANTIK_CLIENT_ID,
  clientSecret: process.env.SEMANTIK_CLIENT_SECRET,
  username: process.env.SEMANTIK_USERNAME,
  password: process.env.SEMANTIK_PASSWORD,
};

// ─── Token Cache (server-side only) ─────────────────────────────────────────
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Ambil OIDC token dari Keycloak Semantik.
 * Token di-cache sampai hampir expired (buffer 30 detik).
 */
export async function getSemantikToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry - 30_000) {
    return cachedToken;
  }

  const response = await fetch(SEMANTIK_CONFIG.tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "password",
      client_id: SEMANTIK_CONFIG.clientId ?? "",
      client_secret: SEMANTIK_CONFIG.clientSecret ?? "",
      username: SEMANTIK_CONFIG.username ?? "",
      password: SEMANTIK_CONFIG.password ?? "",
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gagal ambil token Semantik: ${response.status} ${err}`);
  }

  const data: SemantikTokenResponse = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;

  return cachedToken;
}

export function clearSemantikToken(): void {
  cachedToken = null;
  tokenExpiry = 0;
}

// ─── Generic fetch helper ────────────────────────────────────────────────────
async function semantikFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getSemantikToken();
  const baseUrl = SEMANTIK_CONFIG.apiBaseUrl;

  if (!baseUrl) {
    throw new Error("SEMANTIK_API_BASE_URL belum dikonfigurasi di .env");
  }

  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Semantik API Error ${response.status}: ${err}`);
  }

  return response.json();
}

// ─── Pegawai ─────────────────────────────────────────────────────────────────

/**
 * Cek data pegawai berdasarkan NIP.
 * POST /pegawai/ceknip
 */
export async function checkPegawai(nip: string): Promise<PegawaiResponse> {
  return semantikFetch<PegawaiResponse>("/pegawai/ceknip", {
    method: "POST",
    body: JSON.stringify({ nip }),
  });
}

// ─── Teleconference ──────────────────────────────────────────────────────────

/**
 * Kirim permohonan teleconference baru.
 * POST /teleconference/permohonan
 */
export async function submitPermohonan(
  payload: PermohonanRequest,
): Promise<PermohonanResponse> {
  return semantikFetch<PermohonanResponse>("/teleconference/permohonan", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Ambil detail permohonan berdasarkan ID (angka dari Semantik).
 * GET /teleconference/permohonan/{id}
 */
export async function getPermohonanById(
  id: number | string,
): Promise<PermohonanDetail> {
  return semantikFetch<PermohonanDetail>(`/teleconference/permohonan/${id}`);
}

/**
 * Ambil semua permohonan (dengan pagination opsional).
 * GET /teleconference/permohonan
 */
export async function getAllPermohonan(params?: {
  limit?: number;
  offset?: number;
  search?: string;
}): Promise<PermohonanDetail[]> {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.offset) query.set("offset", String(params.offset));
  if (params?.search) query.set("search", params.search);

  const qs = query.toString();
  return semantikFetch<PermohonanDetail[]>(
    `/teleconference/permohonan${qs ? `?${qs}` : ""}`,
  );
}

/**
 * Ekstrak link Zoom pertama dari detail permohonan.
 */
export function extractZoomLink(
  detail: PermohonanDetail | null | undefined,
): string | null {
  return detail?.jadwal?.[0]?.linkZoom ?? null;
}
