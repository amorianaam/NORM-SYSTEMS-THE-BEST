import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  Globe,
  Info,
  Compass,
  Layers,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Twitter,
  Mail,
  MessageCircle,
  Phone,
  Home,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { t, language, toggleLanguage } = useLanguage();
  const isAr = language === "ar";
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<any>({});
  const [cacheBuster, setCacheBuster] = useState(Date.now());

  // Fetch settings for dynamic logo
  useEffect(() => {
    fetch('/api/settings/tourism-media')
      .then(res => res.ok ? res.json() : {})
      .then(data => {
        setSettings(data);
        setCacheBuster(Date.now());
      })
      .catch(console.error);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isTourism = pathname.startsWith('/norm/hospitality-consultant');
  const logoSrc = isTourism 
    ? `${settings.tourism_logo_path || "/Tourism & Hospitality Sector Consulting.png"}?v=${cacheBuster}`
    : `/logo.png?v=${cacheBuster}`;

  const navLinks = [
    { key: "home", text: t.nav.home, href: "/norm", icon: Home },
    { key: "about", text: t.nav.about, href: "/norm/about", icon: Info },
    {
      key: "methodology",
      text: t.nav.methodology,
      href: "/norm/methodology",
      icon: Compass,
    },
    { key: "systems", text: t.nav.systems, href: "/norm/services", icon: Layers },
    {
      key: "investment",
      text: t.nav.investment,
      href: "/norm/investment",
      icon: TrendingUp,
    },
    {
      key: "insights",
      text: t.nav.insights,
      href: "/norm/insights",
      icon: BookOpen,
    },
    {
      key: "contact",
      text: t.nav.contact,
      href: "/norm/contact",
      icon: MessageSquare,
    },
  ];

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-magenta focus:text-white focus:rounded-full focus:shadow-2xl transition-all"
      >
        {isAr ? "تخطي للوصول للمحتوى" : "Skip to main content"}
      </a>
      <div
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}
        role="navigation"
        aria-label={isAr ? "التنقل الرئيسي" : "Main navigation"}
      >
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "relative" }}
          className="flex items-center justify-between px-[var(--spacing-fluid-sm)] py-5 md:py-6 md:px-[var(--spacing-fluid-md)] bg-parchment/95 backdrop-blur-2xl border-b border-ink/10"
          dir={isAr ? "rtl" : "ltr"}
        >
        <div className="flex items-center gap-10">
          <Link
            to="/norm"
            className="flex items-center gap-3 cursor-pointer group focus-visible:outline-2 focus-visible:outline-magenta focus-visible:outline-offset-4 rounded-lg px-2 -mx-2 py-1"
            aria-label={isAr ? "NORM - الصفحة الرئيسية" : "NORM - Home Page"}
          >
            <img
              src={logoSrc}
              alt="NORM Logo"
              className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          <div className={`hidden lg:flex items-center ${isAr ? "gap-8" : "gap-4 xl:gap-6"}`}>
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <div key={item.key} className="relative group/nav">
                  <Link
                    to={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative ${isAr ? "text-xs lg:text-sm tracking-[0.2em]" : "text-[9px] xl:text-[10px] tracking-widest"} uppercase font-bold transition-all duration-300 pb-1 focus-visible:outline-2 focus-visible:outline-magenta focus-visible:outline-offset-8 rounded-sm ${isActive ? "opacity-100 text-magenta" : "opacity-50 hover:opacity-100 hover:text-magenta"}`}
                  >
                    {item.text}
                    <span
                      className={`absolute left-0 bottom-0 w-full h-[1.5px] bg-magenta origin-left transition-transform duration-300 ease-out ${isActive ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100"}`}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-8">
          <button
            onClick={toggleLanguage}
            className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-magenta transition-all duration-300 px-2 focus-visible:outline-2 focus-visible:outline-magenta focus-visible:outline-offset-8 rounded-sm"
            aria-label={
              isAr ? "تغيير اللغة للإنجليزية" : "Switch language to Arabic"
            }
          >
            <Globe className="w-4 h-4" aria-hidden="true" />
            <span>{isAr ? "EN" : "AR"}</span>
          </button>

          <Link
            to="/norm/contact"
            className={`hidden sm:flex group items-center gap-3 bg-magenta text-white py-2.5 rounded-full ${isAr ? "px-6 text-[10px] md:text-xs tracking-[0.2em]" : "px-3 lg:px-4 text-[9px] tracking-normal"} uppercase font-black hover:bg-ink transition-all duration-500 shadow-xl shadow-magenta/20 focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 ring-offset-parchment`}
          >
            {t.nav.startQualification}
            {isAr ? (
              <ArrowLeft
                className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform"
                aria-hidden="true"
              />
            ) : (
              <ArrowRight
                className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            )}
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-ink hover:text-magenta transition-colors focus-visible:outline-2 focus-visible:outline-magenta focus-visible:outline-offset-4 rounded-sm"
            aria-label={isAr ? "تبديل القائمة" : "Toggle menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </motion.nav>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 top-[70px] md:top-[80px] bg-void/10 backdrop-blur-[2px] z-[55] lg:hidden h-[calc(100vh-70px)]"
              transition={{ duration: 0.3 }}
            />
            <motion.div
              initial={{ opacity: 0, x: isAr ? "15%" : "-15%", scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: isAr ? "15%" : "-15%", scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`fixed top-[70px] md:top-[80px] mt-2 w-[85vw] max-w-[260px] bg-parchment/95 backdrop-blur-3xl shadow-2xl shadow-void/10 z-[60] lg:hidden rounded-2xl border border-white/50 flex flex-col p-4 overflow-hidden ${
                isAr
                  ? "right-[var(--spacing-fluid-sm)]"
                  : "left-[var(--spacing-fluid-sm)]"
              }`}
              dir={isAr ? "rtl" : "ltr"}
              id="mobile-menu"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                if (isAr) {
                  if (offset.x > 50 || velocity.x > 300) setIsOpen(false);
                } else {
                  if (offset.x < -50 || velocity.x < -300) setIsOpen(false);
                }
              }}
            >
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-ink/5">
                <img
                  src={logoSrc}
                  alt="NORM Logo"
                  className="h-5 w-auto object-contain"
                />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-ink leading-none">
                    NORM
                  </span>
                </div>
              </div>

              <nav className="flex flex-col gap-1 pt-0">
                {navLinks.map((item, i) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.key}
                      className="relative"
                      initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.05 + i * 0.04,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        to={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`group flex items-center gap-3 ${isAr ? "text-[13px]" : "text-[11.5px] tracking-wide"} font-serif font-medium transition-all px-3 py-2 rounded-xl focus-visible:outline-2 focus-visible:outline-magenta relative overflow-hidden ${isActive ? "text-magenta bg-white/60 shadow-sm border border-ink/5" : "text-ink/70 hover:text-ink hover:bg-white/40 border border-transparent"}`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeTabMobile"
                            className={`absolute top-1/2 -translate-y-1/2 ${isAr ? "right-0" : "left-0"} w-1 h-1/2 bg-magenta rounded-full`}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            }}
                          />
                        )}
                        <div
                          className={`p-1.5 rounded-lg transition-colors ${isActive ? "bg-magenta/10 text-magenta" : "bg-black/5 text-ink/50 group-hover:bg-black/10 group-hover:text-ink"}`}
                        >
                          <item.icon className="w-4 h-4 stroke-[2]" />
                        </div>
                        {item.text}
                        <ArrowRight
                          className={`w-3.5 h-3.5 opacity-0 transition-all ${isAr ? "rotate-180 translate-x-2 group-hover:translate-x-0 mr-auto" : "-translate-x-2 group-hover:translate-x-0 ml-auto"} group-hover:opacity-40`}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-3 pt-3 border-t border-ink/5 space-y-3"
              >
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={toggleLanguage}
                    className="flex-shrink-0 px-2.5 py-2 bg-void/5 border border-ink/5 shadow-sm rounded-lg flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest hover:bg-magenta hover:text-white hover:border-magenta transition-all group focus-visible:outline-2 focus-visible:outline-magenta"
                  >
                    <Globe className="w-3.5 h-3.5 text-ink/40 group-hover:text-white/80 transition-colors" />
                    <span>{isAr ? "EN" : "AR"}</span>
                  </button>

                  <Link
                    to="/norm/contact"
                    className={`flex-grow flex items-center justify-center gap-1.5 bg-magenta text-white py-2 rounded-lg ${isAr ? "text-[9px] tracking-[0.2em]" : "text-[9px] tracking-normal"} uppercase font-black hover:bg-ink transition-all shadow-lg shadow-magenta/20 focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 ring-offset-white`}
                  >
                    {t.nav.startQualification}
                    <ArrowRight
                      className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`}
                    />
                  </Link>
                </div>

                <div className="pt-2 mt-1 border-t border-ink/5">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="text-[9px] text-center text-ink/50 font-medium mb-2.5"
                  >
                    {isAr ? "متواجدون دائماً لخدمتك" : "Always here to help"}
                  </motion.p>
                  <div className="flex items-center justify-center gap-4">
                    {[
                      { id: "tw", label: "Twitter", icon: Twitter, delay: 0.4 },
                      {
                        id: "wa",
                        label: "WhatsApp",
                        icon: MessageCircle,
                        delay: 0.5,
                      },
                      { id: "em", label: "Email", icon: Mail, delay: 0.6 },
                      { id: "ph", label: "Call", icon: Phone, delay: 0.7 },
                    ].map((social) => (
                      <motion.a
                        key={social.id}
                        href="#"
                        aria-label={social.label}
                        initial={{ opacity: 0, y: 15, scale: 0.5 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                          delay: social.delay,
                        }}
                        className="p-1.5 text-ink hover:text-magenta hover:bg-magenta/10 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-magenta"
                      >
                        <social.icon className="w-4 h-4 stroke-[1.5]" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
