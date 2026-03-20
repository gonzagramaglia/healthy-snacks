"use client";

import { usePathname, useRouter } from "next/navigation";
import { Language } from "@/lib/dictionary";

interface LanguageToggleProps {
  currentLang: Language;
}

export function LanguageToggle({ currentLang }: LanguageToggleProps) {
  const router = useRouter();
  const pathname = usePathname();

  function toSpanishPath() {
    if (!pathname) return "/";
    if (pathname === "/en") return "/";
    if (pathname.startsWith("/en/")) {
      const next = pathname.replace(/^\/en/, "");
      return next || "/";
    }
    return pathname;
  }

  function toEnglishPath() {
    if (!pathname || pathname === "/") return "/en";
    if (pathname === "/en" || pathname.startsWith("/en/")) return pathname;
    return `/en${pathname}`;
  }

  return (
    <div className="flex items-center bg-muted/50 border rounded-md p-0.5 h-9">
      <button
        onClick={() => currentLang !== "es" && router.push(toSpanishPath())}
        aria-label="Cambiar a Español"
        className={`flex items-center justify-center px-2.5 h-full rounded-sm text-[10px] font-bold transition-all duration-200 ${
          currentLang === "es"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground cursor-pointer"
        }`}
      >
        ES
      </button>
      <button
        onClick={() => currentLang !== "en" && router.push(toEnglishPath())}
        aria-label="Switch to English"
        className={`flex items-center justify-center px-2.5 h-full rounded-sm text-[10px] font-bold transition-all duration-200 ${
          currentLang === "en"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground cursor-pointer"
        }`}
      >
        EN
      </button>
    </div>
  );
}
