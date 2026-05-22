/**
 * Semantik API Client
 *
 * - Cek Pegawai : POST {api_base_url}/pegawai/ceknip → LIVE
 * - Get Instansi : GET {api_base_url}/instansi → LIVE
 * - Get All Permohonan : GET {api_base_url}/teleconference/permohonan → LIVE
 * - Get Permohonan by ID : GET {api_base_url}/teleconference/permohonan/{id} → LIVE
 * - Submit Permohonan : POST {local_base_url}/teleconference/permohonan → LOKAL
 * - Get Permohonan by ID (lokal) : GET {local_base_url}/teleconference/permohonan/{id} → LOKAL
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

export interface PermohonanRequest {
  tanggalPermohonan: string;
  instansi: string;
  kodeUnor?: string;
  namaPemohon: string;
  jabatanPemohon: string;
  email: string;
  nomorTelepon?: string;
  judulKegiatan: string;
  lokasiAcara?: string;
  tanggalPelaksanaan: string;
  waktuMulai: string;
  durasiMenit: number;
  jumlahPeserta: string;
  perangkatDibutuhkan?: string;
  jenisKegiatan?: string;
  keterangan?: string;
  acaraBerulang: boolean;
  pengulangan?: "harian" | "mingguan";
  ulangSetiap?: number;
  hariMingguan?: string[];
  jenisBerakhir?: "date" | "count";
  tanggalBerakhir?: string;
  jumlahPenyelenggaraan?: number;
}

export interface PermohonanResponse {
  id?: number;
  noTiket?: string;
  status?: string;
  message?: string;
  data?: {
    id?: number;
    noTiket?: string;
    status?: string;
  };
}

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

// ─── Config ───────────────────────────────────────────────────────────────────
const SEMANTIK_CONFIG = {
  tokenEndpoint:
    "https://auth.tangerangkota.go.id/realms/semantik/protocol/openid-connect/token",
  apiBaseUrl: process.env.SEMANTIK_API_BASE_URL,
  localBaseUrl: process.env.SEMANTIK_LOCAL_BASE_URL,
  clientId: process.env.SEMANTIK_CLIENT_ID,
  clientSecret: process.env.SEMANTIK_CLIENT_SECRET,
  username: process.env.SEMANTIK_USERNAME,
  password: process.env.SEMANTIK_PASSWORD,
  legacyToken: process.env.SEMANTIK_LEGACY_TOKEN,
};

// ─── Token Cache ──────────────────────────────────────────────────────────────
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

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

// ─── Fetch ke LIVE (GET) ──────────────────────────────────────────────────────
async function semantikFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = await getSemantikToken();
  const baseUrl = SEMANTIK_CONFIG.apiBaseUrl;

  if (!baseUrl)
    throw new Error("SEMANTIK_API_BASE_URL belum dikonfigurasi di .env");

  const url = `${baseUrl.replace(/\/$/, "")}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 401 && retry) {
    clearSemantikToken();
    return semantikFetch<T>(endpoint, options, false);
  }

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Semantik API Error ${response.status}: ${err}`);
  }

  return response.json();
}

async function semantikLocalFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = await getSemantikToken();

  const baseUrl = SEMANTIK_CONFIG.localBaseUrl ?? SEMANTIK_CONFIG.apiBaseUrl;

  if (!baseUrl)
    throw new Error("SEMANTIK_LOCAL_BASE_URL belum dikonfigurasi di .env");

  const url = `${baseUrl.replace(/\/$/, "")}${endpoint}`;

  // ✅ LOG 1 — lihat apa yang dikirim ke Semantik
  console.log("=== [SEMANTIK] REQUEST ===");
  console.log("URL:", url);
  console.log("METHOD:", options.method ?? "GET");
  console.log("BODY:", options.body ?? "(no body)");

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  // ✅ LOG 2 — lihat response mentah dari Semantik
  const responseText = await response.text();
  console.log("=== [SEMANTIK] RESPONSE ===");
  console.log("STATUS:", response.status);
  console.log("BODY:", responseText);

  if (response.status === 401 && retry) {
    clearSemantikToken();
    return semantikLocalFetch<T>(endpoint, options, false);
  }

  if (!response.ok) {
    throw new Error(
      `Semantik Local API Error ${response.status}: ${responseText}`,
    );
  }

  return JSON.parse(responseText);
}
// ─── Instansi ─────────────────────────────────────────────────────────────────

/** GET /instansi → LIVE */
export async function getAllInstansi(): Promise<InstansiItem[]> {
  return semantikFetch<InstansiItem[]>("/instansi");
}

// ─── Pegawai ──────────────────────────────────────────────────────────────────

/** POST /pegawai/ceknip → LIVE */
export async function checkPegawai(nip: string): Promise<PegawaiResponse> {
  return semantikFetch<PegawaiResponse>("/pegawai/ceknip", {
    method: "POST",
    body: JSON.stringify({ nip }),
  });
}

// ─── Teleconference ───────────────────────────────────────────────────────────

