import type { Metadata } from "next";
import HeroConcepts from "./HeroConcepts";

export const metadata: Metadata = {
  title: "Hero design previews",
  robots: { index: false, follow: false },
};

export default function HeroConceptsPage() {
  return <HeroConcepts />;
}
