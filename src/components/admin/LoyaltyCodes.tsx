"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Language, dictionary } from "@/lib/dictionary";
import { 
  ArrowLeft, 
  Plus, 
  RefreshCw, 
  Key, 
  CheckCircle2, 
  Circle,
  History
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface LoyaltyCode {
  id: string;
  code: string;
  steps: number;
  is_used: boolean;
  used_by_customer_id: string | null;
  used_at: string | null;
  created_at: string;
}

export function LoyaltyCodes({ lang }: { lang: Language }) {
  const router = useRouter();
  const t = (dictionary[lang] || dictionary["es"]).admin || dictionary["es"].admin;
  const [codes, setCodes] = useState<LoyaltyCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [steps, setSteps] = useState(1);
  const [amount, setAmount] = useState(1);
  const baseUrl = lang === "en" ? "/en/admin" : "/admin";

  const [showGenerator, setShowGenerator] = useState(false);

  const fetchCodes = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/loyalty-codes");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setCodes(data || []);
    } catch (err) {
      console.error("Error fetching codes:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/loyalty-codes", {
        method: "POST",
        body: JSON.stringify({ steps, amount }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        fetchCodes();
      }
    } catch (err) {
      console.error("Error generating codes:", err);
    } finally {
      setGenerating(false);
    }
  }, [fetchCodes, steps, amount]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-foreground font-sans">
      <div className="max-w-6xl mx-auto p-4 md:p-10 pt-12 md:pt-20 space-y-6 md:space-y-12 animate-in fade-in duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-4">
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tight text-foreground uppercase">
              {lang === "es" ? "Códigos" : "Benefit"} <span className="text-primary italic">{lang === "es" ? "Beneficio" : "Codes"}</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium opacity-80 decoration-primary underline-offset-4 decoration-2">
              {lang === "es" ? "Generá y gestioná recompensas instantáneas" : "Generate and manage instant rewards"}
            </p>
          </div>
          
          <div className="flex items-center justify-between gap-4 w-full md:w-auto">
            <Link 
              href={baseUrl}
              className="flex-1 md:flex-none h-11 md:h-12 px-6 gap-2 rounded-xl border-2 border-primary/10 font-black text-xs md:text-sm uppercase tracking-widest hover:bg-muted transition-all flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.admin_panel_link}</span>
            </Link>
            <button
              onClick={() => setShowGenerator(!showGenerator)}
              className="flex-1 md:flex-none h-11 md:h-12 px-6 gap-2 rounded-xl bg-white text-black border-2 border-primary/10 font-black text-xs md:text-sm uppercase tracking-widest hover:bg-muted transition-all flex items-center justify-center cursor-pointer shadow-xl shadow-primary/5"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === "es" ? "Nuevo Código" : "New Code"}</span>
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-md border-2 border-primary/5 rounded-2xl md:rounded-3xl shadow-sm hover:border-primary/20 transition-all duration-300 group">
            <CardContent className="p-4 md:p-8 text-center md:text-left">
              <div className="flex justify-between items-center mb-1 md:mb-3">
                <div className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-widest opacity-50">{lang === "es" ? "Códigos Generados" : "Codes Generated"}</div>
                <Plus className="hidden md:block w-5 h-5 text-primary/30 group-hover:text-primary transition-colors" />
              </div>
              <div className="text-3xl md:text-5xl font-black tracking-tighter">{loading ? "..." : codes.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-md border-2 border-primary/5 rounded-2xl md:rounded-3xl shadow-sm hover:border-primary/20 transition-all duration-300 group">
            <CardContent className="p-4 md:p-8 text-center md:text-left">
              <div className="flex justify-between items-center mb-1 md:mb-3">
                <div className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-widest opacity-50">{lang === "es" ? "Pasos Generados" : "Steps Generated"}</div>
                <Circle className="hidden md:block w-5 h-5 text-primary/30 group-hover:text-primary transition-colors" />
              </div>
              <div className="text-3xl md:text-5xl font-black tracking-tighter text-primary/80">
                {loading ? "..." : codes.reduce((acc, c) => acc + (c.steps || 0), 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-md border-2 border-primary/5 rounded-2xl md:rounded-3xl shadow-sm hover:border-primary/20 transition-all duration-300 group">
            <CardContent className="p-4 md:p-8 text-center md:text-left">
              <div className="flex justify-between items-center mb-1 md:mb-3">
                <div className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-widest opacity-50">{lang === "es" ? "Códigos Usados" : "Codes Used"}</div>
                <CheckCircle2 className="hidden md:block w-5 h-5 text-green-500/30 group-hover:text-green-500 transition-colors" />
              </div>
              <div className="text-3xl md:text-5xl font-black tracking-tighter text-green-500">
                {loading ? "..." : codes.filter(c => c.is_used).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-black/50 backdrop-blur-md border-2 border-primary/5 rounded-2xl md:rounded-3xl shadow-sm hover:border-primary/20 transition-all duration-300 group">
            <CardContent className="p-4 md:p-8 text-center md:text-left">
              <div className="flex justify-between items-center mb-1 md:mb-3">
                <div className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-widest opacity-50">{lang === "es" ? "Pasos Realizados" : "Steps Completed"}</div>
                <History className="hidden md:block w-5 h-5 text-green-500/30 group-hover:text-green-500 transition-colors" />
              </div>
              <div className="text-3xl md:text-5xl font-black tracking-tighter text-green-600">
                {loading ? "..." : codes.filter(c => c.is_used).reduce((acc, c) => acc + (c.steps || 0), 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Card (Generator) */}
        {showGenerator && (
          <Card className="border-2 border-primary/20 rounded-3xl md:rounded-[3rem] shadow-2xl bg-white dark:bg-black overflow-hidden animate-in fade-in slide-in-from-top-8 duration-700">
            <CardContent className="p-6 md:p-12">
              <div className="flex justify-between items-center mb-6 md:mb-10">
                 <h2 className="text-xl md:text-3xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
                  <Plus className="w-6 h-6 text-primary" />
                  {lang === "es" ? "Generar Nuevos" : "Generate New"}
                </h2>
                 <div className="h-1.5 flex-1 mx-4 bg-primary/5 rounded-full" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                <div className="space-y-4">
                  <label className="text-xs md:text-sm font-black uppercase tracking-widest opacity-60">
                    {lang === "es" ? "Pasos por código" : "Steps per code"}
                  </label>
                  <input 
                    type="number" 
                    min="1" 
                    max="10" 
                    value={steps}
                    onChange={(e) => setSteps(parseInt(e.target.value))}
                    className="w-full h-12 md:h-16 text-xl md:text-3xl font-black text-center rounded-2xl border-2 border-primary/10 focus:ring-primary/40 bg-muted/5 tracking-tighter transition-all"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-xs md:text-sm font-black uppercase tracking-widest opacity-60">
                    {lang === "es" ? "Cantidad a generar" : "Qty to generate"}
                  </label>
                  <input 
                    type="number" 
                    min="1" 
                    max="50" 
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    className="w-full h-12 md:h-16 text-xl md:text-3xl font-black text-center rounded-2xl border-2 border-primary/10 focus:ring-primary/40 bg-muted/5 tracking-tighter transition-all"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="w-full h-12 md:h-16 bg-primary text-primary-foreground font-black rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
                  >
                    {generating ? (
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    ) : (
                      <Key className="w-6 h-6" />
                    )}
                    <span className="uppercase tracking-widest text-sm md:text-base">{lang === "es" ? "Generar" : "Generate"}</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* List Section */}
        <div className="space-y-6 md:space-y-10 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-2 md:w-3 h-8 md:h-12 bg-primary rounded-full shadow-lg shadow-primary/20" />
               <h2 className="text-2xl md:text-4xl font-black text-foreground uppercase tracking-tighter">{t.list_title}</h2>
            </div>
            <button 
              onClick={() => { setLoading(true); fetchCodes(); }}
              className="p-3 md:p-4 hover:bg-muted rounded-2xl transition-all active:scale-95 border-2 border-transparent hover:border-primary/20 cursor-pointer"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
          
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="border-2 border-primary/5 rounded-[2rem] overflow-hidden bg-muted/20 animate-pulse h-40 md:h-48" />
              ))}
            </div>
          ) : codes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 md:py-32 border-2 border-dashed border-primary/10 rounded-[2.5rem] md:rounded-[4rem] bg-white/30 dark:bg-black/30 backdrop-blur-sm">
              <Key className="w-16 h-16 md:w-24 md:h-24 text-primary/5 mb-6 animate-bounce duration-[3000ms]" />
              <h3 className="text-2xl md:text-4xl font-black text-foreground mb-3 tracking-tight opacity-40">{t.no_results}</h3>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {codes.map((code) => (
                <Card 
                  key={code.id} 
                  className={`
                    group border-2 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-white dark:bg-black transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5
                    ${code.is_used ? "opacity-60 grayscale border-muted/20" : "border-primary/5"}
                  `}
                >
                  <CardContent className="p-6 md:p-8 space-y-4">
                    <div className="flex justify-between items-start">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50">
                            {lang === "es" ? "CÓDIGO ÚNICO" : "UNIQUE CODE"}
                          </p>
                          <h3 className="text-2xl font-black tracking-tighter text-foreground font-mono uppercase bg-primary/5 px-3 py-1 rounded-xl group-hover:bg-primary/10 transition-colors">
                            {code.code}
                          </h3>
                       </div>
                       {code.is_used ? (
                         <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                            <CheckCircle2 className="w-6 h-6" />
                         </div>
                       ) : (
                         <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary/40">
                            <Circle className="w-6 h-6" />
                         </div>
                       )}
                    </div>

                    <div className="flex items-end justify-between gap-4 pt-2">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50">
                            {lang === "es" ? "PASOS" : "STEPS"}
                          </p>
                          <div className="text-4xl font-black text-primary tracking-tighter">
                            +{code.steps}
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50 mb-1">
                            {lang === "es" ? "CREADO" : "CREATED"}
                          </p>
                          <p className="text-xs font-bold tabular-nums opacity-60">
                            {new Date(code.created_at).toLocaleDateString()}
                          </p>
                       </div>
                    </div>

                    {code.is_used && code.used_at && (
                      <div className="pt-4 mt-4 border-t border-primary/5 text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <History className="w-3 h-3 text-green-500" />
                        {lang === "es" ? "Usado el" : "Used on"} {new Date(code.used_at).toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
