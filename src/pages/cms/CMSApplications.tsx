import { useEffect, useState } from "react";
import {
  Download,
  Users,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import * as XLSX from "xlsx";
import CMSDateFilter, { DateRange } from "../../components/cms/CMSDateFilter";

export default function CMSApplications() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [applications, setApplications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("cms_token");
      const res = await fetch("/api/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("cms_token");
      const res = await fetch(`/api/applications/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchApplications();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusText = (status: string) => {
    if (isAr) {
      if (status === "archived") return "مؤرشف";
      if (status === "review") return "قيد المراجعة";
      return "قيد الانتظار";
    }
    return status === "archived" ? "Archived" : status === "review" ? "Under Review" : "Pending";
  };

  const exportExcel = () => {
    const data = filteredApplications.map((app) => ({
      [isAr ? "المعرف" : "ID"]: app.id,
      [isAr ? "الاسم والهوية" : "Identity"]: app.identity,
      [isAr ? "البريد الإلكتروني" : "Email"]: app.email,
      [isAr ? "الجوال" : "Phone"]: app.phone,
      [isAr ? "السياق الفكري" : "Context"]: app.context,
      [isAr ? "الحالة" : "Status"]: getStatusText(app.status),
      [isAr ? "التاريخ" : "Date"]: new Date(app.created_at).toLocaleString(
        isAr ? "ar-EG" : "en-US",
      ),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      isAr ? "طلبات الانضمام" : "Talent Applications",
    );

    if (isAr) {
      if (!workbook.Workbook) workbook.Workbook = {};
      if (!workbook.Workbook.Views) workbook.Workbook.Views = [{}];
      workbook.Workbook.Views[0].RTL = true;
    }

    XLSX.writeFile(
      workbook,
      `norm_applications_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  const filteredApplications = applications.filter((app) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      (app.identity || "").toLowerCase().includes(searchLower) ||
      (app.email || "").toLowerCase().includes(searchLower) ||
      (app.phone || "").toLowerCase().includes(searchLower) ||
      (app.context || "").toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "all" || (app.status || "pending") === statusFilter;

    let matchesDate = true;
    if (dateRange.startDate && dateRange.endDate) {
      const appDate = new Date(app.created_at);
      matchesDate =
        appDate >= dateRange.startDate && appDate <= dateRange.endDate;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const stats = {
    total: filteredApplications.length,
    pending: filteredApplications.filter(
      (a) => (a.status || "pending") === "pending",
    ).length,
    review: filteredApplications.filter((a) => a.status === "review").length,
    archived: filteredApplications.filter((a) => a.status === "archived").length,
  };

  return (
    <div dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end mb-8 gap-4">
        <div className="hidden items-center gap-3">
          <div className="p-2 bg-magenta/10 rounded-xl">
            <Users className="w-6 h-6 text-magenta" />
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-void font-bold">
            {isAr ? "طلبات الانضمام" : "Talent Applications"}
          </h1>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <CMSDateFilter onFilterChange={setDateRange} />
          <button
            onClick={exportExcel}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-void text-white rounded-xl text-sm font-bold hover:bg-magenta transition-colors h-10 w-full sm:w-auto"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isAr ? "تصدير Excel" : "Export Excel"}
            </span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {isAr ? "الطلبات" : "Total"}
            </div>
            <div className="text-xl font-black text-void">{stats.total}</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {isAr ? "قيد الانتظار" : "Pending"}
            </div>
            <div className="text-xl font-black text-amber-600">
              {stats.pending}
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {isAr ? "قيد المراجعة" : "Review"}
            </div>
            <div className="text-xl font-black text-blue-600">
              {stats.review}
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {isAr ? "مؤرشف" : "Archived"}
            </div>
            <div className="text-xl font-black text-green-600">
              {stats.archived}
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel (Search & Filter) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search
            className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`}
          />
          <input
            type="text"
            placeholder={
              isAr
                ? "البحث بالاسم، البريد أو الهاتف..."
                : "Search by name, email or phone..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full ${isAr ? "pr-10 pl-4" : "pl-10 pr-4"} py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-magenta focus:bg-white transition-all text-void`}
          />
        </div>

        <div className="flex gap-1.5 items-center w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${statusFilter === "all" ? "bg-void text-white shadow-md" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
          >
            {isAr ? "الكل" : "All"}
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${statusFilter === "pending" ? "bg-amber-50 text-amber-700 border border-amber-200 shadow-sm" : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent"}`}
          >
            {isAr ? "قيد الانتظار" : "Pending"}
          </button>
          <button
            onClick={() => setStatusFilter("review")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${statusFilter === "review" ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm" : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent"}`}
          >
            {isAr ? "قيد المراجعة" : "Review"}
          </button>
          <button
            onClick={() => setStatusFilter("archived")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${statusFilter === "archived" ? "bg-green-50 text-green-700 border border-green-200 shadow-sm" : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent"}`}
          >
            {isAr ? "مؤرشف" : "Archived"}
          </button>
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
                <th className="px-6 py-4">
                  {isAr ? "الاسم والهوية" : "Identity"}
                </th>
                <th className="px-6 py-4">
                  {isAr ? "بيانات التواصل" : "Contact"}
                </th>
                <th className="px-6 py-4">
                  {isAr ? "السياق الفكري" : "Context"}
                </th>
                <th className="px-6 py-4">
                  {isAr ? "الحالة" : "Status"}
                </th>
                <th className="px-6 py-4">{isAr ? "التاريخ" : "Date"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50 relative">
                  <td
                    data-label={isAr ? "المعرف" : "ID"}
                    className="px-6 md:py-4 text-xs font-mono"
                  >
                    #{app.id}
                  </td>
                  <td
                    data-label={isAr ? "الاسم والهوية" : "Identity"}
                    className="px-6 md:py-4 font-semibold text-void"
                  >
                    {app.identity}
                  </td>
                  <td
                    data-label={isAr ? "بيانات التواصل" : "Contact"}
                    className="px-6 md:py-4"
                  >
                    <div className="font-mono text-xs">{app.email}</div>
                    <div className="text-xs text-gray-400 font-mono">
                      {app.phone}
                    </div>
                  </td>
                  <td
                    data-label={isAr ? "السياق الفكري" : "Context"}
                    className="px-6 md:py-4 md:max-w-xs truncate"
                    title={app.context}
                  >
                    {app.context}
                  </td>
                  <td
                    data-label={isAr ? "الحالة" : "Status"}
                    className="px-6 md:py-4"
                  >
                    <select
                      value={app.status || "pending"}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      disabled={app.status === 'archived'}
                      className={`text-xs font-semibold px-2 py-1 rounded-full outline-none border cursor-pointer ${
                        app.status === 'archived' ? 'bg-green-100 text-green-800 border-green-200' :
                        app.status === 'review' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        'bg-amber-100 text-amber-800 border-amber-200'
                      } ${app.status === 'archived' ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                      <option value="pending">
                        {isAr ? "قيد الانتظار" : "Pending"}
                      </option>
                      <option value="review">
                        {isAr ? "قيد المراجعة" : "Under Review"}
                      </option>
                      <option value="archived">
                        {isAr ? "مؤرشف" : "Archived"}
                      </option>
                    </select>
                  </td>
                  <td
                    data-label={isAr ? "التاريخ" : "Date"}
                    className="px-6 md:py-4 text-xs text-gray-500 whitespace-nowrap"
                  >
                    {new Date(app.created_at).toLocaleString(
                      isAr ? "ar-EG" : "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </td>
                </tr>
              ))}
              {filteredApplications.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Users className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-base font-semibold text-gray-600 mb-1">
                        {isAr ? "لا توجد طلبات انضمام" : "No Applications Found"}
                      </p>
                      <p className="text-sm">
                        {isAr
                          ? "لم يتم العثور على طلبات تطابق بحثك."
                          : "We couldn't find any applications matching your criteria."}
                      </p>
                    </div>
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
