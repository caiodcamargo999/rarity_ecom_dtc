import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Power of Our Method | Rarity Growth Proposal",
  description: "Rarity Agency DTC Growth Presentation, Financial Diagnostics & Architecture",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThePowerOfOurMethodPage() {
  return (
    <iframe
      src="/Rarity_Sales_Deck.html"
      title="Rarity — Growth Proposal"
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
