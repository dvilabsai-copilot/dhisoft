import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DhiSoft | SaaS for Travel, Hotels & Fleet Operations',
  description: 'Modern SaaS systems for fleet vendors, hotel integrations, itinerary automation, and AI booking workflows.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
