import { Helmet } from "react-helmet-async";
import { useLanguage } from "../../context/LanguageContext";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

// Hook to dynamically query and apply page-specific SEO tags from SQLite database
export function useSEOMetadata(path: string) {
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/seo")
      .then((res) => res.json())
      .then((data) => {
        if (!active || !Array.isArray(data)) return;
        const match = data.find((item: any) => item.path === path);
        if (match) {
          setMetadata(match);
        }
      })
      .catch((e) => console.error("Dynamic SEO fail:", e));
    return () => {
      active = false;
    };
  }, [path]);

  return metadata;
}

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  structuredData?: Record<string, any>;
}

export default function SEO({
  title,
  description,
  keywords,
  structuredData,
}: SEOProps) {
  const { language } = useLanguage();
  const location = useLocation();
  const isAr = language === "ar";

  const dynamicSEO = useSEOMetadata(location.pathname);

  const siteName = isAr
    ? "NORM | دار هندسة القرار"
    : "NORM | Decision Architecture House";

  // Use values from DB if available, otherwise fallback to defaults passed from local page templates
  const dbTitle = isAr ? dynamicSEO?.title_ar : dynamicSEO?.title_en;
  const dbDesc = isAr ? dynamicSEO?.description_ar : dynamicSEO?.description_en;
  const dbKeywords = isAr ? dynamicSEO?.keywords_ar : dynamicSEO?.keywords_en;
  const dbOgTitle = isAr ? dynamicSEO?.og_title_ar : dynamicSEO?.og_title_en;
  const dbOgDesc = isAr ? dynamicSEO?.og_desc_ar : dynamicSEO?.og_desc_en;

  const fullTitle = dbTitle ? `${dbTitle}` : `${title} | ${siteName}`;
  const finalDescription = dbDesc || description;
  const defaultKeywords = isAr
    ? "NORM, دار هندسة القرار, استشارات إدارية, التخطيط الاستراتيجي, إدارة المخاطر, حوكمة الشركات, هندسة الإجراءات, مكتب عائلي, استشارات الشركات"
    : "NORM, Decision Architecture House, Management Consulting, Strategic Planning, Risk Management, Corporate Governance, Process Engineering, Family Office, Corporate Consulting";
  const finalKeywords = dbKeywords || keywords || defaultKeywords;

  const finalOgTitle = dbOgTitle || fullTitle;
  const finalOgDesc = dbOgDesc || finalDescription;

  const currentUrl = `https://norm.sa${location.pathname}`;

  return (
    <Helmet htmlAttributes={{ lang: language, dir: isAr ? "rtl" : "ltr" }}>
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDesc} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content="/og-image.png" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDesc} />
      <meta name="twitter:image" content="/og-image.png" />

      <link rel="canonical" href={currentUrl} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5"
      />

      {/* Alternate languages */}
      <link rel="alternate" hrefLang="en" href={currentUrl} />
      <link rel="alternate" hrefLang="ar" href={currentUrl} />
      <link rel="alternate" hrefLang="x-default" href={currentUrl} />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
