"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
      className="
      rounded-xl
      border
      border-zinc-700
      bg-zinc-900
      p-2
      "
    >
      {theme === "dark"
        ? <Sun size={18} />
        : <Moon size={18} />
      }
    </button>
  );
}