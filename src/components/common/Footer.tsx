import React from "react";
import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { cn } from "../../lib/utils";
import { Mail, MapPin, ArrowLeft, ArrowRight } from "lucide-react";

export default function Footer() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const { pathname } = useLocation();
  const [settings, setSettings] = React.useState<any>({});
  const [cacheBuster, setCacheBuster] = React.useState(Date.now());

  React.useEffect(() => {
    fetch('/api/settings/tourism-media')
      .then(res => res.ok ? res.json() : {})
      .then(data => {
        setSettings(data);
        setCacheBuster(Date.now());
      })
      .catch(console.error);
  }, []);

  const isTourism = pathname.startsWith('/norm/hospitality-consultant');
  const logoSrc = isTourism 
    ? `${settings.tourism_logo_path || "/Tourism & Hospitality Sector Consulting.png"}?v=${cacheBuster}`
    : `/logo.png?v=${cacheBuster}`;

  return (
    <footer
      id="contact"
      role="contentinfo"
      className="bg-parchment text-ink pt-32 pb-12 overflow-hidden border-t border-void/5"
    >
      <div className="container-wide">
        <div
          className={cn(
            "grid md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12 mb-32",
            isAr ? "text-right" : "text-left",
          )}
        >
          {/* Column 1 & 2: Logo, Tagline & Contact */}
          <div className="lg:col-span-2 space-y-10">
            <div className="flex flex-col gap-6">
              <Link
                to="/norm"
                className="w-fit focus-visible:outline-2 focus-visible:outline-magenta focus-visible:outline-offset-4 rounded-lg"
                aria-label={
                  isAr ? "NORM - الصفحة الرئيسية" : "NORM - Home Page"
                }
              >
                <img
                  src={logoSrc}
                  alt="NORM Logo"
                  className="h-12 w-auto object-contain hover:scale-105 transition-transform"
                />
              </Link>
              <p className="text-base font-serif text-magenta opacity-80 max-w-[250px]">
                {t.footer.tagline}
              </p>
            </div>
            <div className="space-y-4 pt-4">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-black opacity-30">
                {t.footer.contact}
              </h4>
              <ul className="space-y-3 text-sm font-bold opacity-70">
                <li className="flex items-center gap-2">
                  <Mail
                    className="w-4 h-4 opacity-50 text-magenta"
                    aria-hidden="true"
                  />
                  <button
                    className="hover:text-magenta transition-colors cursor-pointer break-all focus-visible:outline-2 focus-visible:outline-magenta focus-visible:outline-offset-4 rounded-sm"
                    aria-label={`${isAr ? "أرسل بريداً إلكترونياً إلى" : "Send email to"} ${t.footer.email}`}
                  >
                    {t.footer.email}
                  </button>
                </li>
                <li className="flex items-start gap-2 leading-relaxed max-w-xs">
                  <MapPin
                    className="w-4 h-4 opacity-50 text-magenta mt-1 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{t.footer.address}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Navigation */}
          <nav className="space-y-10" aria-label={t.footer.nav}>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-black opacity-30">
              {t.footer.nav}
            </h4>
            <ul className="space-y-4">
              {[
                { key: "about", text: t.nav.about, href: "/norm/about" },
                {
                  key: "methodology",
                  text: t.nav.methodology,
                  href: "/norm/methodology",
                },
                { key: "systems", text: t.nav.systems, href: "/norm/services" },
                {
                  key: "investment",
                  text: t.nav.investment,
                  href: "/norm/investment",
                },
                { key: "qa", text: t.nav.qa, href: "/norm/qa" },
              ].map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.key} className="flex">
                    <Link
                      to={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`group flex items-center gap-2 text-sm font-bold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-magenta focus-visible:outline-offset-4 rounded-sm ${isActive ? "opacity-100 text-magenta" : "opacity-70 hover:opacity-100 hover:text-magenta"}`}
                    >
                      <span
                        className={cn(
                          "transition-transform duration-300",
                          !isActive &&
                            (isAr
                              ? "group-hover:-translate-x-1.5"
                              : "group-hover:translate-x-1.5"),
                        )}
                      >
                        {item.text}
                      </span>
                      {isAr ? (
                        <ArrowLeft
                          className="w-4 h-4 text-magenta opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                          aria-hidden="true"
                        />
                      ) : (
                        <ArrowRight
                          className="w-4 h-4 text-magenta opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Column 4: Explore */}
          <nav
            className="space-y-10"
            aria-label={isAr ? "الاستكشاف" : "Explore"}
          >
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-black opacity-30">
              {isAr ? "الاستكشاف" : "Explore"}
            </h4>
            <ul className="space-y-4">
              {[
                { key: "tourism", text: t.nav.tourismConsulting || "Tourism Consulting", href: "/norm/hospitality-consultant" },
                { key: "insights", text: t.nav.insights, href: "/norm/insights" },
                {
                  key: "strategicRelations",
                  text: t.nav.strategicRelations,
                  href: "/norm/strategic-relations",
                },
                { key: "portal", text: t.nav.portal, href: "/norm/portal" },
                {
                  key: "work",
                  text: t.nav.workWithNorm,
                  href: "/norm/work-with-norm",
                },
                { key: "contact", text: t.nav.contact, href: "/norm/contact" },
              ].map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.key} className="flex">
                    <Link
                      to={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`group flex items-center gap-2 text-sm font-bold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-magenta focus-visible:outline-offset-4 rounded-sm ${isActive ? "opacity-100 text-magenta" : "opacity-70 hover:opacity-100 hover:text-magenta"}`}
                    >
                      <span
                        className={cn(
                          "transition-transform duration-300",
                          !isActive &&
                            (isAr
                              ? "group-hover:-translate-x-1.5"
                              : "group-hover:translate-x-1.5"),
                        )}
                      >
                        {item.text}
                      </span>
                      {isAr ? (
                        <ArrowLeft
                          className="w-4 h-4 text-magenta opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                          aria-hidden="true"
                        />
                      ) : (
                        <ArrowRight
                          className="w-4 h-4 text-magenta opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Bottom Section with Separator */}
        <div className="pt-16 border-t border-void/5 space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col gap-6">
              <p className="text-[10px] uppercase tracking-[0.2em] font-black opacity-30 text-center md:text-start max-w-2xl leading-relaxed">
                {t.footer.legal}
              </p>
              <nav
                className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4"
                aria-label={isAr ? "الروابط القانونية" : "Legal links"}
              >
                {[
                  { key: "privacy", text: t.nav.privacy, href: "/norm/privacy" },
                  { key: "terms", text: t.nav.terms, href: "/norm/terms" },
                  {
                    key: "disclaimer",
                    text: t.nav.disclaimer,
                    href: "/norm/disclaimer",
                  },
                ].map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.key}
                      to={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`text-[10px] uppercase tracking-widest font-bold transition-all focus-visible:outline-2 focus-visible:outline-magenta focus-visible:outline-offset-4 rounded-sm ${isActive ? "opacity-100 text-magenta" : "opacity-70 hover:opacity-100 hover:text-magenta"}`}
                    >
                      {item.text}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div
              className={cn(
                "flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-black opacity-40",
                isAr ? "flex-row-reverse" : "flex-row",
              )}
            >
              <span>© {new Date().getFullYear()}</span>
              <div
                className="w-1 h-1 rounded-full bg-ink/20"
                aria-hidden="true"
              />
              <span>{t.footer.rights}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
