"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Language, dictionary } from "@/lib/dictionary";
import { ArrowLeft, Plus, RefreshCw, Key, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const t = (dictionary[lang] || dictionary["es"]).admin || dictionary["es"].admin;
  const [codes, setCodes] = useState<LoyaltyCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [steps, setSteps] = useState(1);
  const [amount, setAmount] = useState(1);

  const fetchCodes = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/loyalty-codes");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setCodes(data);
      setIsAdmin(true);
    } catch (err) {
      console.error("Error fetching codes:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const handleGenerate = async () => {
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
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t.back}
          </Link>
          <h1 className="text-3xl font-black">{lang === "es" ? "Códigos de Beneficio" : "Loyalty Codes"}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Generator Card */}
        <div className="bg-card border-2 border-primary/20 rounded-3xl p-6 shadow-xl h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            {lang === "es" ? "Generar Códigos" : "Generate Codes"}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold mb-1.5 block">
                {lang === "es" ? "Cant. de pasos (casilleros)" : "Steps (slots)"}
              </label>
              <input 
                type="number" 
                min="1" 
                max="10" 
                value={steps}
                onChange={(e) => setSteps(parseInt(e.target.value))}
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-bold mb-1.5 block">
                {lang === "es" ? "Cant. de códigos a generar" : "Number of codes to generate"}
              </label>
              <input 
                type="number" 
                min="1" 
                max="50" 
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value))}
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2"
              />
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full bg-primary text-primary-foreground font-black py-4 rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {generating ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Key className="w-5 h-5" />
              )}
              {lang === "es" ? "Generar" : "Generate"}
            </button>
          </div>
        </div>

        {/* List Card */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
            <h2 className="font-bold flex items-center gap-2">
               {t.list_title}
            </h2>
            <button 
              onClick={() => { setLoading(true); fetchCodes(); }}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                  <th className="px-6 py-4">{lang === "es" ? "Código" : "Code"}</th>
                  <th className="px-6 py-4">{lang === "es" ? "Pasos" : "Steps"}</th>
                  <th className="px-6 py-4">{lang === "es" ? "Estado" : "Status"}</th>
                  <th className="px-6 py-4">{lang === "es" ? "Creado" : "Created"}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic">
                      {lang === "es" ? "Cargando..." : "Loading..."}
                    </td>
                  </tr>
                ) : codes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic">
                      {t.no_results}
                    </td>
                  </tr>
                ) : (
                  codes.map((code) => (
                    <tr key={code.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-primary">{code.code}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold">{code.steps}</span>
                      </td>
                      <td className="px-6 py-4">
                        {code.is_used ? (
                          <div className="flex items-center gap-1.5 text-green-500 text-xs font-bold uppercase">
                            <CheckCircle2 className="w-4 h-4" />
                            {lang === "es" ? "Usado" : "Used"}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-bold uppercase">
                            <Circle className="w-4 h-4" />
                            {lang === "es" ? "Disponible" : "Available"}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {new Date(code.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
