import React, { useEffect, useState } from "react";
import { Globe, Save, CheckCircle, X, Search } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const PAGE_PRIORITY = [
  'global', 'gatewayPage', 'homePage', 'aboutPage', 'methodologyPage',
  'servicesPage', 'insightsPage', 'hospitalityConsultantPage', 'investmentPage',
  'strategicRelationsPage', 'workWithNormPage', 'contactPage', 'qaPage',
  'portalPage', 'privacyPolicy', 'termsConditions', 'disclaimer'
];

const ROUTE_TO_PAGE_KEY: Record<string, string> = {
  "/": "gatewayPage",
  "/norm": "homePage",
  "/norm/about": "aboutPage",
  "/norm/services": "servicesPage",
  "/norm/hospitality-consultant": "hospitalityConsultantPage",
  "/norm/methodology": "methodologyPage",
  "/norm/qa": "qaPage",
  "/norm/insights": "insightsPage",
  "/norm/investment": "investmentPage",
  "/norm/strategic-relations": "strategicRelationsPage",
  "/norm/contact": "contactPage",
  "/norm/work-with-norm": "workWithNormPage",
  "/norm/portal": "portalPage",
  "/norm/privacy": "privacyPolicy",
  "/norm/terms": "termsConditions",
  "/norm/disclaimer": "disclaimer"
};

function getTitleAnalysis(title: string) {
  const len = title ? title.length : 0;
  if (len === 0)
    return { len, color: "text-rose-500", status: "missing", msg: "Missing" };
  if (len < 30)
    return { len, color: "text-orange-500", status: "short", msg: "Too short" };
  if (len >= 30 && len < 45)
    return {
      len,
      color: "text-amber-500",
      status: "acceptable",
      msg: "Acceptable",
    };
  if (len >= 45 && len <= 60)
    return {
      len,
      color: "text-emerald-500",
      status: "optimal",
      msg: "Perfect",
    };
  return { len, color: "text-rose-500", status: "long", msg: "Too long" };
}

function getDescAnalysis(desc: string) {
  const len = desc ? desc.length : 0;
  if (len === 0)
    return { len, color: "text-rose-500", status: "missing", msg: "Missing" };
  if (len < 70)
    return { len, color: "text-orange-500", status: "short", msg: "Too short" };
  if (len >= 70 && len < 120)
    return {
      len,
      color: "text-amber-500",
      status: "acceptable",
      msg: "Acceptable",
    };
  if (len >= 120 && len <= 160)
    return {
      len,
      color: "text-emerald-500",
      status: "optimal",
      msg: "Perfect",
    };
  return { len, color: "text-rose-500", status: "long", msg: "Too long" };
}

function SERPPreview({
  isAr,
  title,
  desc,
  path,
}: {
  isAr: boolean;
  title: string;
  desc: string;
  path: string;
}) {
  const displayTitle =
    title ||
    (isAr ? "يرجى كتابة عنوان تعريفي..." : "Please enter a meta title...");
  const displayDesc =
    desc ||
    (isAr
      ? "اكتب هنا ملخصاً تشويقياً لصفحتك لكي يظهر في نتائج بحث المحركات ويتمكن الزوار من قراءة مقتطفات من المقال أو الخدمة المحددة..."
      : "Please enter a descriptive meta description. Providing an engaging, concise description will encourage higher natural search click-through rates.");
  const textDirection = isAr ? "rtl" : "ltr";
  const alignmentClass = isAr ? "text-right" : "text-left";
  const breadcrumbTrail = `https://norm.sa ➜ ${path}`;

  return (
    <div
      className={`p-5 bg-[#202124] border border-[#3c4043] rounded-xl shadow-lg transition-all ${alignmentClass} flex flex-col`}
      dir={textDirection}
    >
      <span className="text-[10px] text-[#9aa0a6] uppercase tracking-widest mb-3 font-bold border-b border-[#3c4043] pb-2">
        {isAr ? "معاينة نتائج جوجل (مظلم)" : "Google SERP Preview (Dark)"}
      </span>
      <div className="flex items-center gap-3 mb-3 text-xs text-[#bdc1c6]">
        <div className="w-7 h-7 rounded-full bg-[#303134] flex items-center justify-center border border-[#3c4043] shrink-0 select-none">
          <Globe className="w-4 h-4 text-[#e8eaed]" />
        </div>
        <div className="flex flex-col gap-0.5 leading-none">
          <span className="font-semibold text-sm text-[#e8eaed]">NORM</span>
          <span
            className="text-[11px] text-[#bdc1c6] font-mono whitespace-nowrap overflow-hidden text-ellipsis max-w-[280px]"
            dir="ltr"
          >
            {breadcrumbTrail}
          </span>
        </div>
      </div>
      <h4
        className="text-[20px] font-normal text-[#8ab4f8] hover:underline cursor-pointer leading-tight mb-2 truncate"
        style={{ fontFamily: "arial, sans-serif" }}
      >
        {displayTitle}
      </h4>
      <p
        className="text-[14px] text-[#bdc1c6] leading-relaxed font-sans break-words line-clamp-2"
        style={{ fontFamily: "arial, sans-serif" }}
      >
        {displayDesc}
      </p>
    </div>
  );
}

