import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rarity Agency | Get Off The Meta Rollercoaster",
  description:
    "Media, creative, and UGC team that runs your growth against MER and real profit — not platform ROAS. Built for DTC brands doing $1M–$10M/year.",
  keywords: [
    "DTC Growth",
    "Performance Marketing",
    "MER Marketing",
    "UGC Production",
    "AI Creative",
    "Meta Ads",
    "Google Ads",
    "Ecommerce Growth Agency",
  ],
  openGraph: {
    title: "Rarity Agency | Get Off The Meta Rollercoaster",
    description:
      "Media, creative, and UGC team that runs your growth against MER and real profit — not platform ROAS.",
    images: ["/images/LP-01-RARITY.jpg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans antialiased bg-[#001244] text-white selection:bg-[#D80064] selection:text-white">
        {children}
      </body>
    </html>
  );
}
