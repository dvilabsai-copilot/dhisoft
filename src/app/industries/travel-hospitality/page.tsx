import type { Metadata } from "next";
import { TravelIndustryPage } from "@/components/home/MarketingPage";

export const metadata: Metadata = {
  title: "Travel & Hospitality Software",
  description: "Booking, travel operations and supplier-connected products shaped around the full travel workflow.",
  alternates: { canonical: "/industries/travel-hospitality" },
  openGraph: { title: "Travel & Hospitality Technology | DHISOFT", description: "Booking, travel operations and supplier-connected products shaped around the full travel workflow." },
};

export default function TravelHospitalityPage() {
  return <TravelIndustryPage />;
}
