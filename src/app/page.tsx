import type { Metadata } from "next";
import VslPage from "@/components/VslPage";

export const metadata: Metadata = {
  title: "Get Off The Meta Rollercoaster",
  description:
    "Media, creative, and UGC team that runs your growth against MER and real profit — not platform ROAS. Built for DTC brands doing $1M–$10M/year.",
};

export default function Home() {
  return <VslPage headlineVariant="default" />;
}

