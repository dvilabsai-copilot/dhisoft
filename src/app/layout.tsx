import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'DHISOFT | SaaS & Product Engineering Studio', template: '%s | DHISOFT' },
  description: 'DHISOFT designs and builds production-oriented SaaS products, workflow systems, APIs and automation for complex businesses.',
  icons: {
    icon: '/images/dhisoft-logo.png',
    shortcut: '/images/dhisoft-logo.png',
    apple: '/images/dhisoft-logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
