'use client'

import Link from "next/link";
import Image from "next/image";
import { services } from "@/data/services";
import ServiceGrid from "@/components/services/ServiceGrid";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import logoHelpdesk from "@/assets/logo_helpdeskTIK.png";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* ==================== HERO SECTION ==================== */}
      {/* Background putih bersih - NO GRADIENT */}
      <section className="relative overflow-hidden bg-white py-24 dark:bg-slate-900 md:py-32 lg:py-40">
        {/* Background decorative elements - lingkaran blur */}
        <div className="absolute inset-0 -z-10">
          {/* Gradient circle blur kiri atas */}
          <div className="absolute left-0 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/20 blur-3xl dark:bg-cyan-500/10" />

          {/* Gradient circle blur kanan bawah */}
          <div className="absolute bottom-0 right-0 h-[600px] w-[600px] translate-x-1/2 translate-y-1/2 rounded-full bg-blue-500/15 blur-3xl dark:bg-cyan-600/10" />

          {/* Animated gradient circle tengah */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-400/10 to-blue-600/10 blur-3xl dark:from-cyan-500/10 dark:to-blue-500/10"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: [0.45, 0, 0.55, 1],
            }}
          />
        </div>

        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            {/* Logo dengan animasi fade in */}
            <motion.div
              className="mb-4 flex justify-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="relative h-36 w-36">
                {/* Glow effect di belakang logo */}
                <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500/30 blur-3xl" />

                {/* Logo image */}
                <div className="relative flex h-full w-full items-center justify-center">
                  <Image
                    src={logoHelpdesk}
                    alt="Helpdesk TIK Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </motion.div>

            {/* Main Heading dengan animasi */}
            <motion.h1
              className="mb-6 text-5xl font-bold tracking-tight text-slate-900 dark:text-white md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              Layanan {/* Text dengan gradient biru */}
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent dark:from-cyan-400 dark:via-blue-400 dark:to-blue-500">
                Helpdesk TIK
              </span>
            </motion.h1>

            {/* Subtitle dengan animasi */}
            <motion.p
              className="mb-10 text-lg leading-relaxed text-slate-600 dark:text-slate-300 md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              Layanan TIK Dinas Komunikasi dan Informatika Kota Tangerang V3
            </motion.p>

            {/* CTA Buttons dengan animasi */}
            <motion.div
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              {/* Primary CTA Button - gradient biru */}
              <Button
                asChild
                size="lg"
                className="group w-full bg-gradient-to-r from-blue-600 to-blue-500 px-8 text-base font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 dark:from-cyan-500 dark:to-blue-500 dark:shadow-cyan-500/20 dark:hover:shadow-cyan-500/30 sm:w-auto"
              >
                <Link href="/services" className="flex items-center gap-2">
                  Lihat Semua Layanan
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>

              {/* Secondary CTA Button - outline style */}
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full border-2 border-slate-200 bg-white px-8 text-base font-semibold text-slate-700 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-cyan-500 dark:hover:bg-slate-700 dark:hover:text-cyan-400 sm:w-auto"
              >
                <Link href="/incident">Laporkan Insiden</Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Decorative wave divider di bawah hero */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="h-16 w-full text-white dark:text-slate-900"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C300,60 600,60 900,30 L900,120 L0,120 Z"
              className="fill-current"
            />
          </svg>
        </div>
      </section>

      {/* ==================== SERVICES SECTION ==================== */}
      {/* Background putih bersih */}
      <section className="bg-white py-20 dark:bg-slate-900 md:py-28">
        <div className="container">
          {/* Section Header dengan animasi */}
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Section Title */}
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl lg:text-5xl">
              Pilih Layanan yang{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent dark:from-cyan-400 dark:to-blue-400">
                Anda Butuhkan
              </span>
            </h2>

            {/* Section Description */}
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              8 layanan digital terintegrasi untuk mendukung produktivitas dan
              efisiensi kerja Anda
            </p>
          </motion.div>

          {/* Service Grid dengan animasi scroll reveal */}
          <ServiceGrid services={services} />

          {/* CTA Button ke halaman Services */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <Button
              asChild
              variant="outline"
              size="lg"
              className="group border-2 border-slate-200 bg-white px-8 text-base font-semibold text-slate-700 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-cyan-500 dark:hover:bg-slate-700 dark:hover:text-cyan-400"
            >
              <Link href="/services" className="flex items-center gap-2">
                Lihat Katalog Lengkap
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
