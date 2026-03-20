import { MainContent } from "@/components/MainContent";
import { hardcodedCustomers } from "@/lib/customers";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ customerName: string }>;
}): Promise<Metadata> {
  const { customerName } = await params;
  const customer = hardcodedCustomers[customerName.toLowerCase()];
  const name = customer
    ? customer.customerName
    : customerName.charAt(0).toUpperCase() +
      customerName.slice(1).toLowerCase();

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
  const customer = hardcodedCustomers[customerName.toLowerCase()] || {
    id: "new",
    customerName:
      customerName.charAt(0).toUpperCase() +
      customerName.slice(1).toLowerCase(),
    purchasesCount: 0,
    lastUpdated: new Date().toISOString(),
  };

  return (
    <MainContent lang="en" customerData={customer} benefitsMode="coupon" />
  );
}
