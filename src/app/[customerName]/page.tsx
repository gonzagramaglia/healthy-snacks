import { redirect } from "next/navigation";

export default async function LegacyCustomerPage({
  params,
}: {
  params: Promise<{ customerName: string }>;
}) {
  const { customerName } = await params;
  redirect(`/u/${customerName.toLowerCase()}`);
}
