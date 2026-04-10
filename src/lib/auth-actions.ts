"use client";

import { createClient } from "./supabase/client";

export async function signInWithGoogle(lang: string = "es") {
  const supabase = createClient();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
  
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${baseUrl}/auth/callback?lang=${lang}`,
    },
  });

  if (error) {
    console.error("Error signing in with Google:", error.message);
    throw error;
  }
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}
