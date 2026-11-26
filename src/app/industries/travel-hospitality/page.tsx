import type { Metadata } from "next";
import { TravelIndustryPage } from "@/components/home/MarketingPage";
import { travelIndustry } from "@/content/service-pages";

export const metadata: Metadata = {
  title: "Travel Software Development for Booking Platforms",
  description: travelIndustry.summary,
  alternates: { canonical: "/industries/travel-hospitality" },
  openGraph: {
    title: "Travel Software Development for Booking Platforms | DHISOFT",
    description: travelIndustry.summary,
    url: "/industries/travel-hospitality",
  },
};

export default function TravelHospitalityPage() {
  return <TravelIndustryPage />;
}
