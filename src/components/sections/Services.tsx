import { motion } from "motion/react";
import {
  Shield,
  BarChart3,
  Globe,
  Users,
  Settings,
  FileText,
  Quote,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { Link } from "react-router-dom";

const icons = [Shield, BarChart3, Globe, Users, Settings, FileText];

export default function Services() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  return (
    <section
      id="about"
      className="section-padding bg-parchment overflow-hidden"
    >
      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-10%" }}
          >
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-magenta mb-6 block">
              {t.previewAbout.eyebrow}
            </span>
            <h2 className="heading-lg mb-8 text-balance">
              {t.previewAbout.title}
            </h2>
            <p className="body-lg text-balance mb-8">
              {t.previewAbout.desc}
            </p>
            <div className="pt-4">
              <Link
                to="/norm/about"
                className="group flex items-center gap-4 text-xs font-bold uppercase tracking-widest hover:text-magenta transition-colors focus-visible:outline-2 focus-visible:outline-magenta focus-visible:outline-offset-8 rounded-sm"
              >
                {t.previewAbout.cta}
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
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            viewport={{ once: true, margin: "-10%" }}
            className="hidden lg:block group relative bg-void p-10 md:p-14 rounded-6xl border border-magenta/20 shadow-2xl shadow-void/40 overflow-hidden cursor-default"
          >
            {/* Architectural Backdrop */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 group-hover:scale-105 group-hover:rotate-1 transition-transform duration-300 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/80 to-transparent" />
            <div
              className={`absolute top-0 w-64 h-64 bg-magenta/20 rounded-full blur-3xl group-hover:bg-magenta/30 group-hover:scale-110 transition-all duration-300 ease-out ${isAr ? "left-0" : "right-0"}`}
            />

            {/* Huge Quotation Mark */}
            <Quote
              className={`absolute top-8 ${isAr ? "left-8 scale-x-[-1]" : "right-8"} w-32 h-32 text-white/[0.03] group-hover:text-magenta/10 transition-colors duration-300`}
              strokeWidth={0.5}
              fill="currentColor"
            />

            {/* Content Info */}
            <div className="relative z-10 flex flex-col h-full">
              <p className="heading-md text-parchment/90 mb-16">
                {t.previewAbout.founder}
              </p>

              {/* Core Foundation Bottom Bar */}
              <div className="mt-auto pt-8 border-t border-white/10 flex items-center justify-between">
                <div
                  className={`flex items-center gap-4 ${isAr ? "flex-row-reverse" : ""}`}
                >
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-magenta/10 border border-magenta/30 group-hover:bg-magenta/20 transition-colors duration-300">
                    <div className="absolute inset-0 bg-magenta/20 rounded-full animate-pulse opacity-50" />
                    <Users className="w-5 h-5 text-magenta group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div
                    className={`flex flex-col ${isAr ? "text-right" : "text-left"}`}
                  >
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-magenta opacity-90">
                      {t.previewAbout.cardHumanEngine}
                    </span>
                    <span className="text-[10px] text-parchment/40 font-bold mt-1 uppercase tracking-widest">
                      {t.previewAbout.cardCoreFoundation}
                    </span>
                  </div>
                </div>

                {/* 3 Geometric Nodes */}
                <div
                  className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-magenta/20 group-hover:bg-magenta group-hover:shadow-glow-magenta-sm transition-all duration-300"
                    style={{ transitionDelay: "0ms" }}
                  />
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-magenta/20 group-hover:bg-magenta group-hover:shadow-glow-magenta-sm transition-all duration-300"
                    style={{ transitionDelay: "50ms" }}
                  />
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-magenta/20 group-hover:bg-magenta group-hover:shadow-glow-magenta-sm transition-all duration-300"
                    style={{ transitionDelay: "100ms" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
