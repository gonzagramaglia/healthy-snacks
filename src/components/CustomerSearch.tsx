"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Language } from "@/lib/dictionary";
import { User, ArrowRight, Mail, UserCircle } from "lucide-react";
import { toast } from "sonner";

export function CustomerSearch({ lang }: { lang: Language }) {
  const [showSurpriseInfo, setShowSurpriseInfo] = useState(false);
  const surpriseInfoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [username, setUsername] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const shouldOpenRegister = searchParams.get("register") === "1";
    if (shouldOpenRegister) {
      setShowRegister(true);
    }
  }, [searchParams]);

  useEffect(() => {
    return () => {
      if (surpriseInfoTimerRef.current)
        clearTimeout(surpriseInfoTimerRef.current);
    };
  }, []);

  const handleSurpriseInfoClick = () => {
    setShowSurpriseInfo(true);
    if (surpriseInfoTimerRef.current)
      clearTimeout(surpriseInfoTimerRef.current);
    surpriseInfoTimerRef.current = setTimeout(() => {
      setShowSurpriseInfo(false);
    }, 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      const prefix = lang === "en" ? "/en/u/" : "/u/";
      router.push(`${prefix}${username.trim().toLowerCase()}`);
    }
  };

  const [isReserving, setIsReserving] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !registerName.trim() ||
      !registerUsername.trim() ||
      !registerEmail.trim()
    )
      return;

    setIsReserving(true);
    try {
      const response = await fetch("/api/reserve-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName,
          username: registerUsername,
          email: registerEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Ocurrió un error inesperado.");
      } else {
        toast.success(
          lang === "es"
            ? "¡Revisá tu correo para confirmar!"
            : "Check your email to confirm!",
        );
        setShowRegister(false);
        setRegisterName("");
        setRegisterUsername("");
        setRegisterEmail("");
      }
    } catch {
      toast.error("Error al conectar con el servidor.");
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-6 pb-6 pt-2 md:pb-12 md:pt-4">
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden text-left flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8 group">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

        <div className="relative z-10 flex-1 space-y-3">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-center md:text-left">
            {lang === "es" ? (
              <>
                Beneficios para
                <span className="block md:inline"> clientes habituales</span>
              </>
            ) : (
              "Benefits for regular customers"
            )}
          </h3>
          <p className="text-muted-foreground text-sm max-w-xl text-center md:text-left">
            {lang === "es" ? (
              <>
                Ingresá tu usuario para ver tu progreso
                <span className="block md:inline">
                  {" "}
                  hacia los próximos regalos
                </span>
              </>
            ) : (
              <>
                Enter your username to see your progress
                <span className="block md:inline">
                  {" "}
                  toward upcoming rewards
                </span>
              </>
            )}
          </p>

          <div className="text-xs text-foreground/80 max-w-xl bg-background/60 border border-primary/15 rounded-xl px-3 py-3">
            {lang === "es" ? (
              <>
                <p className="text-center md:text-left">
                  <strong>
                    🎟️ Cada compra de 1, 2, 3 o 4 Mixes suma pasos
                  </strong>{" "}
                  <span className="md:hidden">
                    ¡Al llegar a la meta, vas a poder canjear tu cupón por 1 Mix
                    gratuito!
                  </span>
                  <span className="hidden md:inline">
                    ¡Al llegar a la meta (10), vas a poder canjear tu cupón por
                    1 Mix gratuito y otra sorpresa! 🎁
                  </span>
                  <span className="relative hidden md:inline-flex align-middle ml-1 group/info select-none cursor-default">
                    <span
                      onClick={handleSurpriseInfoClick}
                      className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-primary/40 text-[10px] font-bold text-primary select-none cursor-default"
                    >
                      ?
                    </span>
                    <span
                      className={`pointer-events-none absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 z-20 w-64 rounded-md border border-primary/20 bg-background px-2 py-1.5 text-[11px] font-medium text-primary text-center shadow-md transition-opacity duration-150 select-none cursor-default ${showSurpriseInfo ? "opacity-100" : "opacity-0 group-hover/info:opacity-100"}`}
                    >
                      Puede incluir descuentos en próximas compras o en locales
                      adheridos
                    </span>
                  </span>
                </p>
                {showRegister && (
                  <div className="hidden md:block">
                    <div className="bg-background/60 border border-primary/15 rounded-xl px-3 py-3 mt-4">
                      <p className="text-[11px] text-muted-foreground font-bold mb-2 text-center md:text-left">
                        {lang === "es"
                          ? "Ejemplo de progreso (7/10):"
                          : "Progress example (7/10):"}
                      </p>
                      <div className="grid grid-cols-10 gap-1.5">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-6 rounded-md border text-[10px] flex items-center justify-center font-bold ${
                              i < 7
                                ? "bg-primary border-primary text-primary-foreground"
                                : "border-dashed border-muted-foreground/30 text-muted-foreground/50 bg-muted/40"
                            }`}
                          >
                            {i === 9 ? "🎁" : i + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="text-center md:text-left">
                  <strong>
                    🎟️ Every purchase of 1, 2, 3, or 4 mixes adds steps
                  </strong>
                  <span className="md:hidden">
                    . Once you hit the goal, you can redeem your coupon for 1
                    free Mix!
                  </span>
                  <span className="hidden md:inline">
                    . Once you hit the goal (10), you can redeem your coupon for
                    1 free Mix and an extra surprise! 🎁
                  </span>
                  <span className="relative hidden md:inline-flex align-middle ml-1 group/info select-none cursor-default">
                    <span
                      onClick={handleSurpriseInfoClick}
                      className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-primary/40 text-[10px] font-bold text-primary select-none cursor-default"
                    >
                      ?
                    </span>
                    <span
                      className={`pointer-events-none absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 z-20 w-64 rounded-md border border-primary/20 bg-background px-2 py-1.5 text-[11px] font-medium text-primary text-center shadow-md transition-opacity duration-150 select-none cursor-default ${showSurpriseInfo ? "opacity-100" : "opacity-0 group-hover/info:opacity-100"}`}
                    >
                      It may include discounts for future purchases or partner
                      stores
                    </span>
                  </span>
                </p>
                {showRegister && (
                  <>
                    <p className="text-[11px] text-muted-foreground font-bold mt-2 mb-2 text-center md:text-left">
                      Progress example (7/10):
                    </p>
                    <div className="grid grid-cols-10 gap-1.5">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-6 rounded-md border text-[10px] flex items-center justify-center font-bold ${
                            i < 7
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-dashed border-muted-foreground/30 text-muted-foreground/50 bg-muted/40"
                          }`}
                        >
                          {i === 9 ? "🎁" : i + 1}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {!showRegister ? (
          <form
            onSubmit={handleSubmit}
            className="relative z-10 w-full lg:w-[360px] space-y-3 mt-1"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <User className="w-5 h-5 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={
                    lang === "es" ? "Tu usuario..." : "Your username..."
                  }
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border-2 border-primary/10 focus:border-primary/50 focus:outline-none transition-all duration-300 shadow-inner"
                />
              </div>
              <button
                type="submit"
                title={lang === "es" ? "Ver beneficios" : "See benefits"}
                className="bg-primary text-primary-foreground p-3.5 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-primary/20 cursor-pointer"
              >
                <ArrowRight className="w-6 h-6 stroke-[2.5px]" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                const prefix = lang === "en" ? "/en/u/" : "/u/";
                router.push(`${prefix}?register=1`);
                setShowRegister(true);
              }}
              className="text-xs text-primary hover:underline cursor-pointer w-full text-center md:text-left md:ml-4"
            >
              {lang === "es"
                ? "¿Todavía no tenés usuario? Crealo ahora"
                : "Don't have a user yet? Create it now"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleRegisterSubmit}
            className="relative z-10 w-full lg:w-[360px] space-y-3 self-center lg:self-center"
          >
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <UserCircle
                  className="w-5 h-5 text-muted-foreground/50 transition-colors"
                  id="register-name-icon"
                />
              </div>
              <input
                type="text"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                placeholder={lang === "es" ? "Nombre" : "Name"}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-card border-2 border-primary/10 focus:border-primary/50 focus:outline-none transition-all duration-300 shadow-inner"
                onFocus={() => {
                  const icon = document.getElementById("register-name-icon");
                  if (icon) icon.classList.add("text-primary");
                }}
                onBlur={() => {
                  const icon = document.getElementById("register-name-icon");
                  if (icon) icon.classList.remove("text-primary");
                }}
              />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <User
                  className="w-5 h-5 text-muted-foreground/50 transition-colors"
                  id="register-username-icon"
                />
              </div>
              <input
                type="text"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                placeholder={
                  lang === "es" ? "Usuario a reservar" : "Username to reserve"
                }
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-card border-2 border-primary/10 focus:border-primary/50 focus:outline-none transition-all duration-300 shadow-inner"
                onFocus={() => {
                  const icon = document.getElementById(
                    "register-username-icon",
                  );
                  if (icon) icon.classList.add("text-primary");
                }}
                onBlur={() => {
                  const icon = document.getElementById(
                    "register-username-icon",
                  );
                  if (icon) icon.classList.remove("text-primary");
                }}
              />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Mail
                  className="w-4 h-4 text-muted-foreground/50 transition-colors"
                  id="register-email-icon"
                />
              </div>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder={lang === "es" ? "Mail" : "Email"}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-card border-2 border-primary/10 focus:border-primary/50 focus:outline-none transition-all duration-300 shadow-inner"
                onFocus={() => {
                  const icon = document.getElementById("register-email-icon");
                  if (icon) icon.classList.add("text-primary");
                }}
                onBlur={() => {
                  const icon = document.getElementById("register-email-icon");
                  if (icon) icon.classList.remove("text-primary");
                }}
              />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-2">
              <button
                type="submit"
                disabled={
                  !registerName.trim() ||
                  !registerUsername.trim() ||
                  !registerEmail.trim() ||
                  isReserving
                }
                className={`px-4 py-2.5 rounded-xl transition-all duration-300 ${
                  !registerName.trim() ||
                  !registerUsername.trim() ||
                  !registerEmail.trim() ||
                  isReserving
                    ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                    : "bg-primary text-primary-foreground hover:scale-[1.02] active:scale-95 cursor-pointer"
                }`}
              >
                {isReserving
                  ? lang === "es"
                    ? "Enviando..."
                    : "Sending..."
                  : lang === "es"
                    ? "Reservar usuario"
                    : "Reserve username"}
              </button>
              <button
                type="button"
                onClick={() => setShowRegister(false)}
                className="text-xs text-muted-foreground hover:underline cursor-pointer"
              >
                {lang === "es" ? "Ya tengo usuario" : "I already have a user"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
