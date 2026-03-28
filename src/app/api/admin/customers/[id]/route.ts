import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const adminPass = request.headers.get("x-admin-password") || "";
    if (
      !process.env.ADMIN_PASSWORD ||
      adminPass !== process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) throw new Error("Missing ID in params");

    const body = await request.json();
    const { name, email, username, purchases_count, is_verified, purchase_dates } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = String(username).toLowerCase();
    
    if (purchases_count !== undefined) {
      const parsedCount = parseInt(String(purchases_count));
      updateData.purchases_count = isNaN(parsedCount) ? 0 : Math.min(10, Math.max(0, parsedCount));
    }
    
    if (is_verified !== undefined) updateData.is_verified = is_verified;
    if (purchase_dates !== undefined) updateData.purchase_dates = purchase_dates;
    updateData.last_updated = new Date().toISOString();

    const supabase = createAdminClient();
    
    const { data: customer, error: updateError } = await supabase
      .from("customers")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Supabase Update Error:", updateError);
      return NextResponse.json({ 
        error: "Database Update Failed", 
        details: updateError.message,
        code: updateError.code
      }, { status: 500 });
    }

    // Optional history recording
    try {
      const countForHistory = (updateData.purchases_count as number) || 0;
      if (countForHistory > 0) {
        const cardNumber = Math.floor((countForHistory - 1) / 10) + 1;
        await supabase.from("customer_loyalty_purchases").insert([{
          customer_id: id,
          purchase_date: new Date().toISOString(),
          card_number: cardNumber
        }]);
      }
    } catch (hErr) {
      console.error("Non-critical history error:", hErr);
    }

    return NextResponse.json({ customer });
  } catch (err) {
    console.error("Critical PATCH Error:", err);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        details: err instanceof Error ? err.message : String(err)
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const adminPass = request.headers.get("x-admin-password") || "";
    if (
      !process.env.ADMIN_PASSWORD ||
      adminPass !== process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = createAdminClient();
    const { error } = await supabase.from("customers").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting customer:", err);
    return NextResponse.json(
      { error: "Error deleting customer" },
      { status: 500 },
    );
  }
}
