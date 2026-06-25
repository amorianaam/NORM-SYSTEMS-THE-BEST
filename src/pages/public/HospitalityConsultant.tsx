import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { useLanguage } from "../../context/LanguageContext";
import SEO from "../../components/common/SEO";
import {
  Building2,
  ClipboardCheck,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Cpu,
  ArrowRight,
  ArrowLeft,
  Phone,
  Mail,
  CheckCircle2,
  Search,
  Settings,
  Zap,
  BarChart3,
  Star,
  Shield,
  ChevronDown,
  ChevronUp,
  Globe2,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { slideUp, staggerContainer } from "../../lib/animations";

/* â”€â”€â”€ Components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

function StackedCardCarousel({ items, isAr }: { items: any[]; isAr: boolean }) {
  const [activeCard, setActiveCard] = useState(0);
  const { t } = useLanguage();
  const tc = t.hospitalityConsultantPage;

  return (
    <div className="lg:hidden relative h-[340px] sm:h-[380px] w-[85%] max-w-[320px] sm:max-w-[360px] mx-auto mb-20 mt-10">
      {items.map((item, index) => {
        const Icon = item.icon;

        let position = "center";
        const total = items.length;
        if (index === activeCard) {
          position = "center";
        } else if (index === (activeCard + 1) % total) {
          position = isAr ? "left" : "right";
        } else if (index === (activeCard - 1 + total) % total) {
          position = isAr ? "right" : "left";
        } else {
          position = "hidden"; // For arrays > 3 elements
        }

        const variants = {
          center: { x: 0, y: 0, scale: 1, rotate: 0, zIndex: 30, opacity: 1 },
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
          hidden: {
            x: 0,
            y: 20,
            scale: 0.7,
            rotate: 0,
            zIndex: 10,
            opacity: 0,
          },
        };

        return (
          <motion.div
            key={index}
            variants={variants}
            initial={false}
            animate={position}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setActiveCard(index)}
            drag={index === activeCard ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(_event, info) => {
              const swipeThreshold = 50;
              const isNext = isAr ? info.offset.x > swipeThreshold : info.offset.x < -swipeThreshold;
              const isPrev = isAr ? info.offset.x < -swipeThreshold : info.offset.x > swipeThreshold;
              if (isNext) {
                setActiveCard((prev) => (prev + 1) % total);
              } else if (isPrev) {
                setActiveCard((prev) => (prev - 1 + total) % total);
              }
            }}
            className={`absolute inset-0 bg-white border border-ink/5 rounded-[2rem] sm:rounded-5xl p-6 sm:p-8 flex flex-col shadow-2xl shadow-ink/10 cursor-pointer overflow-hidden touch-pan-y ${isAr ? "text-right" : "text-left"}`}
          >
            <div
              className={`absolute top-0 w-32 h-32 bg-magenta/5 -mt-8 pointer-events-none ${isAr ? "left-0 rounded-br-[100px] -ml-8" : "right-0 rounded-bl-[100px] -mr-8"}`}
            />

            <div
              className={`flex justify-between items-start mb-8 relative z-10 ${isAr ? "flex-row-reverse" : ""}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-parchment flex items-center justify-center shadow-lg shadow-ink/[0.02]">
                <Icon className="w-6 h-6 text-magenta" aria-hidden="true" />
              </div>
              <span className="text-4xl sm:text-5xl font-serif text-ink/[0.04] font-bold block leading-none select-none">
                0{index + 1}
              </span>
            </div>

            <div className="flex-grow flex flex-col justify-center relative z-10">
              <h3 className="heading-sm mb-4 text-ink">
                {item.title}
              </h3>
              <p className="body-sm text-pretty">
                {item.body}
              </p>
            </div>
          </motion.div>
        );
      })}

      <div className="absolute -bottom-16 left-0 right-0 flex flex-col items-center gap-3">
        <div className="flex justify-center gap-3">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveCard(i)}
              className={`h-2 rounded-full transition-all duration-500 focus:outline-none ${activeCard === i ? "bg-magenta w-8" : "bg-ink/10 w-2 hover:bg-magenta/30"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <span className="micro-label text-ink/30 text-center">
          {tc.ui?.swipeHint}
        </span>
      </div>
    </div>
  );
}

/* â”€â”€â”€ Floating Orb â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function FloatingOrb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      animate={{ y: [-20, 20, -20], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* â”€â”€â”€ MAIN COMPONENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function HospitalityConsultant() {
  const { language, t } = useLanguage();
  const isAr = language === "ar";

  const tc = t.hospitalityConsultantPage;

  // Build the items arrays by merging translations with icons
  const POSITIONING_ICONS = [Settings, Building2, BarChart3];
  const positioningItems = tc.positioning.items.map((item: any, i: number) => ({
    ...item,
    icon: POSITIONING_ICONS[i] || Settings,
  }));

  const SERVICE_ICONS = [
    ClipboardCheck,
    ShieldCheck,
    AlertTriangle,
    TrendingUp,
    MapPin,
    Cpu,
  ];
  const servicesItems = tc.services.items.map((item: any, i: number) => ({
    ...item,
    icon: SERVICE_ICONS[i] || Settings,
  }));

  const VALUE_ICONS = [Search, Star, Shield, Settings];
  const valueItems = tc.value.items.map((item: any, i: number) => ({
    ...item,
    icon: VALUE_ICONS[i] || Settings,
  }));

  const [activeService, setActiveService] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let nextIndex = Math.floor(latest * servicesItems.length);
    if (nextIndex >= servicesItems.length) nextIndex = servicesItems.length - 1;
    if (nextIndex !== activeService) {
      setActiveService(nextIndex);
    }
  });

  const scrollToService = (index: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const containerTop = rect.top + scrollTop;
    const scrollableDistance = rect.height - window.innerHeight;
    const targetProgress = (index + 0.5) / servicesItems.length;
    const targetScrollY = containerTop + targetProgress * scrollableDistance;
    window.scrollTo({ top: targetScrollY, behavior: "smooth" });
  };

  const activeServiceItem = servicesItems[activeService];
  const ITEM_HEIGHT = isMobile ? 65 : 85;

  const siteUrl = "https://norm.sa";
  const orgName = tc.seo?.orgName;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: tc.seo?.serviceName,
    url: `${siteUrl}/hospitality-consultant`,
    description: tc.hero.body,
    mainEntity: {
      "@type": "Service",
      name: tc.seo?.mainEntityName,
      provider: {
        "@type": "Organization",
        name: orgName,
        url: siteUrl,
      },
      description: tc.hero.body,
    },
  };

  return (
    <motion.div
      style={{ position: "relative" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-parchment min-h-screen text-void"
      dir={isAr ? "rtl" : "ltr"}
    >
      <SEO
        title={tc.seo?.title}
        description={tc.hero.body}
        keywords={tc.seo?.keywords}
        structuredData={structuredData}
      />

      {/* â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative flex overflow-hidden bg-void rounded-b-[3rem] lg:rounded-b-[5rem] pt-32 md:pt-40 lg:pt-48 pb-24">
        <div className="absolute inset-0 bg-gradient-radial-magenta" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        <FloatingOrb className="w-96 h-96 bg-magenta/10 blur-3xl top-1/4 left-1/4" />

        <div className="container-wide relative z-10 pb-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              variants={slideUp}
              className="micro-label text-parchment/80 block mb-10"
            >
              {tc.hero.eyebrow}
            </motion.span>

            <motion.h1
              variants={slideUp}
              className="heading-xl mb-6 text-parchment max-w-5xl"
            >
              {tc.hero.title}
            </motion.h1>

            <motion.p
              variants={slideUp}
              className="body-md text-parchment max-w-3xl mb-14"
            >
              {tc.hero.body}
            </motion.p>

            <motion.div
              variants={slideUp}
              className="flex flex-wrap items-center gap-4"
            >
              <a
                href="#services"
                className="inline-flex items-center gap-3 bg-magenta text-parchment px-8 py-4 rounded-full btn-text hover:bg-parchment hover:text-void transition-all duration-500 hover:shadow-[0_0_30px_rgba(224,27,139,0.5)]"
              >
                {tc.hero.ctaServices}
                {isAr ? (
                  <ArrowLeft className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-3 border border-white/15 text-parchment/70 px-8 py-4 rounded-full btn-text hover:border-magenta hover:text-magenta transition-all duration-500"
              >
                {tc.hero.ctaContact}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── POSITIONING ────────────────────────────────────────────────────────── */}
      <section className="py-28 bg-parchment overflow-hidden">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <span className="micro-label mb-5 block">
              {tc.positioning.eyebrow}
            </span>
            <h2 className="heading-lg max-w-3xl mb-6">
              {tc.positioning.title}
            </h2>
            <p className="body-md max-w-3xl">
              {tc.positioning.body}
            </p>
          </motion.div>

          <StackedCardCarousel items={positioningItems} isAr={isAr} />

          <div className="hidden lg:grid md:grid-cols-3 gap-8">
            {positioningItems.map((item: any, i: number) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                  className={`relative group bg-white border border-ink/5 rounded-5xl p-8 md:p-10 lg:p-12 flex flex-col hover:border-magenta/20 hover:shadow-glow-magenta-lg transition-all duration-700 overflow-hidden hover:-translate-y-1 ${isAr ? "text-right" : "text-left"}`}
                >
                  <div
                    className={`absolute top-0 w-32 h-32 bg-magenta/5 -mt-8 transition-transform duration-700 group-hover:scale-150 ${isAr ? "left-0 rounded-br-[100px] -ml-8" : "right-0 rounded-bl-[100px] -mr-8"}`}
                  />

                  <div
                    className={`flex justify-between items-start mb-16 relative z-10 ${isAr ? "flex-row-reverse" : ""}`}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-parchment flex items-center justify-center shadow-lg shadow-ink/[0.02] group-hover:shadow-magenta/[0.1] transition-all duration-500">
                      <Icon className="w-7 h-7 text-ink group-hover:text-magenta transition-colors duration-500" />
                    </div>
                    <span className="text-6xl md:text-7xl font-serif text-ink/[0.03] font-bold block leading-none select-none group-hover:text-magenta/[0.05] transition-colors duration-500">
                      0{i + 1}
                    </span>
                  </div>

                  <div className="flex-grow flex flex-col relative z-10">
                    <h3 className="heading-sm mb-5 group-hover:text-magenta transition-colors duration-500">
                      {item.title}
                    </h3>
                    <p className="body-sm text-pretty">
                      {item.body}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DPP PHILOSOPHY ──────────────────────────────────────────────────────── */}
      <section className="py-28 bg-void overflow-hidden relative">
        <FloatingOrb className="w-80 h-80 bg-magenta/6 blur-3xl top-0 right-0" />
        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20"
          >
            <div className="max-w-2xl">
              <span className="micro-label mb-5 block">
                {tc.dpp.eyebrow}
              </span>
              <h2 className="heading-lg text-parchment mb-6">
                {tc.dpp.title}
              </h2>
              <p className="body-md text-parchment/60">
                {tc.dpp.body}
              </p>
            </div>
            <div className="hidden md:flex shrink-0 w-32 h-32 rounded-full border border-white/10 items-center justify-center relative">
              <div className="absolute inset-2 rounded-full border border-dashed border-magenta/30 animate-[spin_20s_linear_infinite]" />
              <Zap className="w-8 h-8 text-magenta" />
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {tc.dpp.steps.map((step: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative bg-white/5 border border-white/10 rounded-[2rem] p-8 lg:p-10 hover:bg-white/10 hover:border-magenta/30 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-magenta/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div
                  className={`flex items-start gap-6 ${isAr ? "flex-row-reverse" : ""}`}
                >
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-void border border-white/10 flex items-center justify-center heading-md text-parchment/80 group-hover:text-magenta group-hover:border-magenta/50 transition-colors shadow-lg">
                    0{i + 1}
                  </div>
                  <div
                    className={`flex-1 ${isAr ? "text-right" : "text-left"}`}
                  >
                    <h3 className="heading-sm text-parchment mb-3">
                      {step.label}
                    </h3>
                    <p className="body-sm text-parchment/60">
                      {step.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES (STICKY CAROUSEL) ────────────────────────── */}
      <section id="services" className="py-28 bg-parchment relative">
        <div className="container-wide mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="micro-label mb-5 block">
              {tc.services.eyebrow}
            </span>
            <h2 className="heading-lg max-w-3xl">
              {tc.services.title}
            </h2>
          </motion.div>
        </div>

        {/* Mobile Stacked Carousel */}
        <div className="lg:hidden overflow-hidden w-full">
          <StackedCardCarousel items={servicesItems} isAr={isAr} />
        </div>

        <div className="container-wide">
          {/* Desktop Sticky Carousel */}
          <div
            ref={containerRef}
            className="hidden lg:block relative h-[600vh]"
            style={{ position: "relative" }}
          >
            <div className="sticky top-[10vh] h-[80vh] flex flex-row rounded-5xl overflow-hidden border border-void/8 shadow-2xl shadow-void/10">
              <div
                className={`w-[30%] bg-void relative overflow-hidden flex flex-col justify-center ${isAr ? "order-2 border-r border-white/5" : "border-l border-white/5"}`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(224,27,139,0.08),transparent_60%)] pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                <button
                  onClick={() =>
                    activeService > 0 && scrollToService(activeService - 1)
                  }
                  disabled={activeService === 0}
                  className={`absolute top-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 transition-opacity ${activeService === 0 ? "opacity-10 cursor-not-allowed" : "opacity-40 hover:opacity-100 cursor-pointer"}`}
                >
                  <ChevronUp
                    className={`w-5 h-5 text-parchment ${activeService > 0 ? "animate-bounce" : ""}`}
                  />
                </button>

                <button
                  onClick={() =>
                    activeService < servicesItems.length - 1 &&
                    scrollToService(activeService + 1)
                  }
                  disabled={activeService === servicesItems.length - 1}
                  className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 transition-opacity ${activeService === servicesItems.length - 1 ? "opacity-10 cursor-not-allowed" : "opacity-40 hover:opacity-100 cursor-pointer"}`}
                >
                  <ChevronDown
                    className={`w-5 h-5 text-parchment ${activeService < servicesItems.length - 1 ? "animate-bounce" : ""}`}
                  />
                </button>

                <div className="relative z-10 w-full h-[160px] lg:h-[300px] flex items-center justify-center overflow-hidden">
                  {servicesItems.map((s: any, i: number) => {
                    const distance = Math.abs(i - activeService);
                    const isSelected = i === activeService;
                    const translateY = (i - activeService) * ITEM_HEIGHT;

                    let opacity = 0;
                    if (distance === 0) opacity = 1;
                    else if (distance === 1) opacity = 0.4;
                    else if (distance === 2) opacity = 0.1;

                    return (
                      <motion.button
                        key={i}
                        initial={false}
                        onClick={() => scrollToService(i)}
                        animate={{
                          y: translateY,
                          scale: isSelected ? 1 : 0.85,
                          opacity,
                        }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className={`absolute w-full px-4 lg:px-8 py-2 lg:py-4 flex items-center gap-3 lg:gap-5 cursor-pointer ${isAr ? "flex-row-reverse text-right" : "text-left"}`}
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 lg:w-11 lg:h-11 rounded-full border flex items-center justify-center transition-colors duration-500 shadow-lg ${
                            isSelected
                              ? "bg-magenta border-magenta text-parchment shadow-magenta/25"
                              : "bg-transparent border-white/10 text-parchment/40"
                          }`}
                        >
                          <span className="body-md">
                            0{i + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span
                            className={`micro-label block mb-0.5 lg:mb-1 transition-colors duration-500 ${
                              isSelected ? "text-magenta" : "text-parchment/30"
                            }`}
                          >
                            {s.tagline}
                          </span>
                          <span
                            className={`body-sm transition-colors duration-500 line-clamp-1 lg:line-clamp-2 ${
                              isSelected
                                ? "text-parchment"
                                : "text-parchment/50"
                            }`}
                          >
                            {s.title}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div
                className={`w-full lg:w-[70%] flex-1 bg-white relative flex flex-col ${isAr ? "lg:order-1" : ""}`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeService}
                    initial={{ opacity: 0, x: isAr ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isAr ? 30 : -30 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 flex flex-col p-8 md:p-14 lg:p-20 overflow-y-auto hide-scrollbar"
                  >
                    <div
                      className={`flex flex-col h-full ${isAr ? "text-right" : "text-left"}`}
                    >
                      <div className="mb-6 lg:mb-8 lg:-translate-y-2">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 mb-6">
                          <div className="w-14 h-14 shrink-0 rounded-2xl bg-magenta/5 flex items-center justify-center border border-magenta/10">
                            {activeServiceItem.icon && (
                              <activeServiceItem.icon className="w-6 h-6 text-magenta" />
                            )}
                          </div>
                          <h3 className="heading-sm text-void mb-0">
                            {activeServiceItem.title}
                          </h3>
                        </div>
                        <p className="body-md text-void/60 max-w-2xl">
                          {activeServiceItem.body}
                        </p>
                      </div>

                      <div className="bg-parchment/50 rounded-2xl p-6 lg:p-8 mb-8 border border-ink/5">
                        <h4 className="micro-label text-void/40 mb-6 flex items-center gap-2">
                          {tc.ui?.deliverables}
                          <div className="h-px bg-void/10 flex-1 ml-4" />
                        </h4>
                        <ul className="grid gap-4">
                          {activeServiceItem.outputs.map(
                            (output: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-magenta shrink-0 mt-0.5" />
                                <span className="body-sm text-void/80">
                                  {output}
                                </span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>


                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ VALUE PROPOSITION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-28 bg-white border-t border-ink/5 relative overflow-hidden">
        <FloatingOrb className="w-[500px] h-[500px] bg-magenta/5 blur-[100px] -bottom-1/2 -left-1/4" />
        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <span className="micro-label mb-5 block">
              {tc.value.eyebrow}
            </span>
            <h2 className="heading-lg">{tc.value.title}</h2>
          </motion.div>

          {/* Mobile/Tablet View (Stacked Deck) */}
          <div className="lg:hidden overflow-hidden w-full mb-16 mt-8">
            <StackedCardCarousel items={valueItems} isAr={isAr} />
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-6">
            {valueItems.map((item: any, i: number) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`group bg-parchment border border-ink/5 rounded-[2rem] p-8 hover:bg-void hover:text-parchment transition-all duration-500 ${isAr ? "text-right" : "text-left"}`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-white group-hover:bg-white/10 flex items-center justify-center mb-8 border border-ink/5 group-hover:border-white/10 transition-all duration-500">
                    <Icon className="w-6 h-6 text-void group-hover:text-magenta transition-colors" />
                  </div>
                  <h3 className="heading-sm mb-4">{item.title}</h3>
                  <p className="body-sm">
                    {item.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* â”€â”€ ROADMAP / JOURNEY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-28 bg-parchment relative">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20 text-center"
          >
            <span className="micro-label mb-5 block">
              {tc.roadmap.eyebrow}
            </span>
            <h2 className="heading-lg">{tc.roadmap.title}</h2>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            {/* Desktop Track (Background + Progress) */}
            <div className="hidden lg:block absolute top-[31px] left-0 w-full h-[2px] bg-magenta/10 z-0">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className={`absolute top-0 bottom-0 bg-magenta ${isAr ? "right-0" : "left-0"}`}
              />
            </div>

            {/* Mobile Track (Background + Progress) */}
            <div className="lg:hidden absolute top-0 bottom-0 w-[2px] bg-magenta/10 z-0 start-[27px]">
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute start-0 end-0 top-0 bg-magenta"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-4 relative z-10">
              {tc.roadmap.steps.map((step: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.3 }}
                  className={`relative flex flex-row lg:flex-col items-start lg:items-center ${isAr ? "text-right lg:text-center" : "text-left lg:text-center"} gap-5 lg:gap-0`}
                >
                  <div className="w-14 h-14 lg:w-16 lg:h-16 shrink-0 rounded-full bg-magenta text-white flex items-center justify-center font-black text-xl lg:text-2xl shadow-lg shadow-magenta/20 border-4 border-parchment relative z-10 lg:mb-6">
                    0{i + 1}
                  </div>
                  <div className="flex flex-col pt-2 lg:pt-0">
                    <h3 className="heading-sm text-void mb-3">
                      {step.title}
                    </h3>
                    <p className="body-sm text-void/60">
                      {step.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ TARGET AUDIENCE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-28 bg-white border-t border-ink/5">
        <div className="container-wide">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: isAr ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`lg:w-1/3 text-center mb-12 lg:mb-0 ${isAr ? "lg:text-right" : "lg:text-left"}`}
            >
              <span className="micro-label mb-5 inline-block">
                {tc.whoIsThisFor.eyebrow}
              </span>
              <h2 className="heading-lg text-void mb-6">
                {tc.whoIsThisFor.title}
              </h2>
            </motion.div>

            <div className="lg:w-2/3 grid grid-cols-2 gap-3 lg:gap-6 w-full">
              {tc.whoIsThisFor.cards.map((card: any, i: number) => {
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`group relative p-5 lg:p-6 rounded-2xl md:rounded-3xl border border-ink/5 bg-white hover:border-magenta hover:shadow-[0_0_20px_rgba(224,27,139,0.1)] transition-all duration-500 flex flex-col justify-center overflow-hidden cursor-default select-none min-h-[100px] lg:min-h-[120px] ${isAr ? "text-right" : "text-left"}`}
                  >
                    {/* The Pink Gradient Box */}
                    <div className={`absolute top-0 w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-magenta/10 to-transparent pointer-events-none transition-opacity duration-700 ${isAr ? "left-0" : "right-0"}`} />
                    
                    {/* The Watermark Number (Merged into Gradient Box, Exact Match to About Us) */}
                    <span className={`absolute top-2 lg:top-4 text-6xl md:text-7xl font-serif text-ink/[0.03] font-bold leading-none select-none group-hover:text-magenta/[0.05] transition-colors duration-500 z-0 ${isAr ? "left-2 lg:left-4" : "right-2 lg:right-4"}`}>
                      0{i + 1}
                    </span>
                    
                    {/* The Text Content */}
                    <div className="relative z-10 flex flex-col justify-center mt-2 lg:mt-4">
                      <h3 className="body-md sm:body-lg font-bold text-void/90 group-hover:text-magenta transition-colors duration-500">
                        {card.title}
                      </h3>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-28 bg-void relative overflow-hidden">
        <FloatingOrb className="w-[600px] h-[600px] bg-magenta/10 blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

        <div className="container-wide relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <span className="micro-label mb-5 block">
              {tc.cta.eyebrow}
            </span>
            <h2 className="heading-lg text-parchment mb-6">
              {tc.cta.title}
            </h2>
            <p className="body-lg text-parchment/60 mb-12 max-w-2xl mx-auto">
              {tc.cta.body}
            </p>
            <Link
              to="/norm/contact"
              className="inline-flex items-center gap-3 bg-magenta text-parchment px-10 py-5 rounded-full btn-text hover:bg-parchment hover:text-void transition-all duration-500 hover:shadow-[0_0_40px_rgba(224,27,139,0.4)]"
            >
              {tc.cta.button}
              {isAr ? (
                <ArrowLeft className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
