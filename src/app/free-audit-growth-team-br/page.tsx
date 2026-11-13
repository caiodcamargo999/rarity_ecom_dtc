import type { Metadata } from "next";
import TslPage from "@/components/TslPage";

export const metadata: Metadata = {
  title: "Sem Gestor Júnior, Sem Métrica de Vaidade: O Fundador Escalando Pelo Lucro Real | Rarity Agency",
  description:
    "Time sênior de mídia, criativos e UGC focado em MER e lucro real na sua conta bancária. Para marcas de e-commerce que querem previsibilidade de escala.",
  openGraph: {
    title: "Sem Gestor Júnior, Sem Métrica de Vaidade: O Fundador Escalando Pelo Lucro Real | Rarity Agency",
    description:
      "Time sênior de mídia, criativos e UGC focado em MER e lucro real na sua conta bancária. Para marcas de e-commerce que querem previsibilidade de escala.",
    url: "https://ecom.rarityagency.io/free-audit-growth-team-br",
    siteName: "Rarity Agency",
    locale: "pt_BR",
    images: [
      {
        url: "/images/LP-01-RARITY.jpg",
        width: 1200,
        height: 630,
        alt: "Rarity Agency - O Fundador Na Sua Conta, Escalando Pelo Lucro Real",
      },
    ],
  },
};

export default function FreeAuditGrowthTeamBrPage() {
  return <TslPage headlineVariant="growth-team" lang="pt" />;
}
