import { MainContent } from "@/components/MainContent";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Trail Mixes ⚡ | Moovimiento",
  description: "Build your 220g trail mix with selected ingredients.",
};

export default async function HomeEn(props: {
  searchParams: Promise<{ code?: string; lang?: string }>;
}) {
  const searchParams = await props.searchParams;
  if (searchParams.code) {
    redirect(`/auth/callback?code=${searchParams.code}&lang=en`);
  }

  return <MainContent lang="en" benefitsMode="teaser" />;
}
