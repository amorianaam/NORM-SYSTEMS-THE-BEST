import React, { useEffect, useState, useMemo } from "react";
import {
  Type,
  Plus,
  ChevronRight,
  Layers,
  FileText,
  Save,
  Loader2,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";

const getPageName = (pageKey: string, isAr: boolean) => {
  const map: Record<string, { en: string; ar: string }> = {
    gatewayPage: { en: "Gateway Portal", ar: "بوابة الدخول الرئيسية (Gateway)" },
    homePage: { en: "Home Page", ar: "الصفحة الرئيسية" },
    global: {
      en: "Global Text (Nav/Footer)",
      ar: "نصوص عامة (الرأس والتذييل)",
    },
    aboutPage: { en: "About Us", ar: "من نحن" },
    servicesPage: { en: "Domains Decision", ar: "مجالات القرار" },
    methodologyPage: { en: "Methodology", ar: "المنهجية" },
    qaPage: { en: "Q&A", ar: "صفحة الأسئلة الشائعة" },
    insightsPage: { en: "Insights", ar: "صفحة الرؤى" },
    investmentPage: { en: "Investment", ar: "صفحة الاستثمار" },
    strategicRelationsPage: {
      en: "Strategic Relations",
      ar: "علاقات استراتيجية",
    },
    contactPage: { en: "Contact Us", ar: "صفحة التواصل" },
    workWithNormPage: { en: "Work With NORM", ar: "العمل مع نورم" },
    portalPage: { en: "Client Portal", ar: "بوابة العملاء" },
    privacyPolicy: { en: "Privacy Policy", ar: "سياسة الخصوصية" },
    termsConditions: { en: "Terms & Conditions", ar: "الشروط والأحكام" },
    disclaimer: { en: "Disclaimer", ar: "إخلاء المسؤولية" },
    hospitalityConsultantPage: {
      en: "Tourism & Hospitality",
      ar: "صفحة السياحة والضيافة",
    },
  };

  if (map[pageKey]) return isAr ? map[pageKey].ar : map[pageKey].en;
  return pageKey
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const getSectionName = (slug: string, isAr: boolean) => {
  const map: Record<string, { en: string; ar: string }> = {
    hero: { en: "Hero Section", ar: "القسم الافتتاحي" },
    general: { en: "General Texts", ar: "محتوى عام" },
    ui: { en: "UI Elements", ar: "عناصر الواجهة" },
    modal: { en: "Modals", ar: "النوافذ المنبثقة" },
    decisionGap: { en: "Decision Gap", ar: "فجوة القرار" },
    coreIdea: { en: "Core Idea", ar: "الفكرة الجوهرية" },
    previewMethodology: { en: "Methodology Preview", ar: "لمحة المنهجية" },
    previewAbout: { en: "About Preview", ar: "لمحة عن نورم" },
    previewInsights: { en: "Insights Preview", ar: "لمحة الرؤى" },
    contact: { en: "Contact Section", ar: "قسم التواصل" },
    nav: { en: "Navigation Menu", ar: "شريط التصفح" },
    footer: { en: "Footer", ar: "تذييل الصفحة" },
    positioning: { en: "Positioning", ar: "التموضع" },
    differentiation: { en: "Differentiation", ar: "الميزة التنافسية" },
    impact: { en: "Impact", ar: "الأثر" },
    aiStrategy: { en: "AI Strategy", ar: "استراتيجية الذكاء الاصطناعي" },
    finalStatement: { en: "Final Statement", ar: "البيان الختامي" },
    phases: { en: "Phases", ar: "المراحل" },
    outcome: { en: "Outcome", ar: "النتيجة" },
    sections: { en: "Sections", ar: "الأقسام" },
    partners: { en: "Partners", ar: "الشركاء" },
    features: { en: "Features", ar: "المميزات" },
    benefits: { en: "Benefits", ar: "الفوائد" },
    stages: { en: "Stages", ar: "المراحل" },
    requirements: { en: "Requirements", ar: "المتطلبات" },
    form: { en: "Form", ar: "النموذج" },
    security: { en: "Security", ar: "الأمان" },
    login: { en: "Login", ar: "تسجيل الدخول" },
    dpp: { en: "DPP Philosophy", ar: "فلسفة أولوية التطوير" },
    services: { en: "Domains Decision", ar: "مجالات القرار" },
    value: { en: "Value Proposition", ar: "القيمة المضافة" },
    roadmap: { en: "Roadmap", ar: "خارطة الطريق" },
    whoIsThisFor: { en: "Target Audience", ar: "الفئة المستهدفة" },
    acceptanceCriteria: { en: "Acceptance Criteria", ar: "معايير القبول" },
    philosophy: { en: "Philosophy", ar: "الفلسفة" },
  };
  if (map[slug]) return isAr ? map[slug].ar : map[slug].en;
  return slug
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const formatLabel = (key: string, isAr: boolean) => {
  const dictionary: Record<string, { en: string; ar: string }> = {
    eyebrow: { en: "Eyebrow", ar: "العنوان التمهيدي" },
    title: { en: "Title", ar: "العنوان الرئيسي" },
    subtitle: { en: "Subtitle", ar: "العنوان الفرعي" },
    description: { en: "Description", ar: "الوصف" },
    intro: { en: "Intro", ar: "المقدمة" },
    body: { en: "Body Text", ar: "المحتوى" },
    scope: { en: "Scope", ar: "نطاق العمل" },
    impact: { en: "Impact", ar: "الأثر" },
    cat: { en: "Category / Tag", ar: "التصنيف" },
    category: { en: "Category / Tag", ar: "التصنيف" },
    cta: { en: "Call to Action", ar: "زر الإجراء" },
    hospitalitycta: { en: "Hospitality CTA", ar: "زر الضيافة" },
    note: { en: "Note", ar: "ملاحظة" },
    button: { en: "Button", ar: "الزر" },
    text: { en: "Text", ar: "النص" },
    label: { en: "Label", ar: "التسمية" },
    link: { en: "Link", ar: "الرابط" },
    maintitle: { en: "Main Title", ar: "العنوان الرئيسي للبوابة" },
    bottomprompt: { en: "Bottom Prompt", ar: "نص التوجيه السفلي" },
    engineeringtitle: { en: "Engineering Title", ar: "عنوان قطاع هندسة القرار" },
    tourismtitle: { en: "Tourism Title", ar: "عنوان قطاع استشارات السياحة" },
    author: { en: "Author", ar: "المؤلف" },
    role: { en: "Role", ar: "المسمى الوظيفي" },
    date: { en: "Date", ar: "التاريخ" },
    duration: { en: "Duration", ar: "المدة" },
    badge: { en: "Badge", ar: "الشارة" },
    tagline: { en: "Tagline", ar: "الشعار اللفظي" },
    item: { en: "Item", ar: "العنصر" },
    q: { en: "Question", ar: "السؤال" },
    a: { en: "Answer", ar: "الجواب" },
    p1: { en: "Paragraph 1", ar: "الفقرة 1" },
    p2: { en: "Paragraph 2", ar: "الفقرة 2" },
    quote: { en: "Quote", ar: "الاقتباس" },
  };

  const segments = key.split(".");
  if (segments.length > 1) {
    const indexSeg = segments.find((seg) => !isNaN(Number(seg)));
    if (indexSeg !== undefined) {
      const propSeg = segments[segments.length - 1].toLowerCase();
      const translatedProp =
        dictionary[propSeg] ? (isAr ? dictionary[propSeg].ar : dictionary[propSeg].en) :
        propSeg.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const prefix = isAr ? "العنصر" : "Item";
      return `${prefix} ${Number(indexSeg) + 1} - ${translatedProp}`;
    }
  }

  const lowerKey = key.toLowerCase();
  if (dictionary[lowerKey]) return isAr ? dictionary[lowerKey].ar : dictionary[lowerKey].en;

  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const FIELD_ORDER_WEIGHTS: Record<string, number> = {
  tagline: 1,
  eyebrow: 2,
  subtitle: 3,
  maintitle: 4,
  title: 5,
  description: 6,
  desc: 7,
  intro: 8,
  body: 9,
  text: 10,
  p1: 11,
  p2: 12,
  quote: 13,
  author: 14,
  role: 15,
  date: 16,
  duration: 17,
  q: 18,
  a: 19,
  item: 20,
  label: 80,
  badge: 81,
  cat: 90,
  category: 91,
  button: 97,
  bottomprompt: 98,
  cta: 99,
  hospitalitycta: 100,
  link: 101,
};

export default function CMSContent() {
  const { language, refreshOverrides } = useLanguage();
  const isAr = language === "ar";

  const [dbBlocks, setDbBlocks] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const [drafts, setDrafts] = useState<
    Record<string, { content_en: string; content_ar: string }>
  >({});
  const [isSaving, setIsSaving] = useState(false);

  const fetchBlocks = async () => {
    try {
      const res = await fetch("/api/content_blocks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("cms_token")}`,
        },
      });
      const data = await res.json();
      
      // Intercept and strip ghost data
      const cleanedData = data.filter((block: any) => {
        if (block.page === "gatewayPage") {
          const key = block.block_key || "";
          const slug = block.slug || "";
          if (
            key.includes("engineeringSector") ||
            key.includes("tourismSector") ||
            key.includes("topMark") ||
            key === "mainTitle" ||
            slug === "engineeringSector" ||
            slug === "tourismSector" ||
            slug === "mainTitle"
          ) {
            return false; // strip these ghosts completely
          }
        }
        return true;
      });
      
      setDbBlocks(cleanedData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const mergedBlocks = useMemo(() => {
    const flattened: any[] = [];

    const traverse = (enNode: any, arNode: any, path: string[] = []) => {
      for (const key in enNode) {
        if (
          typeof enNode[key] === "object" &&
          enNode[key] !== null &&
          !Array.isArray(enNode[key])
        ) {
          traverse(enNode[key], arNode ? arNode[key] : null, [...path, key]);
        } else if (Array.isArray(enNode[key])) {
          enNode[key].forEach((item: any, index: number) => {
            if (typeof item === "object") {
              traverse(
                item,
                arNode && arNode[key] ? arNode[key][index] : null,
                [...path, key, String(index)],
              );
            } else {
              traverse(
                { [index]: item },
                arNode && arNode[key] ? { [index]: arNode[key][index] } : null,
                [...path, key],
              );
            }
          });
        } else {
          // leaf node (string)
          let page = "global";
          let slug = "general";
          let block_key = [...path, key].join(".");

          if (path.length >= 2) {
            page = path[0];
            slug = path[1];
            block_key = [...path.slice(2), key].join(".");
          } else if (path.length === 1) {
            page = path[0];
            slug = "general";
            block_key = key;
          }

          const homeSections = [
            "hero",
            "decisionGap",
            "coreIdea",
            "previewMethodology",
            "previewAbout",
            "previewInsights",
            "contact",
          ];
          const globalSections = ["nav", "footer"];

          if (homeSections.includes(page)) {
            const originalSlug = slug;
            slug = page;
            page = "homePage";
            block_key =
              originalSlug === "general"
                ? block_key
                : `${originalSlug}.${block_key}`;
          } else if (globalSections.includes(page)) {
            const originalSlug = slug;
            slug = page;
            page = "global";
            block_key =
              originalSlug === "general"
                ? block_key
                : `${originalSlug}.${block_key}`;
          }

          flattened.push({
            id: `static-${page}-${slug}-${block_key}`,
            page,
            slug,
            block_key,
            content_en: enNode[key],
            content_ar: arNode ? arNode[key] : "",
            isStatic: true,
          });
        }
      }
    };

    traverse(translations.en, translations.ar);

    // Merge with DB Blocks
    const dbMap = new Map();
    dbBlocks.forEach((b) => dbMap.set(`${b.page}-${b.slug}-${b.block_key}`, b));

    flattened.forEach((staticBlock) => {
      const dbMatch = dbMap.get(
        `${staticBlock.page}-${staticBlock.slug}-${staticBlock.block_key}`,
      );
      if (dbMatch) {
        staticBlock.id = dbMatch.id;
        staticBlock.content_en = dbMatch.content_en;
        staticBlock.content_ar = dbMatch.content_ar;
        staticBlock.isStatic = false;
        dbMap.delete(
          `${staticBlock.page}-${staticBlock.slug}-${staticBlock.block_key}`,
        );
      }
    });

    // Add remaining DB blocks (custom ones)
    return [...flattened, ...Array.from(dbMap.values())];
  }, [dbBlocks]);

  // Derivations for layout
  const PAGE_PRIORITY = [
    'global',
    'gatewayPage',
    'homePage',
    'aboutPage',
    'methodologyPage',
    'servicesPage',
    'insightsPage',
    'hospitalityConsultantPage',
    'investmentPage',
    'strategicRelationsPage',
    'workWithNormPage',
    'contactPage',
    'qaPage',
    'portalPage',
    'privacyPolicy',
    'termsConditions',
    'disclaimer'
  ];
  const pages = Array.from(new Set(mergedBlocks.map((b) => b.page))).sort((a: any, b: any) => {
    const indexA = PAGE_PRIORITY.indexOf(a);
    const indexB = PAGE_PRIORITY.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return String(a).localeCompare(String(b));
  });

  const SECTION_PRIORITY = [
    'nav', 'hero', 'decisionGap', 'coreIdea', 'positioning', 'differentiation',
    'services', 'dpp', 'philosophy', 'features', 'benefits', 'stages', 'phases',
    'requirements', 'impact', 'outcome', 'aiStrategy', 'previewMethodology',
    'previewAbout', 'previewInsights', 'whoIsThisFor', 'acceptanceCriteria',
    'partners', 'roadmap', 'value', 'sections', 'general', 'ui', 'contact',
    'finalStatement', 'footer'
  ];

  const slugsForPage = selectedPage
    ? Array.from(
        new Set(
          mergedBlocks
            .filter((b) => b.page === selectedPage)
            .map((b) => b.slug),
        ),
      ).sort((a: any, b: any) => {
        const indexA = SECTION_PRIORITY.indexOf(a);
        const indexB = SECTION_PRIORITY.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return String(a).localeCompare(String(b));
      })
    : [];
  const filteredBlocks = mergedBlocks.filter(
    (b) => b.page === selectedPage && b.slug === selectedSlug && b.block_key !== "homeLink" && !b.block_key.endsWith("benefit"),
  );

  // GROUPING LOGIC
  const { coreTexts, dynamicLists } = useMemo(() => {
    const core: any[] = [];
    const lists: Record<string, Record<string, any[]>> = {};

    filteredBlocks.forEach((block) => {
      const segments = block.block_key.split(".");
      const indexStr = segments.find((seg: string) => !isNaN(Number(seg)));

      if (indexStr !== undefined) {
        const idxPosition = segments.indexOf(indexStr);
        const listName = segments.slice(0, idxPosition).join(".");
        const subKey = segments.slice(idxPosition + 1).join(".");

        if (!lists[listName]) lists[listName] = {};
        if (!lists[listName][indexStr]) lists[listName][indexStr] = [];

        lists[listName][indexStr].push({ ...block, subKey });
      } else {
        core.push(block);
      }
    });

    // Sort core texts
    core.sort((a, b) => {
      const wA = FIELD_ORDER_WEIGHTS[a.block_key.split('.').pop()?.toLowerCase() || ''] || 50;
      const wB = FIELD_ORDER_WEIGHTS[b.block_key.split('.').pop()?.toLowerCase() || ''] || 50;
      return wA - wB;
    });

    // Sort items inside lists
    Object.keys(lists).forEach((listName) => {
      Object.keys(lists[listName]).forEach((indexStr) => {
        lists[listName][indexStr].sort((a, b) => {
          const wA = FIELD_ORDER_WEIGHTS[a.subKey.split('.').pop()?.toLowerCase() || ''] || 50;
          const wB = FIELD_ORDER_WEIGHTS[b.subKey.split('.').pop()?.toLowerCase() || ''] || 50;
          return wA - wB;
        });
      });
    });

    return { coreTexts: core, dynamicLists: lists };
  }, [filteredBlocks]);

  // Initialize drafts when filtered blocks or DB blocks change
  useEffect(() => {
    const newDrafts: Record<
      string,
      { content_en: string; content_ar: string }
    > = {};
    filteredBlocks.forEach((block) => {
      const blockKey = `${block.page}-${block.slug}-${block.block_key}`;
      newDrafts[blockKey] = {
        content_en: block.content_en || "",
        content_ar: block.content_ar || "",
      };
    });
    setDrafts(newDrafts);
  }, [selectedPage, selectedSlug, dbBlocks, mergedBlocks]);

  const handleDraftChange = (
    blockKey: string,
    field: "content_en" | "content_ar",
    value: string,
  ) => {
    setDrafts((prev) => ({
      ...prev,
      [blockKey]: {
        ...prev[blockKey],
        [field]: value,
      },
    }));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const promises: Promise<any>[] = [];

      for (const block of filteredBlocks) {
        const blockKey = `${block.page}-${block.slug}-${block.block_key}`;
        const draft = drafts[blockKey];

        if (
          draft &&
          (draft.content_en !== (block.content_en || "") ||
            draft.content_ar !== (block.content_ar || ""))
        ) {
          if (block.isStatic) {
            promises.push(
              fetch(`/api/content_blocks`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("cms_token")}`,
                },
                body: JSON.stringify({
                  page: block.page,
                  slug: block.slug,
                  block_key: block.block_key,
                  content_en: draft.content_en,
                  content_ar: draft.content_ar,
                }),
              }),
            );
          } else {
            promises.push(
              fetch(`/api/content_blocks/${block.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("cms_token")}`,
                },
                body: JSON.stringify({
                  content_en: draft.content_en,
                  content_ar: draft.content_ar,
                }),
              }),
            );
          }
        }
      }

      if (promises.length > 0) {
        await Promise.all(promises);
        await fetchBlocks();
        await refreshOverrides();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const hasUnsavedChanges = filteredBlocks.some((block) => {
    const blockKey = `${block.page}-${block.slug}-${block.block_key}`;
    const draft = drafts[blockKey];
    if (!draft) return false;
    return (
      draft.content_en !== (block.content_en || "") ||
      draft.content_ar !== (block.content_ar || "")
    );
  });

  const renderInputPair = (block: any) => {
    const blockKey = `${block.page}-${block.slug}-${block.block_key}`;
    const draft = drafts[blockKey] || { content_en: "", content_ar: "" };

    return (
      <div
        key={blockKey}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col mb-4"
      >
        <div className="bg-gray-50/50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-magenta bg-magenta/5 px-3 py-1 rounded-lg">
              {formatLabel(String(block.block_key), isAr)}
            </span>
            <span className="text-[10px] text-gray-400 font-mono hidden md:inline-block">
              ({block.block_key})
            </span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* English Input (LTR) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex justify-between items-center">
              <span>{isAr ? "الإنجليزية" : "English"}</span>
              <span className="text-[10px] text-gray-300 font-mono">LTR</span>
            </label>
            <textarea
              dir="ltr"
              className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-magenta/30 rounded-xl p-4 text-sm resize-y min-h-[100px] text-void outline-none transition-all"
              value={draft.content_en}
              onChange={(e) =>
                handleDraftChange(blockKey, "content_en", e.target.value)
              }
              placeholder="Enter English content..."
            />
          </div>

          {/* Arabic Input (RTL) */}
          <div className="flex flex-col gap-2">
            <label
              className="text-xs font-bold text-gray-500 uppercase tracking-wider flex justify-between items-center"
              dir="ltr"
            >
              <span className="text-[10px] text-gray-300 font-mono">RTL</span>
              <span>{isAr ? "العربية" : "Arabic"}</span>
            </label>
            <textarea
              dir="rtl"
              className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-magenta/30 rounded-xl p-4 text-sm resize-y min-h-[100px] text-void outline-none transition-all"
              value={draft.content_ar}
              onChange={(e) =>
                handleDraftChange(blockKey, "content_ar", e.target.value)
              }
              placeholder="أدخل المحتوى بالعربية..."
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="max-w-6xl space-y-8 relative pb-32"
    >
      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-magenta/10 rounded-2xl flex items-center justify-center">
            <Type className="w-6 h-6 text-magenta" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif text-void font-bold">
              {isAr ? "إدارة محتوى الصفحات" : "Page Content Management"}
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-sans">
              {isAr
                ? "قم بتعديل النصوص والمحتوى في الموقع"
                : "Edit the textual content and blocks on the site"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        {/* Page Filter */}
        <div className="flex-1 w-full flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 shrink-0">
            <FileText className="w-5 h-5 text-magenta" />
            <span className="text-sm font-bold text-void">
              {isAr ? "اختر الصفحة:" : "Select Page:"}
            </span>
          </div>
          <select
            value={selectedPage || ""}
            onChange={(e) => {
              setSelectedPage(e.target.value || null);
              setSelectedSlug(null);
            }}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl text-sm px-4 py-3 text-void outline-none focus:border-magenta focus:bg-white transition-all w-full"
          >
            <option value="">
              {isAr ? "-- اختر صفحة --" : "-- Select a page --"}
            </option>
            {pages.map((page: any) => (
              <option key={page} value={page}>
                {page} {isAr ? "—" : "-"} {getPageName(page as string, isAr)}
              </option>
            ))}
          </select>
        </div>

        {/* Section (Slug) Filter */}
        <div className="flex-1 w-full flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 shrink-0">
            <Layers className="w-5 h-5 text-magenta" />
            <span className="text-sm font-bold text-void">
              {isAr ? "اختر القسم:" : "Select Section:"}
            </span>
          </div>
          <select
            value={selectedSlug || ""}
            onChange={(e) => setSelectedSlug(e.target.value || null)}
            disabled={!selectedPage}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl text-sm px-4 py-3 text-void outline-none focus:border-magenta focus:bg-white transition-all w-full disabled:opacity-50"
          >
            <option value="">
              {isAr ? "-- اختر قسم --" : "-- Select a section --"}
            </option>
            {slugsForPage.map((slug) => (
              <option key={String(slug)} value={String(slug)}>
                {getSectionName(String(slug), isAr)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full">
        <div className="space-y-4">
          {!selectedPage || !selectedSlug ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center">
              <Type className="w-12 h-12 text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">
                {isAr
                  ? "يرجى اختيار صفحة من القائمة الجانبية ثم اختيار القسم لعرض وتعديل المحتوى الخاص بها."
                  : "Please select a page and then a section from the sidebar to view and edit its content."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-8">
                <h2 className="text-xl font-serif text-void font-bold">
                  {getPageName(selectedPage as string, isAr)}
                </h2>
                <span className="text-gray-400">/</span>
                <span className="text-magenta font-mono">{selectedSlug}</span>
              </div>

              {selectedPage === "contactPage" ? (() => {
                const formPrefixes = ["buttons.", "steps.", "fields.", "success."];
                const formBlocks = filteredBlocks.filter(b => formPrefixes.some(p => b.block_key.startsWith(p)));
                const standardBlocks = filteredBlocks.filter(b => !formPrefixes.some(p => b.block_key.startsWith(p)));
                
                return (
                  <>
                    {standardBlocks.length > 0 && (
                      <div className="bg-white/50 rounded-3xl border border-gray-100 p-6 md:p-8 mb-8">
                        <h3 className="text-xl font-serif font-bold text-void mb-6">
                          {isAr ? "نصوص أخرى (غير متعلقة بالنموذج)" : "Other Texts (Non-Form)"}
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          {standardBlocks.map(renderInputPair)}
                        </div>
                      </div>
                    )}
                    
                    {formBlocks.length > 0 && (
                      <>
                        <div className="bg-void/5 p-6 rounded-2xl mb-8 border border-void/10">
                          <h3 className="text-xl font-bold mb-4 text-magenta">{isAr ? "1. النصوص الأساسية (الأزرار)" : "1. Core Actions"}</h3>
                          <div className="grid grid-cols-1 gap-4">
                            {formBlocks.filter(b => b.block_key.includes('buttons.')).map(renderInputPair)}
                          </div>
                        </div>
                        <div className="bg-void/5 p-6 rounded-2xl mb-8 border border-void/10">
                          <h3 className="text-xl font-bold mb-4 text-magenta">{isAr ? "2. أسماء المراحل" : "2. Step Headers"}</h3>
                          <div className="grid grid-cols-1 gap-4">
                            {formBlocks.filter(b => b.block_key.includes('steps.')).map(renderInputPair)}
                          </div>
                        </div>
                        <div className="bg-void/5 p-6 rounded-2xl mb-8 border border-void/10">
                          <h3 className="text-xl font-bold mb-4 text-magenta">{isAr ? "3. بيانات المستخدم" : "3. User Fields"}</h3>
                          <div className="grid grid-cols-1 gap-4">
                            {formBlocks.filter(b => b.block_key.includes('fields.name') || b.block_key.includes('fields.position') || b.block_key.includes('fields.email') || b.block_key.includes('fields.phone')).map(renderInputPair)}
                          </div>
                        </div>
                        <div className="bg-void/5 p-6 rounded-2xl mb-8 border border-void/10">
                          <h3 className="text-xl font-bold mb-4 text-magenta">{isAr ? "4. رسالة النجاح" : "4. Success Messages"}</h3>
                          <div className="grid grid-cols-1 gap-4">
                            {formBlocks.filter(b => b.block_key.includes('success.')).map(renderInputPair)}
                          </div>
                        </div>
                        <div className="bg-void/5 p-6 rounded-2xl mb-8 border border-void/10">
                          <h3 className="text-xl font-bold mb-4 text-magenta">{isAr ? "5. مسارات القرار (الكيان والاحتياج)" : "5. Decision Tracks"}</h3>
                          <div className="space-y-8">
                            {['government', 'corporate', 'governance', 'family'].map(entity => {
                              const needMap: Record<string, string> = { government: 'institutional', corporate: 'strategic', governance: 'decisionGov', family: 'continuity' };
                              const need = needMap[entity];
                              const groupBlocks = formBlocks.filter(b => 
                                b.block_key === `fields.entityType.options.${entity}` ||
                                b.block_key === `fields.entityType.guidingText.${entity}.desc` ||
                                b.block_key === `fields.need.options.${need}`
                              );
                              if (groupBlocks.length === 0) return null;
                              const entityPathLabels: Record<string, string> = {
                                government: isAr ? "مسار الجهة الحكومية / العامة" : "Government Path",
                                corporate: isAr ? "مسار الشركة / الجهة الاستراتيجية" : "Corporate Path",
                                governance: isAr ? "مسار الجمهور الحوكمي" : "Governance Path",
                                family: isAr ? "مسار التكتل العائلي" : "Family Path",
                              };
                              return (
                                <div key={entity} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                  <h4 className="text-lg font-bold text-void mb-4 capitalize">{entityPathLabels[entity]}</h4>
                                  <div className="grid grid-cols-1 gap-4">
                                    {groupBlocks.map(renderInputPair)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                );
              })() : (
                <>
                  {/* Core Texts Container */}
                  {coreTexts.length > 0 && (
                    <div className="bg-white/50 rounded-3xl border border-gray-100 p-6 md:p-8 mb-8">
                      <h3 className="text-xl font-serif font-bold text-void mb-6">
                        {isAr ? "النصوص الأساسية" : "Core Texts"}
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {coreTexts.map((block) =>
                          renderInputPair(block),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Lists Containers */}
                  {Object.entries(dynamicLists).map(([listName, itemsDict]) => (
                    <div
                      key={listName}
                      className="bg-white/50 rounded-3xl border border-gray-100 p-6 md:p-8 mb-8"
                    >
                      <h3 className="text-xl font-serif font-bold text-void mb-6 capitalize">
                        {isAr ? "قائمة:" : "List:"} {listName.replace(/_/g, " ")}
                      </h3>
                      <div className="space-y-6">
                        {Object.entries(itemsDict)
                          .sort(([a], [b]) => Number(a) - Number(b))
                          .map(([indexStr, blocks]) => (
                            <div
                              key={indexStr}
                              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4"
                            >
                              <h4 className="text-sm font-bold text-magenta mb-4 bg-magenta/5 inline-block px-3 py-1 rounded-lg">
                                {isAr ? "عنصر" : "Item"} {Number(indexStr) + 1}
                              </h4>
                              <div className="grid grid-cols-1 gap-4">
                                {blocks.map((block) =>
                                  renderInputPair(block),
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Luxury Sticky Action Bar */}
      {selectedPage && selectedSlug && hasUnsavedChanges && (
        <div className="sticky bottom-0 z-50 flex items-center justify-end gap-4 p-4 mt-8 bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] rounded-t-2xl">
          <div className="flex flex-col flex-1">
            <span className="font-bold text-sm text-void">
              {isAr ? "تغييرات غير محفوظة" : "Unsaved Changes"}
            </span>
            <span className="text-xs text-gray-500">
              {isAr
                ? "يرجى حفظ التغييرات قبل مغادرة القسم"
                : "Please save your changes before leaving this section"}
            </span>
          </div>
          <button
            onClick={() => setDrafts({})}
            className="px-6 py-2.5 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            {isAr ? "إلغاء التعديلات" : "Discard Changes"}
          </button>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="bg-magenta hover:bg-magenta/90 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-magenta/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isAr ? "حفظ التغييرات" : "Save All Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
