import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Onboarding | Rarity Agency",
  description: "New Client Onboarding Questionnaire & Growth Setup for Rarity DTC Partners",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OnboardingPage() {
  return (
    <main className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#000820] z-50">
      <iframe
        src="/Rarity_Onboarding_Typeform.html"
        title="Rarity — New Client Onboarding"
        className="w-full h-full border-0 block"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-downloads"
      />
    </main>
  );
}
