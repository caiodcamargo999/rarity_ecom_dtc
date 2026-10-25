"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import DashboardPreview from "@/components/common/DashboardPreview";

interface RarityAdCarouselV2Props {
  onOpenAudit: () => void;
  lang?: "en" | "pt";
}

const adCasesEn = [
  {
    id: "meta-1",
    channel: "Meta Ads",
    channelColor: "bg-blue-600/20 border-blue-500/40 text-blue-400",
    tag: "Meta Ads • DTC Brand Scaling",
    title: "8.32x ROAS & $2.95M+ In Verified Revenue",
    image: "/images/cases/meta-ads-case-1.png",
    stats: [
      { label: "Total Revenue", value: "$2.95M+" },
      { label: "Ad Spend", value: "$355k" },
      { label: "Avg ROAS", value: "8.32x" },
      { label: "Purchases", value: "7,641" },
    ],
    summary:
      "We restructured their campaign architecture from fragmented ad sets into a unified broad-targeting MER model with AI-native creative testing. CAC decreased by 34% while order volume scaled 4x.",
    strategy: [
      "Consolidated budget into unified Advantage+ and broad scaling campaigns",
      "Deployed 40+ AI creative variations testing new emotional angles",
      "Managed ad spend strictly against real contribution margin & MER",
    ],
  },
  {
    id: "meta-2",
    channel: "Meta Ads",
    channelColor: "bg-purple-600/20 border-purple-500/40 text-purple-400",
    tag: "Meta Ads • High-Velocity Sprints",
    title: "17.30x ROAS with Rapid Creative Iteration",
    image: "/images/cases/meta-ads-case-2.png",
    stats: [
      { label: "Purchase Value", value: "$431k+" },
      { label: "Ad Spend", value: "$24.9k" },
      { label: "Peak ROAS", value: "17.30x" },
      { label: "Cost / Checkout", value: "$16.06" },
    ],
    summary:
      "Using our proprietary AI production pipeline, we launched 35 hook variations in 7 days, isolating 3 breakout winning creatives that delivered a record 17.30x return on ad spend.",
    strategy: [
      "Ultra-fast AI video iteration targeting high-intent cold audiences",
      "Separated testing campaigns from scaling budget to protect margins",
      "Optimized post-click presell flow to maximize checkout completion",
    ],
  },
  {
    id: "google-1",
    channel: "Google Ads",
    channelColor: "bg-emerald-600/20 border-emerald-500/40 text-emerald-400",
    tag: "Google Ads • Search & PMax Scale",
    title: "10.86x ROAS & $10.7M+ in Omnichannel Sales",
    image: "/images/cases/google-ads-case-1.png",
    stats: [
      { label: "Total Sales", value: "$10.7M+" },
      { label: "Total Cost", value: "$983k" },
      { label: "Conv. Value / Cost", value: "10.86x" },
      { label: "Impressions", value: "97.1M" },
    ],
    summary:
      "Captured high-intent search traffic and scaled Performance Max alongside Meta. Running both channels as one single budget against blended MER created unstoppable cross-channel momentum.",
    strategy: [
      "Search keyword intent clustering with high negative keyword sculpting",
      "Feed-level Performance Max optimization for best-seller margins",
      "Full attribution cross-check against Shopify net bank deposits",
    ],
  },
  {
    id: "google-2",
    channel: "Google Ads",
    channelColor: "bg-teal-600/20 border-teal-500/40 text-teal-400",
    tag: "Google Ads • High-Volume Acquisition",
    title: "9.52x ROAS & $29.83 Cost Per Acquisition",
    image: "/images/cases/google-ads-case-2.png",
    stats: [
      { label: "Sales Volume", value: "$989k+" },
      { label: "Ad Spend", value: "$104k" },
      { label: "Cost / Conv", value: "$29.83" },
      { label: "Value / Cost", value: "9.52x" },
    ],
    summary:
      "Optimized bidding strategy for high contribution margin SKU bundles, driving cost per conversion down while keeping ROAS consistently above 9.5x across all quarters.",
    strategy: [
      "Custom Smart Bidding tROAS adjustments aligned with inventory cycle",
      "Audience signal enrichment using top 5% repeat buyer lists",
      "Targeted product listing ad dominance in non-branded categories",
    ],
  },
];

