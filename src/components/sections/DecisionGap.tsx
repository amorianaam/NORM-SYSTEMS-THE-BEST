import { motion } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";

export default function DecisionGap() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  return (
    <section className="bg-void text-parchment relative overflow-hidden flex flex-col justify-center py-20 md:py-32 lg:py-40">
      {/* Top 80px Divider Gradient */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-parchment to-transparent pointer-events-none z-10" />

      <div className="container-wide relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-24 relative bg-white/[0.02] lg:bg-transparent border border-magenta/10 lg:border-transparent rounded-5xl lg:rounded-none p-8 sm:p-10 lg:p-0 overflow-hidden lg:overflow-visible">
          {/* Mobile Unified Glowing Orb */}
          <motion.div
            className="lg:hidden absolute left-1/2 -translate-x-1/2 w-[150%] h-64 bg-magenta/15 blur-[60px] rounded-full z-0 pointer-events-none"
            animate={{ y: [-50, 400, -50] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Left Column: Decision Gap Context */}
          <div className="lg:col-span-6 flex flex-col justify-center relative z-10 pb-12 lg:pb-0">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-10%" }}
              className="micro-label mb-8 block"
            >
              {t.decisionGap.eyebrow}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              viewport={{ once: true, margin: "-10%" }}
              className="heading-lg mb-8 md:mb-10"
            >
              {t.decisionGap.title}
            </motion.h2>

            <div className="w-16 h-[1px] bg-magenta/30 mb-8 md:mb-10" />

            <div className="space-y-6 md:space-y-8 text-start">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                viewport={{ once: true, margin: "-10%" }}
                className="body-lg text-magenta/90"
              >
                {t.decisionGap.p1}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 0.6, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                viewport={{ once: true, margin: "-10%" }}
                className="body-lg max-w-md"
              >
                {t.decisionGap.p2}
              </motion.p>
            </div>
          </div>

          {/* Right Column: The Core Idea */}
          <div className="lg:col-span-6 flex items-center relative z-10 pt-10 lg:pt-0 border-t border-magenta/20 lg:border-t-transparent">
            <motion.div
              initial={{ opacity: 0, x: isAr ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true, margin: "-10%" }}
              className="w-full lg:p-14 lg:border lg:border-parchment/10 lg:bg-neutral-900/60 lg:backdrop-blur-md lg:rounded-5xl relative lg:shadow-2xl lg:shadow-void group lg:overflow-hidden"
            >
              {/* Decorative gradients (Desktop only) */}
              <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-magenta/10 to-transparent pointer-events-none" />
              <div className="hidden lg:block absolute -top-24 -right-24 w-48 h-48 bg-magenta/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-magenta/30 transition-colors duration-700" />

              <div className="relative z-10 flex flex-col h-full justify-between gap-8 md:gap-12">
                <div>
                  <span className="micro-label mb-4 md:mb-6 block">
                    {t.coreIdea.eyebrow}
                  </span>
                  <h3 className="heading-md text-parchment mb-4 md:mb-6">
                    <span className="text-magenta font-semibold">NORM</span>{" "}
                    {t.coreIdea.title}
                  </h3>
                  <p className="body-lg text-parchment/70 max-w-md">
                    {t.coreIdea.description}
                  </p>
                </div>

                <div
                  className={`relative pt-6 md:pt-8 mt-auto ${isAr ? "pr-6 md:pr-8 border-r" : "pl-6 md:pl-8 border-l"} border-magenta/30`}
                >
                  <p className="body-lg text-parchment text-balance">
                    {t.coreIdea.empowerment}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom 80px Divider Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
    </section>
  );
}
