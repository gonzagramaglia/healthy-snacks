import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isAuthorized(request: NextRequest) {
  const adminPass = request.headers.get("x-admin-password") || "";
  return (
    !!process.env.ADMIN_PASSWORD && adminPass === process.env.ADMIN_PASSWORD
  );
}

export async function GET(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ coupons: data || [] });
  } catch (err) {
    console.error("Error loading coupons:", err);
    return NextResponse.json(
      { error: "Error loading coupons" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const supabase = createAdminClient();

    const payload = {
      code: String(body.code || "")
        .trim()
        .toUpperCase(),
      type: body.type,
      value: Number(body.value || 0),
      max_discount:
        body.max_discount === null || body.max_discount === undefined
          ? null
          : Number(body.max_discount),
      min_subtotal:
        body.min_subtotal === null || body.min_subtotal === undefined
          ? null
          : Number(body.min_subtotal),
      active: Boolean(body.active),
      usage_limit:
        body.usage_limit === null || body.usage_limit === undefined
          ? null
          : Number(body.usage_limit),
      allowed_email: body.allowed_email
        ? String(body.allowed_email).trim()
        : null,
    };

    const { data, error } = await supabase
      .from("coupons")
      .insert([payload])
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ coupon: data });
  } catch (err) {
    console.error("Error creating coupon:", err);
    return NextResponse.json(
      { error: "Error creating coupon" },
      { status: 500 },
    );
  }
}
