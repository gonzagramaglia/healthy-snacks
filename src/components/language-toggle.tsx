"use client";

import { usePathname, useRouter } from "next/navigation";
import { Language } from "@/lib/dictionary";

interface LanguageToggleProps {
  currentLang: Language;
  onLanguageChange?: (lang: Language) => void;
}

export function LanguageToggle({ currentLang, onLanguageChange }: LanguageToggleProps) {
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
    const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
    return `/en${path}`;
  }

  const handleLangChange = (newLang: Language) => {
    if (newLang === currentLang) return;
    
    if (onLanguageChange) {
      onLanguageChange(newLang);
    } else {
      if (newLang === "es") router.push(toSpanishPath());
      else router.push(toEnglishPath());
    }
  };

  return (
    <div className="flex items-center bg-muted/50 border rounded-md p-0.5 h-9 shrink-0 gap-0.5">
      <button
        onClick={() => handleLangChange("es")}
        aria-label="Cambiar a Español"
        className={`flex items-center justify-center px-2.5 h-full rounded-sm text-[10px] font-black tracking-tighter transition-all duration-200 ${
          currentLang === "es"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground cursor-pointer"
        }`}
      >
        ES
      </button>
      <button
        onClick={() => handleLangChange("en")}
        aria-label="Switch to English"
        className={`flex items-center justify-center px-2.5 h-full rounded-sm text-[10px] font-black tracking-tighter transition-all duration-200 ${
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
