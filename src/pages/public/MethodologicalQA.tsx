import { motion } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowRight, HelpCircle } from "lucide-react";
import SEO from "../../components/common/SEO";
import { slideUp, staggerContainer } from "../../lib/animations";

export default function MethodologicalQA() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const content = t.qaPage;

  return (
    <div className="bg-parchment min-h-screen" dir={isAr ? "rtl" : "ltr"}>
      <SEO
        title={isAr ? "المنهجية: أسئلة وأجوبة" : "Methodological Q&A"}
        description={content.hero.intro}
      />
      {/* Hero Section */}
      <section className="pt-32 md:pt-40 lg:pt-48 pb-32 border-b border-void/5">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="container-wide"
        >
          <div className="max-w-4xl">
            <motion.span
              variants={slideUp}
              className="micro-label mb-8 block"
            >
              {content.hero.eyebrow}
            </motion.span>
            <motion.h1
              variants={slideUp}
              className="heading-xl mb-12"
            >
              {content.hero.title}
            </motion.h1>
            <motion.p
              variants={slideUp}
              className="body-lg border-l-2 border-magenta/20 pl-8 ml-2 text-ink/60"
            >
              {content.hero.intro}
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Q&A List Section */}
      <section className="pb-40">
        <div>
          {content.questions.map(
            (item: { q: string; a: string }, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className={`py-24 md:py-32 ${idx % 2 === 1 ? "bg-white" : "bg-parchment"}`}
              >
                <div className="container-wide">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
                    <div className="lg:col-span-1">
                      <span className="text-4xl font-serif text-magenta/20">
                        0{idx + 1}
                      </span>
                    </div>

                    <div className="lg:col-span-11 space-y-12">
                      <div className="max-w-4xl">
                        <h2 className="heading-md mb-12">
                          {item.q}
                        </h2>
                        <div className="relative">
                          <div className="absolute top-0 left-0 bottom-0 w-px bg-magenta/10" />
                          <p className="body-md pl-12 whitespace-pre-line">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ),
          )}
        </div>
      </section>

      {/* Final Statement & CTA */}
      <section className="py-16 md:py-20 bg-void/5">
        <div className="container-wide text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <p className="heading-md text-void/90 mb-16 max-w-4xl mx-auto">
              {content.finalStatement}
            </p>

            <Link
              to="/norm/contact"
              className="inline-flex items-center gap-6 px-12 py-5 border-2 border-magenta text-magenta rounded-full btn-text hover:bg-magenta hover:text-parchment transition-all duration-500 group"
            >
              {content.ctaButton}
              <ArrowRight
                className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""}`}
              />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
