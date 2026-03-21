"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedPass = window.localStorage.getItem("admin_password") || "";
      if (!storedPass) {
        setCheckingAuth(false);
        return;
      }

      try {
        const res = await fetch("/api/admin/orders", {
          headers: { "x-admin-password": storedPass },
        });
        if (res.ok) {
          router.push("/admin");
          return;
        }
      } catch {
        // ignore and show login
      }

      window.localStorage.removeItem("admin_password");
      setCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/orders", {
        headers: { "x-admin-password": password },
      });

      if (!res.ok) {
        setError("Invalid password");
        return;
      }

      window.localStorage.setItem("admin_password", password);
      router.push("/admin");
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex justify-center">
          <Link
            href="/en"
            aria-label="Go to home"
            className="relative h-12 w-12 cursor-pointer"
          >
            <Image
              src="/moovimiento.png"
              alt="Moovimiento"
              fill
              className="block dark:hidden object-contain"
              priority
            />
            <Image
              src="/moovimiento-white.png"
              alt="Moovimiento"
              fill
              className="hidden dark:block object-contain"
              priority
            />
          </Link>
        </div>

        <Card className="w-full">
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-200 p-3 rounded text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handlePasswordSignIn} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value="gonza@moovimiento.com"
                  readOnly
                  placeholder="admin@moovimiento.com"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
