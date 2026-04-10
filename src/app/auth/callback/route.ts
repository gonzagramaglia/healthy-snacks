import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const lang = searchParams.get("lang") || "es";
  const next = searchParams.get("next") || (lang === "en" ? "/en" : "/");

  console.log("Auth callback triggered", { code: !!code, lang, next });

  if (code) {
    try {
      const cookieStore = await cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
              cookieStore.set({ name, value, ...options });
            },
            remove(name: string, options: CookieOptions) {
              cookieStore.set({ name, value: "", ...options, maxAge: 0 });
            },
          },
        }
      );

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Auth error during code exchange:", error);
        return NextResponse.redirect(new URL(`${next}?error=auth_exchange_failed`, request.url));
      }

      const user = data?.user;

      if (user?.email) {
        console.log("User verified via Google:", user.email);
        
        // Admin client (self-contained)
        const adminSupabase = createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false,
            },
          }
        );
        
        // Check if customer exists
        const { data: customer, error: fetchError } = await adminSupabase
          .from("customers")
          .select("id, username, name, is_verified")
          .eq("email", user.email.toLowerCase())
          .maybeSingle();

        if (fetchError) {
           console.error("Error fetching customer from DB:", fetchError);
        }

        if (!customer) {
          console.log("Creating new customer record for:", user.email);
          const baseUsername = user.user_metadata?.full_name 
            ? user.user_metadata.full_name.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "")
            : user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
          
          const username = `${baseUsername}${Math.floor(Math.random() * 1000)}`;

          const { error: insertError } = await adminSupabase.from("customers").insert({
            name: user.user_metadata?.full_name || user.email.split("@")[0],
            email: user.email.toLowerCase(),
            username: username,
            is_verified: true,
            purchases_count: 0,
          });

          if (insertError) {
            console.error("Error inserting new customer:", insertError);
          }

          const prefix = lang === "en" ? "/en/u/" : "/u/";
          return NextResponse.redirect(new URL(`${prefix}${username}`, request.url));
        } else {
          console.log("Existing customer found:", customer.username);
          // Update existing record if not verified or name is missing
          if (!customer.is_verified || !customer.name) {
            await adminSupabase
              .from("customers")
              .update({
                is_verified: true,
                name: customer.name || user.user_metadata?.full_name || user.email.split("@")[0]
              })
              .eq("id", customer.id);
          }

          const prefix = lang === "en" ? "/en/u/" : "/u/";
          return NextResponse.redirect(new URL(`${prefix}${customer.username}`, request.url));
        }
      }
    } catch (err) {
      console.error("Unexpected error in auth callback:", err);
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
