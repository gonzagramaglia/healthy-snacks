import { MainContent } from "@/components/MainContent";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Usuarios ⚡ | Moovimiento",
  description: "Ingresá tu usuario para ver tus beneficios en Moovimiento.",
};

export default async function UsersPage(props: {
  searchParams: Promise<{ code?: string; lang?: string }>;
}) {
  const searchParams = await props.searchParams;
  if (searchParams.code) {
    redirect(`/auth/callback?code=${searchParams.code}${searchParams.lang ? `&lang=${searchParams.lang}` : ""}`);
  }

  return <MainContent lang="es" benefitsMode="hub" />;
}
