import { motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import SEO from "../../components/common/SEO";
import { ArrowRight, ShieldCheck, Scale, BarChart3, Binary, Cpu, Network } from "lucide-react";
import { slideUp, staggerContainer } from "../../lib/animations";

export default function About() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const content = t.aboutPage;
  const [activeWhyNormCard, setActiveWhyNormCard] = useState(0);

  const siteUrl = "https://norm.sa";
  const orgName = isAr
    ? "Ù†ÙˆØ±Ù… | Ø¯Ø§Ø± Ù‡Ù†Ø¯Ø³Ø© Ø§Ù„Ù‚Ø±Ø§Ø±"
    : "NORM | Decision Architecture House";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: isAr ? "Ù…Ù† Ù†Ø­Ù†" : "About Us",
    url: `${siteUrl}/about`,
    description: content.hero.subtitle,
    mainEntity: {
      "@type": "Organization",
      name: orgName,
      description: content.hero.body,
      url: siteUrl,
    },
  };

  return (
    <div className="bg-parchment" dir={isAr ? "rtl" : "ltr"}>
      <SEO
        title={isAr ? "Ù…Ù† Ù†Ø­Ù†" : "About"}
        description={content.hero.subtitle}
        structuredData={structuredData}
      />
      {/* 1. Hero Section: Who is NORM? */}
      <section className="relative overflow-hidden pt-32 md:pt-40 lg:pt-48 pb-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="container-wide"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            <div className="lg:col-span-7">
              <motion.span variants={slideUp} className="micro-label mb-8 block">
                {content.hero.title}
              </motion.span>
              <motion.h1 variants={slideUp} className="heading-xl mb-12">
                {content.hero.subtitle}
              </motion.h1>
              <div className="space-y-8">
                <motion.p variants={slideUp} className="body-lg max-w-2xl">
                  {content.hero.body}
                </motion.p>
                <motion.p variants={slideUp} className="body-lg max-w-xl">
                  {t.previewAbout.founder}
                </motion.p>
              </div>
            </div>
            <div className="hidden lg:block lg:col-span-5 relative">
              {/* Circular Visual Narrative */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                className="aspect-square flex items-center justify-center relative group"
              >
                <div className="relative z-10 w-[85%] h-[85%] rounded-full overflow-hidden shadow-2xl shadow-magenta/10 group-hover:scale-105 group-hover:shadow-magenta/20 transition-all duration-700 ease-out bg-white p-1 flex items-center justify-center">
                  <div className="w-full h-full rounded-full overflow-hidden relative bg-white">
                    <div className="absolute inset-0 ring-1 ring-inset ring-void/10 rounded-full z-10 pointer-events-none" />
                    <img
                      src="/about.png"
                      alt="NORM Embroidered Patch"
                      className="w-full h-full object-cover scale-[1.15] group-hover:scale-[1.20] transition-transform duration-[1.5s] ease-out"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 1b. Core Philosophy Banner */}
      <section
        className="py-16 bg-magenta-soft border-y border-magenta/10"
        id="philosophy-statement"
      >
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-3xl">
              <span className="micro-label block mb-4">
                {content.philosophy?.title}
              </span>
              <p className="heading-sm text-ink">
                {content.philosophy?.desc}
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="micro-label text-ink/30 block">
                {content.philosophy?.badge}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Positioning: For Whom We Architect */}
      <section
        className="section-padding bg-void text-parchment overflow-hidden border-b border-parchment/5"
        id="positioning-section"
      >
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-5 flex flex-col justify-between">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="lg:sticky lg:top-32"
              >
                <span className="micro-label block mb-4">
                  {content.positioning?.badge}
                </span>
                <h2 className="heading-lg mb-6">
                  {content.positioning.title}
                </h2>
                <div className="w-16 h-[2px] bg-magenta mb-8" />

                <p className="body-lg mb-8">
                  {content.positioning.desc}
                </p>

                {/* Elegant architectural logic wireframe */}
                <div className="hidden md:block relative w-full h-64 overflow-hidden border border-parchment/5 rounded-3xl bg-neutral-900/40">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px]" />

                  <svg
                    className="absolute inset-0 w-full h-full opacity-40"
                    viewBox="0 0 400 240"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path
                      d="M50 120 H350"
                      stroke="url(#wireframe-gradient)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                      viewport={{ once: true }}
                    />
                    <motion.path
                      d="M120 40 L280 200"
                      stroke="url(#wireframe-gradient)"
                      strokeWidth="1"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      transition={{
                        duration: 1.5,
                        delay: 0.3,
                        ease: "easeInOut",
                      }}
                      viewport={{ once: true }}
                    />
                    <motion.path
                      d="M280 40 L120 200"
                      stroke="url(#wireframe-gradient)"
                      strokeWidth="1"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      transition={{
                        duration: 1.5,
                        delay: 0.5,
                        ease: "easeInOut",
                      }}
                      viewport={{ once: true }}
                    />
                    <circle
                      cx="200"
                      cy="120"
                      r="32"
                      stroke="var(--color-magenta)"
                      strokeWidth="0.75"
                      strokeDasharray="3 3"
                      className="origin-center"
                    />
                    <circle
                      cx="200"
                      cy="120"
                      r="8"
                      fill="var(--color-magenta)"
                      className="animate-pulse"
                    />

                    <circle
                      cx="120"
                      cy="40"
                      r="3"
                      fill="var(--color-primary-gray)"
                    />
                    <circle
                      cx="280"
                      cy="40"
                      r="3"
                      fill="var(--color-primary-gray)"
                    />
                    <circle
                      cx="120"
                      cy="200"
                      r="3"
                      fill="var(--color-primary-gray)"
                    />
                    <circle
                      cx="280"
                      cy="200"
                      r="3"
                      fill="var(--color-primary-gray)"
                    />

                    <defs>
                      <linearGradient
                        id="wireframe-gradient"
                        x1="0"
                        y1="0"
                        x2="400"
                        y2="240"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="var(--color-primary-gray)" />
                        <stop offset="0.5" stopColor="var(--color-magenta)" />
                        <stop
                          offset="1"
                          stopColor="var(--color-primary-purple)"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute bottom-4 right-6 left-6 flex justify-between micro-label text-parchment/30">
                    <span>{content.positioning?.wireframeDiag}</span>
                    <span>{content.positioning?.wireframeAcc}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {content.positioning.segments?.map(
                  (segment: any, idx: number) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.15, duration: 0.8 }}
                      viewport={{ once: true }}
                      className="group relative p-8 rounded-3xl border border-parchment/5 hover:border-magenta/20 bg-neutral-900/20 hover:bg-neutral-900/40 hover:shadow-2xl hover:shadow-magenta/5 transition-all duration-500 ease-out flex flex-col justify-between min-h-[240px]"
                    >
                      {/* Corner gradient highlight */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-magenta/5 rounded-tr-3xl rounded-bl-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div>
                        <div className="flex items-center justify-between mb-8">
                          <span className="micro-label text-magenta/50 group-hover:text-magenta transition-colors duration-300">
                            0{idx + 1}
                          </span>
                          <span className="micro-label text-parchment/30 group-hover:text-parchment/50 transition-colors duration-300">
                            {content.positioning?.segmentBadge}
                          </span>
                        </div>

                        <h3 className="heading-sm text-white group-hover:text-magenta transition-colors duration-300">
                          {segment.title}
                        </h3>

                        <p className="body-sm text-parchment/60 mt-4 group-hover:text-parchment/80 transition-colors duration-300 text-balance">
                          {segment.desc}
                        </p>
                      </div>
                    </motion.div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Differentiation: Why NORM? */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="container-wide">
          <div className="max-w-4xl mb-16 md:mb-24">
            <h2 className="heading-lg mb-10">
              {content.differentiation.title}
            </h2>
            <p className="body-lg">
              {content.differentiation.desc}
            </p>
          </div>

          <div className="relative mt-8 md:mt-16 pb-20">
            {/* Mobile Stacked Carousel */}
            <div className="lg:hidden relative h-[320px] sm:h-[340px] w-[80%] max-w-[300px] sm:max-w-[320px] mx-auto mb-16">
              {content.differentiation.points.map(
                (point: any, index: number) => {
                  const Icons = [ShieldCheck, Scale, BarChart3];
                  const Icon = Icons[index % Icons.length];

                  let position = "center";
                  if (index === activeWhyNormCard) {
                    position = "center";
                  } else if (index === (activeWhyNormCard + 1) % 3) {
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
                      onClick={() => setActiveWhyNormCard(index)}
                      drag={index === activeWhyNormCard ? "x" : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.4}
                      onDragEnd={(_event, info) => {
                        const swipeThreshold = 50;
                        const isNext = isAr ? info.offset.x > swipeThreshold : info.offset.x < -swipeThreshold;
                        const isPrev = isAr ? info.offset.x < -swipeThreshold : info.offset.x > swipeThreshold;
                        if (isNext) {
                          setActiveWhyNormCard((prev) => (prev + 1) % 3);
                        } else if (isPrev) {
                          setActiveWhyNormCard((prev) => (prev - 1 + 3) % 3);
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
                          {point.title}
                        </h3>
                        <p className="body-sm text-pretty">
                          {point.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                },
              )}

              <div className="absolute -bottom-16 left-0 right-0 flex flex-col items-center gap-3">
                <div className="flex justify-center gap-3">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      onClick={() => setActiveWhyNormCard(i)}
                      className={`h-2 rounded-full transition-all duration-500 focus:outline-none ${activeWhyNormCard === i ? "bg-magenta w-8" : "bg-ink/10 w-2 hover:bg-magenta/30"}`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
                <span className="micro-label text-ink/30 text-center">
                  {content.differentiation?.swipeHint}
                </span>
              </div>
            </div>

            {/* Desktop Grid */}
            <div className="hidden lg:grid grid-cols-3 gap-8 lg:gap-10">
              {content.differentiation.points.map(
                (point: any, index: number) => {
                  const Icons = [ShieldCheck, Scale, BarChart3];
                  const Icon = Icons[index % Icons.length];
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
                        <h3 className="heading-md mb-5 group-hover:text-magenta transition-colors duration-500">
                          {point.title}
                        </h3>
                        <p className="body-sm text-pretty">
                          {point.desc}
                        </p>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Impact Section */}
      <section className="py-20 md:py-32 relative">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative rounded-3xl md:rounded-7xl overflow-hidden aspect-video flex items-center justify-center bg-void"
            >
              <Binary className="w-16 h-16 md:w-40 md:h-40 text-magenta/20 animate-pulse mb-12 md:mb-0" />
              <div className="absolute bottom-4 left-4 right-4 md:bottom-12 md:left-12 md:right-12 p-4 md:p-8 glass-dark rounded-2xl md:rounded-3xl">
                <p className="micro-label text-parchment/60 mb-1 md:mb-2">
                  {content.impact?.ledgerBadge}
                </p>
                <p className="heading-sm text-parchment">
                  {content.impact?.ledgerTitle}
                </p>
              </div>
            </motion.div>

            <div>
              <h2 className="heading-lg mb-12">
                {content.impact.title}
              </h2>
              <div className="space-y-12">
                {content.impact.items.map((item: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="flex gap-8 group"
                  >
                    <div className="text-4xl font-serif text-magenta/20 transition-colors group-hover:text-magenta">
                      0{idx + 1}
                    </div>
                    <div>
                      <h4 className="heading-sm mb-4">{item.title}</h4>
                      <p className="body-md max-w-md">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AI Strategy */}
      <section className="section-padding bg-parchment">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="p-12 md:p-24 rounded-7xl border border-magenta/20 bg-white relative overflow-hidden group"
          >
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="micro-label mb-8 block">
                  {content.aiStrategy?.badge}
                </span>
                <h2 className="heading-lg mb-8">
                  {content.aiStrategy.subtitle}
                </h2>
                <p className="body-lg mb-12">
                  {content.aiStrategy.body}
                </p>

                <div className="flex items-center gap-6 p-8 bg-void text-parchment rounded-3xl border border-magenta/20 shadow-2xl shadow-magenta/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-magenta/10 blur-3xl group-hover:bg-magenta/20 transition-all duration-700" />
                  <div className="p-4 bg-magenta/10 rounded-2xl">
                    <Binary className="w-8 h-8 text-magenta" />
                  </div>
                  <div>
                    <p className="micro-label mb-1">
                      {content.aiStrategy?.synergyTitle}
                    </p>
                    <p className="body-sm">
                      {content.aiStrategy?.synergyDesc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 relative">
                {/* Synergy Visual */}
                <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                  <motion.div
                    animate={{
                      rotate: 360,
                      borderWidth: [1, 2, 1],
                      opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-full h-full border-2 border-dashed border-magenta rounded-full"
                  />
                </div>

                {[
                  { icon: Binary, label: content.aiStrategy?.pillars?.logic },
                  { icon: Cpu, label: content.aiStrategy?.pillars?.speed },
                  { icon: ShieldCheck, label: content.aiStrategy?.pillars?.safety },
                  { icon: Network, label: content.aiStrategy?.pillars?.scale },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="aspect-square bg-void/5 rounded-3xl flex flex-col items-center justify-center p-8 odd:mt-12 group/item hover:bg-magenta transition-all duration-500 relative z-10 overflow-hidden"
                    >
                      <div className="relative z-10 flex flex-col items-center gap-4">
                        <Icon className="w-8 h-8 text-magenta group-hover/item:text-parchment transition-colors" />
                        <span className="btn-text text-parchment/50 group-hover/item:text-parchment transition-all mt-4 text-center">
                          {item.label}
                        </span>
                      </div>
                      <motion.div
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          delay: i * 1,
                        }}
                        className="absolute inset-0 bg-magenta/5 rounded-full blur-2xl group-hover/item:bg-white/10"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FINAL STATEMENT */}
      <section className="py-24 md:py-32 text-center container-wide bg-void/5 rounded-6xl my-16 md:my-20 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <p className="heading-md mb-16 max-w-5xl mx-auto text-void/90">
            {content.finalStatement.quote}
          </p>
          <Link to="/norm/contact" className="inline-block btn-text px-12 py-5 bg-magenta text-parchment rounded-full hover:bg-void transition-colors shadow-2xl shadow-magenta/20">
            {content.finalStatement.cta}
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
