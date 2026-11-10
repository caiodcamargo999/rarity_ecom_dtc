import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A Força do Nosso Método | Proposta de Crescimento Rarity",
  description: "Apresentação de Crescimento DTC da Rarity Agency, Diagnóstico Financeiro e Arquitetura",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThePowerOfOurMethodBrPage() {
  return (
    <iframe
      src="/Rarity_Sales_Deck_PT.html"
      title="Rarity — Proposta de Crescimento"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        border: "none",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        zIndex: 999999,
        background: "#000",
      }}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />
  );
}
