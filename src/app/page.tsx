import type { Metadata } from "next";
import VslPage from "@/components/VslPage";

export const metadata: Metadata = {
  title: "Meta Says It's Working. Your Bank Account Disagrees. | Rarity Agency",
  description:
    "Media, creative, and UGC team that runs your growth against MER and real profit — not platform ROAS. Built for DTC brands scaling on Meta.",
};

export default function Home() {
  return <VslPage headlineVariant="default" />;
}

