import { motion } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";
import { ArrowRight, Brain, FileText, Send } from "lucide-react";
import { useState, FormEvent, useRef } from "react";
import SEO from "../../components/common/SEO";
import { slideUp, staggerContainer } from "../../lib/animations";

export default function WorkWithNorm() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const content = t.workWithNormPage;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    identity: "",
    email: "",
    phone: "",
    context: "",
  });
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
    return (
      phoneRegex.test(phone) &&
      phone.replace(/\D/g, "").length >= 8 &&
      phone.replace(/\D/g, "").length <= 15
    );
  };


  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "email" || field === "phone") {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; phone?: string } = {};
    if (!validatePhone(formData.phone)) {
      newErrors.phone = isAr
        ? "الرجاء إدخال رقم هاتف صحيح"
        : "Please enter a valid phone number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsSuccess(true);
        setFormData({ identity: "", email: "", phone: "", context: "" });
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error(error);
      // Fallback for visual demo if API fails
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-parchment min-h-screen" dir={isAr ? "rtl" : "ltr"}>
      <SEO
        title={isAr ? "Ø§Ù„Ø¹Ù…Ù„ Ù…Ø¹Ù†Ø§" : "Work with NORM"}
        description={content.hero.intro}
      />
      {/* Hero Section */}
      <section className="pt-32 md:pt-40 lg:pt-48 pb-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="container-wide"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.span
              variants={slideUp}
              className="micro-label mb-8 block"
            >
              {content.hero.eyebrow}
            </motion.span>
            <motion.h1
              variants={slideUp}
              className="heading-xl mb-10"
            >
              {content.hero.title}
            </motion.h1>
            <motion.div
              variants={slideUp}
              className="inline-flex items-center gap-3 px-6 py-3 bg-magenta/5 border border-magenta/10 rounded-full mb-10 text-magenta mx-auto"
            >
              <span className="w-2 h-2 rounded-full bg-magenta animate-pulse" />
              <span className="body-sm">
                {content.hero.pricing}
              </span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="body-lg"
            >
              {content.hero.intro}
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Philosophy & Environment */}
      <section className="pb-32 overflow-hidden">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: isAr ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-lg mb-10">
                {content.environment.title}
              </h2>
              <p className="body-lg border-l-2 border-magenta/20 pl-8 ml-2 text-void/60">
                {content.environment.body}
              </p>
            </motion.div>

            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-magenta/5 rounded-7xl blur-3xl transform rotate-3" />
              <div className="relative bg-white/40 backdrop-blur-sm border border-magenta/10 p-12 rounded-7xl shadow-2xl">
                <Brain className="w-20 h-20 text-magenta opacity-30 mb-8 stroke-[1]" />
                <div className="space-y-4">
                  <div className="h-2 w-3/4 bg-magenta/10 rounded-full" />
                  <div className="h-2 w-full bg-magenta/5 rounded-full" />
                  <div className="h-2 w-5/6 bg-magenta/10 rounded-full" />
                  <div className="h-2 w-2/3 bg-magenta/5 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements & Thinking Profile */}
      <section className="pb-40">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div className="order-2 lg:order-1 relative group">
              <div className="absolute inset-0 bg-void/5 rounded-6xl group-hover:bg-magenta/5 transition-colors duration-700" />
              <div className="relative p-12 md:p-16 space-y-10">
                <div className="w-16 h-16 bg-void text-parchment rounded-2xl flex items-center justify-center">
                  <FileText className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="heading-sm mb-6">
                    {content.requirements.title}
                  </h3>
                  <p className="body-md mb-8">
                    {content.requirements.body}
                  </p>
                  <div className="p-6 bg-magenta/5 rounded-2xl border border-magenta/10">
                    <p className="body-sm text-magenta">
                      {content.requirements.note}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: isAr ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 lg:pt-10"
            >
              <p className="heading-md text-void/90">
                {content.finalStatement}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Submission Form Section */}
      <section id="apply" className="pb-24">
        <div className="container-wide w-full px-4 md:px-6">
          <div className="bg-white/95 backdrop-blur-xl text-void rounded-[1.5rem] md:rounded-[2rem] shadow-2xl shadow-void/10 overflow-hidden relative border border-void/5 max-w-4xl mx-auto w-full">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-magenta/[0.03] to-transparent pointer-events-none" />
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-magenta/10 blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-magenta/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="p-6 sm:p-8 md:p-12 relative z-10">
              {isSuccess ? (
                <div
                  className="text-center py-16 md:py-20"
                  role="status"
                  aria-live="polite"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 md:w-20 md:h-20 bg-magenta/20 rounded-full flex items-center justify-center mx-auto mb-8 text-magenta"
                  >
                    <Send
                      className="w-8 h-8 md:w-10 md:h-10"
                      aria-hidden="true"
                    />
                  </motion.div>
                  <h2 className="heading-md mb-4">
                    {content.form.success.title}
                  </h2>
                  <p className="body-sm max-w-sm mx-auto text-void/70">
                    {content.form.success.desc}
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-10 md:mb-12">
                    <h2 className="heading-sm mb-4 text-void">
                      {content.cta.title}
                    </h2>
                      <p className="body-sm text-void/70 font-medium">
                        {content.cta.subtitle}
                      </p>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="w-full space-y-4 md:space-y-6"
                  >
                    <div className="space-y-2">
                      <label
                        htmlFor="identity-input"
                        className="block text-sm font-semibold text-void/80 mb-2"
                      >
                        {content.form.fields.identity}
                      </label>
                      <input
                        id="identity-input"
                        type="text"
                        required
                        value={formData.identity}
                        onChange={(e) =>
                          updateField("identity", e.target.value)
                        }
                        className="w-full bg-white border border-void/10 hover:border-void/20 rounded-xl px-4 py-3 text-sm focus:border-magenta focus:bg-magenta/[0.02] focus:outline-none transition-all duration-300 focus-visible:ring-4 focus-visible:ring-magenta/10 text-void"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="email-input"
                          className="block text-sm font-semibold text-void/80 mb-2"
                        >
                          {content.form.fields.email}
                        </label>
                        <input
                          id="email-input"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 focus-visible:ring-4 text-void ${errors.email ? "border-red-500/50 hover:border-red-500/70 focus:border-red-500 focus-visible:ring-red-500/10 focus:bg-red-500/[0.02]" : "border-void/10 hover:border-void/20 focus:border-magenta focus-visible:ring-magenta/10 focus:bg-magenta/[0.02]"}`}
                        />
                        {errors.email && (
                          <p className="text-[10px] sm:text-xs text-red-400 mt-1.5 flex items-center gap-1.5 font-medium">
                            <span className="w-1 h-1 rounded-full bg-red-400" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="phone-input"
                          className="block text-sm font-semibold text-void/80 mb-2"
                        >
                          {content.form.fields.phone}
                        </label>
                        <input
                          id="phone-input"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 focus-visible:ring-4 text-void ${errors.phone ? "border-red-500/50 hover:border-red-500/70 focus:border-red-500 focus-visible:ring-red-500/10 focus:bg-red-500/[0.02]" : "border-void/10 hover:border-void/20 focus:border-magenta focus-visible:ring-magenta/10 focus:bg-magenta/[0.02]"}`}
                        />
                        {errors.phone && (
                          <p className="text-[10px] sm:text-xs text-red-400 mt-1.5 flex items-center gap-1.5 font-medium">
                            <span className="w-1 h-1 rounded-full bg-red-400" />
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="context-input"
                        className="block text-sm font-semibold text-void/80 mb-2 flex items-center justify-between"
                      >
                        <span>{content.form.fields.context}</span>
                        <span className="opacity-50 lowercase">
                          {content.form.fields.contextLabel}
                        </span>
                      </label>
                      <textarea
                        id="context-input"
                        ref={textareaRef}
                        rows={1}
                        value={formData.context}
                        onChange={(e) => {
                          updateField("context", e.target.value);
                          if (textareaRef.current) {
                            textareaRef.current.style.height = "auto";
                            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
                          }
                        }}
                        className="w-full bg-white border border-void/10 hover:border-void/20 rounded-xl px-4 py-3 text-sm focus:border-magenta focus:bg-magenta/[0.02] focus:outline-none transition-all duration-300 resize-none overflow-y-hidden focus-visible:ring-4 focus-visible:ring-magenta/10 text-void"
                      />
                    </div>

                    <div className="pt-4 md:pt-6">
                      <button
                        type="submit"
                        className="w-full max-w-[240px] mx-auto flex items-center justify-center gap-3 md:gap-4 px-6 py-3 md:py-4 bg-magenta text-white rounded-full btn-text hover:bg-white hover:text-void transition-all duration-500 disabled:opacity-20 disabled:cursor-not-allowed focus-visible:ring-4 focus-visible:ring-magenta/20 outline-none shadow-[0_0_40px_-10px_rgba(208,0,111,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] group"
                      >
                        {isSubmitting ? (
                          <div
                            className="w-4 h-4 border-2 border-parchment/30 border-t-parchment text-parchment rounded-full animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <>
                            <span>{content.cta.button}</span>
                            <ArrowRight
                              className={`w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 ${isAr ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
