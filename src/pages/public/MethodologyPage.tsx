import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";
import {
  Layers,
  Network,
  Workflow,
  BookOpen,
  ShieldCheck,
  Info,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import SEO from "../../components/common/SEO";
import { slideUp, staggerContainer } from "../../lib/animations";

const PhaseIcons = [Layers, Network, Workflow, BookOpen, ShieldCheck];

export default function MethodologyPage() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const content = t.methodologyPage;
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);
  const [activePhase, setActivePhase] = useState<number | null>(0);
  const [chartEntered, setChartEntered] = useState(false);
  const [revealedPhases, setRevealedPhases] = useState<Record<number, boolean>>(
    {},
  );

  useEffect(() => {
    if (chartEntered) {
      content.phases.forEach((_: any, i: number) => {
        setTimeout(
          () => {
            setRevealedPhases((prev) => ({ ...prev, [i]: true }));
          },
          400 + i * 250,
        );
      });
    }
  }, [chartEntered, content.phases]);

  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.scrollY;
      const middleOfScreen = window.innerHeight / 2;
      const elementHalf = elementRect.height / 2;

      const y = absoluteElementTop - middleOfScreen + elementHalf;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div
      ref={targetRef}
      className="bg-parchment min-h-screen relative overflow-clip"
      dir={isAr ? "rtl" : "ltr"}
    >
      <SEO
        title={isAr ? "Ø§Ù„Ù…Ù†Ù‡Ø¬ÙŠØ©" : "Methodology"}
        description={content.hero.intro}
      />
      {/* Subtle Animated Background - Reactive to Scroll */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="fixed inset-0 pointer-events-none z-0"
      >
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_rgba(224,27,139,0.02)_0%,_transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-void)_1px,_transparent_1px)] bg-[size:80px_80px] opacity-[0.03]" />

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.1, y: 0, x: 0 }}
            animate={{
              y: [0, -100, 0],
              x: [0, 50, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-1 h-1 bg-magenta rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </motion.div>

      {/* Hero Section */}
      <section className="relative bg-void text-parchment overflow-hidden z-10 border-b border-white/5 pt-32 md:pt-40 lg:pt-48 pb-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="container-wide relative z-10 text-center"
        >
          <div className="max-w-5xl mx-auto">
            <motion.span variants={slideUp} className="micro-label mb-8 block text-magenta/80">
              {content.hero?.badge}
            </motion.span>
            <motion.h1 variants={slideUp} className="heading-xl mb-8">
              {content.hero.title}
            </motion.h1>
            <motion.div variants={slideUp} className="w-24 h-px bg-magenta/30 mx-auto mb-8"></motion.div>
            <motion.p variants={slideUp} className="body-lg max-w-3xl mx-auto">
              {content.hero.intro}
            </motion.p>
          </div>
        </motion.div>

        {/* Hero Specific Motion */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
          <motion.div
            initial={{ scale: 1, opacity: 0.1 }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] bg-magenta rounded-full blur-[120px]"
          />
        </div>
      </section>

      {/* Narrative Section */}
      <section className="section-padding py-40 relative z-10">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-5 lg:order-last">
              <div className="sticky top-40">
                <motion.div
                  onViewportEnter={() => setChartEntered(true)}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-10%" }}
                >
                  <div className="hidden lg:block overflow-visible">
                    {/* Interactive SVG Illustration - Enhanced Animation */}
                    <svg
                      role="img"
                      width="320"
                      height="420"
                      viewBox="0 0 320 420"
                      className="overflow-visible"
                    >
                      <defs>
                        <linearGradient
                          id="magentaGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="var(--color-magenta)" />
                          <stop
                            offset="100%"
                            stopColor="var(--color-primary-purple)"
                          />
                        </linearGradient>
                      </defs>
                      <motion.line
                        x1={isAr ? 20 : 320}
                        y1="20"
                        x2={isAr ? 20 : 320}
                        y2="400"
                        stroke="currentColor"
                        className="text-magenta/20"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={
                          chartEntered
                            ? { pathLength: 1, opacity: 1 }
                            : { pathLength: 0, opacity: 0 }
                        }
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />

                      {[0, 1, 2, 3, 4].map((i) => {
                        const isActive = activePhase === i;
                        const shortTitle =
                          content.phases[i].title.split(":")[1]?.trim() ||
                          content.phases[i].title;
                        const boxWidth = 160 + i * 30;
                        const xStart = isAr ? 20 : 320 - boxWidth;
                        const yPos = 50 + i * 70;
                        const Icon = PhaseIcons[i];
                        const isRevealed = revealedPhases[i];

                        return (
                          <motion.g
                            key={i}
                            role="button"
                            aria-pressed={isActive}
                            aria-current={isActive ? "step" : undefined}
                            aria-label={`${content.ui?.phasePrefix} 0${i + 1}: ${shortTitle}`}
                            tabIndex={0}
                            onMouseEnter={() => setHoveredPhase(i)}
                            onMouseLeave={() => setHoveredPhase(null)}
                            onClick={() => {
                              setActivePhase(i);
                              setTimeout(
                                () => scrollToSection(`phase-${i}`),
                                450,
                              );
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setActivePhase(i);
                                setTimeout(
                                  () => scrollToSection(`phase-${i}`),
                                  450,
                                );
                              }
                            }}
                            className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-8 rounded-sm group/svg-phase"
                            initial={{ opacity: 0, x: isAr ? -20 : 20 }}
                            animate={{
                              opacity: isRevealed ? 1 : 0,
                              x: isRevealed
                                ? isActive
                                  ? isAr
                                    ? 15
                                    : -15
                                  : 0
                                : isAr
                                  ? -20
                                  : 20,
                            }}
                            whileHover={
                              isRevealed && !isActive
                                ? { x: isAr ? 5 : -5 }
                                : undefined
                            }
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          >
                            <rect
                              x={xStart}
                              y={yPos}
                              width={boxWidth}
                              height="50"
                              rx="15"
                              fill={
                                isActive || hoveredPhase === i
                                  ? "url(#magentaGradient)"
                                  : "currentColor"
                              }
                              className={`transition-all duration-500 ${isActive || hoveredPhase === i ? "drop-shadow-lg" : "text-magenta/10 drop-shadow-sm"}`}
                            />
                            <foreignObject
                              x={xStart}
                              y={yPos}
                              width={boxWidth}
                              height="50"
                              className="pointer-events-none"
                            >
                              <div
                                className={`w-full h-full flex items-center ${isAr ? "justify-end pr-4 pl-2" : "justify-start pl-4 pr-2"} gap-3`}
                              >
                                <motion.div
                                  animate={
                                    isActive
                                      ? {
                                          scale: [1, 1.2, 1],
                                          opacity: [0.8, 1, 0.8],
                                        }
                                      : {}
                                  }
                                  transition={
                                    isActive
                                      ? {
                                          duration: 2,
                                          repeat: Infinity,
                                          ease: "easeInOut",
                                        }
                                      : {}
                                  }
                                  className="flex-shrink-0"
                                >
                                  <Icon
                                    className={`w-5 h-5 transition-colors duration-500 ${isActive || hoveredPhase === i ? "text-white" : "text-ink opacity-30"}`}
                                    aria-hidden="true"
                                  />
                                </motion.div>
                                <span
                                  className={`micro-label line-clamp-2 transition-all duration-500 flex-1 text-right ${isActive || hoveredPhase === i ? "!text-white scale-105" : "text-ink/50"}`}
                                >
                                  {shortTitle}
                                </span>
                              </div>
                            </foreignObject>
                          </motion.g>
                        );
                      })}
                    </svg>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-12 md:space-y-16 lg:order-first">
              {content.phases.map((phase: any, idx: number) => {
                const Icon = PhaseIcons[idx];
                const isActive = activePhase === idx;
                const isHovered = hoveredPhase === idx;

                return (
                  <motion.div
                    key={idx}
                    id={`phase-${idx}`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: "-15%" }}
                    onClick={() => {
                      const newPhase = isActive ? null : idx;
                      setActivePhase(newPhase);
                      if (newPhase !== null) {
                        setTimeout(() => scrollToSection(`phase-${idx}`), 450);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        const newPhase = isActive ? null : idx;
                        setActivePhase(newPhase);
                        if (newPhase !== null) {
                          setTimeout(
                            () => scrollToSection(`phase-${idx}`),
                            450,
                          );
                        }
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isActive}
                    aria-current={isActive ? "step" : undefined}
                    aria-controls={`phase-content-${idx}`}
                    className={`relative p-5 md:p-6 rounded-2xl transition-all duration-500 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-4 overflow-hidden group ${
                      isActive
                        ? "bg-gradient-to-br from-magenta/5 to-void/5 border-magenta/20 shadow-lg shadow-magenta/5 ring-1 ring-magenta/20"
                        : "border border-transparent hover:bg-void/[0.02] hover:border-void/10"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-phase-highlight"
                        className="absolute inset-0 bg-gradient-to-r from-magenta/[0.03] to-transparent pointer-events-none"
                        initial={false}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                    <div className="flex items-start gap-4 md:gap-6 relative z-10">
                      <div
                        className={`flex-shrink-0 mt-1 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-all duration-500 shadow-sm bg-white ${isActive ? "text-magenta border-magenta/30 scale-105 shadow-magenta/10" : "border border-void/10 group-hover:border-magenta/30 text-ink"} border`}
                      >
                        <Icon
                          className={`w-5 h-5 md:w-6 md:h-6 stroke-[1.5] ${isActive ? "text-magenta" : ""}`}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="relative flex-grow min-w-0">
                        <span
                          className={`micro-label mb-2 block transition-all text-right w-full text-ink/40 group-hover:text-magenta ${isActive ? "text-magenta" : ""}`}
                        >
                          {content.ui?.stepPrefix} 0{idx + 1}
                        </span>

                        <div className="flex items-center gap-3 mb-2 group/title">
                          <h3
                            className={`heading-sm text-start transition-colors w-full ${isActive ? "text-magenta" : "group-hover:text-magenta"}`}
                          >
                            {phase.title}
                          </h3>
                        </div>

                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.div
                              id={`phase-content-${idx}`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                height: { duration: 0.4, ease: "easeOut" },
                                opacity: { duration: 0.3, delay: 0.1 },
                              }}
                              className="overflow-hidden"
                            >
                              <div className="pt-6 pb-2 space-y-6">
                                <p className="body-md max-w-2xl text-ink/80">
                                  {phase.desc}
                                </p>

                                {phase.caseStudy && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="p-6 bg-white/50 backdrop-blur-sm border border-void/5 rounded-2xl mt-6 relative overflow-hidden group/case"
                                  >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-magenta opacity-20 group-hover/case:opacity-100 transition-opacity" />
                                    <span
                                      className={`micro-label block mb-3 ${isAr ? "text-right" : "text-left"}`}
                                    >
                                      {content.ui?.caseStudyBadge}
                                    </span>
                                    <p className="body-sm text-ink/90">
                                      {phase.caseStudy}
                                    </p>
                                  </motion.div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Outcome Section */}
      <section className="section-padding py-16 md:py-24 lg:py-32 relative z-10 bg-parchment">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-10%" }}
            className="bg-void text-parchment rounded-[2rem] sm:rounded-5xl md:rounded-7xl p-8 sm:p-10 md:p-16 lg:p-24 relative overflow-hidden text-center max-w-5xl mx-auto shadow-2xl shadow-void/10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(224,27,139,0.15)_0%,_transparent_70%)] pointer-events-none" />

            <div className="relative z-10">
              <span className="micro-label mb-4 md:mb-6 block">
                {content.outcome.eyebrow}
              </span>

              <h2 className="heading-sm mb-3 md:mb-5 text-parchment/90">
                {content.outcome.title}
              </h2>

              <p className="heading-md text-white mb-8 md:mb-10 mx-auto">
                {content.outcome.highlight}
              </p>

              <div className="w-12 md:w-16 h-0.5 md:h-1 bg-magenta/30 mx-auto mb-6 md:mb-12 rounded-full" />

              <p className="body-md max-w-2xl mx-auto text-parchment/80">
                {content.outcome.desc}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final Statement */}
      <section className="section-padding py-20 bg-void text-parchment text-center relative z-10">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
          >
            <p className="heading-md mb-20 max-w-5xl mx-auto text-parchment/90">
              {content.finalStatement}
            </p>
            <div className="w-24 h-[1px] bg-magenta/30 mx-auto" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
