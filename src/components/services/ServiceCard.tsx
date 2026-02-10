import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  PenTool,
  Shield,
  Video,
  Globe,
  GitBranch,
  HardDrive,
  AlertTriangle,
  HelpCircle,
  LucideIcon,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Service } from "@/data/services";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Mail,
  PenTool,
  Shield,
  Video,
  Globe,
  GitBranch,
  HardDrive,
  AlertTriangle,
  HelpCircle,
};

interface ServiceCardProps {
  service: Service;
  className?: string;
}

const ServiceCard = ({ service, className }: ServiceCardProps) => {
  const IconComponent = iconMap[service.icon] || HelpCircle;

  return (
    <Link href={service.route} className="group block h-full">
      <Card
        className={cn(
          // 🎨 Base - Card dengan background putih & border subtle
          "relative h-full overflow-hidden",
          "border border-slate-200/60 bg-white",
          "dark:border-slate-700/50 dark:bg-slate-900/50",

          // 💎 Premium Shadow - Bayangan bertingkat untuk depth
          "shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)]",

          // ✨ Transition - Smooth animation 400ms
          "transition-all duration-400 ease-out",

          // 🌟 Hover State - Elevasi dengan shadow yang lebih dramatic
          "hover:shadow-[0_12px_32px_rgba(59,130,246,0.12),0_2px_8px_rgba(59,130,246,0.08)]",
          "hover:border-blue-200/60 hover:-translate-y-1",
          "dark:hover:border-blue-500/30 dark:hover:shadow-[0_12px_32px_rgba(59,130,246,0.2)]",

          className,
        )}
      >
        {/* 🌈 Gradient Background Overlay - Muncul saat hover */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-500",
            "bg-gradient-to-br from-blue-50/80 via-white/40 to-cyan-50/60",
            "dark:from-blue-950/20 dark:via-slate-900/40 dark:to-cyan-950/10",
            "group-hover:opacity-100",
          )}
        />

        {/* ✨ Sparkle Effect - Debu bintang subtle di corner */}
        <div className="absolute -right-6 -top-6 h-24 w-24 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 rotate-12 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/10 blur-2xl" />
        </div>

        <CardContent className="relative flex h-full flex-col gap-6 p-6">
          {/* 🎯 Icon Section - Premium glassmorphic container */}
          <div className="flex items-start justify-between">
            <div className="relative">
              {/* Glow effect background */}
              <div
                className={cn(
                  "absolute -inset-2 rounded-2xl opacity-0 blur-xl transition-all duration-500",
                  "bg-gradient-to-br from-blue-400/30 to-cyan-400/20",
                  "group-hover:opacity-100 group-hover:-inset-3 group-hover:blur-2xl",
                )}
              />

              {/* Icon container dengan glassmorphism */}
              <div
                className={cn(
                  "relative flex h-16 w-16 items-center justify-center rounded-2xl",
                  "bg-gradient-to-br from-blue-50 to-blue-100/80",
                  "dark:from-blue-950/40 dark:to-blue-900/30",
                  "border border-blue-200/50 dark:border-blue-800/50",
                  "backdrop-blur-sm transition-all duration-500",
                  "group-hover:scale-110 group-hover:from-blue-100 group-hover:to-blue-200/90",
                  "dark:group-hover:from-blue-900/60 dark:group-hover:to-blue-800/50",
                  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5)]",
                  "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]",
                )}
              >
                <IconComponent
                  className={cn(
                    "h-8 w-8 transition-all duration-500",
                    "text-blue-600 dark:text-blue-400",
                    "group-hover:scale-110 group-hover:text-blue-700",
                    "dark:group-hover:text-blue-300",
                    "drop-shadow-sm",
                  )}
                />
              </div>
            </div>

            {/* Status indicator - Premium badge */}
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1",
                "bg-gradient-to-r from-green-50 to-emerald-50",
                "dark:from-green-950/40 dark:to-emerald-950/30",
                "border border-green-200/50 dark:border-green-800/50",
                "opacity-0 transition-all duration-300 group-hover:opacity-100",
              )}
            >
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
              <span className="text-xs font-medium text-green-700 dark:text-green-400">
                Tersedia
              </span>
            </div>
          </div>

          {/* 📝 Content Section */}
          <div className="flex flex-1 flex-col gap-2">
            {/* Service Title */}
            <h3
              className={cn(
                "text-lg font-bold leading-tight transition-colors duration-300",
                "text-slate-900 dark:text-slate-50",
                "group-hover:text-blue-700 dark:group-hover:text-blue-300",
              )}
            >
              {service.title}
            </h3>

            {/* Service Description */}
            <p
              className={cn(
                "line-clamp-2 text-sm leading-relaxed transition-colors duration-300",
                "text-slate-600 dark:text-slate-400",
                "group-hover:text-slate-700 dark:group-hover:text-slate-300",
              )}
            >
              {service.description}
            </p>
          </div>

          {/* 🔗 CTA Section - Arrow dengan teks */}
          <div
            className={cn(
              "flex items-center gap-2 text-sm font-semibold",
              "text-blue-600 dark:text-blue-400",
              "transition-all duration-300",
            )}
          >
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              Selengkapnya
            </span>
            <ArrowRight
              className={cn(
                "h-4 w-4 transition-all duration-300",
                "group-hover:translate-x-2",
              )}
            />
          </div>

          {/* Decorative bottom line */}
          <div
            className={cn(
              "absolute bottom-0 left-0 h-1 w-0 transition-all duration-500",
              "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500",
              "group-hover:w-full",
            )}
          />
        </CardContent>
      </Card>
    </Link>
  );
};

export default ServiceCard;
