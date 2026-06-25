import { useEffect, useState } from "react";
import { Download, Users, FileText, ArrowDownToLine } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import * as XLSX from "xlsx";
import CMSDateFilter, { DateRange } from "../../components/cms/CMSDateFilter";

export default function CMSInsightReaders() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [readers, setReaders] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    const fetchReaders = async () => {
      const token = localStorage.getItem("cms_token");
      if (!token) return;
      try {
        const res = await fetch("/api/insight_readers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setReaders(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchReaders();
  }, []);

  const exportExcel = () => {
    const data = readers.map((r) => ({
      [isAr ? "المعرف" : "ID"]: r.id,
      [isAr ? "الاسم" : "Name"]: r.name,
      [isAr ? "البريد الإلكتروني" : "Email"]: r.email,
      [isAr ? "المنظمة" : "Organization"]: r.organization,
      [isAr ? "عنوان الرؤية" : "Insight Title"]: r.insight_title,
      [isAr ? "تاريخ التحميل" : "Download Time"]: new Date(
        r.download_time,
      ).toLocaleString(isAr ? "ar-EG" : "en-US"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      isAr ? "قراء الرؤى" : "Readers",
    );

    // Add RTL property if Arabic
    if (isAr) {
      if (!workbook.Workbook) workbook.Workbook = {};
      if (!workbook.Workbook.Views) workbook.Workbook.Views = [{}];
      workbook.Workbook.Views[0].RTL = true;
    }

    XLSX.writeFile(
      workbook,
      `norm_insight_readers_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  const filteredReaders = readers.filter((r) => {
    let matchesDate = true;
    if (dateRange.startDate && dateRange.endDate) {
      const dDate = new Date(r.download_time);
      matchesDate = dDate >= dateRange.startDate && dDate <= dateRange.endDate;
    }
    return matchesDate;
  });

  const stats = {
    total: filteredReaders.length,
  };

  return (
    <div dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-magenta/10 rounded-xl">
            <Users className="w-6 h-6 text-magenta" />
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-void font-bold">
            {isAr ? "قراء الرؤى" : "Insight Readers"}
          </h1>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <CMSDateFilter onFilterChange={setDateRange} />
          <button
            onClick={exportExcel}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-void text-white rounded-xl text-sm font-bold hover:bg-magenta transition-colors h-10 w-full sm:w-auto shrink-0"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isAr ? "تصدير Excel" : "Export Excel"}
            </span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {isAr ? "إجمالي القراء" : "Total Readers"}
            </div>
            <div className="text-xl font-black text-void">{stats.total}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table
            className={`w-full ${isAr ? "text-right" : "text-left"} text-sm text-gray-600 responsive-table`}
          >
            <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-4">{isAr ? "المعرف" : "ID"}</th>
                <th className="px-6 py-4">{isAr ? "الاسم" : "Name"}</th>
                <th className="px-6 py-4">
                  {isAr ? "البريد الإلكتروني" : "Email"}
                </th>
                <th className="px-6 py-4">
                  {isAr ? "المنظمة" : "Organization"}
                </th>
                <th className="px-6 py-4">
                  {isAr ? "عنوان الرؤية" : "Insight Title"}
                </th>
                <th className="px-6 py-4">
                  {isAr ? "تاريخ التحميل" : "Download Date"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredReaders.map((reader) => (
                <tr key={reader.id} className="hover:bg-gray-50/50 relative">
                  <td
                    data-label={isAr ? "المعرف" : "ID"}
                    className="px-6 md:py-4 font-mono text-xs"
                  >
                    #{reader.id}
                  </td>
                  <td
                    data-label={isAr ? "الاسم" : "Name"}
                    className="px-6 md:py-4 font-semibold text-void"
                  >
                    {reader.name}
                  </td>
                  <td
                    data-label={isAr ? "البريد الإلكتروني" : "Email"}
                    className="px-6 md:py-4"
                  >
                    {reader.email}
                  </td>
                  <td
                    data-label={isAr ? "المنظمة" : "Organization"}
                    className="px-6 md:py-4"
                  >
                    {reader.organization}
                  </td>
                  <td
                    data-label={isAr ? "عنوان الرؤية" : "Insight Title"}
                    className="px-6 md:py-4 max-w-[200px] truncate"
                    title={reader.insight_title}
                  >
                    {reader.insight_title}
                  </td>
                  <td
                    data-label={isAr ? "تاريخ التحميل" : "Download Date"}
                    className="px-6 md:py-4 text-xs whitespace-nowrap"
                  >
                    {new Date(reader.download_time).toLocaleDateString(
                      isAr ? "ar-EG" : "en-US",
                    )}
                  </td>
                </tr>
              ))}
              {filteredReaders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    {isAr ? "لم يتم العثور على قراء." : "No readers found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
