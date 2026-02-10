import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({
  value,
  onChange,
  placeholder = "Cari layanan...",
  className,
}: SearchBarProps) => {
  return (
    <div className={cn("relative", className)}>
      {/* Search Icon */}
      <Search className="absolute left-4 top-1/2 h-51 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

      {/* Input Field */}
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          // Base styles
          "h-14 pl-12 pr-12 text-base",
          "rounded-2xl border-2",

          // Colors & Border
          "border-slate-200 bg-white text-slate-900",
          "dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-50",

          // Placeholder
          "placeholder:text-slate-400 dark:placeholder:text-slate-500",

          // Focus state
          "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
          "dark:focus:border-blue-400 dark:focus:ring-blue-400/10",

          // Transitions
          "transition-all duration-300",

          // Shadow
          "shadow-sm hover:shadow-md focus:shadow-lg",
        )}
      />

      {/* Clear Button - Muncul kalau ada value */}
      {value && (
        <button
          onClick={() => onChange("")}
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2",
            "flex h-7 w-7 items-center justify-center rounded-full",
            "bg-slate-100 text-slate-600",
            "hover:bg-slate-200 hover:text-slate-900",
            "dark:bg-slate-800 dark:text-slate-400",
            "dark:hover:bg-slate-700 dark:hover:text-slate-200",
            "transition-all duration-200",
            "hover:scale-110 active:scale-95",
          )}
          aria-label="Hapus pencarian"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
