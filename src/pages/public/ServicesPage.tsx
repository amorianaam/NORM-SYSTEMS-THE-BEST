import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  TrendingUp,
  Target,
  Layers,
  Cpu,
  ShieldCheck,
  Binary,
} from "lucide-react";
import SEO from "../../components/common/SEO";
import { slideUp, staggerContainer } from "../../lib/animations";

const SectionIcons = [TrendingUp, Target, Layers, Cpu, ShieldCheck, Binary];

const AbstractVisual = ({ index, isAr }: { index: number; isAr: boolean }) => {
  const variants = [
    // Visual 0: Investment/Growth
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-7xl">
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-magenta)_1px,_transparent_1px)] bg-[size:24px_24px] opacity-10"
      />
      <div className="relative w-64 h-64 border border-magenta/5 rounded-full flex items-center justify-center">
        <motion.div
          animate={{ strokeDashoffset: [100, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-dashed border-magenta/20 rounded-full"
        />
        <TrendingUp className="w-16 h-16 text-magenta/30 stroke-[1]" />
      </div>
    </div>,
    // Visual 1: Strategy/Calibration
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-7xl">
      <div className="absolute inset-0 bg-gradient-to-br from-magenta/[0.03] to-transparent" />
      <div className="relative w-full h-full flex items-center justify-center">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.2 }}
            className="absolute border border-magenta/10 rounded-lg"
            style={{
              width: 100 + i * 40,
              height: 100 + i * 40,
              transform: `rotate(${i * 15}deg)`,
            }}
          />
        ))}
        <Target className="w-16 h-16 text-magenta/30 stroke-[1] z-10" />
      </div>
    </div>,
    // Visual 2: Orginizational/Layers
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-7xl">
      <div className="grid grid-cols-4 gap-4 opacity-10">
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3, delay: i * 0.1, repeat: Infinity }}
            className="w-12 h-12 bg-magenta rounded-lg"
          />
        ))}
      </div>
      <Layers className="w-16 h-16 text-magenta/30 stroke-[1] absolute z-10" />
    </div>,
    // Visual 3: Execution/Cpu
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-7xl">
      <svg className="absolute w-full h-full opacity-10" viewBox="0 0 100 100">
        <motion.path
          d="M10 10 L90 10 L90 90 L10 90 Z"
          fill="none"
          stroke="var(--color-magenta)"
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.path
          d="M20 20 L80 20 L80 80 L20 80 Z"
          fill="none"
          stroke="var(--color-magenta)"
          strokeWidth="0.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
      </svg>
      <Cpu className="w-16 h-16 text-magenta/30 stroke-[1] z-10" />
    </div>,
    // Visual 4: Governance/Shield
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-7xl">
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute w-[150%] h-[150%] border-[0.5px] border-magenta/10 rounded-full"
      />
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-magenta/5 blur-2xl rounded-full"
        />
        <ShieldCheck className="w-16 h-16 text-magenta/30 stroke-[1] z-10" />
      </div>
    </div>,
    // Visual 5: Decision Support/Binary
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-7xl">
      <div className="absolute inset-0 flex flex-wrap gap-2 p-8 opacity-5 font-mono text-[8px] overflow-hidden leading-none">
        {Array.from({ length: 1000 }).map((_, i) => (
          <span key={i}>{Math.round(Math.random())}</span>
        ))}
      </div>
      <Binary className="w-16 h-16 text-magenta/30 stroke-[1] z-10" />
    </div>,
  ];

  return variants[index] || null;
};

interface SystemCardProps {
  section: any;
  idx: number;
  isAr: boolean;
  labels: any;
  key?: any;
}

