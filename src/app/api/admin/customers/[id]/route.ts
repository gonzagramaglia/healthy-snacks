import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(
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
    const body = await request.json();
    const { name, username, purchases_count, is_verified, purchase_dates } = body;

    type UpdateCustomer = {
      name?: string;
      username?: string;
      purchases_count?: number;
      is_verified?: boolean;
      purchase_dates?: string[];
      last_updated?: string;
    };
    const updateData: UpdateCustomer = {};
    if (name !== undefined) updateData.name = name;
    if (username !== undefined) updateData.username = username.toLowerCase();
    if (purchases_count !== undefined)
      updateData.purchases_count = purchases_count;
    if (is_verified !== undefined) updateData.is_verified = is_verified;
    if (purchase_dates !== undefined) updateData.purchase_dates = purchase_dates;
    updateData.last_updated = new Date().toISOString();

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("customers")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Record history if purchase count was updated
    if (purchases_count !== undefined) {
      await supabase.from("customer_loyalty_purchases").insert([{
        customer_id: id,
        purchase_date: new Date().toISOString(),
        card_number: Math.floor((purchases_count - 1) / 10) + 1
      }]);
    }

    return NextResponse.json({ customer: data });
  } catch (err) {
    console.error("Error updating customer:", err);
    return NextResponse.json(
      { error: "Error updating customer" },
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
