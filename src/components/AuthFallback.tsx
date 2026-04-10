"use client";

import { useEffect } from "react";

export function AuthFallback() {
  useEffect(() => {
    // We use window.location.search directly for maximum reliability
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      console.log("Auth code detected, redirecting to callback...");
      const url = new URL(window.location.href);
      url.pathname = "/auth/callback";
      // We keep the existing search params (code, etc.)
      window.location.href = url.toString();
    }
  }, []);

  return null;
}
