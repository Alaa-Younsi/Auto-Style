import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/theme/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg text-muted hover:text-ink hover:bg-line/40 transition-colors"
      aria-label={theme === "dark" ? "Mode clair" : "Mode sombre"}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
