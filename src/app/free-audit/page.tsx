import type { Metadata } from "next";
import TslPage from "@/components/TslPage";

export const metadata: Metadata = {
  title: "Get Off The Ad Performance Rollercoaster | Rarity Agency",
  description:
    "Scale what actually drives real profit. We help ambitious DTC brands break through revenue plateaus by aligning Meta Ads, Google PMax, and 30+ monthly AI creative sprints around real contribution margin.",
  openGraph: {
    title: "Get Off The Ad Performance Rollercoaster | Rarity Agency",
    description:
      "Scale what actually drives real profit. We help ambitious DTC brands break through revenue plateaus by aligning Meta Ads, Google PMax, and 30+ monthly AI creative sprints around real contribution margin.",
    url: "https://ecom.rarityagency.io/free-audit",
    siteName: "Rarity Agency",
  },
};

export default function FreeAuditPage() {
  return <TslPage headlineVariant="default" lang="en" />;
}
