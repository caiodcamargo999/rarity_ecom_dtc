import type { Metadata } from "next";
import VslPage from "@/components/VslPage";

export const metadata: Metadata = {
  title: "A Full Growth Team For Less Than One Media Buyer",
  description:
    "Media, creative, and UGC team that runs your growth against MER and real profit — not platform ROAS. Built for DTC brands doing $1M–$10M/year who are done being burned by agencies.",
  openGraph: {
    title: "A Full Growth Team For Less Than One Media Buyer | Rarity Agency",
    description:
      "Media, creative, and UGC team that runs your growth against MER and real profit — not platform ROAS. Built for DTC brands doing $1M–$10M/year.",
    url: "https://growth.rarityagency.com",
    siteName: "Rarity Agency",
    images: [
      {
        url: "/images/LP-01-RARITY.jpg",
        width: 1200,
        height: 630,
        alt: "Rarity Agency - A Full Growth Team For Less Than One Media Buyer",
      },
    ],
  },
};

export default function GrowthTeamVslPage() {
  return <VslPage headlineVariant="growth-team" />;
}
