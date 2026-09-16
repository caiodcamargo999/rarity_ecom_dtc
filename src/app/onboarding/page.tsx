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
    <iframe
      src="/Rarity_Onboarding_Typeform.html"
      title="Rarity — New Client Onboarding"
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
        background: "#000820",
      }}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />
  );
}
