import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Codene — App Development Estimates',
  description:
    'Get an instant, detailed estimate for your mobile app project. Select features, set your budget, and receive an itemized breakdown in minutes.',
  openGraph: {
    title: 'Codene — App Development Estimates',
    description:
      'Get an instant, detailed estimate for your mobile app project.',
    type: 'website',
    url: 'https://codene.us',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="mesh-bg" />
        {children}
      </body>
    </html>
  );
}
