"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type Coupon = {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  max_discount: number | null;
  min_subtotal: number | null;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  usage_limit: number | null;
  used_count: number;
  allowed_email: string | null;
  created_at: string;
  updated_at: string;
};

type CouponForm = {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  max_discount: number | null;
  min_subtotal: number | null;
  active: boolean;
  usage_limit: number | null;
  allowed_email: string | null;
};

export default function CouponsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CouponForm>({
    code: "",
    type: "percentage",
    value: 0,
    max_discount: null as number | null,
    min_subtotal: null as number | null,
    active: true,
    usage_limit: null as number | null,
    allowed_email: "" as string | null,
  });

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (err) throw err;
      setCoupons(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push("/admin/login");
        return;
      }
      setUser(data.user);
      await fetchCoupons();
    };
    checkAuth();
  }, [supabase, router, fetchCoupons]);

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingId) {
        const { error: err } = await supabase
          .from("coupons")
          .update(formData)
          .eq("id", editingId);
        if (err) throw err;
      } else {
        const { error: err } = await supabase
          .from("coupons")
          .insert([formData]);
        if (err) throw err;
      }

      setFormData({
        code: "",
        type: "percentage",
        value: 0,
        max_discount: null,
        min_subtotal: null,
        active: true,
        usage_limit: null,
        allowed_email: null,
      });
      setShowForm(false);
      setEditingId(null);
      await fetchCoupons();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save coupon");
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    setError(null);
    try {
      const { error: err } = await supabase
        .from("coupons")
        .delete()
        .eq("id", id);
      if (err) throw err;
      await fetchCoupons();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete coupon");
    }
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      max_discount: coupon.max_discount,
      min_subtotal: coupon.min_subtotal,
      active: coupon.active,
      usage_limit: coupon.usage_limit,
      allowed_email: coupon.allowed_email,
    });
    setEditingId(coupon.id);
    setShowForm(true);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Manage Coupons</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage discount codes
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/admin")}>
              ← Back
            </Button>
            <Button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                setFormData({
                  code: "",
                  type: "percentage",
                  value: 0,
                  max_discount: null,
                  min_subtotal: null,
                  active: true,
                  usage_limit: null,
                  allowed_email: null,
                });
              }}
            >
              + New Coupon
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-200 rounded">
            {error}
          </div>
        )}

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingId ? "Edit Coupon" : "Create Coupon"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveCoupon} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Code</Label>
                    <Input
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          code: (
                            e.target as HTMLInputElement
                          ).value.toUpperCase(),
                        })
                      }
                      placeholder="e.g., SUMMER20"
                      required
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: (e.target as HTMLSelectElement).value as
                            | "percentage"
                            | "fixed",
                        })
                      }
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed ($)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Value</Label>
                    <Input
                      type="number"
                      value={formData.value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          value:
                            parseFloat((e.target as HTMLInputElement).value) ||
                            0,
                        })
                      }
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <Label>Max Discount</Label>
                    <Input
                      type="number"
                      value={formData.max_discount ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          max_discount: (e.target as HTMLInputElement).value
                            ? parseFloat((e.target as HTMLInputElement).value)
                            : null,
                        })
                      }
                      min="0"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Min Subtotal</Label>
                    <Input
                      type="number"
                      value={formData.min_subtotal ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          min_subtotal: (e.target as HTMLInputElement).value
                            ? parseFloat((e.target as HTMLInputElement).value)
                            : null,
                        })
                      }
                      min="0"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <Label>Usage Limit</Label>
                    <Input
                      type="number"
                      value={formData.usage_limit ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          usage_limit: (e.target as HTMLInputElement).value
                            ? parseInt((e.target as HTMLInputElement).value)
                            : null,
                        })
                      }
                      min="0"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div>
                  <Label>Allowed Email (optional)</Label>
                  <Input
                    type="email"
                    value={formData.allowed_email ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        allowed_email:
                          (e.target as HTMLInputElement).value || null,
                      })
                    }
                    placeholder="Restrict to specific email"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        active: (e.target as HTMLInputElement).checked,
                      })
                    }
                  />
                  <Label htmlFor="active">Active</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Save</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-10">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No coupons yet. Create one to get started.
          </div>
        ) : (
          <div className="grid gap-4">
            {coupons.map((coupon) => (
              <Card key={coupon.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold">{coupon.code}</h3>
                        <span
                          className={`px-3 py-1 rounded text-sm font-medium ${coupon.active ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"}`}
                        >
                          {coupon.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-lg mb-3">
                        {coupon.type === "percentage"
                          ? `${coupon.value}%`
                          : `$${coupon.value}`}
                        {coupon.max_discount &&
                          ` (max: $${coupon.max_discount})`}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        {coupon.min_subtotal && (
                          <p>Min: ${coupon.min_subtotal}</p>
                        )}
                        {coupon.usage_limit && (
                          <p>Limit: {coupon.usage_limit}</p>
                        )}
                        <p>Used: {coupon.used_count}</p>
                        {coupon.allowed_email && (
                          <p>Email: {coupon.allowed_email}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEditCoupon(coupon)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteCoupon(coupon.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
