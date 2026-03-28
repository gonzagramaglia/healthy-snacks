"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { LogOut, Ticket, Star, ShieldCheck, ArrowRight } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [adminPass, setAdminPass] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedPass = window.localStorage.getItem("admin_password") || "";
      if (!storedPass) {
        router.push("/admin/login");
        return;
      }

      try {
        const res = await fetch("/api/admin/orders", {
          headers: { "x-admin-password": storedPass },
        });
        if (!res.ok) {
          window.localStorage.removeItem("admin_password");
          router.push("/admin/login");
          return;
        }
      } catch {
        router.push("/admin/login");
        return;
      }

      setAdminPass(storedPass);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
        <div className="relative">
          {/* Animated Background Rings */}
          <div className="absolute inset-0 -m-8 rounded-full border-2 border-primary/20 animate-ping duration-[3s]" />
          <div className="absolute inset-0 -m-4 rounded-full border-2 border-primary/10 animate-pulse duration-[2s]" />
          
          {/* Central Logo Placeholder/Icon */}
          <div className="relative bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-primary/20 backdrop-blur-sm shadow-xl shadow-primary/5">
             <ShieldCheck className="w-8 h-8 text-primary animate-bounce duration-[2s]" />
          </div>
        </div>
        
        <div className="mt-12 space-y-2 text-center">
          <h2 className="text-xl font-black uppercase tracking-widest text-foreground animate-pulse">
            Verificando Acceso
          </h2>
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  if (!adminPass) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505]">
      <div className="max-w-6xl mx-auto py-12 px-6 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tight text-foreground">
              Panel de <span className="text-primary">Control</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium opacity-80">
              Bienvenido de nuevo, <span className="text-foreground font-bold">gonza@moovimiento.com</span>
            </p>
          </div>
          <Button
            variant="ghost"
            className="rounded-xl border-2 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all font-bold gap-2 pr-4"
            onClick={() => {
              window.localStorage.removeItem("admin_password");
              router.push("/admin/login");
            }}
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/admin/discount-codes" className="group">
            <Card className="h-full rounded-[2rem] border-2 border-primary/5 bg-white dark:bg-black hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                <Ticket className="w-32 h-32" />
              </div>
              
              <CardHeader className="pt-10 px-10">
                 <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <Ticket className="w-6 h-6 text-primary" />
                 </div>
                <CardTitle className="text-3xl font-black tracking-tight group-hover:text-primary transition-colors">
                  Códigos de Descuento
                </CardTitle>
              </CardHeader>
              <CardContent className="px-10 pb-10">
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Creá y gestioná cupones promocionales (ej: <span className="text-foreground font-bold font-mono">OFF10</span>) para campañas de marketing.
                </p>
                <div className="flex items-center gap-2 text-primary font-bold">
                  Gestionar <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/customer-benefits" className="group">
            <Card className="h-full rounded-[2rem] border-2 border-primary/5 bg-white dark:bg-black hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                <Star className="w-32 h-32" />
              </div>

               <CardHeader className="pt-10 px-10">
                 <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <Star className="w-6 h-6 text-primary" />
                 </div>
                <CardTitle className="text-3xl font-black tracking-tight group-hover:text-primary transition-colors">
                  Gestión de Beneficios
                </CardTitle>
              </CardHeader>
              <CardContent className="px-10 pb-10">
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Fidelizá a tus clientes gestionando el programa de puntos, <span className="text-foreground font-bold">verificaciones</span> y tarjetas de compras.
                </p>
                <div className="flex items-center gap-2 text-primary font-bold">
                  Configurar Beneficios <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
