import { MainContent } from "@/components/MainContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Usuarios ⚡ | Moovimiento",
  description: "Ingresá tu usuario para ver tus beneficios en Moovimiento.",
};

export default function UsersPage() {
  return <MainContent lang="es" benefitsMode="hub" />;
}
