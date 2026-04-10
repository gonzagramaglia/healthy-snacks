"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function AuthFallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      console.log("Auth code detected at root, redirecting to callback...");
      // We manually construct the callback URL to include the code and any other params
      const params = new URLSearchParams();
      params.set("code", code);
      
      const lang = searchParams.get("lang");
      if (lang) params.set("lang", lang);

      const next = searchParams.get("next");
      if (next) params.set("next", next);

      router.replace(`/auth/callback?${params.toString()}`);
    }
  }, [code, searchParams, router]);

  return null;
}
