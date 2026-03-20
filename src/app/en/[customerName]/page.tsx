import { redirect } from "next/navigation";

export default async function LegacyCustomerPageEn({
  params,
}: {
  params: Promise<{ customerName: string }>;
}) {
  const { customerName } = await params;
  redirect(`/en/u/${customerName.toLowerCase()}`);
}
