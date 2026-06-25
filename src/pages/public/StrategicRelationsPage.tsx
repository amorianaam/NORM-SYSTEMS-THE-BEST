import React from "react";
import { motion } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowRight, LineChart, Briefcase, Building2 } from "lucide-react";
import SEO from "../../components/common/SEO";
import { slideUp, staggerContainer } from "../../lib/animations";

// Hardcoded icons mapping to prevent CMS UI breaks
const ICONS_BY_INDEX = [LineChart, Briefcase, Building2];

// Partners data

export default function StrategicRelationsPage() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const content = t.strategicRelationsPage;
  const [activePartnerCard, setActivePartnerCard] = React.useState(0);

  const [PARTNERS_LOGOS, setPartnersLogos] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch("/api/partners")
      .then((res) => res.json())
      .then((data) => setPartnersLogos(data))
      .catch((err) => console.error("Failed to fetch partners:", err));
  }, []);

  return (
    <div
      className="bg-parchment min-h-screen relative overflow-clip"
      dir={isAr ? "rtl" : "ltr"}
    >
      <SEO
        title={isAr ? "Ø§Ù„Ø´Ø±Ø§ÙƒØ§Øª Ø§Ù„Ø§Ø³ØªØ±Ø§ØªÙŠØ¬ÙŠØ©" : "Strategic Relations"}
        description={content.hero.intro}
      />

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0 mix-blend-multiply flex items-center justify-center overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="w-[150vw] h-[150vw] border-[1px] border-ink rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-dashed opacity-50"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="w-[100vw] h-[100vw] border-[1px] border-ink rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70"
        />
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="w-[50vw] h-[50vw] border-[1px] border-ink rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Intro Section */}
        <section className="pt-32 md:pt-40 lg:pt-48 pb-24 mb-12">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-4xl"
          >
            <motion.span variants={slideUp} className="micro-label mb-8 block !text-magenta/80">
              {content.hero.eyebrow}
            </motion.span>
            <motion.h1 variants={slideUp} className="heading-xl mb-8 md:mb-12 text-void">
              {content.hero.title}
            </motion.h1>
            <motion.p variants={slideUp} className="body-lg text-void/80 max-w-3xl">
              {content.hero.intro}
            </motion.p>
          </motion.div>
        </section>

        {/* Partners Breakdown */}
        <div className="max-w-7xl mx-auto flex flex-col justify-center mb-24 lg:mb-32">
          <div className="relative mt-8 md:mt-16 pb-20">
            {/* Mobile Stacked Carousel */}
            <div className="lg:hidden relative h-[320px] sm:h-[340px] w-[80%] max-w-[300px] sm:max-w-[320px] mx-auto mb-16">
              {content.partners.map((partner: any, index: number) => {
                const Icon = ICONS_BY_INDEX[index % 3];

                let position = "center";
                if (index === activePartnerCard) {
                  position = "center";
                } else if (index === (activePartnerCard + 1) % 3) {
                  position = isAr ? "left" : "right";
                } else {
                  position = isAr ? "right" : "left";
                }

                const variants = {
                  center: {
                    x: 0,
                    y: 0,
                    scale: 1,
                    rotate: 0,
                    zIndex: 30,
                    opacity: 1,
                  },
                  right: {
                    x: "35%",
                    y: 12,
                    scale: 0.85,
                    rotate: 6,
                    zIndex: 20,
                    opacity: 0.6,
                  },
                  left: {
                    x: "-35%",
                    y: 12,
                    scale: 0.85,
                    rotate: -6,
                    zIndex: 20,
                    opacity: 0.6,
                  },
                };

                return (
                  <motion.div
                    key={index}
                    variants={variants}
                    initial={false}
                    animate={position}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => setActivePartnerCard(index)}
                    drag={index === activePartnerCard ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.4}
                    onDragEnd={(_event, info) => {
                      const swipeThreshold = 50;
                      const isNext = isAr ? info.offset.x > swipeThreshold : info.offset.x < -swipeThreshold;
                      const isPrev = isAr ? info.offset.x < -swipeThreshold : info.offset.x > swipeThreshold;
                      if (isNext) {
                        setActivePartnerCard((prev) => (prev + 1) % 3);
                      } else if (isPrev) {
                        setActivePartnerCard((prev) => (prev - 1 + 3) % 3);
                      }
                    }}
                    className="absolute inset-0 bg-parchment border border-ink/5 rounded-[2rem] sm:rounded-5xl p-6 sm:p-8 flex flex-col shadow-2xl shadow-ink/10 cursor-pointer overflow-hidden touch-pan-y"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-magenta/5 rounded-bl-[100px] -mr-8 -mt-8 pointer-events-none" />

                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-ink/[0.02]">
                        <Icon
                          className="w-6 h-6 text-magenta"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-4xl sm:text-5xl font-serif text-ink/[0.04] font-bold block leading-none select-none">
                        0{index + 1}
                      </span>
                    </div>

                    <div className="flex-grow flex flex-col justify-center relative z-10">
                      <h3 className="heading-sm mb-4 text-ink">
                        {partner.title}
                      </h3>
                      <p className="body-sm text-pretty">
                        {partner.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}

              <div className="absolute -bottom-16 left-0 right-0 flex flex-col items-center gap-3">
                <div className="flex justify-center gap-3">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      onClick={() => setActivePartnerCard(i)}
                      className={`h-2 rounded-full transition-all duration-500 focus:outline-none ${activePartnerCard === i ? "bg-magenta w-8" : "bg-ink/10 w-2 hover:bg-magenta/30"}`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
                <span className="micro-label !text-ink/30 text-center">
                  {content.swipeHint}
                </span>
              </div>
            </div>

            {/* Desktop Grid */}
            <div className="hidden lg:grid grid-cols-3 gap-8 lg:gap-10">
              {content.partners.map((partner: any, index: number) => {
                const Icon = ICONS_BY_INDEX[index % 3];
                return (
                  <div
                    key={index}
                    className="relative group bg-parchment border border-ink/5 rounded-5xl p-8 md:p-10 lg:p-12 flex flex-col hover:border-magenta/20 hover:shadow-glow-magenta-lg transition-all duration-700 overflow-hidden hover:-translate-y-1"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-magenta/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform duration-700 group-hover:scale-150" />

                    <div className="flex justify-between items-start mb-16 relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-ink/[0.02] group-hover:shadow-magenta/[0.1] transition-all duration-500">
                        <Icon
                          className="w-7 h-7 text-ink group-hover:text-magenta transition-colors duration-500"
                          aria-hidden="true"
                        />
                      </div>
                      <span
                        className="text-6xl md:text-7xl font-serif text-ink/[0.03] font-bold block leading-none select-none group-hover:text-magenta/[0.05] transition-colors duration-500"
                        aria-hidden="true"
                      >
                        0{index + 1}
                      </span>
                    </div>

                    <div className="flex-grow flex flex-col relative z-10">
                      <h3 className="heading-sm mb-5 group-hover:text-magenta transition-colors duration-500">
                        {partner.title}
                      </h3>
                      <p className="body-sm text-pretty">
                        {partner.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Logos Marquee Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1 }}
          className="mb-24 lg:mb-32 border-t border-b border-void/5 py-16 overflow-hidden"
        >
          <div className="text-center mb-16 px-6">
            <h3 className="heading-lg text-void/90">
              {content.successPartners}
            </h3>
          </div>

          <div
            className="relative w-full overflow-hidden flex flex-col gap-6 md:gap-8"
            dir="ltr"
          >
            {/* Soft gradient masks for the marquee edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-parchment to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-parchment to-transparent z-10" />

            {/* Row 1: Right to left (due to LTR dir, translateX(-50%) moves Left) */}
            <div className="flex w-max animate-marquee-left gap-4 md:gap-6 lg:gap-8 px-2 md:px-4">
              {[...PARTNERS_LOGOS, ...PARTNERS_LOGOS].map((logo, idx) => (
                <div
                  key={`r1-${idx}`}
                  className="w-[100px] md:w-[120px] lg:w-[140px] shrink-0 aspect-[3/2] flex items-center justify-center p-2 md:p-3 bg-white/60 rounded-xl md:rounded-2xl border border-void/5 hover:border-magenta/50 hover:shadow-2xl hover:shadow-magenta/20 backdrop-blur-sm group cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:scale-[1.08] hover:bg-white"
                >
                  <img
                    src={logo.src}
                    alt={logo.name}
                    loading="lazy"
                    className="max-w-[90%] max-h-[90%] object-contain mix-blend-multiply group-hover:scale-[1.15] transition-transform duration-500"
                  />
                </div>
              ))}
            </div>

            {/* Row 2: Left to right (due to LTR dir, translateX(-50%) to 0 moves Right) */}
            <div className="flex w-max animate-marquee-right gap-4 md:gap-6 lg:gap-8 px-2 md:px-4">
              {[...PARTNERS_LOGOS]
                .reverse()
                .concat([...PARTNERS_LOGOS].reverse())
                .map((logo, idx) => (
                  <div
                    key={`r2-${idx}`}
                    className="w-[100px] md:w-[120px] lg:w-[140px] shrink-0 aspect-[3/2] flex items-center justify-center p-2 md:p-3 bg-white/60 rounded-xl md:rounded-2xl border border-void/5 hover:border-magenta/50 hover:shadow-2xl hover:shadow-magenta/20 backdrop-blur-sm group cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:scale-[1.08] hover:bg-white"
                  >
                    <img
                      src={logo.src}
                      alt={logo.name}
                      loading="lazy"
                      className="max-w-[90%] max-h-[90%] object-contain mix-blend-multiply group-hover:scale-[1.15] transition-transform duration-500"
                    />
                  </div>
                ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Final Statement & CTA */}
      <section className="py-16 md:py-20 bg-void/5 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="w-12 h-1 bg-magenta mx-auto mb-10 opacity-30" />
          <p className="heading-md text-void/90 mb-16 max-w-4xl mx-auto">
            {content.finalStatement}
          </p>
          <Link
            to="/norm/contact"
            className="inline-flex items-center gap-6 px-12 py-5 border-2 border-magenta text-magenta rounded-full btn-text hover:bg-magenta hover:text-parchment transition-all duration-500 group"
          >
            {content.cta}
            <ArrowRight
              className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""}`}
            />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
