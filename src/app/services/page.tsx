import type { Metadata } from "next";
import { ServicesLandingPage } from "@/components/home/MarketingPage";

export const metadata: Metadata = {
  title: "Software Development Services",
  description: "Explore DHISOFT's custom software development, SaaS engineering, enterprise workflows, API integration and AI automation services.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return <ServicesLandingPage />;
}
