import { motion } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";
import SEO from "../../components/common/SEO";
import { slideUp, staggerContainer } from "../../lib/animations";

export default function PrivacyPolicy() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const content = t.privacyPolicy;

  return (
    <div
      className="bg-parchment min-h-screen pt-32 md:pt-40 lg:pt-48 pb-32 md:pb-48"
      dir={isAr ? "rtl" : "ltr"}
    >
      <SEO
        title={content.title}
        description={content.sections[0]?.body || content.title}
      />
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

        <div className="space-y-16">
          {content.sections.map((section: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <h2 className="heading-md mb-6 text-void">
                {section.title}
              </h2>
              <p className="body-md text-void/60">
                {section.body}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
