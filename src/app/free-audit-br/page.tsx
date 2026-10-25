import type { Metadata } from "next";
import TslPage from "@/components/TslPage";

export const metadata: Metadata = {
  title: "Saia da Montanha-Russa de Performance de Anúncios | Rarity Agency",
  description:
    "Escale o que realmente gera lucro líquido. Ajudamos marcas ambiciosas de e-commerce a romper o platô unindo Meta Ads, Google PMax e mais de 30 testes criativos com IA por mês com foco em margem de contribuição.",
  openGraph: {
    title: "Saia da Montanha-Russa de Performance de Anúncios | Rarity Agency",
    description:
      "Escale o que realmente gera lucro líquido. Ajudamos marcas ambiciosas de e-commerce a romper o platô unindo Meta Ads, Google PMax e mais de 30 testes criativos com IA por mês com foco em margem de contribuição.",
    url: "https://ecom.rarityagency.io/free-audit-br",
    siteName: "Rarity Agency",
    locale: "pt_BR",
  },
};

export default function FreeAuditBrPage() {
  return <TslPage headlineVariant="default" lang="pt" />;
}