function SystemCard({ section, idx, isAr, labels }: SystemCardProps) {
  const Icon = SectionIcons[idx];
  const [activeTab, setActiveTab] = useState<"logic" | "scope" | "impact">(
    "logic",
  );

  const tabOptions = [
    { id: "logic" as const, label: labels.logic },
    { id: "scope" as const, label: labels.scope },
    { id: "impact" as const, label: labels.impact },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-10%" }}
      className="group relative"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-stretch">
        {/* Left Column: Visual & Header */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="relative flex-1 glass border border-void/10 rounded-5xl lg:rounded-7xl p-6 lg:p-12 transition-all duration-700 hover:border-magenta/20 shadow-2xl overflow-hidden min-h-[200px] lg:min-h-0">
            <AbstractVisual index={idx} isAr={isAr} />

            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-white border border-void/5 flex items-center justify-center mb-6 lg:mb-8 shadow-sm">
                  <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-magenta stroke-[1.5]" />
                </div>
                <span className="micro-label mb-3 lg:mb-4 block text-magenta/40">
                  SYSTEM 0{idx + 1}
                </span>
                <h2 className="heading-sm text-ink group-hover:text-magenta transition-colors duration-500">
                  {section.title}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Segment Switcher on Mobile/Tablet & Expanded Stack on Desktop */}
        <div className="lg:col-span-7">
          {/* Mobile Segments Tab Bar */}
          <div className="lg:hidden bg-void/5 p-1 rounded-2xl flex gap-1 mb-4 select-none relative z-10">
            {tabOptions.map((opt) => {
              const isActive = activeTab === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setActiveTab(opt.id)}
                  className={`relative flex-1 py-3 btn-text tracking-wider transition-all duration-300 rounded-xl outline-none focus-visible:ring-1 focus-visible:ring-magenta ${
                    isActive ? "text-magenta" : "text-ink/50 hover:text-ink"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId={`active-pill-${idx}`}
                      className="absolute inset-0 bg-white rounded-xl shadow-sm border border-void/5"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Display Container */}
          <div className="lg:hidden min-h-[160px] relative">
            <AnimatePresence mode="wait">
              {activeTab === "logic" && (
                <motion.div
                  key="logic"
                  initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isAr ? -20 : 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 backdrop-blur-sm p-6 sm:p-10 rounded-5xl border border-void/5 shadow-xl shadow-void/[0.01]"
                >
                  <p className="body-md text-ink/80">
                    {section.logic}
                  </p>
                </motion.div>
              )}

              {activeTab === "scope" && (
                <motion.div
                  key="scope"
                  initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isAr ? -20 : 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/40 p-6 sm:p-10 rounded-5xl border border-void/5"
                >
                  <p className="body-sm text-ink/60 whitespace-pre-line">
                    {section.scope}
                  </p>
                </motion.div>
              )}

              {activeTab === "impact" && (
                <motion.div
                  key="impact"
                  initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isAr ? -20 : 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-magenta/5 border border-magenta/10 p-6 sm:p-10 rounded-5xl"
                >
                  <p className="body-sm font-bold text-magenta">
                    {section.impact}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Expanded Layout (Remains stacked for luxury desktop presentation) */}
          <div className="hidden lg:flex lg:flex-col space-y-6">
            {/* Logic Gate */}
            <div className="bg-white/80 backdrop-blur-sm p-10 rounded-6xl border border-void/5 hover:border-magenta/20 transition-all duration-500 shadow-xl shadow-void/[0.01]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-magenta" />
                <span className="micro-label">
                  {labels.logic}
                </span>
              </div>
              <p className="body-lg text-ink/80">
                {section.logic}
              </p>
            </div>

            {/* Intervention Scope */}
            <div className="bg-white/40 p-10 rounded-6xl border border-void/5 group-hover:border-void/10 transition-all duration-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-void/25" />
                <span className="micro-label text-ink/30">
                  {labels.scope}
                </span>
              </div>
              <p className="body-sm text-ink/60 whitespace-pre-line">
                {section.scope}
              </p>
            </div>

            {/* Impact Statement */}
            <div className="bg-magenta/5 border border-magenta/10 p-10 rounded-6xl transition-all duration-500 group-hover:bg-magenta/[0.08]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-magenta" />
                <span className="micro-label">
                  {labels.impact}
                </span>
              </div>
              <p className="body-sm text-magenta">
                {section.impact}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ServicesPage() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const content = t.servicesPage;
  const labels = content.hero.labels;

  const siteUrl = "https://norm.sa";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Institutional Systems & Decision Architecture",
    provider: {
      "@type": "Organization",
      name: "NORM | Decision Architecture House",
      url: siteUrl,
    },
    description: content.hero.intro,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: isAr ? "Ù†Ø·Ø§Ù‚ Ø§Ù„Ø¹Ù…Ù„" : "Scope of Work",
      itemListElement: content.sections.map((section: any, idx: number) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: section.title,
          description: section.logic,
        },
      })),
    },
  };

  return (
    <div className="bg-parchment min-h-screen" dir={isAr ? "rtl" : "ltr"}>
      <SEO
        title={isAr ? "Ø§Ù„Ø£Ù†Ø¸Ù…Ø© Ø§Ù„Ù…Ø¤Ø³Ø³ÙŠØ©" : "Systems"}
        description={content.hero.intro}
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-void/5 pt-32 md:pt-40 lg:pt-48 pb-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="container-wide"
        >
          <div className="max-w-4xl">
            <motion.span
              variants={slideUp}
              className="micro-label mb-8 block"
            >
              {content.hero.eyebrow}
            </motion.span>
            <motion.h1
              variants={slideUp}
              className="heading-xl mb-12 text-ink"
            >
              {content.hero.title}
            </motion.h1>
            <motion.p
              variants={slideUp}
              className="body-lg"
            >
              {content.hero.intro}
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Systems Grid/Stack */}
      <section className="py-20 md:py-40">
        <div className="container-wide space-y-12 md:space-y-24">
          {content.sections.map((section: any, idx: number) => (
            <SystemCard
              key={idx}
              section={section}
              idx={idx}
              isAr={isAr}
              labels={labels}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding py-60 bg-void text-parchment text-center relative overflow-hidden">
        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-md mb-16 max-w-2xl mx-auto">
              {content.cta.title}
            </h2>
            <Link
              to="/norm/contact"
              className="inline-flex items-center gap-6 px-12 py-5 bg-magenta text-parchment rounded-full btn-text hover:bg-white hover:text-void transition-all duration-500 hover:shadow-[0_0_25px_rgba(224,27,139,0.7)] group"
            >
              {content.cta.button}
              <ArrowRight
                className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""}`}
              />
            </Link>
          </motion.div>
        </div>

        {/* Abstract Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-magenta)_1px,_transparent_1px)] bg-[size:40px_40px]" />
        </div>
      </section>
    </div>
  );
}
