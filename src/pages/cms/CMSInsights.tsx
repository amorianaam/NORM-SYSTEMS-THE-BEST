import React, { useEffect, useState } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  Search,
  Filter,
  Download,
  ChevronDown,
  Check,
  Image as ImageIcon,
  X,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmDialogContext";
import CMSDateFilter, { DateRange } from "../../components/cms/CMSDateFilter";

import PaperVisual from "../../components/common/PaperVisual";

function CMSStackedInsightsCarousel({
  items,
  isAr,
  onEdit,
  onDelete,
}: {
  items: any[];
  isAr: boolean;
  onEdit: (insight: any) => void;
  onDelete: (id: number) => void;
}) {
  const [activeCard, setActiveCard] = useState(0);

  if (!items || items.length === 0) return null;

  return (
    <div className="md:hidden relative h-[420px] sm:h-[440px] w-[85%] max-w-[320px] mx-auto mb-24 mt-10">
      {items.map((insight, index) => {
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
            key={insight.id || index}
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
            className={`absolute inset-0 bg-white rounded-[2.5rem] border border-void/5 p-8 flex flex-col justify-between shadow-2xl shadow-void/[0.05] cursor-pointer overflow-hidden touch-pan-y ${isAr ? "text-right" : "text-left"}`}
          >
            <div
              className="absolute top-4 right-4 z-40 flex items-center gap-2"
              dir="ltr"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(insight);
                }}
                className="p-2 bg-white rounded-full text-gray-400 hover:text-magenta shadow-sm border border-gray-100 hover:border-magenta/30 transition-colors duration-200"
                title="Edit"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(insight.id);
                }}
                className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500 shadow-sm border border-gray-100 hover:border-red-200 transition-colors duration-200"
                title="Delete"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            <div>
              <PaperVisual
                category={insight.category_en || insight.category}
                insightId={insight.id}
                title={insight.title_en || insight.title_ar}
              />
              <span className="text-[10px] uppercase tracking-widest font-black text-magenta mb-4 block">
                {isAr
                  ? insight.category_ar || insight.category
                  : insight.category_en || insight.category}
              </span>
              <h3 className="text-xl font-serif mb-4 text-ink">
                {isAr
                  ? insight.title_ar || insight.title
                  : insight.title_en || insight.title}
              </h3>
              <p className="opacity-60 font-light text-sm leading-relaxed mb-6 line-clamp-3">
                {isAr
                  ? insight.summary_ar || insight.summary
                  : insight.summary_en || insight.summary}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest opacity-70 mt-auto">
              <span>{isAr ? "تحميل التقرير" : "Download Whitepaper"}</span>
              <Download className="w-4 h-4 text-magenta" />
            </div>
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
            {isAr
              ? "اسحب البطاقة يميناً أو يساراً للتنقل"
              : "Swipe card left or right to navigate"}
          </span>
        </div>
      )}
    </div>
  );
}

