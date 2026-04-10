import { MainContent } from "@/components/MainContent";
import { AuthFallback } from "@/components/AuthFallback";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Usuarios ⚡ | Moovimiento",
  description: "Ingresá tu usuario para ver tus beneficios en Moovimiento.",
};

export default function UsersPage() {
  return (
    <>
      <Suspense fallback={null}>
        <AuthFallback />
      </Suspense>
      <MainContent lang="es" benefitsMode="hub" />
    </>
  );
}
