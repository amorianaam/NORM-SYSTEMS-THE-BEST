import { motion } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import { slideUp, staggerContainer } from "../../lib/animations";

export default function Hero() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  return (
    <section className="relative flex flex-col overflow-hidden bg-parchment pt-32 md:pt-40 lg:pt-48 pb-20">
      <div className="container-wide relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-5xl"
        >
          <motion.span
            variants={slideUp}
            className="micro-label mb-10 block"
          >
            {t.hero.eyebrow}
          </motion.span>

          <motion.h1 
            variants={slideUp}
            className="heading-xl mb-10 text-balance"
          >
            {t.hero.title}
          </motion.h1>

          <div className="space-y-10">
            <div className="space-y-6">
              <motion.p
                variants={slideUp}
                className="body-lg text-magenta"
              >
                {t.hero.subtitle}
              </motion.p>
              <motion.p
                variants={slideUp}
                className="body-md max-w-2xl text-balance"
              >
                {t.hero.body}
              </motion.p>
            </div>

            <motion.div
              variants={slideUp}
              className="pt-4 flex flex-wrap items-center gap-4"
            >
              <a
                href="#methodology"
                className="inline-flex items-center gap-4 bg-ink text-parchment px-8 py-4 rounded-full btn-text hover:bg-magenta transition-all duration-500 hover:shadow-glow-magenta-sm"
              >
                {t.hero.cta}
              </a>

              {/* Hospitality Consultant CTA */}
              <Link
                to="/norm/hospitality-consultant"
                className="group inline-flex items-center gap-3 border border-void/15 hover:border-magenta/40 bg-white/60 hover:bg-magenta/5 text-void px-7 py-4 rounded-full btn-text transition-all duration-500 backdrop-blur-sm"
              >
                <div className="w-6 h-6 rounded-full bg-magenta/10 group-hover:bg-magenta flex items-center justify-center transition-all duration-500">
                  <Building2 className="w-3 h-3 text-magenta group-hover:text-parchment transition-colors duration-500" />
                </div>
                <span className="group-hover:text-magenta transition-colors duration-300">
                  {t.hero.hospitalityCTA}
                </span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Subtle Background Mark */}
      <div
        className={`absolute top-1/2 ${isAr ? "-left-20" : "-right-20"} -translate-y-1/2 w-1/3 h-2/3 opacity-[0.02] pointer-events-none`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full fill-none stroke-current"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            strokeWidth="0.5"
            strokeDasharray="1 1"
          />
          <circle cx="50" cy="50" r="35" strokeWidth="0.5" />
        </svg>
      </div>
    </section>
  );
}
