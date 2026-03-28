import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const adminPass = request.headers.get("x-admin-password") || "";
    if (
      !process.env.ADMIN_PASSWORD ||
      adminPass !== process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    const supabase = createAdminClient();
    let dbQuery = supabase
      .from("customers")
      .select("*")
      .order("purchases_count", { ascending: false });

    if (query) {
      dbQuery = dbQuery.or(`name.ilike.%${query}%,username.ilike.%${query}%`);
    }

    const { data, error } = await dbQuery;

    if (error) throw error;

    return NextResponse.json({ customers: data });
  } catch (err) {
    console.error("Error fetching customers:", err);
    return NextResponse.json(
      { error: "Error fetching customers" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminPass = request.headers.get("x-admin-password") || "";
    if (
      !process.env.ADMIN_PASSWORD ||
      adminPass !== process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, username, purchases_count, is_verified, purchase_dates } = body;

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("customers")
      .insert([
        {
          name,
          username: username.toLowerCase(),
          purchases_count: purchases_count || 0,
          is_verified: is_verified !== undefined ? is_verified : true,
          purchase_dates: purchase_dates || [],
          last_updated: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    if (purchases_count > 0) {
      await supabase.from("customer_loyalty_purchases").insert(
        Array.from({ length: purchases_count }).map((_, i) => ({
          customer_id: data.id,
          purchase_date: new Date().toISOString(),
          card_number: Math.floor(i / 10) + 1,
        }))
      );
    }

    return NextResponse.json({ customer: data });
  } catch (err) {
    console.error("Error creating customer:", err);
    return NextResponse.json(
      { error: "Error creating customer" },
      { status: 500 },
    );
  }
}
