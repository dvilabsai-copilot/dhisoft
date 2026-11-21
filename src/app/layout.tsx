import "./globals.css";
import type { Metadata } from "next";
import { organizationJsonLd, serializeJsonLd, SITE_ORIGIN, websiteJsonLd } from "@/lib/seo";

const description =
  "DHISOFT designs and engineers custom software, SaaS products, operational workflows and integrations for complex businesses.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  applicationName: "DHISOFT",
  title: {
    default: "Custom Software Development & SaaS Engineering | DHISOFT",
    template: "%s | DHISOFT",
  },
  description,
  openGraph: {
    type: "website",
    url: "/",
    siteName: "DHISOFT",
    locale: "en_IN",
    title: "Custom Software Development & SaaS Engineering | DHISOFT",
    description,
    images: [
      {
        url: "/social-preview",
        width: 1200,
        height: 630,
        alt: "DHISOFT — Custom software and SaaS engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Software Development & SaaS Engineering | DHISOFT",
    description,
    images: ["/social-preview"],
  },
  icons: {
    icon: "/images/dhisoft-logo.png",
    shortcut: "/images/dhisoft-logo.png",
    apple: "/images/dhisoft-logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = [organizationJsonLd(), websiteJsonLd()];

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