export default function CMSInsights() {
  const { t, language } = useLanguage();
  const { showConfirm } = useConfirm();
  const { showToast } = useToast();
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"insights" | "news">("insights");
  const [insights, setInsights] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
  const [formLang, setFormLang] = useState<"en" | "ar">("ar");

  const [formData, setFormData] = useState({
    title_ar: "",
    title_en: "",
    category_ar: "",
    category_en: "",
    summary_ar: "",
    summary_en: "",
  });

  const [newsFormData, setNewsFormData] = useState({
    content_ar: "",
    content_en: "",
  });

  const [pdfFileEn, setPdfFileEn] = useState<File | null>(null);
  const [pdfFileAr, setPdfFileAr] = useState<File | null>(null);
  const [existingPdfEn, setExistingPdfEn] = useState<string | null>(null);
  const [existingPdfAr, setExistingPdfAr] = useState<string | null>(null);
  const [removePdfEn, setRemovePdfEn] = useState(false);
  const [removePdfAr, setRemovePdfAr] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter state
  const [selectedCategoryEn, setSelectedCategoryEn] = useState<string | null>(
    null,
  );
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  const fetchInsights = async () => {
    try {
      const res = await fetch("/api/insights");
      const data = await res.json();
      setInsights(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/insights_news");
      const data = await res.json();
      setNews(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchInsights();
    fetchNews();
  }, []);

  // Compute unique categories from DB insights
  const categoriesMap = insights.reduce(
    (acc, item) => {
      const catEn = item.category_en || item.category || "Uncategorized";
      const catAr = item.category_ar || item.category || "غير مصنف";
      if (!acc[catEn]) acc[catEn] = catAr;
      return acc;
    },
    {} as Record<string, string>,
  );

  const filteredInsights = insights.filter((p) => {
    const matchesCategory =
      !selectedCategoryEn ||
      (p.category_en || p.category) === selectedCategoryEn;
    let matchesDate = true;
    if (dateRange.startDate && dateRange.endDate) {
      const pubDate = new Date(p.published_at || p.created_at || new Date());
      matchesDate =
        pubDate >= dateRange.startDate && pubDate <= dateRange.endDate;
    }
    return matchesCategory && matchesDate;
  });

  const stats = {
    total: filteredInsights.length,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("cms_token");
    if (!token) return;

    const data = new FormData();
    data.append("title_ar", formData.title_ar);
    data.append("title_en", formData.title_en);
    data.append("category_ar", formData.category_ar);
    data.append("category_en", formData.category_en);
    data.append("summary_ar", formData.summary_ar);
    data.append("summary_en", formData.summary_en);

    if (pdfFileEn) data.append("pdf_en", pdfFileEn);
    if (pdfFileAr) data.append("pdf_ar", pdfFileAr);
    if (removePdfEn) data.append("remove_pdf_en", "true");
    if (removePdfAr) data.append("remove_pdf_ar", "true");

    try {
      const url = editingId ? `/api/insights/${editingId}` : "/api/insights";
      const method = editingId ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      setIsModalOpen(false);
      setEditingId(null);
      fetchInsights();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (insight: any) => {
    setFormData({
      title_ar: insight.title_ar || "",
      title_en: insight.title_en || "",
      category_ar: insight.category_ar || insight.category || "",
      category_en: insight.category_en || insight.category || "",
      summary_ar: insight.summary_ar || "",
      summary_en: insight.summary_en || "",
    });
    setExistingPdfEn(insight.pdf_path_en || insight.pdf_path);
    setExistingPdfAr(insight.pdf_path_ar || insight.pdf_path);
    setRemovePdfEn(false);
    setRemovePdfAr(false);
    setEditingId(insight.id);
    setPdfFileEn(null);
    setPdfFileAr(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    showConfirm(
      {
        message: isAr
          ? "هل أنت متأكد من الحذف النهائي؟ سيتم مسح الملف من الخادم"
          : "Are you sure you want to permanently delete this? Files will be removed from the server.",
      },
      async () => {
        const token = localStorage.getItem("cms_token");
        if (!token) return;

        try {
          await fetch(`/api/insights/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          showToast(
            isAr ? "تم الحذف بنجاح" : "Deleted successfully",
            "success",
          );
          fetchInsights();
        } catch (e) {
          console.error(e);
          showToast(isAr ? "حدث خطأ" : "An error occurred", "error");
        }
      },
    );
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("cms_token");
    if (!token) return;

    try {
      const url = editingNewsId
        ? `/api/insights_news/${editingNewsId}`
        : "/api/insights_news";
      const method = editingNewsId ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newsFormData),
      });
      setIsNewsModalOpen(false);
      setEditingNewsId(null);
      fetchNews();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewsEdit = (newsItem: any) => {
    setNewsFormData({
      content_ar: newsItem.content_ar || "",
      content_en: newsItem.content_en || "",
    });
    setEditingNewsId(newsItem.id);
    setIsNewsModalOpen(true);
  };

  const handleNewsDelete = (id: number) => {
    showConfirm(
      {
        message: isAr
          ? "هل أنت متأكد من الحذف النهائي؟"
          : "Are you sure you want to permanently delete this?",
      },
      async () => {
        const token = localStorage.getItem("cms_token");
        if (!token) return;

        try {
          await fetch(`/api/insights_news/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          showToast(
            isAr ? "تم الحذف بنجاح" : "Deleted successfully",
            "success",
          );
          fetchNews();
        } catch (e) {
          console.error(e);
          showToast(isAr ? "حدث خطأ" : "An error occurred", "error");
        }
      },
    );
  };

  return (
    <div dir={isAr ? "rtl" : "ltr"}>
      {/* TABS */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`px-6 py-3 font-bold text-sm transition-colors duration-200 ${activeTab === "insights" ? "border-b-2 border-magenta text-magenta" : "text-gray-400 hover:text-void"}`}
          onClick={() => setActiveTab("insights")}
        >
          {isAr ? "إدارة الرؤى والأخبار" : "Insights & News Management"}
        </button>
        <button
          className={`px-6 py-3 font-bold text-sm transition-colors duration-200 ${activeTab === "news" ? "border-b-2 border-magenta text-magenta" : "text-gray-400 hover:text-void"}`}
          onClick={() => setActiveTab("news")}
        >
          {isAr ? "إدارة الأخبار" : "News Management"}
        </button>
      </div>

      {activeTab === "insights" ? (
        <>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-magenta/10 rounded-xl">
                <FileText className="w-6 h-6 text-magenta" />
              </div>
              <h1 className="text-2xl md:text-3xl font-serif text-void font-bold">
                {isAr ? "إدارة الرؤى والأخبار" : "Insights & News"}
              </h1>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <CMSDateFilter onFilterChange={setDateRange} />
              <button
                onClick={() => {
                  setFormData({
                    title_ar: "",
                    title_en: "",
                    category_ar: "",
                    category_en: "",
                    summary_ar: "",
                    summary_en: "",
                  });
                  setPdfFileEn(null);
                  setPdfFileAr(null);
                  setEditingId(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-void text-white rounded-xl text-sm font-bold hover:bg-magenta transition-colors duration-200 h-10 w-full sm:w-auto shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isAr ? "إضافة رؤية" : "Add Insight"}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {isAr ? "إجمالي الرؤى" : "Total Insights"}
                </div>
                <div className="text-xl font-black text-void">
                  {stats.total}
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel (Filter) */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-end">
            <div className="flex gap-2 items-center w-full md:w-auto shrink-0">
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                {isAr ? "التصنيف:" : "Category:"}
              </span>
              <select
                value={selectedCategoryEn || "all"}
                onChange={(e) =>
                  setSelectedCategoryEn(
                    e.target.value === "all" ? null : e.target.value,
                  )
                }
                className="bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-1.5 text-void outline-none focus:border-magenta w-full md:w-64"
              >
                <option value="all">
                  {isAr ? "جميع التصنيفات" : "All Categories"}
                </option>
                {Object.entries(categoriesMap).map(([en, ar]) => (
                  <option key={en} value={en}>
                    {isAr ? ar : en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <CMSStackedInsightsCarousel
            items={filteredInsights}
            isAr={isAr}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredInsights.map((insight) => (
                <motion.div
                  layout
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative bg-white rounded-[2.5rem] border border-void/5 p-10 flex flex-col justify-between hover:border-magenta/20 transition-all duration-500 shadow-2xl shadow-void/[0.01] hover:shadow-magenta/[0.03]"
                >
                  <div
                    className="absolute top-4 right-4 z-20 flex items-center gap-2"
                    dir="ltr"
                  >
                    <button
                      onClick={() => handleEdit(insight)}
                      className="p-2 bg-white rounded-full text-gray-400 hover:text-magenta shadow-sm border border-gray-100 hover:border-magenta/30 transition-colors duration-200"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(insight.id)}
                      className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500 shadow-sm border border-gray-100 hover:border-red-200 transition-colors duration-200"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <PaperVisual
                      category={insight.category_en || insight.category}
                      insightId={insight.id}
                      title={insight.title_en || insight.title_ar}
                    />
                    <span className="text-[10px] uppercase tracking-widest font-black text-magenta mb-4 block">
                      {isAr
                        ? insight.category_ar || insight.category
                        : insight.category_en || insight.category}
                    </span>
                    <h3 className="text-2xl font-serif mb-4 text-ink">
                      {isAr
                        ? insight.title_ar || insight.title
                        : insight.title_en || insight.title}
                    </h3>
                    <p className="opacity-60 font-light leading-relaxed mb-8 line-clamp-4">
                      {isAr
                        ? insight.summary_ar || insight.summary
                        : insight.summary_en || insight.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest group/btn opacity-70">
                    <span className="relative overflow-hidden inline-block group-hover/btn:text-magenta transition-colors duration-200">
                      {isAr ? "تحميل التقرير" : "Download Whitepaper"}
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-magenta transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left" />
                    </span>
                    <Download className="w-4 h-4 text-magenta transform translate-y-0 group-hover/btn:-translate-y-1 transition-transform" />
                  </div>
                </motion.div>
              ))}

              {filteredInsights.length === 0 && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                  <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center border border-gray-100 shadow-sm mt-8">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-void mb-2">
                      {isAr ? "لا توجد بيانات" : "No Data Found"}
                    </h3>
                    <p className="text-sm text-gray-500 max-w-sm">
                      {isAr
                        ? "لم يتم العثور على رؤى تطابق بحثك. قم بإضافة رؤية جديدة أو جرب تصفية مختلفة."
                        : "No insights found matching your criteria. Add a new one or try a different filter."}
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-magenta/10 rounded-xl">
                <FileText className="w-6 h-6 text-magenta" />
              </div>
              <h1 className="text-2xl md:text-3xl font-serif text-void font-bold">
                {isAr ? "شريط الأخبار" : "News Ticker"}
              </h1>
            </div>
            <button
              onClick={() => {
                setNewsFormData({ content_ar: "", content_en: "" });
                setEditingNewsId(null);
                setIsNewsModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-void text-white rounded-xl text-sm font-bold hover:bg-magenta transition-colors duration-200 h-10 w-full sm:w-auto shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isAr ? "إضافة خبر" : "Add News"}
              </span>
            </button>
          </div>

          {news.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center border border-gray-100 shadow-sm mt-8">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-void mb-2">
                {isAr ? "لا توجد بيانات" : "No Data Found"}
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                {isAr
                  ? "لم يتم العثور على أخبار. قم بإضافة خبر جديد."
                  : "No news found. Add a new news item."}
              </p>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">
                      {isAr ? "المحتوى (عربي)" : "Content (Arabic)"}
                    </th>
                    <th className="px-6 py-4">
                      {isAr ? "المحتوى (إنجليزي)" : "Content (English)"}
                    </th>
                    <th className="px-6 py-4 text-center">
                      {isAr ? "إجراءات" : "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {news.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-void font-bold">
                        {item.content_ar}
                      </td>
                      <td className="px-6 py-4 text-void font-bold" dir="ltr">
                        {item.content_en}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleNewsEdit(item)}
                            className="p-2 text-gray-400 hover:text-magenta transition-colors duration-200"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleNewsDelete(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Insight Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-void/40 backdrop-blur-sm flex items-center justify-center p-4 z-[999]"
          dir="ltr"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }} 
            transition={{ duration: 0.3 }} 
            className="bg-white border border-gray-100 rounded-3xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-serif font-bold text-void">
                {editingId ? (isAr ? "تعديل الرؤية" : "Edit Insight") : (isAr ? "إضافة رؤية جديدة" : "Add New Insight")}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ENGLISH COLUMN */}
                <div className="space-y-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100" dir="ltr">
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-200/50 pb-3">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <h4 className="font-bold text-void uppercase tracking-widest text-sm">
                      English Details
                    </h4>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Title (EN)</label>
                    <input
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-void focus:border-magenta focus:ring-2 focus:ring-magenta/10 outline-none transition-all shadow-sm"
                      value={formData.title_en}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Summary (EN)</label>
                    <textarea
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-void focus:border-magenta focus:ring-2 focus:ring-magenta/10 outline-none transition-all h-20 resize-none shadow-sm"
                      value={formData.summary_en}
                      onChange={(e) => setFormData({ ...formData, summary_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category (EN)</label>
                    <input
                      required
                      placeholder="e.g. Logic, Governance, Investment..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-void focus:border-magenta focus:ring-2 focus:ring-magenta/10 outline-none transition-all shadow-sm"
                      value={formData.category_en}
                      onChange={(e) => setFormData({ ...formData, category_en: e.target.value })}
                    />
                  </div>

                  {/* English PDF Zone */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">PDF Document (EN)</label>
                    {existingPdfEn && !removePdfEn && !pdfFileEn && (
                      <div className="mb-2 p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between shadow-sm">
                        <span className="text-xs font-bold text-void truncate pr-4">Current EN PDF Available</span>
                        <div className="flex items-center gap-2">
                          <a href={existingPdfEn} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-void transition-colors duration-200">
                            <Eye className="w-4 h-4" />
                          </a>
                          <button type="button" onClick={() => setRemovePdfEn(true)} className="text-red-400 hover:text-red-500 transition-colors duration-200">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                    {(!existingPdfEn || removePdfEn || pdfFileEn) && (
                      <div className="relative group cursor-pointer w-full bg-white hover:bg-gray-50 border-2 border-dashed border-gray-200 hover:border-magenta rounded-xl p-6 text-center transition-all duration-300">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => {
                            setPdfFileEn(e.target.files ? e.target.files[0] : null);
                            if (e.target.files && e.target.files.length > 0) setRemovePdfEn(false);
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="p-3 rounded-full bg-gray-50 group-hover:bg-magenta/10 transition-colors duration-300">
                            <FileText className="w-6 h-6 text-gray-400 group-hover:text-magenta transition-colors duration-200" />
                          </div>
                          <span className="text-sm font-bold text-gray-500 group-hover:text-void transition-colors duration-300">
                            {pdfFileEn ? pdfFileEn.name : isAr ? "اختر ملف PDF (EN)" : "Drop English PDF here or click"}
                          </span>
                        </div>
                      </div>
                    )}
                    {removePdfEn && existingPdfEn && !pdfFileEn && (
                      <div className="mt-2 text-xs text-red-500 flex items-center justify-between">
                        <span>EN PDF will be removed</span>
                        <button type="button" onClick={() => setRemovePdfEn(false)} className="text-gray-500 hover:text-void underline">Undo</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ARABIC COLUMN */}
                <div className="space-y-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100" dir="rtl">
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-200/50 pb-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h4 className="font-bold text-void tracking-widest text-sm">
                      التفاصيل باللغة العربية
                    </h4>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">العنوان (AR)</label>
                    <input
                      required
                      dir="rtl"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-void focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all shadow-sm"
                      value={formData.title_ar}
                      onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">الملخص (AR)</label>
                    <textarea
                      required
                      dir="rtl"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-void focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all h-20 resize-none shadow-sm"
                      value={formData.summary_ar}
                      onChange={(e) => setFormData({ ...formData, summary_ar: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">التصنيف (AR)</label>
                    <input
                      required
                      dir="rtl"
                      placeholder="مثال: المنهجية، الحوكمة، الاستثمار..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-void focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all shadow-sm"
                      value={formData.category_ar}
                      onChange={(e) => setFormData({ ...formData, category_ar: e.target.value })}
                    />
                  </div>

                  {/* Arabic PDF Zone */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">ملف PDF (AR)</label>
                    {existingPdfAr && !removePdfAr && !pdfFileAr && (
                      <div className="mb-2 p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between shadow-sm">
                        <span className="text-xs font-bold text-void truncate pl-4">ملف PDF العربي متاح</span>
                        <div className="flex items-center gap-2">
                          <a href={existingPdfAr} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-void transition-colors duration-200">
                            <Eye className="w-4 h-4" />
                          </a>
                          <button type="button" onClick={() => setRemovePdfAr(true)} className="text-red-400 hover:text-red-500 transition-colors duration-200">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                    {(!existingPdfAr || removePdfAr || pdfFileAr) && (
                      <div className="relative group cursor-pointer w-full bg-white hover:bg-gray-50 border-2 border-dashed border-gray-200 hover:border-emerald-500 rounded-xl p-6 text-center transition-all duration-300">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => {
                            setPdfFileAr(e.target.files ? e.target.files[0] : null);
                            if (e.target.files && e.target.files.length > 0) setRemovePdfAr(false);
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="p-3 rounded-full bg-gray-50 group-hover:bg-emerald-500/10 transition-colors duration-300">
                            <FileText className="w-6 h-6 text-gray-400 group-hover:text-emerald-500 transition-colors duration-200" />
                          </div>
                          <span className="text-sm font-bold text-gray-500 group-hover:text-void transition-colors duration-300">
                            {pdfFileAr ? pdfFileAr.name : isAr ? "قم بإسقاط ملف PDF هنا أو انقر للاختيار" : "Drop Arabic PDF here"}
                          </span>
                        </div>
                      </div>
                    )}
                    {removePdfAr && existingPdfAr && !pdfFileAr && (
                      <div className="mt-2 text-xs text-red-500 flex items-center justify-between">
                        <span>سيتم حذف ملف PDF العربي</span>
                        <button type="button" onClick={() => setRemovePdfAr(false)} className="text-gray-500 hover:text-void underline">تراجع</button>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors duration-200"
                >
                  {isAr ? "إلغاء الأمر" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-void text-white rounded-xl text-sm font-bold hover:bg-magenta transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg"
                >
                  {isSubmitting
                    ? isAr ? "جاري الحفظ..." : "Saving..."
                    : isAr ? "حفظ الرؤية" : "Save Insight"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* News Modal */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-void/40 backdrop-blur-sm"
            onClick={() => setIsNewsModalOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }} 
            transition={{ duration: 0.3 }} 
            className="bg-white border border-gray-100 rounded-3xl shadow-2xl p-8 max-w-4xl w-full relative z-10 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-serif font-bold text-void">
                {editingNewsId
                  ? isAr
                    ? "تعديل الخبر"
                    : "Edit News"
                  : isAr
                    ? "إضافة خبر"
                    : "Add News"}
              </h2>
              <button
                type="button"
                onClick={() => setIsNewsModalOpen(false)}
                className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleNewsSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ENGLISH COLUMN */}
                <div className="space-y-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 shadow-sm" dir="ltr">
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-200/50 pb-3">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <h4 className="font-bold text-void uppercase tracking-widest text-sm">
                      English News
                    </h4>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Content (EN)</label>
                    <textarea
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-void focus:border-magenta focus:ring-2 focus:ring-magenta/10 outline-none transition-all h-32 resize-none shadow-sm"
                      value={newsFormData.content_en}
                      onChange={(e) => setNewsFormData({ ...newsFormData, content_en: e.target.value })}
                    />
                  </div>
                </div>

                {/* ARABIC COLUMN */}
                <div className="space-y-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 shadow-sm" dir="rtl">
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-200/50 pb-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h4 className="font-bold text-void tracking-widest text-sm">
                      الخبر باللغة العربية
                    </h4>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">المحتوى (AR)</label>
                    <textarea
                      required
                      dir="rtl"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white text-void focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all h-32 resize-none shadow-sm"
                      value={newsFormData.content_ar}
                      onChange={(e) => setNewsFormData({ ...newsFormData, content_ar: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-8 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors duration-200"
                >
                  {isAr ? "إلغاء الأمر" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-void text-white rounded-xl text-sm font-bold hover:bg-magenta transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg"
                >
                  {isSubmitting
                    ? isAr ? "جاري الحفظ..." : "Saving..."
                    : isAr ? "حفظ الخبر" : "Save News"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}


