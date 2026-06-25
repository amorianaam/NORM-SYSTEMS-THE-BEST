import { motion } from "motion/react";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { ArrowLeft, ArrowRight, Target, Shield, Building } from "lucide-react";
import { Link } from "react-router-dom";

export default function Methodology() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const [activeCard, setActiveCard] = useState(0);

  const icons = [Target, Shield, Building];

  return (
    <section
      id="methodology"
      className="section-padding bg-white relative overflow-hidden"
    >
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-10%" }}
          className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10"
        >
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-magenta mb-6 block">
              {t.previewMethodology.eyebrow}
            </span>
            <h2 className="heading-lg max-w-2xl">
              {t.previewMethodology.title}
            </h2>
          </div>
          <Link
            to="/norm/methodology"
            className="group flex items-center gap-4 text-xs font-bold uppercase tracking-widest hover:text-magenta transition-colors focus-visible:outline-2 focus-visible:outline-magenta focus-visible:outline-offset-8 rounded-sm"
          >
            {t.previewMethodology.cat}
            {isAr ? (
              <ArrowLeft
                className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                aria-hidden="true"
              />
            ) : (
              <ArrowRight
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            )}
          </Link>
        </motion.div>

        <div className="relative mt-16 md:mt-32 pb-20">
          {/* Mobile Stacked Carousel */}
          <div className="lg:hidden relative h-[320px] sm:h-[340px] w-[80%] max-w-[300px] sm:max-w-[320px] mx-auto mb-16">
            {t.previewMethodology.stages.map((stage: any, index: number) => {
              const Icon = icons[index % icons.length];

              let position = "center";
              if (index === activeCard) {
                position = "center";
              } else if (index === (activeCard + 1) % 3) {
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
                  onClick={() => setActiveCard(index)}
                  drag={index === activeCard ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.4}
                  onDragEnd={(_event, info) => {
                    const swipeThreshold = 50;
                    if (info.offset.x < -swipeThreshold) {
                      // Swiped left
                      setActiveCard((prev) => (prev + 1) % 3);
                    } else if (info.offset.x > swipeThreshold) {
                      // Swiped right
                      setActiveCard((prev) => (prev - 1 + 3) % 3);
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
                      {stage.title}
                    </h3>
                    <p className="body-sm text-pretty mb-4">
                      {stage.desc}
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
                    onClick={() => setActiveCard(i)}
                    className={`h-2 rounded-full transition-all duration-500 focus:outline-none ${activeCard === i ? "bg-magenta w-8" : "bg-ink/10 w-2 hover:bg-magenta/30"}`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-ink/30 uppercase tracking-[0.2em] font-mono text-center">
                {t.previewMethodology.bottomPrompt || (isAr
                  ? "اسحب البطاقة يميناً أو يساراً للتنقل"
                  : "Swipe left or right to explore stages")}
              </span>
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-3 gap-8 lg:gap-10">
            {t.previewMethodology.stages.map((stage: any, index: number) => {
              const Icon = icons[index % icons.length];
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
                      {stage.title}
                    </h3>

                    <p className="body-sm text-pretty mb-5">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
