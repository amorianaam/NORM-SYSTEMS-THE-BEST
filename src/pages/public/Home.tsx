import { useScroll, useSpring, motion } from "motion/react";
import Hero from "../../components/sections/Hero";
import DecisionGap from "../../components/sections/DecisionGap";
import Methodology from "../../components/sections/Methodology";
import Services from "../../components/sections/Services";
import Insights from "../../components/sections/Insights";
import SEO from "../../components/common/SEO";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function ContactSection() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  return (
    <section className="py-16 md:py-20 bg-void/5 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto"
      >
        <div className="w-12 h-1 bg-magenta mx-auto mb-10 opacity-30" />
        <p className="heading-md mb-16 max-w-5xl mx-auto text-void/90">
          {t.contact.title}
        </p>
        <Link
          to="/norm/contact"
          className="inline-flex items-center gap-6 px-12 py-5 border-2 border-magenta text-magenta rounded-full btn-text hover:bg-magenta hover:text-parchment transition-all duration-500 group"
        >
          {t.contact.cat}
          <ArrowRight
            className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""}`}
          />
        </Link>
      </motion.div>
    </section>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const { language, t } = useLanguage();
  const isAr = language === "ar";

  const siteUrl = "https://norm.sa";
  const orgName = t.homePage?.seo?.orgName;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: orgName,
    url: siteUrl,
    inLanguage: isAr ? "ar" : "en",
    publisher: {
      "@type": "Organization",
      name: "NORM",
      url: siteUrl,
      logo: `${siteUrl}/favicon.ico`,
    },
  };

  return (
    <div className="relative" dir={isAr ? "rtl" : "ltr"}>
      <SEO
        title={t.homePage?.seo?.title}
        description={t.homePage?.seo?.desc}
        structuredData={structuredData}
      />
      {/* Scroll Progress Bar */}
      <motion.div
        className={`fixed top-0 left-0 right-0 h-1 bg-magenta z-[60] ${isAr ? "origin-right" : "origin-left"}`}
        style={{ scaleX }}
      />

      <main>
        <Hero />
        <DecisionGap />
        <Methodology />
        <Services />
        <Insights />
        <ContactSection />
      </main>
    </div>
  );
}
