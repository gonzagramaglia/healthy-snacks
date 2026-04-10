import { MainContent } from "@/components/MainContent";
import { AuthFallback } from "@/components/AuthFallback";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <AuthFallback />
      </Suspense>
      <MainContent lang="es" benefitsMode="teaser" />
    </>
  );
}
