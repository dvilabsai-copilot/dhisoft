import type { Metadata } from "next";
import { AboutPage } from "@/components/home/MarketingPage";

export const metadata: Metadata = {
  title: "About DHI Software Systems",
  description: "Learn how DHISOFT approaches custom software, SaaS products and operational technology.",
  alternates: { canonical: "/about" },
};

export default function AboutRoute() {
  return <AboutPage />;
}
