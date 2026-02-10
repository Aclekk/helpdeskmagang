import { z } from "zod";

export type FieldType = "text" | "email" | "textarea" | "select" | "date" | "time" | "number" | "file" | "checkbox";

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface ServiceDetails {
  description: string;
  benefits: string[];
  requirements: string[];
  process: string[];
  timeEstimate: string;
  supportContact: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: "akun" | "keamanan" | "infrastruktur" | "meeting" | "domain" | "repository" | "incident";
  icon: string;
  route: string;
  formSchema: FormField[];
  details?: ServiceDetails;
}

export const categories = [
  { id: "akun", label: "Akun", color: "bg-blue-500" },
  { id: "keamanan", label: "Keamanan", color: "bg-green-500" },
  { id: "infrastruktur", label: "Infrastruktur", color: "bg-purple-500" },
  { id: "meeting", label: "Meeting", color: "bg-yellow-500" },
  { id: "domain", label: "Domain", color: "bg-orange-500" },
  { id: "repository", label: "Repository", color: "bg-pink-500" },
  { id: "incident", label: "Incident", color: "bg-red-500" },
] as const;

export const services: Service[] = [
  {
    id: "email-resmi",
    title: "Email Resmi",
    description: "Pengajuan pembuatan email resmi @tangerangkota.go.id untuk pegawai",
    category: "akun",
    icon: "Mail",
    route: "/services/email-resmi",
    formSchema: [
      { name: "fullName", label: "Nama Lengkap", type: "text", required: true, placeholder: "Masukkan nama lengkap" },
      { name: "nip", label: "NIP", type: "text", required: true, placeholder: "Masukkan NIP" },
      { name: "unit", label: "Unit/OPD", type: "text", required: true, placeholder: "Masukkan unit kerja" },
      { name: "requestedEmail", label: "Email yang Diminta", type: "email", required: true, placeholder: "contoh@tangerangkota.go.id" },
      { name: "reason", label: "Alasan Pengajuan", type: "textarea", required: true, placeholder: "Jelaskan alasan pengajuan email" },
    ],
  },
  {
    id: "tanda-tangan-elektronik",
    title: "Tanda Tangan Elektronik",
    description: "Pengajuan pembuatan sertifikat tanda tangan elektronik (TTE)",
    category: "keamanan",
    icon: "PenTool",
    route: "/services/tanda-tangan-elektronik",
    formSchema: [
      { name: "fullName", label: "Nama Lengkap", type: "text", required: true, placeholder: "Masukkan nama lengkap" },
      { name: "nip", label: "NIP", type: "text", required: true, placeholder: "Masukkan NIP" },
      { name: "unit", label: "Unit/OPD", type: "text", required: true, placeholder: "Masukkan unit kerja" },
      { name: "certificateType", label: "Jenis Sertifikat", type: "select", required: true, options: [
        { value: "personal", label: "Personal" },
        { value: "organisasi", label: "Organisasi" },
      ]},
      { name: "reason", label: "Alasan Pengajuan", type: "textarea", required: true, placeholder: "Jelaskan alasan pengajuan TTE" },
    ],
  },
  {
    id: "vpn",
    title: "Layanan VPN Pemerintah Kota Tangerang",
    description: "Akses aman ke jaringan internal Pemerintah Kota Tangerang untuk mendukung pekerjaan dari jarak jauh",
    category: "infrastruktur",
    icon: "Shield",
    route: "/services/vpn",
    details: {
      description: "Layanan Virtual Private Network (VPN) Pemerintah Kota Tangerang memungkinkan akses aman ke jaringan internal pemerintah dari lokasi manapun. Dengan enkripsi tingkat tinggi, layanan ini memastikan keamanan dan kerahasiaan data selama transmisi.",
      benefits: [
        "Akses aman ke aplikasi dan data internal",
        "Enkripsi data untuk keamanan maksimal",
        "Dapat diakses dari mana saja selama terhubung internet",
        "Dukungan teknis 24/7"
      ],
      requirements: [
        "Pegawai aktif Pemerintah Kota Tangerang",
        "Memiliki perangkat yang memenuhi spesifikasi minimum",
        "Menyetujui kebijakan penggunaan VPN"
      ],
      process: [
        "Isi formulir permohonan",
        "Verifikasi data oleh admin",
        "Pembuatan akun VPN",
        "Pengiriman kredensial melalui email resmi"
      ],
      timeEstimate: "1-2 hari kerja",
      supportContact: "helpdesk@tangerangkota.go.id / (021) 5517744"
    },
    formSchema: [
      { name: "jenisPermohonan", label: "Jenis Permohonan", type: "select", required: true, options: [
        { value: "baru", label: "Baru" },
        { value: "perpanjangan", label: "Perpanjangan" }
      ]},
      { name: "nama", label: "Nama", type: "text", required: true, placeholder: "Masukkan nama lengkap" },
      { name: "jabatan", label: "Jabatan", type: "text", required: true, placeholder: "Masukkan jabatan" },
      { name: "statusPegawai", label: "Status Pegawai", type: "select", required: true, options: [
        { value: "asn", label: "ASN" },
        { value: "ta", label: "TA" }
      ]},
      { name: "nip", label: "NIP", type: "text", required: true, placeholder: "Masukkan NIP" },
      { name: "email", label: "Email", type: "email", required: true, placeholder: "contoh@contoh.com" },
      { name: "whatsapp", label: "Nomor Telp yang terhubung ke Whatsapp", type: "text", required: true, placeholder: "08xxxxxxxxxx" },
      { name: "instansi", label: "Instansi", type: "select", required: true, options: [
        { value: "Pilih Instansi", label: "Pilih Instansi" },
        { value: "Diskominfo Kota Tangerang", label: "Diskominfo Kota Tangerang" },
        { value: "Dinas Pendidikan", label: "Dinas Pendidikan" },
        { value: "Dinas Kesehatan", label: "Dinas Kesehatan" },
        { value: "Kecamatan", label: "Kecamatan" },
        { value: "Kelurahan", label: "Kelurahan" }
      ]},
      { name: "tujuan", label: "Tujuan", type: "textarea", required: true, placeholder: "Jelaskan tujuan penggunaan VPN" },
      { name: "tandaTangan", label: "Tanda Tangan", type: "file", required: true }
    ]
  },
  {
    id: "video-conference",
    title: "Video Conference Zoom",
    description: "Pengajuan penggunaan akun Zoom premium untuk meeting",
    category: "meeting",
    icon: "Video",
    route: "/services/video-conference",
    formSchema: [
      { name: "fullName", label: "Nama Lengkap", type: "text", required: true, placeholder: "Masukkan nama lengkap" },
      { name: "meetingDate", label: "Tanggal Meeting", type: "date", required: true },
      { name: "meetingTime", label: "Jam Meeting", type: "time", required: true },
      { name: "participantCount", label: "Jumlah Peserta", type: "number", required: true, placeholder: "Masukkan perkiraan jumlah peserta" },
      { name: "hostNeeds", label: "Kebutuhan Host", type: "select", required: true, options: [
        { value: "host", label: "Host" },
        { value: "co-host", label: "Co-Host" },
        { value: "both", label: "Host & Co-Host" },
      ]},
      { name: "reason", label: "Alasan/Agenda Meeting", type: "textarea", required: true, placeholder: "Jelaskan agenda meeting" },
    ],
  },
  {
    id: "subdomain",
    title: "Subdomain",
    description: "Pengajuan pembuatan subdomain *.tangerangkota.go.id",
    category: "domain",
    icon: "Globe",
    route: "/services/subdomain",
    formSchema: [
      { name: "subdomainName", label: "Nama Subdomain", type: "text", required: true, placeholder: "contoh: aplikasi" },
      { name: "purpose", label: "Tujuan Penggunaan", type: "textarea", required: true, placeholder: "Jelaskan tujuan subdomain" },
      { name: "pic", label: "PIC (Person In Charge)", type: "text", required: true, placeholder: "Nama penanggung jawab" },
      { name: "contact", label: "Kontak PIC", type: "text", required: true, placeholder: "No. HP / Email" },
    ],
  },
  {
    id: "repository-git",
    title: "Repository (Git/Repo)",
    description: "Pengajuan pembuatan repository Git untuk pengembangan aplikasi",
    category: "repository",
    icon: "GitBranch",
    route: "/services/repository-git",
    formSchema: [
      { name: "projectName", label: "Nama Project", type: "text", required: true, placeholder: "Masukkan nama project" },
      { name: "accessLevel", label: "Level Akses", type: "select", required: true, options: [
        { value: "read", label: "Read Only" },
        { value: "write", label: "Read & Write" },
      ]},
      { name: "members", label: "Anggota Tim", type: "textarea", required: true, placeholder: "Daftar email anggota tim (pisahkan dengan koma)" },
      { name: "description", label: "Deskripsi Project", type: "textarea", required: true, placeholder: "Jelaskan deskripsi project" },
    ],
  },
  {
    id: "repository-storage",
    title: "Repository (File/Storage)",
    description: "Pengajuan penyimpanan file dan dokumen di cloud storage",
    category: "repository",
    icon: "HardDrive",
    route: "/services/repository-storage",
    formSchema: [
      { name: "folderName", label: "Nama Folder", type: "text", required: true, placeholder: "Masukkan nama folder" },
      { name: "quota", label: "Kebutuhan Quota", type: "select", required: true, options: [
        { value: "5gb", label: "5 GB" },
        { value: "10gb", label: "10 GB" },
        { value: "25gb", label: "25 GB" },
        { value: "50gb", label: "50 GB" },
      ]},
      { name: "members", label: "Anggota Akses", type: "textarea", required: true, placeholder: "Daftar email yang dapat mengakses (pisahkan dengan koma)" },
      { name: "purpose", label: "Tujuan Penggunaan", type: "textarea", required: true, placeholder: "Jelaskan tujuan penyimpanan" },
    ],
  },
  {
    id: "laporan-insiden",
    title: "Laporan Insiden",
    description: "Laporkan insiden atau gangguan sistem TIK",
    category: "incident",
    icon: "AlertTriangle",
    route: "/incident",
    formSchema: [
      { name: "systemAffected", label: "Sistem/Aplikasi Terdampak", type: "text", required: true, placeholder: "Nama sistem yang mengalami masalah" },
      { name: "incidentDate", label: "Waktu Kejadian", type: "date", required: true },
      { name: "incidentTime", label: "Jam Kejadian", type: "time", required: true },
      { name: "severity", label: "Tingkat Keparahan", type: "select", required: true, options: [
        { value: "low", label: "Rendah - Tidak mengganggu operasional" },
        { value: "medium", label: "Sedang - Sebagian fungsi terganggu" },
        { value: "high", label: "Tinggi - Sistem tidak bisa diakses" },
        { value: "critical", label: "Kritis - Dampak luas pada layanan publik" },
      ]},
      { name: "chronology", label: "Kronologi Kejadian", type: "textarea", required: true, placeholder: "Jelaskan kronologi kejadian secara detail" },
      { name: "impact", label: "Dampak", type: "textarea", required: true, placeholder: "Jelaskan dampak yang ditimbulkan" },
      { name: "evidence", label: "Bukti/Screenshot", type: "file", required: false },
    ],
  },
];

export const getServiceById = (id: string): Service | undefined => {
  return services.find((service) => service.id === id);
};

export const getServicesByCategory = (category: string): Service[] => {
  if (category === "all") return services;
  return services.filter((service) => service.category === category);
};

// Zod schema generator based on form fields
export const generateZodSchema = (fields: FormField[]) => {
  const schemaObject: Record<string, z.ZodTypeAny> = {};
  
  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;
    
    switch (field.type) {
      case "email":
        fieldSchema = z.string().email("Email tidak valid");
        break;
      case "number":
        fieldSchema = z.coerce.number().min(1, "Harus lebih dari 0");
        break;
      case "file":
        fieldSchema = z.any().optional();
        break;
      default:
        fieldSchema = z.string();
    }
    
    if (field.required && field.type !== "file") {
      fieldSchema = fieldSchema.refine((val) => val !== undefined && val !== "", {
        message: `${field.label} wajib diisi`,
      });
    } else if (!field.required) {
      fieldSchema = fieldSchema.optional();
    }
    
    schemaObject[field.name] = fieldSchema;
  });
  
  return z.object(schemaObject);
};
