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

export default function CMSInquiries() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  const entityMap: Record<string, { ar: string; en: string }> = {
    government: { ar: "جهة حكومية / عامة", en: "Government / Public Entity" },
    corporate: { ar: "شركة / جهة استراتيجية", en: "Corporate / Strategic Entity" },
    governance: { ar: "جمهور حوكمي", en: "Governance Stakeholders" },
    family: { ar: "تكتل عائلي", en: "Family Conglomerate" },
  };

  const challengeMap: Record<string, { ar: string; en: string }> = {
    institutional: { ar: "القرارات المؤسسية", en: "Institutional Decisions" },
    strategic: { ar: "القرارات الاستراتيجية", en: "Strategic Decisions" },
    decisiongov: { ar: "حوكمة القرار", en: "Decision Governance" },
    continuity: { ar: "استمرارية الكيان", en: "Business Continuity" },
  };

  const formatEntity = (val: string) => {
    if (!val) return "-";
    const key = val.toLowerCase();
    if (entityMap[key]) return isAr ? entityMap[key].ar : entityMap[key].en;
    return val;
  };

  const formatChallenge = (val: string) => {
    if (!val) return "-";
    const key = val.toLowerCase();
    if (challengeMap[key])
      return isAr ? challengeMap[key].ar : challengeMap[key].en;
    return val;
  };

  const fetchInquiries = async () => {
    const token = localStorage.getItem("cms_token");
    if (!token) return;
    try {
      const res = await fetch("/api/inquiries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setInquiries(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const updateStatus = async (id: number, nextStatus: string) => {
    // Optimistic UI update
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: nextStatus } : inq)),
    );

    const token = localStorage.getItem("cms_token");
    try {
      const res = await fetch(`/api/inquiries/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
    } catch (e) {
      console.error(e);
      // Revert if error
      fetchInquiries();
    }
  };

  const exportExcel = () => {
    const getStatusText = (status: string) => {
      if (isAr) {
        if (status === "completed") return "مكتمل";
        if (status === "reviewed") return "تمت المراجعة";
        return "قيد الانتظار";
      }
      return status;
    };

    const data = inquiries.map((q) => ({
      [isAr ? "المعرف" : "ID"]: q.id,
      [isAr ? "نوع الكيان" : "Entity Type"]: formatEntity(q.entity),
      [isAr ? "مجال الاحتياج" : "Area of Need"]: formatChallenge(q.challenge),
      [isAr ? "الاسم" : "Name"]: q.name,
      [isAr ? "المنصب" : "Position"]: q.position,
      [isAr ? "البريد الإلكتروني" : "Email"]: q.email,
      [isAr ? "الجوال" : "Phone"]: q.phone,
      [isAr ? "الحالة" : "Status"]: getStatusText(q.status),
      [isAr ? "التاريخ" : "Date"]: new Date(q.created_at).toLocaleString(
        isAr ? "ar-EG" : "en-US",
      ),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      isAr ? "الطلبات" : "Inquiries",
    );

    // Add RTL property if Arabic
    if (isAr) {
      if (!workbook.Workbook) workbook.Workbook = {};
      if (!workbook.Workbook.Views) workbook.Workbook.Views = [{}];
      workbook.Workbook.Views[0].RTL = true;
    }

    XLSX.writeFile(
      workbook,
      `norm_inquiries_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      (inq.entity || "").toLowerCase().includes(searchLower) ||
      (inq.name || "").toLowerCase().includes(searchLower) ||
      (inq.email || "").toLowerCase().includes(searchLower) ||
      (inq.challenge || "").toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "all" || (inq.status || "pending") === statusFilter;

    let matchesDate = true;
    if (dateRange.startDate && dateRange.endDate) {
      const inqDate = new Date(inq.created_at);
      matchesDate =
        inqDate >= dateRange.startDate && inqDate <= dateRange.endDate;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const stats = {
    total: filteredInquiries.length,
    pending: filteredInquiries.filter(
      (i) => (i.status || "pending") === "pending",
    ).length,
    reviewed: filteredInquiries.filter((i) => i.status === "reviewed").length,
    completed: filteredInquiries.filter((i) => i.status === "completed").length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
            <CheckCircle className="w-3.5 h-3.5" />
            {isAr ? "مكتمل" : "Completed"}
          </span>
        );
      case "reviewed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            {isAr ? "تمت المراجعة" : "Reviewed"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5" />
            {isAr ? "قيد الانتظار" : "Pending"}
          </span>
        );
    }
  };

  return (
    <div dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end mb-8 gap-4">
        <div className="hidden items-center gap-3">
          <div className="p-2 bg-magenta/10 rounded-xl">
            <Users className="w-6 h-6 text-magenta" />
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-void font-bold">
            {isAr ? "طلبات التأهيل" : "Inquiries Pipeline"}
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
              {isAr ? "تمت المراجعة" : "Reviewed"}
            </div>
            <div className="text-xl font-black text-blue-600">
              {stats.reviewed}
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {isAr ? "مكتمل" : "Completed"}
            </div>
            <div className="text-xl font-black text-green-600">
              {stats.completed}
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
                ? "البحث بالجهة، الاسم، البريد أو التحدي..."
                : "Search by entity, name, email or challenge..."
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
            onClick={() => setStatusFilter("reviewed")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${statusFilter === "reviewed" ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm" : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent"}`}
          >
            {isAr ? "مراجعة" : "Reviewed"}
          </button>
          <button
            onClick={() => setStatusFilter("completed")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${statusFilter === "completed" ? "bg-green-50 text-green-700 border border-green-200 shadow-sm" : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent"}`}
          >
            {isAr ? "مكتمل" : "Completed"}
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
                  {isAr ? "نوع الكيان" : "Entity Type"}
                </th>
                <th className="px-6 py-4">
                  {isAr ? "الاسم والمنصب" : "Name & Position"}
                </th>
                <th className="px-6 py-4">{isAr ? "بيانات التواصل" : "Contact Info"}</th>
                <th className="px-6 py-4">
                  {isAr ? "مجال الاحتياج" : "Area of Need"}
                </th>
                <th className="px-6 py-4">
                  {isAr ? "الحالة والإجراء" : "Status & Action"}
                </th>
                <th className="px-6 py-4">{isAr ? "التاريخ" : "Date"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-gray-50/50 relative">
                  <td
                    data-label={isAr ? "المعرف" : "ID"}
                    className="px-6 md:py-4 text-xs font-mono"
                  >
                    #{inq.id}
                  </td>
                  <td
                    data-label={isAr ? "نوع الكيان" : "Entity Type"}
                    className="px-6 md:py-4 font-semibold text-void"
                  >
                    {formatEntity(inq.entity)}
                  </td>
                  <td
                    data-label={isAr ? "الاسم والمنصب" : "Name & Position"}
                    className="px-6 md:py-4"
                  >
                    <div className="font-semibold text-void">{inq.name}</div>
                    <div className="text-xs text-gray-400">{inq.position}</div>
                  </td>
                  <td
                    data-label={isAr ? "بيانات التواصل" : "Contact Info"}
                    className="px-6 md:py-4"
                  >
                    <div className="font-mono text-xs">{inq.email}</div>
                    <div className="text-xs text-gray-400 font-mono">
                      {inq.phone}
                    </div>
                  </td>
                  <td
                    data-label={isAr ? "مجال الاحتياج" : "Area of Need"}
                    className="px-6 md:py-4 md:max-w-xs truncate"
                    title={formatChallenge(inq.challenge)}
                  >
                    {formatChallenge(inq.challenge)}
                  </td>
                  <td
                    data-label={isAr ? "الحالة والإجراء" : "Status & Action"}
                    className="px-6 md:py-4"
                  >
                    <select
                      value={inq.status || "pending"}
                      onChange={(e) => updateStatus(inq.id, e.target.value)}
                      disabled={inq.status === 'completed'}
                      className={`text-xs font-semibold px-2 py-1 rounded-full outline-none border cursor-pointer ${
                        inq.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                        inq.status === 'reviewed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        'bg-amber-100 text-amber-800 border-amber-200'
                      } ${inq.status === 'completed' ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                      {(!inq.status || inq.status === 'pending') && (
                        <option value="pending">{isAr ? "قيد الانتظار" : "Pending"}</option>
                      )}
                      {(!inq.status || inq.status === 'pending' || inq.status === 'reviewed') && (
                        <option value="reviewed">{isAr ? "تمت المراجعة" : "Reviewed"}</option>
                      )}
                      <option value="completed">{isAr ? "مكتمل" : "Completed"}</option>
                    </select>
                  </td>
                  <td
                    data-label={isAr ? "التاريخ" : "Date"}
                    className="px-6 md:py-4 text-xs whitespace-nowrap"
                  >
                    {new Date(inq.created_at).toLocaleDateString(
                      isAr ? "ar-EG" : "en-US",
                    )}
                  </td>
                </tr>
              ))}
              {filteredInquiries.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    {isAr
                      ? "لا توجد طلبات تطابق بحثك."
                      : "No matching inquiries found."}
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
