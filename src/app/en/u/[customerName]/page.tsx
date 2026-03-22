import { MainContent } from "@/components/MainContent";
import { hardcodedCustomers } from "@/lib/customers";
import { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ customerName: string }>;
}): Promise<Metadata> {
  const { customerName } = await params;
  const targetId = customerName.toLowerCase();
  
  let name = targetId.charAt(0).toUpperCase() + targetId.slice(1);
  
  // First check hardcoded, then DB
  if (hardcodedCustomers[targetId]) {
    name = hardcodedCustomers[targetId].customerName;
  } else {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("customers")
        .select("name")
        .eq("username", targetId)
        .eq("is_verified", true)
        .maybeSingle();
      if (data?.name) {
        name = data.name;
      }
    } catch (err) {
      // Ignore
    }
  }

  return {
    title: `${name}'s Benefits ⚡ | Moovimiento`,
    description: "Check your benefits and purchases at Moovimiento.",
  };
}

export default async function CustomerPageEn({
  params,
}: {
  params: Promise<{ customerName: string }>;
}) {
  const { customerName } = await params;
  const targetId = customerName.toLowerCase();
  
  let customer = hardcodedCustomers[targetId];

  // If not found in hardcoded, look in Supabase database
  if (!customer) {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("customers")
        .select("id, name, is_verified, purchases_count, last_updated")
        .eq("username", targetId)
        .maybeSingle();
        
      if (data && data.is_verified) {
        customer = {
          id: data.id,
          customerName: data.name,
          purchasesCount: data.purchases_count,
          lastUpdated: data.last_updated,
          isVerified: data.is_verified,
        };
      }
    } catch (err) {
      // Ignore
    }
  }

  // Fallback to empty state
  if (!customer) {
    customer = {
      id: "new",
      customerName:
        customerName.charAt(0).toUpperCase() +
        customerName.slice(1).toLowerCase(),
      purchasesCount: 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  return (
    <MainContent lang="en" customerData={customer} benefitsMode="coupon" />
  );
}
