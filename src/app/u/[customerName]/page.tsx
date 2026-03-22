import { MainContent } from "@/components/MainContent";
import { hardcodedCustomers } from "@/lib/customers";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

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
      const supabase = await createClient();
      const { data } = await supabase
        .from("customers")
        .select("name")
        .eq("username", targetId)
        .eq("is_verified", true)
        .single();
      if (data?.name) {
        name = data.name;
      }
    } catch (err) {
      // Ignore
    }
  }

  return {
    title: `Beneficios de ${name} ⚡ | Moovimiento`,
    description: "Consultá tus beneficios y compras realizadas en Moovimiento.",
  };
}

export default async function CustomerPage({
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
      const supabase = await createClient();
      const { data } = await supabase
        .from("customers")
        .select("id, name, is_verified, purchases_count, last_updated")
        .eq("username", targetId)
        .single();
        
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
    <MainContent lang="es" customerData={customer} benefitsMode="coupon" />
  );
}
