import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  UserPlus,
  Shield,
  Mail,
  Lock,
  Calendar,
  Loader2,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmDialogContext";
import SEO from "../../components/common/SEO";

export default function CMSUsers() {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();
  const isAr = language === "ar";

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Edit Modal State
  const [editUser, setEditUser] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");

  const fetchUsers = async () => {
    const token = localStorage.getItem("cms_token");
    if (!token) return;

    try {
      const res = await fetch("/api/cms_users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("cms_token");
    if (!token) return;

    if (formData.password.length < 6) {
      setError(
        isAr
          ? "يجب ألا تقل كلمة المرور عن 6 خانات"
          : "Password must be at least 6 characters",
      );
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/cms_users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(
          isAr
            ? "تم تسجيل المتعاون الجديد بنجاح."
            : "New collaborator registered successfully.",
        );
        setFormData({ name: "", email: "", password: "" });
        fetchUsers();
      } else {
        const errorData = await res.json();
        setError(
          errorData.error ||
            (isAr
              ? "فشل تسجيل المستخدم."
              : "Failed to register user. Ensure email is unique."),
        );
      }
    } catch (err) {
      setError(
        isAr ? "خطأ في الاتصال بالخادم." : "Database connection failure.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditSubmitting(true);
    setEditError("");

    const token = localStorage.getItem("cms_token");
    if (!token) return;

    if (editFormData.password && editFormData.password.length < 6) {
      setEditError(
        isAr
          ? "يجب ألا تقل كلمة المرور عن 6 خانات"
          : "Password must be at least 6 characters",
      );
      setEditSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`/api/cms_users/${editUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (res.ok) {
        setEditUser(null);
        fetchUsers();
      } else {
        const errorData = await res.json();
        setEditError(
          errorData.error ||
            (isAr ? "فشل تحديث المستخدم." : "Failed to update user."),
        );
      }
    } catch (err) {
      setEditError(
        isAr ? "خطأ في الاتصال بالخادم." : "Database connection failure.",
      );
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteUser = (id: number, role: string) => {
    if (role === "admin") {
      showToast(
        isAr ? "لا يمكن حذف مدير النظام." : "Cannot delete super admin.",
        "error",
      );
      return;
    }

    showConfirm(
      {
        title: isAr ? "تحذير: إزالة حساب محرر" : "Warning: Delete Editor",
        message: isAr
          ? "هل أنت متأكد من حذف حساب هذا المحرر؟ لا يمكن التراجع عن هذا الإجراء."
          : "Are you sure you want to delete this editor? This action is irreversible.",
        isDestructive: true,
      },
      async () => {
        const token = localStorage.getItem("cms_token");
        if (!token) return;

        try {
          const res = await fetch(`/api/cms_users/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            showToast(
              isAr ? "تم حذف الحساب بنجاح" : "Account deleted successfully",
              "success",
            );
            fetchUsers();
          } else {
            const errorData = await res.json();
            showToast(
              errorData.error || (isAr ? "فشل الحذف" : "Failed to delete"),
              "error",
            );
          }
        } catch (err) {
          showToast(isAr ? "خطأ في الاتصال" : "Connection error", "error");
        }
      },
    );
  };

  const openEditModal = (user: any) => {
    setEditUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      password: "", // Keep empty, only update if typed
    });
    setEditError("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 space-y-8"
      dir={isAr ? "rtl" : "ltr"}
    >
      <SEO
        title={
          isAr
            ? "إدارة طاقم العمل - لوحة التحكم NORM"
            : "Staff Management - NORM CMS"
        }
        description="NORM Staff and Editors Management"
      />

      <div className="flex items-center gap-3 border-b pb-4">
        <Users className="w-8 h-8 text-magenta" />
        <div>
          <h1 className="text-2xl font-serif text-void font-bold">
            {isAr
              ? "إدارة طاقم العمل والمتعاونين"
              : "Staff & Collaborators Management"}
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-sans">
            {isAr
              ? "إضافة وإدارة المحررين وتعديل بيانات دخول النظام."
              : "Register and manage editors and system access credentials."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Collaborator Form */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm h-fit space-y-6">
          <div className="flex items-center gap-2 border-b pb-3">
            <UserPlus className="w-5 h-5 text-magenta" />
            <h2 className="text-base font-serif font-bold text-void">
              {isAr ? "إضافة محرر محتوى جديد" : "Add Content Editor"}
            </h2>
          </div>

          <form
            onSubmit={handleCreateUser}
            className="space-y-4 font-sans text-xs"
          >
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3.5 bg-green-50 border border-green-200 text-green-700 rounded-xl font-medium">
                {success}
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">
                {isAr ? "الاسم الكامل للموظف" : "Full Name"}
              </label>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={
                    isAr ? "مثال: عبد الإله الفهد" : "e.g., Al-Anoud Fahad"
                  }
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-3 text-void focus:outline-none focus:border-magenta focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">
                {isAr ? "البريد الإلكتروني المهني" : "Professional Email"}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="name@norm.com"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-3 text-void focus:outline-none focus:border-magenta focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">
                {isAr ? "كلمة المرور الآمنة" : "Secure Passcode"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-3 text-void focus:outline-none focus:border-magenta focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2 text-gray-500">
              <Shield className="w-4 h-4 text-magenta shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed">
                {isAr
                  ? "سيتم تعيين العضو الجديد بصفة 'محرر محتوى' تلقائياً. يمكن لمحرر المحتوى إدارة الرؤى والاستفسارات، ولا يمكنه الوصول لإعدادات النظام."
                  : "New member will be assigned 'Editor' role automatically. Editors can manage insights and inquiries but not system settings."}
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-magenta text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-widest hover:bg-magenta/90 transition-all disabled:opacity-50 mt-2 text-xs shadow-md"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>{isAr ? "إضافة المحرر" : "Add Editor"}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing Users List */}
        <div className="lg:col-span-2 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              <h2 className="text-base font-serif font-bold text-void">
                {isAr ? "أعضاء الفريق النشطين" : "Active Staff & Directory"}
              </h2>
            </div>
            <span className="px-3 py-1 bg-magenta/5 text-magenta font-mono text-xs rounded-full font-bold">
              {users.length} {isAr ? "عضو" : "Members"}
            </span>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-magenta mb-2" />
                <span className="text-xs font-mono">
                  {isAr
                    ? "جاري جلب قائمة الكوادر..."
                    : "Loading cohort roster..."}
                </span>
              </div>
            ) : (
              <table className="w-full text-start text-xs text-gray-600 font-sans responsive-table">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase">
                  <tr>
                    <th className="px-4 py-3 text-start rounded-l-lg">
                      {isAr ? "الاسم" : "Name"}
                    </th>
                    <th className="px-4 py-3 text-start">
                      {isAr ? "البريد المهني" : "Email Address"}
                    </th>
                    <th className="px-4 py-3 text-start">
                      {isAr ? "المستوى" : "Role"}
                    </th>
                    <th className="px-4 py-3 text-start whitespace-nowrap">
                      {isAr ? "آخر دخول" : "Last Login"}
                    </th>
                    <th className="px-4 py-3 text-start rounded-r-lg">
                      {isAr ? "الإجراءات" : "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/40 relative">
                      <td
                        data-label={isAr ? "الاسم" : "Name"}
                        className="px-4 md:py-4 font-bold text-void"
                      >
                        {user.name}
                      </td>
                      <td
                        data-label={isAr ? "البريد المهني" : "Email Address"}
                        className="px-4 md:py-4 font-mono font-medium"
                      >
                        {user.email}
                      </td>
                      <td
                        data-label={isAr ? "المستوى" : "Role"}
                        className="px-4 md:py-4"
                      >
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                            user.role === "admin"
                              ? "bg-rose-50 text-rose-700 border border-rose-100"
                              : "bg-blue-50 text-blue-700 border border-blue-100"
                          }`}
                        >
                          {user.role === "admin" && (
                            <Shield className="w-3 h-3" />
                          )}
                          {user.role === "admin"
                            ? isAr
                              ? "مدير نظام"
                              : "SUPER ADMIN"
                            : isAr
                              ? "محرر محتوى"
                              : "EDITOR"}
                        </span>
                      </td>
                      <td
                        data-label={isAr ? "آخر دخول" : "Last Login"}
                        className="px-4 md:py-4 text-gray-400 font-mono text-[10px]"
                      >
                        {user.last_login
                          ? new Date(user.last_login).toLocaleString(
                              isAr ? "ar-EG" : "en-US",
                            )
                          : isAr
                            ? "لم يسجل بعد"
                            : "Never"}
                      </td>
                      <td
                        data-label={isAr ? "الإجراءات" : "Actions"}
                        className="px-4 md:py-4"
                      >
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-1.5 text-gray-400 hover:text-magenta hover:bg-magenta/10 rounded-lg transition-colors"
                            title={isAr ? "تعديل البيانات" : "Edit"}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {user.role !== "admin" && (
                            <button
                              onClick={() =>
                                handleDeleteUser(user.id, user.role)
                              }
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title={isAr ? "حذف الحساب" : "Delete"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditUser(null)}
              className="absolute inset-0 bg-void/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md z-10 border border-gray-100"
            >
              <button
                onClick={() => setEditUser(null)}
                className={`absolute ${isAr ? "left-6" : "right-6"} top-6 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <div className="w-12 h-12 bg-magenta/10 text-magenta rounded-2xl flex items-center justify-center mb-4">
                  <Edit2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-void">
                  {isAr ? "تعديل بيانات الحساب" : "Edit Account Details"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {isAr
                    ? `تعديل معلومات حساب: ${editUser.name}`
                    : `Editing credentials for: ${editUser.name}`}
                </p>
              </div>

              <form
                onSubmit={handleEditSubmit}
                className="space-y-4 font-sans text-xs"
              >
                {editError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium">
                    {editError}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">
                    {isAr ? "الاسم الكامل" : "Full Name"}
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={editFormData.name}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          name: e.target.value,
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-3 text-void focus:outline-none focus:border-magenta focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">
                    {isAr ? "البريد الإلكتروني المهني" : "Professional Email"}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={editFormData.email}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          email: e.target.value,
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-3 text-void focus:outline-none focus:border-magenta focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">
                    {isAr
                      ? "كلمة المرور (اتركها فارغة لعدم التغيير)"
                      : "Password (Leave blank to keep current)"}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={editFormData.password}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          password: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-3 text-void focus:outline-none focus:border-magenta focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={editSubmitting}
                    className="w-full bg-void text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-widest hover:bg-magenta transition-all disabled:opacity-50"
                  >
                    {editSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isAr ? (
                      "حفظ التعديلات"
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