export default function CMSSeoManagement() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [seoList, setSeoList] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    fetchSeoList();
  }, []);

  const DEFAULT_ROUTES = [
    { path: "/", title_en: "Gateway Portal", title_ar: "بوابة الدخول الرئيسية" },
    { path: "/norm", title_en: "Home Page", title_ar: "الصفحة الرئيسية (هندسة القرار)" },
    { path: "/norm/about", title_en: "About Us", title_ar: "من نحن" },
    { path: "/norm/services", title_en: "Domains Decision", title_ar: "مجالات القرار" },
    { path: "/norm/hospitality-consultant", title_en: "Tourism & Hospitality", title_ar: "الاستشارات السياحية والفندقية" },
    { path: "/norm/methodology", title_en: "Methodology", title_ar: "المنهجية" },
    { path: "/norm/qa", title_en: "Methodological Q&A", title_ar: "أسئلة وأجوبة منهجية" },
    { path: "/norm/insights", title_en: "Insights", title_ar: "رؤى نورم" },
    { path: "/norm/investment", title_en: "Investment", title_ar: "الاستثمار" },
    { path: "/norm/strategic-relations", title_en: "Strategic Relations", title_ar: "العلاقات الاستراتيجية" },
    { path: "/norm/contact", title_en: "Contact Us", title_ar: "تواصل معنا" },
    { path: "/norm/work-with-norm", title_en: "Work With NORM", title_ar: "العمل مع نورم" },
    { path: "/norm/portal", title_en: "Client Portal", title_ar: "بوابة العملاء" },
    { path: "/norm/privacy", title_en: "Privacy Policy", title_ar: "سياسة الخصوصية" },
    { path: "/norm/terms", title_en: "Terms Conditions", title_ar: "الشروط والأحكام" },
    { path: "/norm/disclaimer", title_en: "Disclaimer", title_ar: "إخلاء المسؤولية" },
  ];

  const fetchSeoList = async () => {
    try {
      const res = await fetch("/api/seo");
      const data = await res.json();
      if (Array.isArray(data)) {
        const merged = DEFAULT_ROUTES.map((route) => {
          const existing = data.find((item: any) => item.path === route.path);
          if (existing) return existing;
          return {
            ...route,
            title_ar: "",
            description_en: "",
            description_ar: "",
            keywords_en: "",
            keywords_ar: "",
            og_title_en: "",
            og_title_ar: "",
            og_desc_en: "",
            og_desc_ar: "",
          };
        });

        data.forEach((item: any) => {
          if (!merged.find((m) => m.path === item.path)) {
            merged.push(item);
          }
        });

        merged.sort((a: any, b: any) => {
          const keyA = ROUTE_TO_PAGE_KEY[a.path] || a.path;
          const keyB = ROUTE_TO_PAGE_KEY[b.path] || b.path;
          const indexA = PAGE_PRIORITY.indexOf(keyA);
          const indexB = PAGE_PRIORITY.indexOf(keyB);
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          return String(a.path).localeCompare(String(b.path));
        });

        setSeoList(merged);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleEdit = (item: any) => {
    setEditingItem({
      ...item,
      title_en: item.title_en || "",
      title_ar: item.title_ar || "",
      description_en: item.description_en || "",
      description_ar: item.description_ar || "",
      keywords_en: item.keywords_en || "",
      keywords_ar: item.keywords_ar || "",
      og_title_en: item.og_title_en || "",
      og_title_ar: item.og_title_ar || "",
      og_desc_en: item.og_desc_en || "",
      og_desc_ar: item.og_desc_ar || "",
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const token = localStorage.getItem("cms_token");
    try {
      const isNew = !editingItem.id;
      const url = isNew ? "/api/seo" : `/api/seo/${editingItem.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingItem),
      });
      if (res.ok) {
        triggerNotification(
          isAr
            ? "تم حفظ التعديلات بنجاح."
            : "SEO tags successfully synced with Helmet.",
        );
        setEditingItem(null);
        fetchSeoList();
      } else {
        triggerNotification(
          isAr
            ? "فشل الحفظ. تحقق من الصلاحيات."
            : "Failed to save. Check authorizations.",
        );
      }
    } catch (err) {
      console.error(err);
      triggerNotification(
        isAr ? "خطأ في الاتصال بالخادم." : "Internal server error during sync.",
      );
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-magenta/10 rounded-2xl flex items-center justify-center">
            <Globe className="w-6 h-6 text-magenta" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif text-void font-bold">
              {isAr
                ? "إدارة تحسين محركات البحث SEO"
                : "SEO & Metadata Management"}
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-sans">
              {isAr
                ? "تحكم في مسارات الموقع وتهيئتها لمحركات البحث"
                : "Manage site paths and configure them for search engines"}
            </p>
          </div>
        </div>
      </div>

      {notification && (
        <div className="mb-6 p-4 bg-green-50 text-green-800 border-l-4 border-semibold border-green-500 rounded-lg flex items-center gap-2 animate-fade-in text-sm font-medium shadow-sm">
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
          {notification}
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <Search className="w-5 h-5 text-magenta" />
          <span className="text-sm font-bold text-void">
            {isAr ? "اختر مسار الصفحة للتعديل:" : "Select Page Path to Edit:"}
          </span>
        </div>

        <select
          value={editingItem?.path || ""}
          onChange={(e) => {
            const path = e.target.value;
            if (!path) setEditingItem(null);
            else {
              const selected = seoList.find((s) => s.path === path);
              if (selected) handleEdit(selected);
            }
          }}
          className="flex-1 bg-white/40 backdrop-blur-md border border-gray-200/50 rounded-xl text-base px-5 py-3.5 text-void outline-none focus:border-magenta focus:bg-white focus:ring-4 focus:ring-magenta/10 transition-all w-full font-semibold shadow-sm hover:border-gray-300 cursor-pointer"
        >
          <option value="">
            {isAr ? "-- اختر صفحة من القائمة --" : "-- Select a page from the list --"}
          </option>
          {seoList.map((item) => {
            const routeDef = DEFAULT_ROUTES.find((r) => r.path === item.path);
            const label = isAr 
              ? (routeDef?.title_ar || item.title_ar || "مسار جديد") 
              : (routeDef?.title_en || item.title_en || "New Path");
            return (
              <option key={item.path} value={item.path} className="font-sans text-sm">
                {label} — ({item.path})
              </option>
            );
          })}
        </select>
      </div>

      <div>
        {editingItem ? (
          <form
            onSubmit={handleSave}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 lg:p-8 space-y-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] relative overflow-hidden"
          >
            {/* Ambient Background Glows */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-magenta/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <span className="text-xs text-gray-500 font-mono font-bold uppercase tracking-widest">
                  {isAr ? "تعديل المسار" : "Editing URI Path"}
                </span>
                <h3 className="text-2xl font-mono font-bold text-magenta mt-1">
                  {editingItem.path}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-2 bg-gray-50 hover:bg-rose-50 rounded-xl text-gray-400 hover:text-rose-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Google SERP Previews (Side by Side) */}
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SERPPreview
                isAr={false}
                title={editingItem.title_en}
                desc={editingItem.description_en}
                path={editingItem.path}
              />
              <SERPPreview
                isAr={true}
                title={editingItem.title_ar}
                desc={editingItem.description_ar}
                path={editingItem.path}
              />
            </div>

            {/* Inputs Grid (Side by Side) */}
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
              {/* ENGLISH COLUMN */}
              <div
                className="space-y-6 bg-white/40 p-6 rounded-2xl border border-white"
                dir="ltr"
              >
                <div className="flex items-center gap-2 mb-4 border-b border-gray-200/50 pb-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <h4 className="font-bold text-void uppercase tracking-widest text-sm">
                    English Metadata
                  </h4>
                </div>

                <div>
                  {(() => {
                    const analysis = getTitleAnalysis(editingItem.title_en);
                    return (
                      <label className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-600 uppercase">
                          Meta Title
                        </span>
                        <div
                          className={`flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-gray-100 shadow-sm ${analysis.color}`}
                        >
                          <span>{analysis.len} / 60</span>
                        </div>
                      </label>
                    );
                  })()}
                  <input
                    type="text"
                    value={editingItem.title_en}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        title_en: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200/80 rounded-xl text-sm bg-white/80 focus:bg-white focus:border-magenta focus:ring-2 focus:ring-magenta/20 outline-none transition-all shadow-sm"
                    placeholder="e.g. Services Offerings | NORM Consulting"
                  />
                </div>

                <div>
                  {(() => {
                    const analysis = getDescAnalysis(
                      editingItem.description_en,
                    );
                    return (
                      <label className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-600 uppercase">
                          Meta Description
                        </span>
                        <div
                          className={`flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-gray-100 shadow-sm ${analysis.color}`}
                        >
                          <span>{analysis.len} / 160</span>
                        </div>
                      </label>
                    );
                  })()}
                  <textarea
                    rows={4}
                    value={editingItem.description_en}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        description_en: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200/80 rounded-xl text-sm bg-white/80 focus:bg-white focus:border-magenta focus:ring-2 focus:ring-magenta/20 outline-none resize-none transition-all shadow-sm leading-relaxed"
                    placeholder="Summarize the core focus of the page for Google Search results..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                    Keywords & Tags
                  </label>
                  <input
                    type="text"
                    value={editingItem.keywords_en}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        keywords_en: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200/80 rounded-xl text-sm bg-white/80 focus:bg-white focus:border-magenta focus:ring-2 focus:ring-magenta/20 outline-none transition-all shadow-sm"
                    placeholder="NORM, business consulting, corporate governance"
                  />
                </div>
              </div>

              {/* ARABIC COLUMN */}
              <div
                className="space-y-6 bg-white/40 p-6 rounded-2xl border border-white"
                dir="rtl"
              >
                <div className="flex items-center gap-2 mb-4 border-b border-gray-200/50 pb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h4 className="font-bold text-void uppercase tracking-widest text-sm">
                    البيانات الوصفية العربية
                  </h4>
                </div>

                <div>
                  {(() => {
                    const analysis = getTitleAnalysis(editingItem.title_ar);
                    return (
                      <label className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-600 uppercase">
                          العنوان التعريفي (Meta Title)
                        </span>
                        <div
                          className={`flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-gray-100 shadow-sm ${analysis.color}`}
                        >
                          <span dir="ltr">{analysis.len} / 60</span>
                        </div>
                      </label>
                    );
                  })()}
                  <input
                    type="text"
                    value={editingItem.title_ar}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        title_ar: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200/80 rounded-xl text-sm bg-white/80 focus:bg-white focus:border-magenta focus:ring-2 focus:ring-magenta/20 outline-none transition-all shadow-sm"
                    placeholder="مثال: خدماتنا الاستشارية | نورم"
                  />
                </div>

                <div>
                  {(() => {
                    const analysis = getDescAnalysis(
                      editingItem.description_ar,
                    );
                    return (
                      <label className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-600 uppercase">
                          الوصف التعريفي (Meta Description)
                        </span>
                        <div
                          className={`flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-gray-100 shadow-sm ${analysis.color}`}
                        >
                          <span dir="ltr">{analysis.len} / 160</span>
                        </div>
                      </label>
                    );
                  })()}
                  <textarea
                    rows={4}
                    value={editingItem.description_ar}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        description_ar: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200/80 rounded-xl text-sm bg-white/80 focus:bg-white focus:border-magenta focus:ring-2 focus:ring-magenta/20 outline-none resize-none transition-all shadow-sm leading-relaxed"
                    placeholder="ملخص لمحتوى الصفحة ليظهر بوضوح في محركات البحث..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                    الكلمات الدلالية
                  </label>
                  <input
                    type="text"
                    value={editingItem.keywords_ar}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        keywords_ar: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200/80 rounded-xl text-sm bg-white/80 focus:bg-white focus:border-magenta focus:ring-2 focus:ring-magenta/20 outline-none transition-all shadow-sm"
                    placeholder="نورم، استشارات، حوكمة الشركات، هندسة الإجراءات"
                  />
                </div>
              </div>
            </div>

            <div className="relative flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-2.5 bg-void text-white font-bold hover:bg-magenta rounded-xl text-sm transition-colors shadow-lg shadow-void/10"
              >
                <Save className="w-4 h-4" />
                {isAr ? "حفظ التغييرات" : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white/40 backdrop-blur-sm p-16 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Globe className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-void mb-2">
              {isAr ? "لم يتم تحديد أي مسار" : "No path selected"}
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
              {isAr
                ? "الرجاء اختيار مسار (رابط) من القائمة العلوية للبدء في تعديل بيانات تحسين محركات البحث الخاصة به بمظهرها الجديد."
                : "Please select a path (URL) from the dropdown above to start editing its SEO metadata with the new luxury interface."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
