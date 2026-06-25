import { motion } from "motion/react";
import { Download, FileText, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PaperVisual from "../common/PaperVisual";

function InsightsMobileCarousel({
  items,
  isAr,
  t,
}: {
  items: any[];
  isAr: boolean;
  t: any;
}) {
  const [activeCard, setActiveCard] = useState(0);
  const navigate = useNavigate();

  if (!items || items.length === 0) return null;

  return (
    <div className="md:hidden relative h-[420px] sm:h-[440px] w-[85%] max-w-[320px] mx-auto mb-24 mt-10">
      {items.map((paper, index) => {
        let position = "center";
        const total = items.length;
        if (index === activeCard) {
          position = "center";
        } else if (index === (activeCard + 1) % total) {
          position = isAr ? "left" : "right";
        } else if (index === (activeCard - 1 + total) % total) {
          position = isAr ? "right" : "left";
        } else {
          position = "hidden";
        }

        const variants = {
          center: { x: 0, y: 0, scale: 1, rotate: 0, zIndex: 30, opacity: 1 },
          right: {
            x: "25%",
            y: 12,
            scale: 0.85,
            rotate: 6,
            zIndex: 20,
            opacity: 0.6,
          },
          left: {
            x: "-25%",
            y: 12,
            scale: 0.85,
            rotate: -6,
            zIndex: 20,
            opacity: 0.6,
          },
          hidden: {
            x: 0,
            y: 20,
            scale: 0.7,
            rotate: 0,
            zIndex: 10,
            opacity: 0,
          },
        };

        return (
          <motion.div
            key={index}
            variants={variants}
            initial={false}
            animate={position}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setActiveCard(index)}
            drag={index === activeCard ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(_event, info) => {
              const swipeThreshold = 50;
              if (info.offset.x < -swipeThreshold) {
                setActiveCard((prev) => (prev + 1) % total);
              } else if (info.offset.x > swipeThreshold) {
                setActiveCard((prev) => (prev - 1 + total) % total);
              }
            }}
            className={`absolute inset-0 bg-white rounded-5xl border border-void/5 p-8 flex flex-col justify-between shadow-2xl shadow-void/[0.05] cursor-pointer overflow-hidden touch-pan-y ${isAr ? "text-right" : "text-left"}`}
          >
            <div>
              <PaperVisual
                category={
                  paper.category_en || paper.category || paper.category_key
                }
                insightId={paper.id}
                title={paper.title_en || paper.title}
              />
              <span className="text-[10px] uppercase tracking-widest font-black text-magenta mb-4 block">
                {isAr
                  ? paper.category_ar ||
                    t.insightsPage.categories[
                      paper.category || paper.category_key
                    ] ||
                    paper.category
                  : paper.category_en || paper.category || paper.category_key}
              </span>
              <h3 className="heading-sm mb-4 text-ink line-clamp-2">
                {isAr
                  ? paper.title_ar || paper.title
                  : paper.title_en || paper.title}
              </h3>
              <p className="body-sm mb-6 line-clamp-3">
                {isAr
                  ? paper.summary_ar || paper.summary
                  : paper.summary_en || paper.summary}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/insights");
              }}
              className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest group/btn mt-auto"
            >
              <span className="relative overflow-hidden inline-block group-hover/btn:text-magenta transition-colors">
                {t.previewInsights.downloadBtn}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-magenta transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left" />
              </span>
              <ArrowRight
                className={`w-4 h-4 text-magenta transform translate-y-0 transition-transform ${isAr ? "rotate-180 group-hover/btn:-translate-x-1" : "group-hover/btn:translate-x-1"}`}
              />
            </button>
          </motion.div>
        );
      })}

      {/* Progress Dots & Helper Text */}
      {items.length > 1 && (
        <div className="absolute -bottom-16 left-0 right-0 flex flex-col items-center gap-4 pointer-events-none">
          <div className="flex justify-center items-center gap-2 pointer-events-auto">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCard(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  idx === activeCard
                    ? "w-8 bg-magenta"
                    : "w-1.5 bg-magenta/20 hover:bg-magenta/40"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] uppercase tracking-widest font-mono text-void/40 text-center">
            {t.previewInsights.bottomPrompt || (isAr
              ? "مرر البطاقة يميناً أو يساراً للتنقل"
              : "Swipe card left or right to navigate")}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Insights() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  const [recentInsights, setRecentInsights] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/insights")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setRecentInsights(data.slice(0, 2));
        } else {
          setRecentInsights([...t.insightsPage.papers].reverse().slice(0, 2));
        }
      })
      .catch(() => {
        setRecentInsights([...t.insightsPage.papers].reverse().slice(0, 2));
      });
  }, [t.insightsPage.papers]);

  return (
    <section id="insights" className="section-padding bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto w-full px-[var(--spacing-fluid-sm)] md:px-[var(--spacing-fluid-md)] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12 lg:gap-20"
        >
          <div className="max-w-3xl">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-magenta mb-6 block">
              {t.previewInsights.eyebrow}
            </span>
            <h2 className="heading-lg text-balance">
              {t.previewInsights.title}
            </h2>
          </div>
          <Link
            to="/norm/insights"
            className="group flex items-center gap-4 text-xs font-bold uppercase tracking-widest hover:text-magenta transition-colors focus-visible:outline-2 focus-visible:outline-magenta focus-visible:outline-offset-8 rounded-sm"
          >
            {t.previewInsights.viewAllBtn}
            {isAr ? (
              <ArrowLeft
                className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                aria-hidden="true"
              />
            ) : (
              <ArrowRight
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            )}
          </Link>
        </motion.div>

        <div className="hidden md:grid md:grid-cols-2 gap-8 lg:gap-12">
          {recentInsights.map((insight: any, index: number) => (
            <motion.div
              key={insight.id || index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true, margin: "-10%" }}
              className="block h-full"
            >
              <Link
                to="/norm/insights"
                className="group relative bg-white rounded-5xl border border-void/5 p-10 flex flex-col justify-between hover:border-magenta/20 transition-all duration-500 shadow-2xl shadow-void/[0.01] hover:shadow-magenta/[0.03]"
              >
                <div>
                  <PaperVisual
                    category={
                      insight.category_en ||
                      insight.category ||
                      insight.category_key
                    }
                    insightId={insight.id}
                    title={insight.title_en || insight.title}
                  />
                  <span className="text-[10px] uppercase tracking-widest font-black text-magenta mb-6 block text-start">
                    {isAr
                      ? insight.category_ar ||
                        t.insightsPage.categories[
                          insight.category || insight.category_key
                        ] ||
                        insight.category
                      : insight.category_en ||
                        insight.category ||
                        insight.category_key}
                  </span>
                  <h3 className="heading-sm mb-6 group-hover:text-magenta transition-colors text-start">
                    {isAr
                      ? insight.title_ar || insight.title
                      : insight.title_en || insight.title}
                  </h3>
                  <p className="body-sm mb-8 text-start line-clamp-3">
                    {isAr
                      ? insight.summary_ar || insight.summary
                      : insight.summary_en || insight.summary}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest group/btn">
                  <span className="relative overflow-hidden inline-block group-hover/btn:text-magenta transition-colors">
                    {t.previewInsights.downloadBtn}
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-magenta transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left" />
                  </span>
                  <ArrowRight
                    className={`w-4 h-4 text-magenta transform translate-y-0 transition-transform ${isAr ? "rotate-180 group-hover/btn:-translate-x-1" : "group-hover/btn:translate-x-1"}`}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <InsightsMobileCarousel items={recentInsights} isAr={isAr} t={t} />
      </div>
    </section>
  );
}
