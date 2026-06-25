import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";
import {
  ArrowRight,
  Download,
  X,
  Search,
  Filter,
  ChevronDown,
  Check,
  FileText,
} from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import SEO from "../../components/common/SEO";
import { slideUp, staggerContainer } from "../../lib/animations";

import PaperVisual from "../../components/common/PaperVisual";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  insightId: number;
  paperTitle: string;
  pdfPath: string | null;
  t: any;
  isAr: boolean;
}

const DownloadModal = ({
  isOpen,
  onClose,
  insightId,
  paperTitle,
  pdfPath,
  t,
  isAr,
}: DownloadModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/insight_readers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          organization,
          insight_id: insightId,
        }),
      });

      if (res.ok) {
        localStorage.setItem(
          "norm_insights_registered",
          JSON.stringify({ name, email, organization }),
        );
        if (pdfPath) {
          window.open(pdfPath, "_blank");
        }
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-void/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-parchment w-full max-w-lg rounded-5xl overflow-hidden shadow-2xl border border-magenta/10"
            dir={isAr ? "rtl" : "ltr"}
          >
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="heading-md mb-2">{t.modal.title}</h3>
                  <p className="micro-label">
                    {paperTitle}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-void/40 hover:text-magenta transition-colors mt-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="micro-label !text-void">
                      {t.modal.name}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-void/5 border border-void/10 rounded-xl px-4 py-3 focus:border-magenta focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="micro-label !text-void">
                      {t.modal.email}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-void/5 border border-void/10 rounded-xl px-4 py-3 focus:border-magenta focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="micro-label !text-void">
                      {t.modal.org}
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      required
                      className="w-full bg-void/5 border border-void/10 rounded-xl px-4 py-3 focus:border-magenta focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-magenta text-parchment rounded-xl btn-text hover:bg-void transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-parchment/30 border-t-parchment rounded-full animate-spin" />
                    ) : (
                      <>
                        {t.modal.submit}
                        <ArrowRight
                          className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`}
                        />
                      </>
                    )}
                  </button>
                </form>
              </>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

function StackedInsightsCarousel({
  items,
  isAr,
  content,
  onDownloadClick,
  buttonText,
}: {
  items: any[];
  isAr: boolean;
  content: any;
  onDownloadClick: (paper: any) => void;
  buttonText: string;
}) {
  const [activeCard, setActiveCard] = useState(0);

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
              const isNext = isAr ? info.offset.x > swipeThreshold : info.offset.x < -swipeThreshold;
              const isPrev = isAr ? info.offset.x < -swipeThreshold : info.offset.x > swipeThreshold;
              if (isNext) {
                setActiveCard((prev) => (prev + 1) % total);
              } else if (isPrev) {
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
              <span className="micro-label mb-4 block">
                {isAr
                  ? paper.category_ar ||
                    content.categories[paper.category || paper.category_key] ||
                    paper.category
                  : paper.category_en || paper.category || paper.category_key}
              </span>
              <h3 className="heading-sm mb-4 text-ink">
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
                onDownloadClick(paper);
              }}
              className="flex items-center gap-4 btn-text group/btn mt-auto"
            >
              <span className="relative overflow-hidden inline-block group-hover/btn:text-magenta transition-colors">
                {buttonText}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-magenta transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left" />
              </span>
              <Download
                className={`w-4 h-4 text-magenta transform translate-y-0 group-hover/btn:-translate-y-1 transition-transform`}
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
          <span className="micro-label text-void/40 text-center">
            {content.ui?.swipeHint}
          </span>
        </div>
      )}
    </div>
  );
}

export default function InsightsPage() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const content = t.insightsPage;

  const [dbInsights, setDbInsights] = useState<any[]>([]);
  const [dbNews, setDbNews] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activePaper, setActivePaper] = useState<any>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json())
      .then((data) => {
        // Fallback to translation papers if API fails/empty
        if (Array.isArray(data) && data.length > 0) {
          setDbInsights(data);
        } else {
          setDbInsights(content.papers);
        }
      })
      .catch((e) => {
        setDbInsights(content.papers); // Fallback to translating if DB not populated yet
      });

    fetch("/api/insights_news")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDbNews(data);
        }
      })
      .catch((e) => console.error("Error fetching news:", e));
  }, [content.papers]);

  const categoriesMap = dbInsights.reduce(
    (acc, item) => {
      const catEn =
        item.category_en ||
        item.category ||
        item.category_key ||
        "Uncategorized";
      const catAr =
        item.category_ar ||
        content.categories[item.category || item.category_key] ||
        content.ui?.uncategorized;
      if (!acc[catEn]) acc[catEn] = catAr;
      return acc;
    },
    {} as Record<string, string>,
  );

  const filteredPapers = selectedCategory
    ? dbInsights.filter(
        (p: any) =>
          (p.category_en || p.category || p.category_key) === selectedCategory,
      )
    : dbInsights;

  const handleDownloadClick = (paper: any) => {
    const isRegistered = localStorage.getItem("norm_insights_registered");
    const paperPdf = isAr
      ? paper.pdf_path_ar || paper.pdf_path
      : paper.pdf_path_en || paper.pdf_path;

    if (isRegistered && paperPdf) {
      try {
        const userData = JSON.parse(isRegistered);
        fetch("/api/insight_readers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...userData, insight_id: paper.id }),
        });
      } catch (e) {}

      window.open(paperPdf, "_blank");
    } else {
      setActivePaper(paper);
      setModalOpen(true);
    }
  };

  return (
    <div className="bg-parchment min-h-screen" dir={isAr ? "rtl" : "ltr"}>
      <SEO
        title={content.ui?.seoTitle}
        description={content.hero.title}
      />
      {/* Hero */}
      <section className="pt-32 md:pt-40 lg:pt-48 pb-24 border-b border-void/5 relative overflow-hidden">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="container-wide relative z-10"
        >
          <motion.span
            variants={slideUp}
            className="micro-label mb-8 block"
          >
            {content.hero.eyebrow}
          </motion.span>
          <motion.h1
            variants={slideUp}
            className="heading-xl mb-10 max-w-4xl"
          >
            {content.hero.title}
          </motion.h1>
        </motion.div>
      </section>

      {/* Dynamic News Ticker */}
      {dbNews.length > 0 && (
        <div className="bg-void text-parchment overflow-hidden py-3 flex items-center border-y border-magenta/20">
          <div
            className="flex w-max min-w-[200vw] justify-around whitespace-nowrap animate-marquee-left"
            dir="ltr"
          >
            {/* Duplicate news to create a continuous marquee effect */}
            {[...dbNews, ...dbNews].map((newsItem, idx) => (
              <span
                key={idx}
                className="flex items-center mx-8 gap-4 micro-label !text-white"
              >
                <span className="w-2 h-2 rounded-full bg-magenta glow-magenta" />
                {isAr ? newsItem.content_ar : newsItem.content_en}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filter Section */}
      <section className="sticky top-[64px] md:top-[72px] z-40 bg-parchment/90 backdrop-blur-xl border-b border-void/5 py-4">
        <div className="container-wide flex items-center justify-end md:justify-between">
          <div className="micro-label text-ink/40 hidden md:block">
            {content.ui?.exploreInsights}
          </div>

          <div className="relative z-50">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center gap-3 px-6 py-3 rounded-full micro-label transition-all duration-300 border backdrop-blur-md ${filterOpen ? "bg-void text-parchment border-void" : "bg-white/50 text-void border-void/10 hover:border-magenta"}`}
            >
              <Filter className="w-4 h-4" />
              <span>
                {!selectedCategory
                  ? content.ui?.filterInsights
                  : isAr
                    ? categoriesMap[selectedCategory]
                    : selectedCategory}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-500 ${filterOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {filterOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setFilterOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute z-50 top-full mt-4 w-64 bg-white/90 backdrop-blur-2xl border border-void/5 rounded-[2rem] shadow-2xl p-2 ${isAr ? "left-0 origin-top-left" : "right-0 origin-top-right"}`}
                  >
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => {
                          setSelectedCategory(null);
                          setFilterOpen(false);
                        }}
                        className={`flex items-center justify-between px-6 py-4 rounded-3xl btn-text transition-all duration-300 ${!selectedCategory ? "bg-magenta/5 text-magenta" : "text-void/60 hover:text-void hover:bg-void/5"}`}
                      >
                        <span>
                          {content.ui?.allInsights}
                        </span>
                        {!selectedCategory && <Check className="w-4 h-4" />}
                      </button>

                      {Object.entries(categoriesMap).map(
                        ([key, label]: [string, any]) => (
                          <button
                            key={key}
                            onClick={() => {
                              setSelectedCategory(key);
                              setFilterOpen(false);
                            }}
                            className={`flex items-center justify-between px-6 py-4 rounded-3xl btn-text transition-all duration-300 ${selectedCategory === key ? "bg-magenta/5 text-magenta" : "text-void/60 hover:text-void hover:bg-void/5"}`}
                          >
                            <span>{isAr ? label : key}</span>
                            {selectedCategory === key && (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                        ),
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Editorial Grid */}
      <section className="py-24">
        <div className="container-wide">
          <StackedInsightsCarousel
            items={filteredPapers}
            isAr={isAr}
            content={content}
            onDownloadClick={handleDownloadClick}
            buttonText={t.insightsPage.downloadBtn}
          />

          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredPapers.map((paper: any) => (
                <motion.div
                  layout
                  key={paper.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative bg-white rounded-5xl border border-void/5 p-10 flex flex-col justify-between hover:border-magenta/20 transition-all duration-500 shadow-2xl shadow-void/[0.01] hover:shadow-magenta/[0.03]"
                >
                  <div>
                    <PaperVisual
                      category={
                        paper.category_en ||
                        paper.category ||
                        paper.category_key
                      }
                      insightId={paper.id}
                      title={paper.title_en || paper.title}
                    />
                    <span className="micro-label mb-6 block">
                      {isAr
                        ? paper.category_ar ||
                          content.categories[
                            paper.category || paper.category_key
                          ] ||
                          paper.category
                        : paper.category_en ||
                          paper.category ||
                          paper.category_key}
                    </span>
                    <h3 className="heading-sm mb-6 group-hover:text-magenta transition-colors">
                      {isAr
                        ? paper.title_ar || paper.title
                        : paper.title_en || paper.title}
                    </h3>
                    <p className="body-md mb-8">
                      {isAr
                        ? paper.summary_ar || paper.summary
                        : paper.summary_en || paper.summary}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownloadClick(paper)}
                    className="flex items-center gap-4 btn-text group/btn text-ink"
                  >
                    <span className="relative overflow-hidden inline-block group-hover/btn:text-magenta transition-colors">
                      {t.insightsPage.downloadBtn}
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-magenta transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left" />
                    </span>
                    <Download className="w-4 h-4 text-magenta transform translate-y-0 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                </motion.div>
              ))}

              {filteredPapers.length === 0 && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 text-void/50">
                  {content.ui?.noReports}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <DownloadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        insightId={activePaper?.id}
        paperTitle={
          isAr
            ? activePaper?.title_ar || activePaper?.title
            : activePaper?.title_en || activePaper?.title
        }
        pdfPath={
          isAr
            ? activePaper?.pdf_path_ar || activePaper?.pdf_path
            : activePaper?.pdf_path_en || activePaper?.pdf_path
        }
        t={content}
        isAr={isAr}
      />
    </div>
  );
}
