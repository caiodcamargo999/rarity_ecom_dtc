import type { Metadata } from "next";
import TslPage from "@/components/TslPage";

export const metadata: Metadata = {
  title: "A Full Growth Team For Less Than One Media Buyer",
  description:
    "Scale what actually drives real profit. We help ambitious DTC brands break through revenue plateaus with a full growth team for less than one media buyer.",
  openGraph: {
    title: "A Full Growth Team For Less Than One Media Buyer | Rarity TSL",
    description:
      "Scale what actually drives real profit. We help ambitious DTC brands break through revenue plateaus with a full growth team for less than one media buyer.",
    url: "https://growth.rarityagency.com/tsl",
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

export default function GrowthTeamTslPage() {
  return <TslPage headlineVariant="growth-team" />;
}
