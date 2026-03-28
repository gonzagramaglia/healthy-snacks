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
    const { name, username, purchases_count, is_verified } = body;

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("customers")
      .insert([
        {
          name,
          username: username.toLowerCase(),
          purchases_count: purchases_count || 0,
          is_verified: is_verified !== undefined ? is_verified : true,
          last_updated: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ customer: data });
  } catch (err) {
    console.error("Error creating customer:", err);
    return NextResponse.json(
      { error: "Error creating customer" },
      { status: 500 },
    );
  }
}
