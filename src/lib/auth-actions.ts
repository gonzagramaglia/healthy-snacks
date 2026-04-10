"use client";

import { createClient } from "./supabase/client";

export async function signInWithGoogle(lang: string = "es", next?: string) {
  const supabase = createClient();
  const baseUrl = window.location.origin;
  
  let redirectUrl = `${baseUrl}/auth/callback?lang=${lang}`;
  if (next) {
    redirectUrl += `&next=${encodeURIComponent(next)}`;
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
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
