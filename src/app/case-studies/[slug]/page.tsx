import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/home/MarketingPage";
import { caseStudies, caseStudyHref, getCaseStudy } from "@/content/case-studies";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) notFound();

  const url = caseStudyHref(study.slug);
  return {
    title: study.searchTitle,
    description: study.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${study.searchTitle} | DHISOFT`,
      description: study.summary,
      images: [{ url: study.screenshot.src, width: 1280, height: 800, alt: study.screenshot.alt }],
    },
  };
}

export default async function Page({ params }: Props) {
  const study = getCaseStudy((await params).slug);
  if (!study) notFound();
  return <CaseStudyPage study={study} />;
}
