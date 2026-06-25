import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";
import { Lock, ArrowRight, Shield } from "lucide-react";
import SEO from "../../components/common/SEO";

export default function ClientPortal() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const content = t.portalPage;

  return (
    <div className="bg-parchment min-h-screen" dir={isAr ? "rtl" : "ltr"}>
      <SEO
        title={content.login?.title}
        description={content.login?.desc}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key="login-view"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col md:flex-row min-h-screen"
        >
          {/* Left Section - Portal (Deep Void) */}
          <div className="flex-1 bg-void py-24 md:py-32 px-8 md:px-16 lg:px-24 flex flex-col justify-center order-2 md:order-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(224,27,139,0.05)_0%,_transparent_50%)]" />
            <motion.div
              initial={{ opacity: 0, x: isAr ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-md mx-auto w-full z-10 text-center"
            >
              <div className="w-16 h-16 mx-auto bg-parchment/5 rounded-2xl flex items-center justify-center mb-10 border border-parchment/10 relative">
                <Lock className="text-parchment w-8 h-8 relative z-10" />
                <div className="absolute inset-0 bg-magenta/20 blur-xl rounded-full" />
              </div>
              <h2 className="heading-md mb-4 text-parchment">
                {content.login?.title}
              </h2>
              <p className="body-lg mb-12 text-parchment">
                {content.login?.desc}
              </p>

              <div className="flex justify-center">
                <a
                  href="/cms/login"
                  className="w-full sm:w-auto inline-flex bg-white/10 text-white py-4 px-8 rounded-xl items-center justify-center gap-3 btn-text border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all"
                >
                  {content.login?.btn}
                  <ArrowRight
                    className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`}
                  />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Section - Aesthetic */}
          <div className="flex-1 bg-parchment py-24 px-8 flex items-center justify-center order-1 md:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-md text-center"
            >
              <Shield className="w-20 h-20 text-void/20 mx-auto mb-8" />
              <h3 className="heading-md text-void mb-4">
                {content.security?.title}
              </h3>
              <p className="body-lg text-void">
                {content.security?.desc}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
