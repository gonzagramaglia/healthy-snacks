import { MainContent } from "@/components/MainContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users ⚡ | Moovimiento",
  description: "Enter your username to see your benefits at Moovimiento.",
};

export default function UsersPageEn() {
  return <MainContent lang="en" benefitsMode="hub" />;
}
