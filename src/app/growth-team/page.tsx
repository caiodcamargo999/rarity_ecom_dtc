import type { Metadata } from "next";
import VslPage from "@/components/VslPage";

export const metadata: Metadata = {
  title: "A Media Buyer, Designer & Growth Strategist for Less Than One Hire",
  description:
    "Media, creative, and UGC team that runs your growth against MER and real profit — not platform ROAS. Built for DTC brands who are done being burned by agencies.",
  openGraph: {
    title: "A Media Buyer, Designer & Growth Strategist for Less Than One Hire | Rarity Agency",
    description:
      "Media, creative, and UGC team that runs your growth against MER and real profit — not platform ROAS. Built for DTC brands who are done being burned by agencies.",
    url: "https://growth.rarityagency.com",
    siteName: "Rarity Agency",
    images: [
      {
        url: "/images/LP-01-RARITY.jpg",
        width: 1200,
        height: 630,
        alt: "Rarity Agency - A Media Buyer, Designer & Growth Strategist for Less Than One Hire",
      },
    ],
  },
};

export default function GrowthTeamVslPage() {
  return <VslPage headlineVariant="growth-team" />;
}
