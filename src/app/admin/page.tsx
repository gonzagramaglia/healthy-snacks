"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!adminPass) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Logged in as: gonza@moovimiento.com
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              window.localStorage.removeItem("admin_password");
              router.push("/admin/login");
            }}
          >
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/discount-codes">
            <Card className="h-full cursor-pointer hover:bg-accent transition border-primary/20">
              <CardHeader>
                <CardTitle>🎫 Administrar Códigos de Descuento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Creá, editá y gestioná códigos promocionales para tus clientes (ej: OFF10).
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/customer-benefits">
            <Card className="h-full cursor-pointer hover:bg-accent transition border-primary/20">
              <CardHeader>
                <CardTitle>⭐ Administrar Beneficios (Cupones)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Gestioná la fidelidad de tus clientes: editá sus puntos y tarjetas de compras.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
