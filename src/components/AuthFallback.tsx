"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function AuthFallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      const url = new URL(window.location.href);
      url.pathname = "/auth/callback";
      window.location.href = url.toString();
    }
  }, [code]);

  return null;
}
