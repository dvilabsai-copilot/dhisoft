import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dhisoft.in'),
  title: { default: 'DHISOFT | Custom Software & Product Engineering', template: '%s | DHISOFT' },
  description: 'DHISOFT designs and engineers custom software, SaaS products, operational workflows and integrations for complex businesses.',
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
