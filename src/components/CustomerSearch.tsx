"use client";

import { useState } from "react";
import { Language } from "@/lib/dictionary";
import { toast } from "sonner";
import { signInWithGoogle } from "@/lib/auth-actions";

export function CustomerSearch({ lang }: { lang: Language }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle(lang);
    } catch {
      toast.error(lang === "es" ? "Error al iniciar sesión con Google" : "Error signing in with Google");
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-6 pb-6 pt-2 md:pb-12 md:pt-4">
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden text-left flex flex-col-reverse lg:flex-row items-center gap-6 lg:gap-12 group">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

        <div className="relative z-10 w-full lg:w-[320px] bg-background/40 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 space-y-4">
           <div className="flex justify-between items-center border-b border-primary/10 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {lang === "es" ? "Cómo funciona" : "How it works"}
              </span>
           </div>
           <p className="text-xs text-muted-foreground leading-relaxed">
             {lang === "es" ? (
               <span>
                 🎟️ Cada compra suma pasos. Al llegar a 10, ¡tenés un Mix gratuito y 10% de descuento!<span className="hidden md:inline"> 🎁</span>
               </span>
             ) : (
               <span>
                 🎟️ Every purchase adds steps. Reach 10 and get a free Mix and 10% off!<span className="hidden md:inline"> 🎁</span>
               </span>
             )}
           </p>
           <div className="grid grid-cols-5 gap-1.5 pt-1">
             {Array.from({ length: 10 }).map((_, i) => (
               <div
                 key={i}
                 className={`h-8 rounded-lg border text-[10px] flex items-center justify-center font-bold ${
                   i < 7
                     ? "bg-primary/20 border-primary/30 text-primary"
                     : "border-dashed border-muted-foreground/30 text-muted-foreground/30 bg-muted/20"
                 }`}
               >
                 {i === 9 ? "🎁" : i + 1}
               </div>
             ))}
           </div>
           <p className="text-[10px] text-center text-muted-foreground italic">
             {lang === "es" ? "Ejemplo de progreso (7/10)" : "Progress example (7/10)"}
           </p>
        </div>

        <div className="relative z-10 flex-1 space-y-4">
          <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-center md:text-left">
            {lang === "es" ? (
              <>
                Beneficios para
                <span className="text-primary"> clientes habituales</span>
              </>
            ) : (
              <>
                Benefits for
                <span className="text-primary"> regular customers</span>
              </>
            )}
          </h3>
          <p className="text-muted-foreground text-base max-w-xl text-center md:text-left">
            {lang === "es" ? (
              "Iniciá sesión para ver tu progreso y canjear tus premios acumulados."
            ) : (
              "Sign in to see your progress and redeem your accumulated rewards."
            )}
          </p>

          <div className="flex flex-col md:flex-row items-center md:items-stretch gap-4 pt-2">
            <button
              onClick={handleGoogleLogin}
              disabled={true}
              className="group relative flex items-center justify-center gap-3 bg-white text-black font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-black/5 border border-black/10 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0 w-full max-w-[300px] md:max-w-none md:w-auto"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>{lang === "es" ? "Ingresar con Google" : "Sign in with Google"}</span>
            </button>
            <div className="bg-primary/5 text-primary text-sm px-4 py-3 rounded-xl border border-primary/10 text-center md:text-left flex items-center justify-center w-full max-w-[300px] md:max-w-none md:w-auto">
              <span>
                {lang === "es" 
                  ? "🏖️ Nos estamos tomando un descanso. ¡Volveremos pronto!" 
                  : "🏖️ We're taking a short break. We'll be back soon!"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
