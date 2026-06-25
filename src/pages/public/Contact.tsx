import { motion } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";
import SEO from "../../components/common/SEO";
import ContactForm from "../../components/sections/ContactForm";
import { slideUp, staggerContainer } from "../../lib/animations";
import { Mail, Phone } from "lucide-react";

export default function Contact() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const content = t.contactPage;

  return (
    <div
      className="bg-parchment min-h-screen pt-24 md:pt-32 pb-20 md:pb-32"
      dir={isAr ? "rtl" : "ltr"}
    >
      <SEO
        title={isAr ? "تواصل معنا" : "Contact Us"}
        description={content.hero.intro}
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="container-wide max-w-4xl lg:max-w-5xl mx-auto px-4 md:px-6"
      >
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.span
            variants={slideUp}
            className="micro-label mb-6 block"
          >
            {content.hero.eyebrow}
          </motion.span>
          <motion.h1
            variants={slideUp}
            className="heading-xl mb-6"
          >
            {content.hero.title}
          </motion.h1>
          <motion.div
            variants={slideUp}
            className="inline-flex items-center gap-3 px-5 py-2 md:px-6 md:py-3 bg-magenta/5 border border-magenta/10 rounded-full mb-6 text-magenta"
          >
            <span className="w-2 h-2 rounded-full bg-magenta animate-pulse" />
            <span className="body-sm">
              {content.hero.pricing}
            </span>
          </motion.div>
          <motion.p
            variants={slideUp}
            className="body-lg text-void/80 max-w-md mx-auto"
          >
            {content.hero.intro}
          </motion.p>
        </div>

        {/* Form Container */}
        <ContactForm />

        {/* Support Section */}
        <motion.div variants={slideUp} className="mt-20 md:mt-24 mb-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8 before:h-[1px] before:flex-1 before:bg-void/10 after:h-[1px] after:flex-1 after:bg-void/10">
            <span className="text-xs md:text-sm font-bold text-void/40 uppercase tracking-widest px-4">
              {(content.directChannels as any).title}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <a 
              href={`mailto:${(content.directChannels as any).email}`}
              className="flex items-center gap-4 md:gap-5 p-5 md:p-6 bg-white/60 backdrop-blur-md border border-void/5 rounded-[1.5rem] hover:bg-white hover:border-magenta/20 hover:shadow-xl hover:shadow-void/5 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-magenta/5 text-magenta rounded-xl flex items-center justify-center shrink-0 group-hover:bg-magenta group-hover:text-white transition-colors duration-300">
                <Mail className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="text-start">
                <span className="block text-xs font-bold text-void/40 uppercase tracking-wider mb-1">{(content.directChannels as any).emailLabel}</span>
                <span className="block text-sm md:text-base font-bold text-void">{(content.directChannels as any).email}</span>
              </div>
            </a>
            
            <a 
              href={`tel:${(content.directChannels as any).phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-4 md:gap-5 p-5 md:p-6 bg-white/60 backdrop-blur-md border border-void/5 rounded-[1.5rem] hover:bg-white hover:border-magenta/20 hover:shadow-xl hover:shadow-void/5 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-magenta/5 text-magenta rounded-xl flex items-center justify-center shrink-0 group-hover:bg-magenta group-hover:text-white transition-colors duration-300">
                <Phone className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="text-start">
                <span className="block text-xs font-bold text-void/40 uppercase tracking-wider mb-1">{(content.directChannels as any).phoneLabel}</span>
                <span className="block text-sm md:text-base font-bold text-void" dir="ltr">{(content.directChannels as any).phone}</span>
              </div>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
