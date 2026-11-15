import type { Metadata } from "next";
import { ServicesLandingPage } from "@/components/home/MarketingPage";

export const metadata: Metadata = {
  title: "Software Engineering Services",
  description: "Custom software, SaaS product engineering, business workflows, integrations and AI-enabled automation from DHISOFT.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return <ServicesLandingPage />;
}
