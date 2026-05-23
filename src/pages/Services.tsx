"use client";

import { useState, useMemo } from "react";
import { services, getServicesByCategory, categories } from "@/data/services";
import ServiceGrid from "@/components/services/ServiceGrid";
import SearchBar from "@/components/services/SearchBar";
import CategoryFilter from "@/components/services/CategoryFilter";
import { motion } from "framer-motion";
import { LayoutGrid, Search, SlidersHorizontal } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 dark:from-blue-900 dark:via-blue-800 dark:to-slate-900">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="container relative z-10 py-14 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Breadcrumb */}
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-200/80">
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Diskominfo Kota Tangerang</span>
              <span className="text-blue-300/50">·</span>
              <span className="text-white">Katalog Layanan</span>
            </div>

            <h1 className="mb-3 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
              Katalog Layanan TIK
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-blue-100/80 md:text-lg">
              Temukan dan ajukan layanan teknologi informasi untuk mendukung
              produktivitas kerja Anda secara profesional.
            </p>

            {/* Stats chips */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-sm font-medium text-white">
                  {services.length} Layanan Tersedia
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-blue-300" />
                <span className="text-sm font-medium text-white">
                  {categories.length} Kategori
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            xmlns="http://www.w3.org/2000/svg"
            className="block w-full"
          >
            <path
              d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"
              className="fill-slate-50 dark:fill-slate-950"
            />
          </svg>
        </div>
      </div>

      {/* ── Search & Filter ── */}
      <div className="container -mt-2 pb-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Cari Layanan
            </span>
          </div>
          <div className="mb-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Filter Kategori
            </span>
          </div>
          <CategoryFilter
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </motion.div>
      </div>

      {/* ── Results ── */}
      <div className="container pb-16 pt-6">
        {filteredServices.length > 0 ? (
          <>
            {/* Results count bar */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-1 w-6 rounded-full bg-blue-600" />
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
              </div>
            </div>
            <ServiceGrid services={filteredServices} />
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-4 rounded-full bg-slate-100 p-5 dark:bg-slate-800">
              <Search className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-slate-50">
              Layanan tidak ditemukan
            </h3>
            <p className="mb-6 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Coba ubah kata kunci atau pilih kategori lain.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Reset Pencarian
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Services;