const adCasesPt = [
  {
    id: "meta-1",
    channel: "Meta Ads",
    channelColor: "bg-blue-600/20 border-blue-500/40 text-blue-400",
    tag: "Meta Ads • Escala de Marca DTC",
    title: "8.32x de ROAS & Mais de $2.95M em Receita Verificada",
    image: "/images/cases/meta-ads-case-1.png",
    stats: [
      { label: "Receita Total", value: "$2.95M+" },
      { label: "Investimento", value: "$355k" },
      { label: "ROAS Médio", value: "8.32x" },
      { label: "Pedidos", value: "7.641" },
    ],
    summary:
      "Reestruturamos a conta de conjuntos fragmentados para um modelo unificado de público amplo (Broad/Advantage+) com testes criativos de IA. O CAC caiu 34% enquanto o volume de pedidos escalou 4x.",
    strategy: [
      "Consolidação de verba em campanhas unificadas Advantage+ e Broad",
      "Produção de mais de 40 variações criativas testando novos ângulos emocionais",
      "Gestão de investimento focada estritamente em margem de contribuição e MER",
    ],
  },
  {
    id: "meta-2",
    channel: "Meta Ads",
    channelColor: "bg-purple-600/20 border-purple-500/40 text-purple-400",
    tag: "Meta Ads • Sprints Criativos Rápidos",
    title: "17.30x de ROAS com Iteração Criativa Acelerada",
    image: "/images/cases/meta-ads-case-2.png",
    stats: [
      { label: "Receita Gerada", value: "$431k+" },
      { label: "Investimento", value: "$24.9k" },
      { label: "Pico de ROAS", value: "17.30x" },
      { label: "Custo / Checkout", value: "$16.06" },
    ],
    summary:
      "Com nossa esteira proprietária de IA, lançamos 35 variações de hook em 7 dias, isolando 3 criativos vencedores que entregaram um retorno recorde de 17.30x de ROAS.",
    strategy: [
      "Iteração ágil de vídeos com IA focando em públicos frios de alta intenção",
      "Separação de campanhas de validação e escala para blindar margens",
      "Otimização da experiência pós-clique para maximizar finalizações de compra",
    ],
  },
  {
    id: "google-1",
    channel: "Google Ads",
    channelColor: "bg-emerald-600/20 border-emerald-500/40 text-emerald-400",
    tag: "Google Ads • Escala em Search & PMax",
    title: "10.86x de ROAS & Mais de $10.7M em Vendas Omnichannel",
    image: "/images/cases/google-ads-case-1.png",
    stats: [
      { label: "Vendas Totais", value: "$10.7M+" },
      { label: "Investimento", value: "$983k" },
      { label: "Valor Conv. / Custo", value: "10.86x" },
      { label: "Impressões", value: "97.1M" },
    ],
    summary:
      "Capturamos tráfego de busca de alta intenção e escalamos o Performance Max integrado ao Meta Ads. Operar ambos como um único orçamento contra o MER gerou tração contínua.",
    strategy: [
      "Clusterização de palavras-chave e negativação agressiva de termos irrelevantes",
      "Otimização de feed no PMax priorizando margem dos produtos mais vendidos",
      "Validação de atribuição cruzada com os depósitos líquidos da loja",
    ],
  },
  {
    id: "google-2",
    channel: "Google Ads",
    channelColor: "bg-teal-600/20 border-teal-500/40 text-teal-400",
    tag: "Google Ads • Aquisição em Alto Volume",
    title: "9.52x de ROAS & $29.83 de Custo por Aquisição",
    image: "/images/cases/google-ads-case-2.png",
    stats: [
      { label: "Volume de Vendas", value: "$989k+" },
      { label: "Investimento", value: "$104k" },
      { label: "Custo / Conv.", value: "$29.83" },
      { label: "Valor / Custo", value: "9.52x" },
    ],
    summary:
      "Otimizamos a estratégia de lances para kits com alta margem de contribuição, reduzindo o custo por conversão e mantendo o ROAS acima de 9.5x em todos os trimestres.",
    strategy: [
      "Lances inteligentes com tROAS ajustados ao ciclo de estoque",
      "Enriquecimento de sinais com listas dos top 5% clientes recorrentes",
      "Domínio de Shopping em categorias de busca genérica",
    ],
  },
];

