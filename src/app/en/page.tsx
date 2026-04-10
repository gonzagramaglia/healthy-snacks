import { MainContent } from "@/components/MainContent";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Trail Mixes ⚡ | Moovimiento",
  description: "Build your 220g trail mix with selected ingredients.",
};

export default function HomeEn() {
  return <MainContent lang="en" benefitsMode="teaser" />;
}
