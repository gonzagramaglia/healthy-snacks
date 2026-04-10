"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { LogOut, Ticket, Star, ShieldCheck, ArrowRight, Key } from "lucide-react";
import { dictionary, Language } from "@/lib/dictionary";
import { LanguageToggle } from "@/components/language-toggle";

interface AdminHubProps {
  lang: Language;
}

export function AdminHub({ lang }: AdminHubProps) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const baseUrl = lang === "en" ? "/en/admin" : "/admin";

  useEffect(() => {
    // We remember the last language choice in admin
    window.localStorage.setItem("admin_lang", lang);

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/orders");
        if (!res.ok) {
          router.push("/admin/login");
          return;
        }
        setIsAdmin(true);
      } catch {
        router.push("/admin/login");
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, lang]);

  const handleLangChange = (newLang: Language) => {
    if (newLang === lang) return;
    const targetPath = newLang === "en" ? "/en/admin" : "/admin";
    router.push(targetPath);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#050505] z-50">
        <div className="relative">
          <div className="absolute inset-0 -m-8 rounded-full border-2 border-primary/20 animate-ping duration-[3s]" />
          <div className="absolute inset-0 -m-4 rounded-full border-2 border-primary/10 animate-pulse duration-[2s]" />
          <div className="relative bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-primary/20 backdrop-blur-sm shadow-xl shadow-primary/5">
             <ShieldCheck className="w-8 h-8 text-primary animate-bounce duration-[2s]" />
          </div>
        </div>
        <div className="mt-12 space-y-2 text-center">
          <h2 className="text-xl font-black uppercase tracking-widest text-white animate-pulse">
            {lang === "es" ? "Verificando Acceso" : "Verifying Access"}
          </h2>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const t = dictionary[lang].admin;

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="max-w-6xl mx-auto py-12 px-6 md:px-10 pt-12 md:pt-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tight text-white">
              {(t.title || "Admin").split(" ")[0]} <span className="text-primary">{(t.title || "").split(" ").slice(1).join(" ")}</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium opacity-80">
              {t.welcome || "Bienvenido,"} <span className="text-white font-bold">Gonza</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="scale-90 md:scale-100">
               <LanguageToggle currentLang={lang} onLanguageChange={handleLangChange} />
             </div>
             <Button
               variant="ghost"
               className="rounded-xl border-2 border-white/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all font-bold gap-2 pr-4 text-muted-foreground"
               onClick={async () => {
                 const { signOut } = await import("@/lib/auth-actions");
                 await signOut();
                 router.push("/admin/login");
               }}
             >
               <LogOut className="w-4 h-4" />
               <span className="hidden sm:inline">{t.logout || "Salir"}</span>
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link href={`${baseUrl}/discount-codes`} className="group">
            <Card className="h-full rounded-[2rem] border-2 border-primary/5 bg-white/70 dark:bg-black/70 backdrop-blur-md hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                <Ticket className="w-32 h-32" />
              </div>
              <CardHeader className="pt-10 px-10">
                 <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <Ticket className="w-6 h-6 text-primary" />
                 </div>
                <CardTitle className="text-3xl font-black tracking-tight group-hover:text-primary transition-colors">
                  {t.discount_codes}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-10 pb-10">
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  {t.manage_coupons.replace("{code}", "OFF10")}
                </p>
                <div className="flex items-center gap-2 text-primary font-bold">
                  {t.manage} <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href={`${baseUrl}/loyalty-codes`} className="group">
            <Card className="h-full rounded-[2rem] border-2 border-primary/5 bg-white/70 dark:bg-black/70 backdrop-blur-md hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                <Key className="w-32 h-32" />
              </div>
              <CardHeader className="pt-10 px-10">
                 <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <Key className="w-6 h-6 text-primary" />
                 </div>
                <CardTitle className="text-3xl font-black tracking-tight group-hover:text-primary transition-colors">
                  {lang === "es" ? "Códigos Beneficio" : "Loyalty Codes"}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-10 pb-10">
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  {lang === "es" ? "Generá códigos aleatorios para regalar pasos en el cupón de fidelidad." : "Generate random codes to gift steps in the loyalty coupon."}
                </p>
                <div className="flex items-center gap-2 text-primary font-bold">
                  {t.manage} <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href={`${baseUrl}/customer-benefits`} className="group">
            <Card className="h-full rounded-[2rem] border-2 border-primary/5 bg-white/70 dark:bg-black/70 backdrop-blur-md hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                <Star className="w-32 h-32" />
              </div>
               <CardHeader className="pt-10 px-10">
                 <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <Star className="w-6 h-6 text-primary" />
                 </div>
                <CardTitle className="text-3xl font-black tracking-tight group-hover:text-primary transition-colors">
                  {t.customer_benefits}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-10 pb-10">
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  {t.manage_loyalty}
                </p>
                <div className="flex items-center gap-2 text-primary font-bold">
                  {t.configure} <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
