import { createAdminClient } from "@/lib/supabase/admin";

export type CouponType = "percentage" | "fixed";

type CouponRow = {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  max_discount: number | null;
  min_subtotal: number | null;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  usage_limit: number | null;
  used_count: number;
  allowed_email: string | null;
};

export type CouponValidationResult = {
  valid: boolean;
  code: string;
  discountAmount: number;
  reason?: string;
  coupon?: {
    id: string;
    code: string;
    type: CouponType;
    value: number;
    maxDiscount: number | null;
    minSubtotal: number | null;
  };
};

export function normalizeCouponCode(input: string) {
  return input.trim().toUpperCase();
}

function parsePositiveNumber(value: unknown) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return n;
}

function computeDiscountAmount(coupon: CouponRow, subtotal: number) {
  if (subtotal <= 0) return 0;

  let raw = 0;
  if (coupon.type === "percentage") {
    raw = (subtotal * coupon.value) / 100;
  } else {
    raw = coupon.value;
  }

  if (coupon.max_discount !== null) {
    raw = Math.min(raw, coupon.max_discount);
  }

  return Math.max(0, Math.min(raw, subtotal));
}

export async function validateCoupon(params: {
  code: string;
  subtotal: number;
  email?: string;
}): Promise<CouponValidationResult> {
  const code = normalizeCouponCode(params.code);
  const subtotal = parsePositiveNumber(params.subtotal);
  const email = (params.email || "").trim().toLowerCase();

  if (!code) {
    return { valid: false, code: "", discountAmount: 0, reason: "empty_code" };
  }

  if (subtotal <= 0) {
    return {
      valid: false,
      code,
      discountAmount: 0,
      reason: "invalid_subtotal",
    };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("discount_codes")
    .select(
      "id, code, type, value, max_discount, min_subtotal, active, starts_at, ends_at, usage_limit, used_count, allowed_email",
    )
    .eq("code", code)
    .maybeSingle();

  if (error) {
    console.error("Error fetching coupon:", error);
    throw error;
  }

  if (!data) {
    return { valid: false, code, discountAmount: 0, reason: "not_found" };
  }

  const coupon = data as CouponRow;
  const nowTs = Date.now();

  if (!coupon.active) {
    return { valid: false, code, discountAmount: 0, reason: "inactive" };
  }

  if (coupon.starts_at && nowTs < new Date(coupon.starts_at).getTime()) {
    return { valid: false, code, discountAmount: 0, reason: "not_started" };
  }

  if (coupon.ends_at && nowTs > new Date(coupon.ends_at).getTime()) {
    return { valid: false, code, discountAmount: 0, reason: "expired" };
  }

  if (coupon.min_subtotal !== null && subtotal < coupon.min_subtotal) {
    return {
      valid: false,
      code,
      discountAmount: 0,
      reason: "min_subtotal_not_met",
    };
  }

  if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
    return {
      valid: false,
      code,
      discountAmount: 0,
      reason: "usage_limit_reached",
    };
  }

  if (
    coupon.allowed_email &&
    email &&
    coupon.allowed_email.toLowerCase() !== email
  ) {
    return {
      valid: false,
      code,
      discountAmount: 0,
      reason: "email_not_allowed",
    };
  }

  const discountAmount = computeDiscountAmount(coupon, subtotal);
  if (discountAmount <= 0) {
    return { valid: false, code, discountAmount: 0, reason: "zero_discount" };
  }

  return {
    valid: true,
    code,
    discountAmount,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      maxDiscount: coupon.max_discount,
      minSubtotal: coupon.min_subtotal,
    },
  };
}
