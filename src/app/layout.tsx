import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'DhiSoft | SaaS for Travel, Hotels & Fleet Operations', template: '%s | DhiSoft' },
  description: 'Custom SaaS systems for travel, hotel, fleet and AI booking operations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
