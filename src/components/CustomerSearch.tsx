"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { dictionary, Language } from "@/lib/dictionary";
import { User, ArrowRight } from "lucide-react";

export function CustomerSearch({ lang }: { lang: Language }) {
    const t = dictionary[lang];
    const [name, setName] = useState("");
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            const prefix = lang === 'en' ? '/en/' : '/';
            // We use window.location.assign for a harder refresh or just router
            // router should be fine as it's a dynamic route
            router.push(`${prefix}${name.trim().toLowerCase()}`);
        }
    };

    return (
        <section className="mx-auto max-w-5xl px-6 pb-6 pt-2 md:pb-12 md:pt-4">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center gap-6 justify-between group">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

                <div className="relative z-10 space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight">{t.coupon_search_title}</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto md:mx-0">{t.coupon_search_subtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-xs md:max-w-md">
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <User className="w-5 h-5 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t.coupon_search_placeholder}
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border-2 border-primary/10 focus:border-primary/50 focus:outline-none transition-all duration-300 shadow-inner"
                            />
                        </div>
                        <button
                            type="submit"
                            title={t.coupon_search_button}
                            className="bg-primary text-primary-foreground p-3.5 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-primary/20 cursor-pointer"
                        >
                            <ArrowRight className="w-6 h-6 stroke-[2.5px]" />
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
