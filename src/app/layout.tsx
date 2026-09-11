import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#00103A",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://rarityagency.com"),
  title: {
    default: "Rarity Agency | DTC Performance Marketing & Media Buying Agency",
    template: "%s | Rarity Agency",
  },
  description:
    "Rarity is a premier performance marketing agency helping ambitious DTC ecommerce brands break through revenue plateaus. We scale Meta Ads, Google PMax, and 30+ monthly AI creative sprints against real contribution margin & blended MER.",
  applicationName: "Rarity Agency",
  authors: [{ name: "Rarity Growth Team", url: "https://rarityagency.com" }],
  generator: "Next.js",
  keywords: [
    "Rarity Agency",
    "DTC Growth Agency",
    "Performance Marketing Agency",
    "Meta Ads Agency",
    "Google Ads Performance Max",
    "AI Creative Production",
    "UGC Video Ads",
    "Contribution Margin Scaling",
    "Ecommerce Media Buying",
    "Blended MER Growth",
    "Shopify Plus Marketing Agency",
    "DTC Fractional CMO",
    "Ecommerce Ad Scale",
    "TikTok Advertising for DTC",
    "Creative Strategy Sprint Lab",
  ],
  referrer: "origin-when-cross-origin",
  creator: "Rarity Agency",
  publisher: "Rarity Agency",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", sizes: "any" },
    ],
    apple: [
      { url: "/favicon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Rarity Agency | DTC Performance Marketing & Media Buying Agency",
    description:
      "Stop the ad performance rollercoaster. Align Meta, Google PMax, and 30+ monthly AI creative sprints around contribution margin and real cash flow.",
    url: "https://rarityagency.com",
    siteName: "Rarity Agency",
    images: [
      {
        url: "/images/LP-01-RARITY.jpg",
        width: 1200,
        height: 630,
        alt: "Rarity Agency - DTC Performance Media & AI Creative Sprint Lab",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rarity Agency | DTC Performance Marketing & Media Buying",
    description:
      "Media, creative, and UGC team that runs your growth against MER and real profit — not vanity platform ROAS. Scaled $15M+ in verified ad spend.",
    images: ["/images/LP-01-RARITY.jpg"],
    creator: "@rarityagency",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Business & Marketing",
};

// JSON-LD Structured Data for Google Knowledge Graph, ChatGPT, and Perplexity indexing
const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://rarityagency.com/#organization",
      "name": "Rarity Agency",
      "url": "https://rarityagency.com",
      "logo": "https://rarityagency.com/images/logo_rarity_branco_sem_fundo_zoom_in.png",
      "image": "https://rarityagency.com/images/LP-01-RARITY.jpg",
      "description": "Rarity is a performance marketing and creative growth agency for 7- and 8-figure DTC ecommerce brands. Specializing in Meta Ads, Google Performance Max, 30+ monthly AI creative iterations, and contribution margin scaling.",
      "priceRange": "$$$$",
      "currenciesAccepted": "USD",
      "paymentAccepted": "Credit Card, Wire Transfer, ACH",
      "areaServed": [
        {
          "@type": "Country",
          "name": "United States"
        },
        {
          "@type": "Country",
          "name": "Global"
        }
      ],
      "knowsAbout": [
        "Direct-to-Consumer (DTC) Marketing",
        "Meta Advertising & Advantage+ Scaling",
        "Google Performance Max & Search Arbitrage",
        "AI Native UGC Creative Production",
        "Marketing Efficiency Ratio (MER) & Unit Economics",
        "Shopify Plus Conversion Rate Optimization"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "DTC Growth Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Performance Media Buying & Channel Scaling",
              "description": "Unified Meta Ads and Google Performance Max media management optimized against net contribution margin."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "AI Creative Sprint Lab & UGC Production",
              "description": "Production and iteration of 30+ monthly high-converting video hooks, motion graphics, and psychological angles."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Free DTC Growth & Unit Economics Audit",
              "description": "Forensic audit analyzing pixel attribution, customer cohort LTV, creative fatigue, and allowable CPA guardrails."
            }
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.98",
        "bestRating": "5.0",
        "ratingCount": "48"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://rarityagency.com/#website",
      "url": "https://rarityagency.com",
      "name": "Rarity Agency",
      "publisher": {
        "@id": "https://rarityagency.com/#organization"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://rarityagency.com/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How is Rarity different from traditional media buying agencies?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Unlike traditional agencies that assign junior media buyers and optimize for vanity in-platform ROAS, Rarity gives you direct access to senior operators who manage your media, creative, and data against real bank-deposit contribution margin and blended MER."
          }
        },
        {
          "@type": "Question",
          "name": "How many ad creatives does Rarity produce and test per month?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our in-house AI Creative Sprint Lab produces and iterates on 30+ high-converting creative variations, UGC video hooks, and objection-busting angles every single month to eliminate ad fatigue."
          }
        },
        {
          "@type": "Question",
          "name": "Who owns the ad accounts, creative assets, and customer data?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You retain 100% ownership of your ad accounts, pixel data, tracking setups, and creative assets forever. We never hold client data hostage."
          }
        },
        {
          "@type": "Question",
          "name": "What metrics does Rarity optimize for?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We optimize against real unit economics: Contribution Margin, Blended Marketing Efficiency Ratio (MER), First-Order CAC, and Cohort LTV."
          }
        }
      ]
    }
  ]
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "GTM-NG79CXDZ";

  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${playfairDisplay.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-[#001244] text-white selection:bg-[#D80064] selection:text-white">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
