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
    <main className="fixed inset-0 w-screen h-screen overflow-hidden bg-black z-50">
      <iframe
        src="/Rarity_Sales_Deck.html"
        title="Rarity — Growth Proposal"
        className="w-full h-full border-0 block"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-downloads"
      />
    </main>
  );
}
