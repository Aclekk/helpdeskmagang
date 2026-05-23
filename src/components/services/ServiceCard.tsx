import Link from "next/link";
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
  ArrowUpRight,
} from "lucide-react";
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

// Warna per kategori
const categoryStyle: Record<
  string,
  { bg: string; icon: string; dot: string; badge: string }
> = {
  akun: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    icon: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
  },
  keamanan: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    icon: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
  },
  infrastruktur: {
    bg: "bg-violet-50 dark:bg-violet-950/30",
    icon: "text-violet-600 dark:text-violet-400",
    dot: "bg-violet-500",
    badge:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300",
  },
  meeting: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    icon: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
  },
  domain: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    icon: "text-orange-600 dark:text-orange-400",
    dot: "bg-orange-500",
    badge:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300",
  },
  repository: {
    bg: "bg-pink-50 dark:bg-pink-950/30",
    icon: "text-pink-600 dark:text-pink-400",
    dot: "bg-pink-500",
    badge: "bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-300",
  },
  incident: {
    bg: "bg-red-50 dark:bg-red-950/30",
    icon: "text-red-600 dark:text-red-400",
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300",
  },
};

const categoryLabel: Record<string, string> = {
  akun: "Akun",
  keamanan: "Keamanan",
  infrastruktur: "Infrastruktur",
  meeting: "Meeting",
  domain: "Domain",
  repository: "Repository",
  incident: "Insiden",
};

interface ServiceCardProps {
  service: Service;
  className?: string;
  onRequestClick?: (serviceId: string) => void;
}

const ServiceCard = ({
  service,
  className,
  onRequestClick,
}: ServiceCardProps) => {
  const IconComponent = iconMap[service.icon] || HelpCircle;
  const style = categoryStyle[service.category] ?? categoryStyle["akun"];

  const handleClick = (e: React.MouseEvent) => {
    if (onRequestClick) {
      e.preventDefault();
      onRequestClick(service.id);
    }
  };

  return (
    <Link
      href={service.route}
      className="group block h-full"
      onClick={handleClick}
    >
      <div
        className={cn(
          "relative flex h-full flex-col rounded-2xl border bg-white p-5",
          "border-slate-200/80 dark:border-slate-800 dark:bg-slate-900",
          "shadow-sm transition-all duration-300",
          "hover:-translate-y-1 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800",
          className,
        )}
      >
        {/* Top row: icon + badge */}
        <div className="mb-4 flex items-start justify-between">
          {/* Icon */}
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl",
              style.bg,
              "transition-transform duration-300 group-hover:scale-110",
            )}
          >
            <IconComponent className={cn("h-6 w-6", style.icon)} />
          </div>

          {/* Category badge */}
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-semibold",
              style.badge,
            )}
          >
            {categoryLabel[service.category] ?? service.category}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2">
          <h3 className="text-base font-bold leading-snug text-slate-900 dark:text-slate-50 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
            {service.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {service.description}
          </p>
        </div>

        {/* Footer CTA */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <span className="text-xs text-green-600 dark:text-green-400">
              Tersedia
            </span>
          </div>
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400",
              "transition-all duration-200 group-hover:gap-2",
            )}
          >
            Ajukan
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          className={cn(
            "absolute bottom-0 left-0 h-0.5 w-0 rounded-b-2xl transition-all duration-500",
            "bg-gradient-to-r from-blue-600 to-blue-400",
            "group-hover:w-full",
          )}
        />
      </div>
    </Link>
  );
};

export default ServiceCard;
