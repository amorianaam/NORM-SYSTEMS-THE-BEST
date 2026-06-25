import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Target,
  UserCircle,
  AlertCircle,
  Compass,
} from "lucide-react";
import { useState, FormEvent } from "react";

export default function ContactForm() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const content = t.contactPage;

  // Guiding text — derived read-only state, zero formData mutation
  const guidingTextMap = (content.form.fields.entityType as any).guidingText as
    | Record<string, { desc: string }>
    | undefined;

  const entityToNeedMap: Record<string, string> = {
    government: "institutional",
    corporate: "strategic",
    governance: "decisionGov",
    family: "continuity",
  };

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const [formData, setFormData] = useState({
    entityType: "",
    need: "",
    name: "",
    position: "",
    email: "",
    phone: "",
  });

  // Derived guiding text — purely read-only, placed after formData declaration
  const guidingText = formData.entityType
    ? guidingTextMap?.[formData.entityType]
    : null;

  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  const validatePhone = (phone: string) => {
    // Basic phone validation: mostly numbers, some formatting chars allowed, 8-15 chars
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
    return (
      phoneRegex.test(phone) &&
      phone.replace(/\D/g, "").length >= 8 &&
      phone.replace(/\D/g, "").length <= 15
    );
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Auto-validate on blur
    if (field === "email" && formData.email && !validateEmail(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: isAr
          ? "الرجاء إدخال بريد إلكتروني صحيح"
          : "Please enter a valid email address",
      }));
    }
    if (field === "phone" && formData.phone && !validatePhone(formData.phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: isAr
          ? "الرجاء إدخال رقم هاتف صحيح"
          : "Please enter a valid phone number",
      }));
    }
  };

  const isFieldValid = (field: string) => {
    if (!touched[field]) return false;
    if (field === "name") return formData.name.trim().length > 0;
    if (field === "position") return formData.position.trim().length > 0;
    if (field === "email") return validateEmail(formData.email);
    if (field === "phone") return validatePhone(formData.phone);
    return false;
  };

  const totalSteps = 3;
  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  const handleNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, totalSteps));
  };
  const handlePrev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? (isAr ? -30 : 30) : isAr ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? (isAr ? -30 : 30) : isAr ? 30 : -30,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" },
    }),
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      handleNext();
      return;
    }

    // Validate final step
    const newErrors: { email?: string; phone?: string } = {};
    if (!validateEmail(formData.email)) {
      newErrors.email = isAr
        ? "الرجاء إدخال بريد إلكتروني صحيح"
        : "Please enter a valid email address";
    }
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
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entity: formData.entityType,
          challenge: formData.need,
          name: formData.name,
          position: formData.position,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        // Handle failures gracefully if needed
        console.error("Failed to submit");
        // Could present an error toast here in production
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "email" || field === "phone") {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="relative max-w-5xl mx-auto w-full bg-white/95 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] shadow-2xl shadow-void/10 border border-void/5 overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-magenta/[0.03] to-transparent pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-magenta/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-magenta/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="p-6 sm:p-8 md:p-12 relative z-10">
        {/* Acceptance Criteria Banner */}
        {!isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 md:mb-10 p-4 sm:p-6 lg:p-8 bg-magenta/5 border border-magenta/10 rounded-2xl"
          >
            <div className="flex gap-3 sm:gap-4 md:gap-5 items-start">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-magenta/10 flex items-center justify-center shrink-0">
                <AlertCircle
                  className="w-4 h-4 sm:w-5 sm:h-5 text-magenta"
                  aria-hidden="true"
                />
              </div>
              <div className="pt-0.5 w-full">
                <h3 className="text-base md:text-lg font-bold mb-1 md:mb-2 text-void">
                  {(content.acceptanceCriteria as any).title}
                </h3>
                <p className="text-sm md:text-base text-void/80 font-medium leading-relaxed">
                  {(content.acceptanceCriteria as any).body}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress Indicators */}
        {!isSuccess && (
          <div
            className="relative flex justify-between items-center mb-5 sm:mb-6 z-10 max-w-sm mx-auto px-2"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={isAr ? "تقدم النموذج" : "Form progress"}
          >
            <div
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-void/5 -z-10 rounded-full overflow-hidden"
              aria-hidden="true"
            >
              <motion.div
                className="h-full bg-magenta"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "circOut" }}
              />
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center micro-label transition-all duration-500
                      ${
                        step === i
                          ? "bg-magenta !text-white ring-8 ring-magenta/10 scale-110"
                          : step > i
                            ? "bg-magenta !text-white"
                            : "bg-parchment !text-void/40 border border-void/10"
                      }`}
              >
                {step > i ? (
                  <CheckCircle2
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 !text-white"
                    strokeWidth={3}
                  />
                ) : (
                  `0${i}`
                )}
              </div>
            ))}
          </div>
        )}

        {/* Form Content */}
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 md:py-24"
            role="status"
            aria-live="polite"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 bg-magenta/10 rounded-full flex items-center justify-center mx-auto mb-8 text-magenta">
              <CheckCircle2
                className="w-10 h-10 md:w-12 md:h-12"
                aria-hidden="true"
              />
            </div>
            <h3 className="heading-md mb-6">
              {content.form.success.title}
            </h3>
            <p className="body-md text-void max-w-sm mx-auto mb-4">
              {content.form.success.desc}
            </p>
            <p className="body-md text-void max-w-sm mx-auto">
              {content.form.success.body}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait" custom={direction}>
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                    <div className="p-1.5 sm:p-2 bg-magenta/5 rounded-lg sm:rounded-xl">
                      <Building2
                        className="text-magenta w-4 h-4 sm:w-5 sm:h-5"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="heading-sm">
                      {content.form.steps.context}
                    </h3>
                  </div>

                  <div
                    className="grid grid-cols-2 gap-3 sm:gap-4"
                    role="radiogroup"
                    aria-label={content.form.steps.context}
                  >
                    {Object.entries(content.form.fields.entityType.options).map(
                      ([key, label]: [string, any]) => (
                        <button
                          key={key}
                          type="button"
                          role="radio"
                          tabIndex={0}
                          aria-checked={formData.entityType === key}
                          onClick={() => setFormData({ ...formData, entityType: key, need: entityToNeedMap[key] })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setFormData({ ...formData, entityType: key, need: entityToNeedMap[key] });
                            }
                          }}
                          className={`p-4 rounded-xl border text-start transition-all duration-300 focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 outline-none flex items-center justify-between ${formData.entityType === key ? "bg-magenta/5 border-magenta text-magenta ring-1 ring-magenta shadow-sm" : "bg-void/[0.02] border-void/10 text-void hover:border-void/30"}`}
                        >
                          <span
                            className={`text-sm md:text-base font-semibold ${formData.entityType === key ? "text-magenta" : "text-void/80"}`}
                          >
                            {label}
                          </span>
                          {formData.entityType === key && (
                            <CheckCircle2 className="w-4 h-4 text-magenta shrink-0" />
                          )}
                        </button>
                      ),
                    )}
                  </div>

                  {/* Dynamic Guiding Text — appears after entity selection */}
                  <AnimatePresence mode="wait">
                    {formData.entityType && guidingText && (
                      <motion.div
                        key={formData.entityType}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="mt-4 p-5 sm:p-6 rounded-2xl bg-magenta/5 border border-magenta/10 flex gap-4 items-start"
                        role="status"
                        aria-live="polite"
                      >
                        <Compass
                          className="w-5 h-5 text-magenta shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <div>
                          <p className="body-md text-void/90 font-medium leading-relaxed">
                            {guidingText.desc}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                    <div className="p-1.5 sm:p-2 bg-magenta/5 rounded-lg sm:rounded-xl">
                      <Target
                        className="text-magenta w-4 h-4 sm:w-5 sm:h-5"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="heading-sm">
                      {content.form.steps.challenge}
                    </h3>
                  </div>

                  <div
                    className="grid grid-cols-2 gap-3 sm:gap-4"
                    role="radiogroup"
                    aria-label={content.form.steps.challenge}
                  >
                    {Object.entries(content.form.fields.need.options).map(
                      ([key, label]: [string, any]) => (
                        <button
                          key={key}
                          type="button"
                          role="radio"
                          tabIndex={0}
                          aria-checked={formData.need === key}
                          onClick={() => updateField("need", key)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              updateField("need", key);
                            }
                          }}
                          className={`p-4 rounded-xl border text-start transition-all duration-300 focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 outline-none flex items-center justify-between ${formData.need === key ? "bg-magenta/5 border-magenta text-magenta ring-1 ring-magenta shadow-sm" : "bg-void/[0.02] border-void/10 text-void hover:border-void/30"}`}
                        >
                          <span
                            className={`text-sm md:text-base font-semibold ${formData.need === key ? "text-magenta" : "text-void/80"}`}
                          >
                            {label}
                          </span>
                          {formData.need === key && (
                            <CheckCircle2 className="w-4 h-4 text-magenta shrink-0" />
                          )}
                        </button>
                      ),
                    )}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                    <div className="p-1.5 sm:p-2 bg-magenta/5 rounded-lg sm:rounded-xl">
                      <UserCircle
                        className="text-magenta w-4 h-4 sm:w-5 sm:h-5"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="heading-sm">
                      {content.form.steps.data}
                    </h3>
                  </div>

                  <div className="space-y-4 md:space-y-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="name-input"
                        className="block text-sm font-semibold text-void/80 mb-2"
                      >
                        {content.form.fields.name}
                      </label>
                      <div className="relative group">
                        <div className="absolute bottom-full mb-1 start-0 sm:start-auto opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                          <div className="bg-void text-white text-xs font-medium py-1.5 px-3 rounded-md shadow-lg whitespace-nowrap relative">
                            {isAr
                              ? "الاسم الكامل أو اسم الممثل"
                              : "Full name or representative's name"}
                            <div className="absolute top-full start-4 sm:start-1/2 sm:-translate-x-1/2 border-[4px] border-solid border-transparent border-t-void" />
                          </div>
                        </div>
                        <input
                          id="name-input"
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          onBlur={() => handleBlur("name")}
                          className={`w-full bg-white border rounded-xl px-4 py-3 text-sm md:text-base font-medium text-void focus:outline-none transition-all duration-300 focus-visible:ring-4 focus-visible:ring-magenta/10 pr-10 ${isFieldValid("name") ? "border-green-500 focus:border-green-500 bg-green-50/10" : "border-void/10 hover:border-void/20 focus:border-magenta focus:bg-magenta/[0.02]"}`}
                        />
                        {isFieldValid("name") && (
                          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="position-input"
                        className="block text-sm font-semibold text-void/80 mb-2"
                      >
                        {content.form.fields.position}
                      </label>
                      <div className="relative group">
                        <div className="absolute bottom-full mb-1 start-0 sm:start-auto opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                          <div className="bg-void !text-white micro-label py-1.5 px-3 rounded-md shadow-lg whitespace-nowrap relative">
                            {isAr
                              ? "المسمى الوظيفي في المنشأة"
                              : "Job title within the entity"}
                            <div className="absolute top-full start-4 sm:start-1/2 sm:-translate-x-1/2 border-[4px] border-solid border-transparent border-t-void" />
                          </div>
                        </div>
                        <input
                          id="position-input"
                          required
                          type="text"
                          value={formData.position}
                          onChange={(e) =>
                            updateField("position", e.target.value)
                          }
                          onBlur={() => handleBlur("position")}
                          className={`w-full bg-white border rounded-xl px-4 py-3 text-sm md:text-base font-medium text-void focus:outline-none transition-all duration-300 focus-visible:ring-4 focus-visible:ring-magenta/10 pr-10 ${isFieldValid("position") ? "border-green-500 focus:border-green-500 bg-green-50/10" : "border-void/10 hover:border-void/20 focus:border-magenta focus:bg-magenta/[0.02]"}`}
                        />
                        {isFieldValid("position") && (
                          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="email-input"
                        className="block text-sm font-semibold text-void/80 mb-2"
                      >
                        {content.form.fields.email}
                      </label>
                      <div className="relative group">
                        <div className="absolute bottom-full mb-1 start-0 sm:start-auto opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                          <div className="bg-void !text-white micro-label py-1.5 px-3 rounded-md shadow-lg whitespace-nowrap relative">
                            {isAr
                              ? "البريد الإلكتروني المخصص للعمل"
                              : "Work email address"}
                            <div className="absolute top-full start-4 sm:start-1/2 sm:-translate-x-1/2 border-[4px] border-solid border-transparent border-t-void" />
                          </div>
                        </div>
                        <input
                          id="email-input"
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          onBlur={() => handleBlur("email")}
                          className={`w-full bg-white border rounded-xl px-4 py-3 text-sm md:text-base font-medium text-void focus:outline-none transition-all duration-300 focus-visible:ring-4 focus-visible:ring-magenta/10 pr-10 ${errors.email ? "border-red-500/50 hover:border-red-500/70 focus:border-red-500 focus-visible:ring-red-500/10 focus:bg-red-500/[0.02]" : isFieldValid("email") ? "border-green-500 focus:border-green-500 bg-green-50/10" : "border-void/10 hover:border-void/20 focus:border-magenta focus:bg-magenta/[0.02]"}`}
                        />
                        {isFieldValid("email") && (
                          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                        )}
                        {errors.email && (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <AnimatePresence>
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="micro-label text-red-500 mt-1.5 flex items-center gap-1"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="phone-input"
                        className="block text-sm font-semibold text-void/80 mb-2"
                      >
                        {content.form.fields.phone}
                      </label>
                      <div className="relative group">
                        <div className="absolute bottom-full mb-1 start-0 sm:start-auto opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                          <div className="bg-void !text-white micro-label py-1.5 px-3 rounded-md shadow-lg whitespace-nowrap relative">
                            {isAr
                              ? "رقم هاتف مباشر للتواصل"
                              : "Direct contact phone number"}
                            <div className="absolute top-full start-4 sm:start-1/2 sm:-translate-x-1/2 border-[4px] border-solid border-transparent border-t-void" />
                          </div>
                        </div>
                        <input
                          id="phone-input"
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          onBlur={() => handleBlur("phone")}
                          className={`w-full bg-white border rounded-xl px-4 py-3 text-sm md:text-base font-medium text-void focus:outline-none transition-all duration-300 focus-visible:ring-4 focus-visible:ring-magenta/10 pr-10 ${errors.phone ? "border-red-500/50 hover:border-red-500/70 focus:border-red-500 focus-visible:ring-red-500/10 focus:bg-red-500/[0.02]" : isFieldValid("phone") ? "border-green-500 focus:border-green-500 bg-green-50/10" : "border-void/10 hover:border-void/20 focus:border-magenta focus:bg-magenta/[0.02]"}`}
                        />
                        {isFieldValid("phone") && (
                          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                        )}
                        {errors.phone && (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <AnimatePresence>
                        {errors.phone && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="micro-label text-red-500 mt-1.5 flex items-center gap-1"
                          >
                            {errors.phone}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Actions */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-void/5 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 sm:gap-2 md:gap-3 micro-label text-void/40 hover:text-void transition-colors focus-visible:outline-2 focus-visible:outline-magenta focus-visible:outline-offset-4 rounded-sm"
                >
                  {isAr ? (
                    <ArrowRight
                      className="w-3 h-3 md:w-4 md:h-4"
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowLeft
                      className="w-3 h-3 md:w-4 md:h-4"
                      aria-hidden="true"
                    />
                  )}
                  {content.form.buttons.prev}
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  (step === 1 && !formData.entityType) ||
                  (step === 2 && !formData.need)
                }
                className={`flex items-center gap-2 sm:gap-3 md:gap-4 px-8 py-3 md:py-4 bg-magenta text-white rounded-full btn-text hover:bg-magenta/90 transition-all duration-500 disabled:opacity-20 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 outline-none group`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <motion.span
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      {isAr ? "جاري الإرسال..." : "SUBMITTING..."}
                    </motion.span>
                    <div
                      className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                      aria-hidden="true"
                    />
                  </div>
                ) : (
                  <>
                    {step === totalSteps
                      ? content.form.buttons.submit
                      : content.form.buttons.next}
                    <ArrowRight
                      className={`w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 ${isAr ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
