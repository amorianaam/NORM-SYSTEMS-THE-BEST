import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import CMSInquiries from "./CMSInquiries";
import CMSApplications from "./CMSApplications";

export default function CMSRequestsHub() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"inquiries" | "applications">("inquiries");

  return (
    <div dir={isAr ? "rtl" : "ltr"}>
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`px-6 py-3 font-bold text-sm transition-colors duration-200 ${
            activeTab === "inquiries"
              ? "border-b-2 border-magenta text-magenta"
              : "text-gray-400 hover:text-void"
          }`}
          onClick={() => setActiveTab("inquiries")}
        >
          {isAr ? "طلبات التأهيل" : "Inquiries Pipeline"}
        </button>
        <button
          className={`px-6 py-3 font-bold text-sm transition-colors duration-200 ${
            activeTab === "applications"
              ? "border-b-2 border-magenta text-magenta"
              : "text-gray-400 hover:text-void"
          }`}
          onClick={() => setActiveTab("applications")}
        >
          {isAr ? "طلبات الانضمام" : "Talent Applications"}
        </button>
      </div>

      {activeTab === "inquiries" ? <CMSInquiries /> : <CMSApplications />}
    </div>
  );
}
