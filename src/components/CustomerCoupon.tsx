"use client";

import { CustomerPurchase } from "@/lib/customers";
import { dictionary, Language } from "@/lib/dictionary";
import { Check } from "lucide-react";
import Link from "next/link";

export function CustomerCoupon({ data, lang }: { data: CustomerPurchase, lang: Language }) {
    const t = dictionary[lang];
    const totalSlots = 10;
    const progress = Math.min(data.purchasesCount, totalSlots);
    const isFull = progress >= totalSlots;

    return (
        <section className="mx-auto max-w-5xl px-6 pb-5 pt-1 md:pb-9 md:pt-2">
            <div className="bg-card border-2 border-primary/20 rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden group">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                    <div className="space-y-4 text-center md:text-left flex-1">
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                            <h2 className="text-3xl font-bold tracking-tight">
                                {lang === 'es' ? '¡Hola,' : 'Hi,'} <span className="text-primary">{data.customerName}</span>! 👋
                            </h2>
                            {data.isVerified && (
                                <div
                                    className="flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full text-white cursor-help transform transition-transform hover:scale-110"
                                    title={lang === 'es' ? "Cliente verificado" : "Verified customer"}
                                >
                                    <Check className="w-3 h-3 stroke-[4px]" />
                                </div>
                            )}
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-semibold opacity-90">{t.coupon_title}</h3>
                            <p className="text-muted-foreground text-sm max-w-md mx-auto md:mx-0 whitespace-pre-line">
                                {t.coupon_subtitle}
                            </p>
                        </div>
                        <div className="pt-2">
                            <p className="text-[10px] md:text-xs text-muted-foreground/60 uppercase tracking-wider font-medium">
                                {t.coupon_last_updated.replace('{date}', new Date(data.lastUpdated).toLocaleString(lang === 'es' ? 'es-AR' : 'en-US', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', hour12: true }))}
                            </p>
                            <div className="mt-2">
                                <Link href="/" className="text-[10px] md:text-xs text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors hover:underline">
                                    {t.coupon_not_user.replace('{name}', data.customerName)} {t.coupon_not_user_action}
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-md">
                        <div className="grid grid-cols-5 gap-3">
                            {Array.from({ length: totalSlots }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`
                                        aspect-square rounded-xl md:rounded-2xl border-2 flex items-center justify-center relative transition-all duration-300
                                        ${i < progress
                                            ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20'
                                            : 'border-dashed border-muted-foreground/30 bg-muted/50'}
                                        ${i === progress && !isFull ? 'animate-pulse border-primary/50' : ''}
                                    `}
                                >
                                    {i < progress ? (
                                        <Check className="w-5 h-5 md:w-6 md:h-6 stroke-[3px]" />
                                    ) : (
                                        <span className="text-muted-foreground/30 font-bold text-sm md:text-base">{i + 1}</span>
                                    )}

                                    {i === 9 && (
                                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                            FREE
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 text-center">
                            <p className={`text-sm font-bold uppercase tracking-tight ${isFull ? 'text-green-500 animate-bounce' : 'text-primary'}`}>
                                {isFull
                                    ? t.coupon_status_full
                                    : t.coupon_status_regular.replace('{count}', progress.toString())}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
