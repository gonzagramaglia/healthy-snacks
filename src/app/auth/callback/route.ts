import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const lang = searchParams.get("lang") || "es";
  const next = searchParams.get("next") || (lang === "en" ? "/en" : "/");

  if (code) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && user?.email) {
      // Sync with customers table
      const adminSupabase = createAdminClient();
      
      // Check if customer exists
      const { data: customer } = await adminSupabase
        .from("customers")
        .select("id, username, name, is_verified")
        .eq("email", user.email.toLowerCase())
        .maybeSingle();

      if (!customer) {
        // Create new customer record
        const baseUsername = user.user_metadata.full_name 
          ? user.user_metadata.full_name.toLowerCase().replace(/\s+/g, "")
          : user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
        
        const username = `${baseUsername}${Math.floor(Math.random() * 1000)}`;

        await adminSupabase.from("customers").insert({
          name: user.user_metadata.full_name || user.email.split("@")[0],
          email: user.email.toLowerCase(),
          username: username,
          is_verified: true,
          purchases_count: 0,
        });

        const prefix = lang === "en" ? "/en/u/" : "/u/";
        return NextResponse.redirect(new URL(`${prefix}${username}`, request.url));
      } else {
        // Update existing record if not verified or name is missing
        if (!customer.is_verified || !customer.name) {
          await adminSupabase
            .from("customers")
            .update({
              is_verified: true,
              name: customer.name || user.user_metadata.full_name || user.email.split("@")[0]
            })
            .eq("id", customer.id);
        }

        // Redirect to existing profile
        const prefix = lang === "en" ? "/en/u/" : "/u/";
        return NextResponse.redirect(new URL(`${prefix}${customer.username}`, request.url));
      }
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