/** POST /teleconference/permohonan → LOKAL */
export async function submitPermohonan(
  payload: PermohonanRequest,
): Promise<PermohonanResponse> {
  return semantikLocalFetch<PermohonanResponse>("/teleconference/permohonan", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** GET /teleconference/permohonan/{id} → LIVE */
export async function getPermohonanById(
  id: number | string,
): Promise<PermohonanDetail> {
  return semantikFetch<PermohonanDetail>(`/teleconference/permohonan/${id}`);
}

/** GET /teleconference/permohonan/{id} → LOKAL (dipakai setelah POST) */
export async function getPermohonanByIdLocal(
  id: number | string,
): Promise<PermohonanDetail> {
  return semantikLocalFetch<PermohonanDetail>(
    `/teleconference/permohonan/${id}`,
  );
}

/** GET /teleconference/permohonan → LIVE */

export async function getAllPermohonanLocal(params?: {
  limit?: number;
  offset?: number;
  search?: string;
}): Promise<PermohonanDetail[]> {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.offset) query.set("offset", String(params.offset));
  if (params?.search) query.set("search", params.search);

  const qs = query.toString();
  return semantikLocalFetch<PermohonanDetail[]>(
    `/teleconference/permohonan${qs ? `?${qs}` : ""}`,
  );
}

/** Ekstrak link Zoom pertama dari detail permohonan */
export function extractZoomLink(
  detail: PermohonanDetail | null | undefined,
): string | null {
  return detail?.jadwal?.[0]?.linkZoom ?? null;
}
// ─── Repository ───────────────────────────────────────────────────────────────

export interface RepositoryPersonil {
  namaPersonil: string;
  usernameGitlab: string;
  jabatanPeran: string;
  keterangan: string;
}

export interface RepositoryPermohonanRequest {
  namaAplikasi: string;
  jenisAplikasi: string;
  unitKerjaPengelola: string;
  namaPic: string;
  nomorKontakPic: string;
  subdomain: string;
  bahasaPemrograman: string;
  framework: string;
  database: string;
  webServer: string;
  modulLainnya: string;
  tanggalPermohonan: string;
  tanggalRencanaPublikasi: string;
  namaProyek: string;
  tujuanPembuatan: string;
  namaRepository: string;
  tanggalBerakhir: string;
  jenisDomain: string;
  usulanNamaDomain: string;
  jenisAkses: string;
  persons: RepositoryPersonil[];
}

export interface RepositoryPermohonanResponse {
  id?: number;
  noTiket?: string;
  status?: string;
  message?: string;
  data?: {
    id?: number;
    noTiket?: string;
    status?: string;
  };
}

/** POST /repository/permohonan → LOKAL */
export async function submitRepositoryPermohonan(
  payload: RepositoryPermohonanRequest,
): Promise<RepositoryPermohonanResponse> {
  return semantikLocalFetch<RepositoryPermohonanResponse>(
    "/repository/permohonan",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

/** GET /repository/permohonan → LOKAL */
export async function getAllRepositoryPermohonan(): Promise<
  RepositoryPermohonanResponse[]
> {
  return semantikLocalFetch<RepositoryPermohonanResponse[]>(
    "/repository/permohonan",
  );
}

/** GET /repository/permohonan/{id} → LOKAL */
export async function getRepositoryPermohonanById(
  id: number | string,
): Promise<RepositoryPermohonanResponse> {
  return semantikLocalFetch<RepositoryPermohonanResponse>(
    `/repository/permohonan/${id}`,
  );
}

// ─── VPN (tambahan) ───────────────────────────────────────────────────────────

export interface VpnListItem {
  id: string;
  tanggalPermohonan: string;
  jenisPermohonan: string;
  tujuanPermohonan: string;
  namaPemohon: string;
  email: string;
  instansi: string;
  jabatanPemohon: string;
  statusPegawai: string;
  nip?: string;
  tanggalAkhirKontrak?: string;
  nomorTelepon: string;
  signature?: string;
  status: "verifikasi" | "persetujuan" | "pembuatan" | "selesai" | "tolak" | string;
  statusDetail?: string;
  idVerifikasi?: number;
  idPersetujuan?: number;
  linkVpn?: string;
  tanggalVerifikasi?: string;
  verifikasiNotes?: string;
  tanggalPersetujuan?: string;
  persetujuanNotes?: string;
  persetujuanName?: string;
  alasanPenolakan?: string;
  tanggalPenolakan?: string;
  nomorRekaman?: string;
  vpnUsername?: unknown;
  vpnPassword?: unknown;
  createdAt: string;
  updatedAt: string;
}

/** GET /vpn → LOKAL */
export async function getAllVpn(params?: {
  limit?: number;
  offset?: number;
  status?: string;
  search?: string;
  progress?: boolean;
}): Promise<VpnListItem[]> {
  const query = new URLSearchParams();
  if (params?.limit !== undefined) query.set("limit", String(params.limit));
  if (params?.offset !== undefined) query.set("offset", String(params.offset));
  if (params?.status) query.set("status", params.status);
  if (params?.search) query.set("search", params.search);
  if (params?.progress !== undefined) query.set("progress", String(params.progress));

  const qs = query.toString();
  return semantikLocalFetch<VpnListItem[]>(`/vpn${qs ? `?${qs}` : ""}`);
}

/** GET /vpn/{id} → LOKAL */
export async function getVpnById(id: string | number): Promise<VpnListItem> {
  return semantikLocalFetch<VpnListItem>(`/vpn/${id}`);
}

