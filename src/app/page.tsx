import { MainContent } from "@/components/MainContent";
import { redirect } from "next/navigation";

export default async function Home(props: {
  searchParams: Promise<{ code?: string; lang?: string }>;
}) {
  const searchParams = await props.searchParams;
  if (searchParams.code) {
    redirect(`/auth/callback?code=${searchParams.code}${searchParams.lang ? `&lang=${searchParams.lang}` : ""}`);
  }

  return <MainContent lang="es" benefitsMode="teaser" />;
}
