import { categories } from "@/data/services";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

const CategoryFilter = ({ selected, onChange }: CategoryFilterProps) => {
  return (
    <div className="space-y-3">
      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Button "Semua" - Special styling */}
        <Button
          variant={selected === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onChange("all")}
          className={cn(
            // Base styling
            "group relative overflow-hidden rounded-full px-5 py-2",
            "font-semibold transition-all duration-300",

            // Kondisi ketika ACTIVE
            selected === "all" && [
              "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500",
              "text-white shadow-lg shadow-blue-500/30",
              "border-0",
              "hover:shadow-xl hover:shadow-blue-500/40",
              "dark:shadow-blue-500/20 dark:hover:shadow-blue-500/30",
            ],

            // Kondisi ketika INACTIVE
            selected !== "all" && [
              "border-2 border-slate-200 bg-white text-slate-700",
              "hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700",
              "dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300",
              "dark:hover:border-blue-700 dark:hover:bg-blue-950/30 dark:hover:text-blue-300",
            ],
          )}
        >
          {/* Shine effect saat hover */}
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative flex items-center gap-2">
            {selected === "all" && (
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            )}
            Semua Layanan
          </span>
        </Button>

        {/* Divider visual */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

        {/* Category Pills */}
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selected === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(category.id)}
            className={cn(
              "group relative overflow-hidden rounded-full px-4 py-2",
              "font-medium transition-all duration-300",

              // Kondisi ketika ACTIVE
              selected === category.id && [
                "bg-gradient-to-r from-blue-600 to-blue-500",
                "text-white shadow-md shadow-blue-500/25",
                "border-0",
                "hover:shadow-lg hover:shadow-blue-500/35",
                "dark:shadow-blue-500/15 dark:hover:shadow-blue-500/25",
              ],

              // Kondisi ketika INACTIVE
              selected !== category.id && [
                "border border-slate-200 bg-white/80 text-slate-600",
                "hover:border-blue-200 hover:bg-blue-50/80 hover:text-blue-600",
                "hover:shadow-sm",
                "dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
                "dark:hover:border-blue-700/50 dark:hover:bg-blue-950/20 dark:hover:text-blue-400",
                "backdrop-blur-sm",
              ],
            )}
          >
            {/* Shine effect */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

            <span className="relative flex items-center gap-2">
              {/* Indicator dot untuk active state */}
              {selected === category.id && (
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              )}
              {category.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
