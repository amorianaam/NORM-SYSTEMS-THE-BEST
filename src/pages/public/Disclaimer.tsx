import { motion } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";
import SEO from "../../components/common/SEO";
import { slideUp, staggerContainer } from "../../lib/animations";

export default function Disclaimer() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const content = t.disclaimer;

  return (
    <div
      className="bg-parchment min-h-screen pt-32 md:pt-40 lg:pt-48 pb-32 md:pb-48"
      dir={isAr ? "rtl" : "ltr"}
    >
      <SEO title={content.title} description={content.body || content.title} />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="container-wide max-w-3xl mx-auto px-6"
      >
        <motion.span
          variants={slideUp}
          className="micro-label mb-8 block text-magenta"
        >
          {content.eyebrow}
        </motion.span>
        <motion.h1
          variants={slideUp}
          className="heading-lg mb-16"
        >
          {content.title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-12 bg-white rounded-3xl border border-void/5 shadow-xl shadow-void/[0.02]"
        >
          <p className="body-lg text-void/80">
            {content.body}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
