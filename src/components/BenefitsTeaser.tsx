"use client";

import { useRouter } from "next/navigation";
import { Language } from "@/lib/dictionary";
import { ArrowRight } from "lucide-react";

export function BenefitsTeaser({ lang }: { lang: Language }) {
  const router = useRouter();

  return (
    <section className="mx-auto max-w-5xl px-6 pb-6 pt-2 md:pb-12 md:pt-4">
      <button
        type="button"
        onClick={() => router.push(lang === "en" ? "/en/u" : "/u")}
        className="w-full bg-gradient-to-r from-red-500/10 via-primary/10 to-green-500/10 border-2 border-primary/30 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden text-left group hover:border-primary/60 transition-all duration-300 cursor-pointer"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {lang === "es"
                ? "🎄 Se adelantó la Navidad: hay regalos 🎁"
                : "🎄 Christmas came early: gifts are here 🎁"}
            </h3>
            <p className="text-foreground/80 text-sm md:text-base mt-1 font-semibold">
              {lang === "es"
                ? "Entrá y descubrí tu beneficio ✨"
                : "Enter and unlock your benefit ✨"}
            </p>
          </div>
          <div className="shrink-0 rounded-full bg-primary text-primary-foreground p-3 md:p-4 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
            <ArrowRight className="w-7 h-7 md:w-8 md:h-8" />
          </div>
        </div>
      </button>
    </section>
  );
}
