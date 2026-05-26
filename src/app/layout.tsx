import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bhilaiprops.com"),
  title: {
    default: "BhilaiProps - Premium Real Estate in Bhilai",
    template: "%s | BhilaiProps",
  },
  description:
    "Discover, list, and manage premium residential and commercial properties across Bhilai with verified listings and fast owner connections.",
  keywords: [
    "Bhilai real estate",
    "property in Bhilai",
    "commercial property Bhilai",
    "flats in Bhilai",
    "land in Bhilai",
  ],
  openGraph: {
    title: "BhilaiProps - Premium Real Estate in Bhilai",
    description:
      "Browse verified homes, land, shops, offices, restaurants, and warehouses across Bhilai.",
    url: "https://bhilaiprops.com",
    siteName: "BhilaiProps",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-stone-50 text-zinc-950">{children}</body>
    </html>
  );
}
