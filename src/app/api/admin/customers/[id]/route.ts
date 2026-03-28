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
    const { name, username, purchases_count, is_verified } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (username !== undefined) updateData.username = username.toLowerCase();
    if (purchases_count !== undefined)
      updateData.purchases_count = purchases_count;
    if (is_verified !== undefined) updateData.is_verified = is_verified;
    updateData.last_updated = new Date().toISOString();

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("customers")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

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
