import { useEffect, useState } from "react";
import {
  ListFilter,
  Search,
  Clock,
  ShieldAlert,
  User,
  Activity,
  Database,
  CheckCircle,
  RefreshCcw,
  Download,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../../context/ToastContext";
import SEO from "../../components/common/SEO";
import CMSDateFilter, { DateRange } from "../../components/cms/CMSDateFilter";

export default function CMSAuditLogs() {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const isAr = language === "ar";
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [downloadingJson, setDownloadingJson] = useState(false);
  const [downloadingTar, setDownloadingTar] = useState(false);
  const [isRestoringBackup, setIsRestoringBackup] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const restoreBackup = async () => {
    const confirmed = window.confirm(
      isAr
        ? "⚠️ تحذير حاسم! \n\nسيتم استبدال جميع بيانات النظام الحالية (قاعدة البيانات والملفات والوسائط) بالنسخة الاحتياطية الداخلية.\n\nسيتوقف الخادم مؤقتاً. هذا الإجراء لا يمكن التراجع.\n\nهل أنت متأكد تماماً?"
        : "⚠️ CRITICAL WARNING! \n\nAll current system data (database, files, media) will be OVERWRITTEN by the internal backup.\n\nThe server will pause briefly. This action CANNOT be undone.\n\nAre you absolutely sure?"
    );
    if (!confirmed) return;

    setIsRestoringBackup(true);
    const token = localStorage.getItem("cms_token");
    try {
      const res = await fetch("/api/system/restore", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Restore failed.");
      setSuccessMsg(
        isAr
          ? "✅ تم التعافي بنجاح. سيتم إعادة تحميل الصفحة تلقائياً..."
          : "✅ Restore initiated successfully. Reloading page..."
      );
      setTimeout(() => window.location.reload(), 3000);
    } catch (e: any) {
      showToast((isAr ? "خطأ في الاستعادة: " : "Restore error: ") + e.message, "error");
    } finally {
      setIsRestoringBackup(false);
    }
  };

  const createInternalBackup = async () => {
    setDownloadingJson(true);
    const token = localStorage.getItem("cms_token");
    try {
      const res = await fetch("/api/system/backup/internal", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Unauthorized or database busy.");

      const data = await res.json();
      setSuccessMsg(
        isAr
          ? `تم حفظ النسخة الاحتياطية بنجاح: ${data.filename}`
          : `Internal backup saved successfully: ${data.filename}`,
      );
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (e: any) {
      showToast((isAr ? "خطأ: " : "Error: ") + e.message, "error");
    } finally {
      setDownloadingJson(false);
    }
  };

  const fetchBackupTar = async () => {
    setDownloadingTar(true);
    const token = localStorage.getItem("cms_token");
    try {
      const res = await fetch("/api/system/backup/archive", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok)
        throw new Error("Failed to compile compressed system backup.");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `norm_full_system_backup_${new Date().toISOString().split("T")[0]}.tar.gz`;
      a.click();

      setSuccessMsg(
        isAr
          ? "تمت الأرشفة. جارٍ التنزيل..."
          : "Archived successfully. Downloading...",
      );
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (e: any) {
      showToast(
        (isAr
          ? "خطأ في إنشاء النسخة المضغوطة: "
          : "Error building tar.gz backup: ") + e.message,
        "error",
      );
    } finally {
      setDownloadingTar(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const token = localStorage.getItem("cms_token");
    try {
      const res = await fetch("/api/system/audit_logs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setLogs(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getActionBadge = (action: string) => {
    const act = (action || "").toUpperCase();
    if (act.includes("CREATE")) {
      return (
        <span className="px-2.5 py-1 text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 rounded-full inline-flex items-center">
          {isAr ? "إضافة" : "CREATE"}
        </span>
      );
    } else if (act.includes("DELETE")) {
      return (
        <span className="px-2.5 py-1 text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 rounded-full inline-flex items-center">
          {isAr ? "حذف" : "DELETE"}
        </span>
      );
    } else if (act.includes("UPDATE") || act.includes("UPSERT")) {
      return (
        <span className="px-2.5 py-1 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full inline-flex items-center">
          {isAr ? "تعديل" : "UPDATE"}
        </span>
      );
    } else if (act.includes("LOGIN")) {
      return (
        <span className="px-2.5 py-1 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-full inline-flex items-center">
          {isAr ? "تسجيل دخول" : "LOGIN"}
        </span>
      );
    } else {
      return (
        <span className="px-2.5 py-1 text-[10px] font-bold bg-gray-50 text-gray-700 border border-gray-200 rounded-full inline-flex items-center">
          {act}
        </span>
      );
    }
  };

  const getResourceName = (resource: string) => {
    const resMap: Record<string, { ar: string; en: string }> = {
      insights: { ar: "الرؤى والتحليلات", en: "Insights" },
      inquiries: { ar: "طلبات التأهيل", en: "Inquiries" },
      cms_users: { ar: "طاقم العمل", en: "Staff Users" },
      seo_metadata: { ar: "إعدادات SEO", en: "SEO Settings" },
      content_blocks: { ar: "محتوى الصفحات", en: "Content Blocks" },
      auth: { ar: "المصادقة والدخول", en: "Authentication" },
      image_metadata: { ar: "مكتبة الوسائط", en: "Media Library" },
    };
    const key = (resource || "").toLowerCase();
    if (resMap[key]) {
      return isAr ? resMap[key].ar : resMap[key].en;
    }
    return resource;
  };

  const filteredLogs = logs.filter((log) => {
    const userMatch =
      (log.user_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (log.details || "").toLowerCase().includes(search.toLowerCase()) ||
      (log.resource || "").toLowerCase().includes(search.toLowerCase());

    const actionMatch =
      actionFilter === "all" ||
      (log.action || "").toUpperCase() === actionFilter.toUpperCase();

    let dateMatch = true;
    if (dateRange.startDate && dateRange.endDate) {
      const logDate = new Date(log.timestamp);
      dateMatch =
        logDate >= dateRange.startDate && logDate <= dateRange.endDate;
    }

    return userMatch && actionMatch && dateMatch;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, actionFilter, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="p-4 space-y-8 animate-in fade-in duration-500 max-w-5xl"
    >
      <SEO
        title={
          isAr
            ? "مركز العمليات والرقابة - NORM"
            : "Operations & Audit Center - NORM"
        }
        description={
          isAr
            ? "إدارة العمليات وسجلات النظام"
            : "System operations and audit logs management"
        }
      />

      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between border-b border-gray-100 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-magenta/10 rounded-2xl flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-magenta" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif text-void font-bold">
              {isAr ? "مركز العمليات والرقابة" : "Operations & Audit Center"}
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-sans">
              {isAr
                ? "إدارة النسخ الاحتياطية ومراقبة وتتبع جميع الحركات والتعديلات التي تتم في النظام بدقة."
                : "Manage backups and monitor all actions and modifications made within the system."}
            </p>
          </div>
        </div>
      </div>

      {/* Maintenance Section */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-void mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-magenta" />
          {isAr ? "الصيانة والنسخ الاحتياطي" : "Maintenance & Backups"}
        </h2>

        {successMsg && (
          <div className="mb-4 p-4 bg-green-50 text-green-800 border-l-4 border-green-500 rounded-xl flex items-center gap-2 animate-fade-in text-sm font-medium shadow-sm">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Internal Server Backup */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <h3 className="text-md font-serif text-void font-bold mb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-gray-400" />
                {isAr ? "حفظ كنسخة داخلية (في الخادم)" : "Save Internal Backup"}
              </h3>
              <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                {isAr
                  ? "إنشاء نسخة احتياطية شاملة (قاعدة البيانات + الملفات + الوسائط) وحفظها آمناً داخل خادم النظام."
                  : "Creates a full backup (DB + files + media) stored securely inside the host server. Max 1 copy retained."}
              </p>
            </div>
            <button
              onClick={createInternalBackup}
              disabled={downloadingJson}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-void border border-gray-200 font-bold hover:border-magenta hover:bg-magenta/5 transition-colors rounded-xl disabled:opacity-50 text-xs shadow-sm"
            >
              {downloadingJson ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin" />
                  {isAr ? "جاري الحفظ..." : "Saving..."}
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  {isAr ? "حفظ نسخة" : "Save Backup"}
                </>
              )}
            </button>
          </div>

          {/* Card 2: Local Download */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <h3 className="text-md font-serif text-void font-bold mb-2 flex items-center gap-2">
                <Download className="w-4 h-4 text-gray-400" />
                {isAr ? "تنزيل محلي (إلى جهازك)" : "Download Local Archive"}
              </h3>
              <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                {isAr
                  ? "إنشاء نسخة احتياطية (قاعدة البيانات والملفات) وتنزيلها إلى جهازك بشكل محلي (بصيغة tar.gz)."
                  : "Creates a full backup archive (DB + files + media), downloading it directly to your computer."}
              </p>
            </div>
            <button
              onClick={fetchBackupTar}
              disabled={downloadingTar}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-void text-white font-bold hover:bg-magenta transition-colors rounded-xl disabled:opacity-50 text-xs shadow-sm"
            >
              {downloadingTar ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin" />
                  {isAr ? "جاري الضغط..." : "Bundling..."}
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  {isAr ? "تنزيل" : "Download"}
                </>
              )}
            </button>
          </div>

          {/* Card 3: 1-Click Disaster Recovery Restore */}
          <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <h3 className="text-md font-serif text-red-700 font-bold mb-2 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-red-500" />
                {isAr ? "استعادة النظام" : "Restore System"}
              </h3>
              <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                {isAr
                  ? "تعافي كامل بنقرة واحدة من آخر نسخة داخلية. يتوقف الخادم مؤقتاً خلال العملية. هذا الإجراء لا يمكن التراجع."
                  : "Full system recovery from the last internal backup. Server pauses briefly. This action cannot be undone."}
              </p>
            </div>
            <button
              onClick={restoreBackup}
              disabled={isRestoringBackup}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors rounded-xl disabled:opacity-50 text-xs shadow-sm"
            >
              {isRestoringBackup ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin" />
                  {isAr ? "جاري الاستعادة..." : "Restoring..."}
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  {isAr ? "استعادة النظام" : "Restore System"}
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Audit Section */}
      <div>
        <h2 className="text-lg font-bold text-void mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-magenta" />
          {isAr ? "سجل نشاط النظام" : "System Audit Logs"}
        </h2>

        {/* Audit Controls */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4 mb-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:max-w-md">
              <Search
                className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`}
              />
              <input
                type="text"
                placeholder={
                  isAr
                    ? "البحث عن مستخدم أو تفاصيل..."
                    : "Search by user or details..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full ${isAr ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-magenta focus:bg-white transition-all text-void`}
              />
            </div>

            <div className="w-full md:w-auto shrink-0 z-10 relative">
              <CMSDateFilter onFilterChange={setDateRange} />
            </div>
          </div>

          <div className="flex gap-2 items-center w-full overflow-x-auto pb-2 scrollbar-hide">
            <ListFilter className="w-4 h-4 text-gray-400 hidden md:block shrink-0" />
            {[
              { id: "all", label: isAr ? "الكل" : "All" },
              { id: "CREATE", label: isAr ? "إضافة" : "CREATE" },
              { id: "UPDATE", label: isAr ? "تعديل" : "UPDATE" },
              { id: "DELETE", label: isAr ? "حذف" : "DELETE" },
              { id: "LOGIN", label: isAr ? "تسجيل دخول" : "LOGIN" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setActionFilter(opt.id)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors border shrink-0 ${
                  actionFilter === opt.id
                    ? "bg-void text-white border-void"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-void"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Timeline Grid */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table
              className={`w-full ${isAr ? "text-right" : "text-left"} text-sm text-gray-600 responsive-table`}
            >
              <thead className="bg-gray-50 text-gray-400 uppercase tracking-wider font-bold text-[10px]">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl">
                    {isAr ? "المستخدم" : "User"}
                  </th>
                  <th className="px-6 py-4">{isAr ? "القسم" : "Module"}</th>
                  <th className="px-6 py-4">
                    {isAr ? "التعديل / التفاصيل" : "Details / Modification"}
                  </th>
                  <th className="px-6 py-4 rounded-tr-xl whitespace-nowrap">
                    {isAr ? "التاريخ والوقت" : "Date & Time"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50/40 transition-colors relative"
                  >
                    <td
                      data-label={isAr ? "المستخدم" : "User"}
                      className="px-6 md:py-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-magenta/10 text-magenta flex items-center justify-center font-bold font-serif shrink-0">
                          {log.user_name ? (
                            log.user_name.charAt(0).toUpperCase()
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-void text-xs">
                            {log.user_name || "System"}
                          </div>
                          <div className="text-[9px] text-gray-400 font-mono mt-0.5">
                            ID: {log.user_id || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      data-label={isAr ? "القسم" : "Module"}
                      className="px-6 md:py-4"
                    >
                      <div className="flex flex-col items-start gap-1.5">
                        {getActionBadge(log.action)}
                        <span className="text-[11px] font-semibold text-gray-500">
                          {getResourceName(log.resource)}
                        </span>
                      </div>
                    </td>
                    <td
                      data-label={
                        isAr ? "التعديل / التفاصيل" : "Details / Modification"
                      }
                      className="px-6 md:py-4 md:max-w-sm text-xs font-medium text-gray-600 leading-relaxed"
                    >
                      {log.details || "-"}
                    </td>
                    <td
                      data-label={isAr ? "التاريخ والوقت" : "Date & Time"}
                      className="px-6 md:py-4 whitespace-nowrap"
                    >
                      <div className="flex flex-col gap-1 text-[11px]">
                        <span className="font-bold text-void">
                          {new Date(log.timestamp).toLocaleDateString(
                            isAr ? "ar-EG" : "en-US",
                            { year: "numeric", month: "long", day: "numeric" },
                          )}
                        </span>
                        <span className="text-gray-400 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(log.timestamp).toLocaleTimeString(
                            isAr ? "ar-EG" : "en-US",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedLogs.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-16 text-center text-gray-400"
                    >
                      <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                      <span className="text-sm">
                        {isAr
                          ? "لا توجد سجلات نشاط مطابقة."
                          : "No audit records found."}
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="text-sm text-gray-500 font-medium">
              {isAr ? "إجمالي السجلات:" : "Total Records:"}{" "}
              <span className="font-bold text-void mx-1">
                {filteredLogs.length}
              </span>
            </div>
            {totalPages > 1 && (
              <div className="flex gap-2 items-center" dir="ltr">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-sm font-medium px-2 text-void">
                  {currentPage} / {totalPages}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
