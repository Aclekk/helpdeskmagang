'use client'

import { useState, useMemo } from "react";
import { services, getServicesByCategory } from "@/data/services";
import ServiceGrid from "@/components/services/ServiceGrid";
import SearchBar from "@/components/services/SearchBar";
import CategoryFilter from "@/components/services/CategoryFilter";
import { Sparkles, Building2 } from "lucide-react";

const Services = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredServices = useMemo(() => {
    let result = getServicesByCategory(selectedCategory);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (service) =>
          service.title.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query),
      );
    }

    return result;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="container py-8">
      {/* 🎨 Premium Header Section */}
      <div className="relative mb-12 overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-8 shadow-lg dark:border-slate-800/60 dark:bg-slate-900 md:p-12">
        {/* Decorative background patterns - Full coverage */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-cyan-50/30 dark:from-blue-950/10 dark:via-transparent dark:to-cyan-950/5" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/5" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/5" />

        {/* Content */}
        <div className="relative">
          {/* Breadcrumb / Label */}
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Diskominfo Kota Tangerang
            </span>
          </div>

          {/* Main Title */}
          <h1 className="mb-3 text-4xl font-bold text-slate-900 dark:text-slate-50 md:text-5xl">
            Katalog Layanan
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Temukan dan ajukan layanan teknologi informasi yang Anda butuhkan.
            Semua permintaan akan diproses oleh tim TIK secara profesional dan
            tepat waktu.
          </p>

          {/* Stats / Quick Info */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm dark:bg-slate-900/50">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {services.length} Layanan Tersedia
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm dark:bg-slate-900/50">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300"></span>
            </div>
          </div>
        </div>
      </div>

      {/* search & Filter Section */}
      <div className="mb-10 space-y-6">
        {/* Search Bar */}
        <div className="mx-auto max-w-2xl">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Category Filter */}
        <CategoryFilter
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      {/* 📊 Results Section */}
      <div className="space-y-6">
        {filteredServices.length > 0 ? (
          <>
            {/* Results Info */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Menampilkan{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {filteredServices.length}
                </span>{" "}
                dari{" "}
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {services.length}
                </span>{" "}
                layanan
              </p>

              {/* Sort / View options bisa ditambahkan di sini */}
            </div>

            {/* Service Grid */}
            <ServiceGrid services={filteredServices} />
          </>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-20 text-center dark:border-slate-800 dark:bg-slate-900/20">
            <div className="mb-4 rounded-full bg-slate-100 p-6 dark:bg-slate-800">
              <Sparkles className="h-12 w-12 text-slate-400 dark:text-slate-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-50">
              Layanan tidak ditemukan
            </h3>
            <p className="mb-6 max-w-md text-slate-600 dark:text-slate-400">
              Coba ubah kata kunci pencarian atau pilih kategori lain untuk
              menemukan layanan yang Anda butuhkan.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="rounded-full bg-blue-600 px-6 py-2.5 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