export default function RarityAdCarouselV2({ onOpenAudit, lang = "en" }: RarityAdCarouselV2Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isPt = lang === "pt";
  const adCases = isPt ? adCasesPt : adCasesEn;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % adCases.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + adCases.length) % adCases.length);
  };

  const current = adCases[currentIndex];

  return (
    <section id="cases" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#00103A] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-extrabold tracking-widest text-brand-teal uppercase block mb-2">
            {isPt ? "CASES REAIS & PROVAS DE PERFORMANCE" : "PROVEN AD CAMPAIGNS & PERFORMANCE PROOF"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {isPt ? "Cases da Rarity & Resultados Comprovados" : "Rarity Ad Cases & Performance Proof"}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/80 max-w-xl mx-auto">
            {isPt
              ? "Explore nossos dashboards reais, arquiteturas de campanhas e números verificados de faturamento."
              : "Explore our real dashboard proofs, ad campaign architectures, and verified revenue numbers."}
          </p>
        </div>

        {/* Carousel Container with Side Navigation Arrows */}
        <div className="relative px-2 sm:px-4">
          {/* Left Arrow on Side */}
          <button
            onClick={prevSlide}
            className="absolute left-0 sm:-left-6 lg:-left-7 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#000c2e]/95 hover:bg-[#D80064] text-white border-2 border-white/20 hover:border-brand-teal shadow-[0_0_25px_rgba(0,0,0,0.7)] flex items-center justify-center transition-all duration-200 cursor-pointer group hover:scale-105"
            aria-label="Previous case"
          >
            <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Right Arrow on Side */}
          <button
            onClick={nextSlide}
            className="absolute right-0 sm:-right-6 lg:-right-7 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#000c2e]/95 hover:bg-[#D80064] text-white border-2 border-white/20 hover:border-brand-teal shadow-[0_0_25px_rgba(0,0,0,0.7)] flex items-center justify-center transition-all duration-200 cursor-pointer group hover:scale-105"
            aria-label="Next case"
          >
            <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Active Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="bg-[#000c2e] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden relative"
            >
              {/* Top Tag & Channel Pill */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${current.channelColor}`}>
                  {current.tag}
                </span>
                <span className="text-xs font-mono text-white/50">
                  Case {currentIndex + 1} of {adCases.length}
                </span>
              </div>

              {/* Case Title */}
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
                {current.title}
              </h3>

              {/* 4 Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-6">
                {current.stats.map((st, i) => (
                  <div
                    key={i}
                    className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center"
                  >
                    <div className="text-2xl sm:text-3xl font-extrabold text-brand-teal font-mono">
                      {st.value}
                    </div>
                    <div className="text-[11px] sm:text-xs text-white/70 uppercase font-semibold mt-1">
                      {st.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* High-Definition Ad & Campaign Dashboard Showcase */}
              <div className="w-full my-6">
                <DashboardPreview caseId={current.id} />
              </div>

              {/* Strategy Highlights */}
              <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
                <p className="text-sm sm:text-base text-white/80 leading-relaxed font-medium">
                  {current.summary}
                </p>
                <ul className="space-y-1.5 pt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {current.strategy.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-white/70 bg-white/[0.02] border border-white/5 rounded-xl p-3">
                      <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Navigation Centered at Bottom */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {adCases.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx
                    ? "w-8 bg-brand-teal shadow-[0_0_10px_rgba(15,227,179,0.7)]"
                    : "w-2.5 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to case ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
