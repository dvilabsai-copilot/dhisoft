import type { Metadata } from "next";
import { TravelIndustryPage } from "@/components/home/MarketingPage";
import { travelIndustry } from "@/content/service-pages";

export const metadata: Metadata = {
  title: "Travel & Hospitality Software Development",
  description: travelIndustry.summary,
  alternates: { canonical: "/industries/travel-hospitality" },
  openGraph: {
    title: "Travel & Hospitality Software Development | DHISOFT",
    description: travelIndustry.summary,
    url: "/industries/travel-hospitality",
  },
};

export default function TravelHospitalityPage() {
  return <TravelIndustryPage />;
}
