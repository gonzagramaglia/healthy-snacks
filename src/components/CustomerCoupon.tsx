"use client";

import { useState } from "react";
import { CustomerPurchase } from "@/lib/customers";
import { dictionary, Language } from "@/lib/dictionary";
import { Check } from "lucide-react";
import Link from "next/link";

export function CustomerCoupon({
  data,
  lang,
}: {
  data: CustomerPurchase;
  lang: Language;
}) {
  const t = dictionary[lang];
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const totalSlots = 10;
  const progress = Math.min(data.purchasesCount, totalSlots);
  const isFull = progress >= totalSlots;

  const handleSlotClick = (i: number) => {
    // If it's a future slot (next purchase), we scroll to the builder
    if (i >= progress) {
      const el = document.getElementById("mix-builder");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
    
    if (i < progress) {
      setActiveSlot(i);
      setTimeout(() => setActiveSlot(null), 1500);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-6 pb-5 pt-2 md:pb-9 md:pt-4">
      <div className="bg-card border-2 border-primary/20 rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden group">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <h2 className="text-3xl font-bold tracking-tight">
                {lang === "es" ? "¡Hola," : "Hi,"}{" "}
                <span className="text-primary">{data.name.split(" ")[0]}</span>! 👋
              </h2>
              {data.isVerified && (
                <div
                  className="flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full text-white cursor-help transform transition-transform hover:scale-110"
                  title={
                    lang === "es" ? "Cliente verificado" : "Verified customer"
                  }
                >
                  <Check className="w-3 h-3 stroke-[4px]" />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold opacity-90">
                {t.coupon_title}
              </h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto md:mx-0 whitespace-pre-line">
                {t.coupon_subtitle}
              </p>
            </div>
            <div className="pt-2">
              <p className="text-[10px] md:text-xs text-muted-foreground/60 uppercase tracking-wider font-medium">
                {t.coupon_last_updated.replace(
                  "{date}",
                  new Date(data.lastUpdated).toLocaleDateString(
                    lang === "es" ? "es-AR" : "en-US",
                    { day: "numeric", month: "long" },
                  ),
                )}
              </p>
              <div className="mt-2 text-center md:text-left">
                <Link
                  href={lang === "en" ? "/en/u/" : "/u/"}
                  className="text-[10px] md:text-xs text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors hover:underline"
                >
                  {t.coupon_not_user.replace("{name}", data.name.split(" ")[0])}{" "}
                  {t.coupon_not_user_action}
                </Link>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md">
            <div className="grid grid-cols-5 gap-3">
              {Array.from({ length: totalSlots }).map((_, i) => {
                const isUnlocked = i < progress;
                const isNext = i === progress && !isFull;
                const dateValue = data.purchaseDates?.[i] || "";
                const hasDate = dateValue.trim() !== "";
                
                return (
                  <div
                    key={i}
                    onClick={() => handleSlotClick(i)}
                    className={`
                      aspect-square rounded-xl md:rounded-2xl border-2 flex items-center justify-center relative transition-all duration-300 group/slot cursor-pointer
                      ${isUnlocked
                        ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "border-dashed border-muted-foreground/30 bg-muted/50"
                      }
                      ${isNext ? "animate-pulse border-primary/50 ring-4 ring-primary/5" : ""}
                    `}
                  >
                    <div className="flex items-center justify-center w-full h-full relative">
                      {isUnlocked ? (
                         <div className="relative w-full h-full flex items-center justify-center">
                            {/* Checkmark hidden on hover if date exists */}
                            <Check
                              className={`
                                w-5 h-5 md:w-6 md:h-6 stroke-[3px] transition-opacity duration-300
                                ${hasDate ? "group-hover/slot:opacity-0" : "opacity-100"}
                                ${activeSlot === i ? "opacity-0" : ""}
                              `}
                            />
                            {/* Date shown on hover or if slot is active */}
                            <span
                              className={`
                                absolute inset-0 flex items-center justify-center text-[10px] md:text-sm font-black tracking-tighter transition-all duration-300
                                ${hasDate ? "opacity-0 group-hover/slot:opacity-100 group-hover/slot:scale-110" : "hidden"}
                                ${activeSlot === i ? "!opacity-100 !scale-110" : ""}
                              `}
                            >
                              {dateValue}
                            </span>
                         </div>
                      ) : (
                         <div className="flex items-center justify-center relative w-full h-full">
                           <span className={`text-sm md:text-base font-black transition-opacity duration-300 ${isNext ? "text-primary opacity-60 group-hover/slot:opacity-0" : "text-muted-foreground/20"}`}>
                             {i + 1}
                           </span>
                           {isNext && (
                              <span className="absolute inset-0 flex items-center justify-center text-[9px] md:text-xs font-black uppercase tracking-widest text-primary opacity-0 group-hover/slot:opacity-100 transition-opacity">
                                 {lang === "es" ? "NUEVO" : "NEW"}
                              </span>
                           )}
                         </div>
                      )}
                    </div>

                    {/* FREE badge on Slot 10 */}
                    {i === 9 && (
                      <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[7px] md:text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md border border-white dark:border-zinc-900">
                        FREE
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 text-center">
              <p
                className={`text-xs md:text-sm font-black uppercase tracking-tighter ${isFull ? "text-green-500 animate-bounce" : "text-primary opacity-80"}`}
              >
                {isFull
                  ? t.coupon_status_full
                  : t.coupon_status_regular.replace(
                      "{count}",
                      progress.toString(),
                    )}
              </p>
            </div>
          </div>
        </div>

        {/* Redemption Code Section */}
        {!isFull && (
          <div className="mt-6 bg-card border border-primary/10 rounded-2xl p-6 shadow-sm">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-3 text-muted-foreground">
              {t.loyalty_code_label}
            </h4>
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);
                const code = formData.get("code") as string;
                
                if (!code) return;

                const btn = form.querySelector("button");
                if (btn) btn.disabled = true;

                try {
                  const res = await fetch("/api/loyalty-codes/redeem", {
                    method: "POST",
                    body: JSON.stringify({ code, customerId: data.id }),
                    headers: { "Content-Type": "application/json" },
                  });

                  const result = await res.json();
                  
                  if (result.success) {
                     const msg = t.loyalty_code_success.replace("{steps}", result.stepsAdded.toString());
                     alert(msg);
                     window.location.reload();
                  } else {
                     alert(result.error || t.loyalty_code_error);
                  }
                } catch {
                  alert(t.loyalty_code_error);
                } finally {
                  if (btn) btn.disabled = false;
                }
              }}
              className="flex gap-2"
            >
              <input
                name="code"
                type="text"
                placeholder={t.loyalty_code_placeholder}
                className="flex-1 bg-muted/50 border border-primary/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase font-mono"
                required
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {t.loyalty_code_button}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
