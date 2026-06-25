import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmDialogContext";
import {
  Upload,
  Copy,
  Trash2,
  Plus,
  X,
  Save,
  FileImage,
  LayoutGrid,
  AlertCircle,
  RefreshCw,
  Edit2,
} from "lucide-react";

export default function CMSMedia() {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();
  const isAr = language === "ar";

  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingStatic, setUploadingStatic] = useState<string | null>(null);

  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: "",
    order_index: 0,
    file: null as File | null,
  });

  const [editingPartner, setEditingPartner] = useState<any | null>(null);
  const [tourismSettings, setTourismSettings] = useState<any>({});

  useEffect(() => {
    fetchPartners();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings/tourism-media");
      if (!res.ok) { throw new Error('API route not found'); }
      
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();
        setTourismSettings(data);
      } else {
        throw new Error('API returned non-JSON response');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTourismUpload = async (key: string, file: File) => {
    setUploadingStatic(key);
    const formData = new FormData();
    formData.append("key", key);
    formData.append("image", file);

    try {
      const token = localStorage.getItem("cms_token");
      const res = await fetch("/api/settings/tourism-media", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        showToast(isAr ? "تم تحديث الوسائط بنجاح!" : "Media updated successfully!", "success");
        fetchSettings();
      } else {
        showToast(isAr ? "حدث خطأ أثناء الرفع" : "An error occurred", "error");
      }
    } catch (e) {
      console.error(e);
      showToast(isAr ? "حدث خطأ" : "An error occurred", "error");
    } finally {
      setUploadingStatic(null);
    }
  };

  const handleDeleteTourism = (key: string) => {
    showConfirm(
      {
        message: isAr
          ? "هل أنت متأكد من رغبتك في الحذف؟ سيتم مسح الملف نهائياً من الخادم."
          : "Are you sure you want to delete this? The file will be permanently removed.",
      },
      async () => {
        setUploadingStatic(key);
        try {
          const token = localStorage.getItem("cms_token");
          const res = await fetch(`/api/settings/tourism-media/${key}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            showToast(
              isAr ? "تم حذف الوسائط بنجاح!" : "Media deleted successfully!",
              "success",
            );
            fetchSettings();
          } else {
            showToast(isAr ? "حدث خطأ أثناء الحذف" : "Error deleting media", "error");
          }
        } catch (e) {
          console.error(e);
          showToast(isAr ? "حدث خطأ" : "An error occurred", "error");
        } finally {
          setUploadingStatic(null);
        }
      },
    );
  };

  const fetchPartners = async () => {
    try {
      const res = await fetch("/api/partners");
      if (res.ok) {
        const data = await res.json();
        setPartners(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStaticUpload = async (type: string, file: File) => {
    setUploadingStatic(type);
    const formData = new FormData();
    formData.append("type", type);
    formData.append("image", file);

    try {
      const token = localStorage.getItem("cms_token");
      const res = await fetch("/api/media/static", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        showToast(
          isAr ? "تم تحديث الصورة بنجاح!" : "Image updated successfully!",
          "success",
        );
        // Force reload to bypass cache
        setTimeout(() => window.location.reload(), 1500);
      } else {
        showToast(isAr ? "فشل الرفع" : "Failed to upload", "error");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploadingStatic(null);
    }
  };

  const handleDeleteStatic = (type: string) => {
    showConfirm(
      {
        message: isAr
          ? "هل أنت متأكد من الحذف النهائي؟ سيتم مسح الملف من الخادم"
          : "Are you sure you want to permanently delete this? Files will be removed from the server.",
      },
      async () => {
        setUploadingStatic(type);
        try {
          const token = localStorage.getItem("cms_token");
          const res = await fetch(`/api/media/static/${type}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            showToast(
              isAr ? "تم حذف الصورة بنجاح!" : "Image deleted successfully!",
              "success",
            );
            setTimeout(() => window.location.reload(), 1500);
          }
        } catch (e) {
          console.error(e);
          showToast(isAr ? "حدث خطأ" : "An error occurred", "error");
        } finally {
          setUploadingStatic(null);
        }
      },
    );
  };

  const handleSavePartner = async () => {
    if (isAddingPartner) {
      if (!newPartner.name || !newPartner.file) {
        showToast(
          isAr
            ? "يرجى تعبئة الاسم واختيار صورة"
            : "Please enter name and select an image",
          "error",
        );
        return;
      }
      const formData = new FormData();
      formData.append("name", newPartner.name);
      formData.append("image", newPartner.file);

      try {
        const token = localStorage.getItem("cms_token");
        const res = await fetch("/api/partners", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (res.ok) {
          setIsAddingPartner(false);
          setNewPartner({ name: "", file: null });
          fetchPartners();
        }
      } catch (e) {
        console.error(e);
      }
    } else if (editingPartner) {
      if (!editingPartner.name) return;
      const formData = new FormData();
      formData.append("name", editingPartner.name);
      if (editingPartner.file) {
        formData.append("image", editingPartner.file);
      } else if (editingPartner.remove_image) {
        formData.append("remove_image", "true");
      }

      try {
        const token = localStorage.getItem("cms_token");
        const res = await fetch(`/api/partners/${editingPartner.id}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (res.ok) {
          setEditingPartner(null);
          fetchPartners();
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleDeletePartner = (id: number) => {
    showConfirm(
      {
        message: isAr
          ? "هل أنت متأكد من الحذف النهائي؟ سيتم مسح الملف من الخادم"
          : "Are you sure you want to permanently delete this? Files will be removed from the server.",
      },
      async () => {
        try {
          const token = localStorage.getItem("cms_token");
          const res = await fetch(`/api/partners/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            showToast(
              isAr ? "تم الحذف بنجاح" : "Deleted successfully",
              "success",
            );
            fetchPartners();
          }
        } catch (e) {
          console.error(e);
          showToast(isAr ? "حدث خطأ" : "An error occurred", "error");
        }
      },
    );
  };

  
  const handleCopyLink = (path: string) => {
    const fullUrl = window.location.origin + path;
    navigator.clipboard.writeText(fullUrl);
    showToast(isAr ? "تم نسخ الرابط" : "Link copied to clipboard", "success");
  };

  const staticMedia = [
    {
      type: "logo",
      title: isAr ? "شعار الموقع" : "Site Logo",
      path: "/logo.png",
    },
    {
      type: "favicon",
      title: isAr ? "أيقونة الموقع" : "Site Favicon",
      path: "/favicon.png",
    },
    {
      type: "og-image",
      title: isAr ? "صورة المشاركة (SEO)" : "Share Image (SEO)",
      path: "/og-image.png",
    },
    {
      type: "about",
      title: isAr ? "صورة قسم من نحن" : "About Section Image",
      path: "/about.png",
    },
    {
      type: "gate-logo",
      title: isAr ? "شعار البوابة الرئيسية (Gate)" : "Gateway Logo",
      path: "/logo-gate.png",
    },
  ];

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {isAr ? "إدارة الوسائط" : "Media Management"}
          </h1>
          <p className="text-ink/60 mt-1">
            {isAr
              ? "إدارة الصور الثابتة والشعارات"
              : "Manage static images and logos"}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Static Media Section */}
        <div>
          <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
            <FileImage className="w-5 h-5 text-primary" />
            وسائط دار هندسة القرار
          </h2>
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {staticMedia.map((media) => (
              <div
                key={media.type}
                className="bg-white rounded-xl border border-ink/10 p-4 flex flex-col items-center text-center"
              >
                <h3 className="font-semibold text-ink mb-4">{media.title}</h3>

                <div className="w-full h-32 bg-sand rounded-lg mb-4 flex items-center justify-center relative group overflow-hidden border border-ink/5">
                  <img
                    src={`${media.path}?t=${new Date().getTime()}`}
                    alt={media.title}
                    className="max-w-full max-h-full object-contain p-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-off"><line x1="3" y1="3" x2="21" y2="21"/><path d="M15 9h.01"/><path d="M21 15V5a2 2 0 0 0-2-2H9"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L12 15"/><path d="M16 21v-2a4 4 0 0 0-3-3.87"/><path d="M3 16s1-1 4-1 5 2 8 2h4"/><path d="M3 21v-4"/><path d="M3 5v14a2 2 0 0 0 2 2h14c.15 0 .3-.02.45-.05"/></svg>';
                    }}
                  />
                  <div className="absolute inset-0 bg-void/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                    <button
                      onClick={() => handleCopyLink(`${media.path}?t=${new Date().getTime()}`)}
                      className="bg-white text-void p-2 rounded-lg hover:bg-magenta hover:text-white transition-colors shadow-sm"
                      title={isAr ? "نسخ الرابط" : "Copy URL"}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <label
                      className="cursor-pointer bg-white text-void p-2 rounded-lg hover:bg-magenta hover:text-white transition-colors shadow-sm"
                      title={isAr ? "تغيير الصورة" : "Change Image"}
                    >
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleStaticUpload(media.type, e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                    <button
                      onClick={() => handleDeleteStatic(media.type)}
                      className="bg-white text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                      title={isAr ? "حذف الصورة" : "Delete Image"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {uploadingStatic === media.type && (
                  <p className="text-xs text-primary animate-pulse">
                    {isAr ? "جاري التحديث..." : "Updating..."}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tourism Sector Media Section */}
        <div>
          <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-primary" />
            وسائط إستشارات السياحة
          </h2>
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { key: "tourism_logo_path", title: isAr ? "شعار قطاع السياحة" : "Tourism Logo", fallback: "/logo.png" },
              { key: "tourism_favicon_path", title: isAr ? "أيقونة المتصفح لقطاع السياحة" : "Tourism Favicon", fallback: "/favicon.png" },
              { key: "tourism_og_image_path", title: isAr ? "صورة المشاركة لقطاع السياحة" : "Tourism OG Image", fallback: "/og-image.png" },
            ].map((media) => {
              const currentPath = tourismSettings[media.key] || media.fallback;
              return (
                <div
                  key={media.key}
                  className="bg-gray-50 rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col items-center text-center"
                >
                  <h3 className="font-semibold text-ink mb-4">{media.title}</h3>

                  <div className="w-full h-32 bg-white rounded-lg border border-gray-100 mb-4 flex items-center justify-center relative group overflow-hidden border border-ink/5">
                    <img
                      src={`${currentPath}?t=${new Date().getTime()}`}
                      alt={media.title}
                      className="max-w-full max-h-full object-contain p-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-off"><line x1="3" y1="3" x2="21" y2="21"/><path d="M15 9h.01"/><path d="M21 15V5a2 2 0 0 0-2-2H9"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L12 15"/><path d="M16 21v-2a4 4 0 0 0-3-3.87"/><path d="M3 16s1-1 4-1 5 2 8 2h4"/><path d="M3 21v-4"/><path d="M3 5v14a2 2 0 0 0 2 2h14c.15 0 .3-.02.45-.05"/></svg>';
                      }}
                    />
                    <div className="absolute inset-0 bg-void/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                      <button
                        onClick={() => handleCopyLink(`${currentPath}?t=${new Date().getTime()}`)}
                        className="bg-white text-void p-2 rounded-lg hover:bg-magenta hover:text-white transition-colors shadow-sm"
                        title={isAr ? "نسخ الرابط" : "Copy URL"}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <label
                        className="cursor-pointer bg-white text-void p-2 rounded-lg hover:bg-magenta hover:text-white transition-colors shadow-sm"
                        title={isAr ? "تغيير الصورة" : "Change Image"}
                      >
                        <Upload className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleTourismUpload(media.key, e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                      <button
                        onClick={() => handleDeleteTourism(media.key)}
                        className="bg-white text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                        title={isAr ? "حذف الصورة" : "Delete Image"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {uploadingStatic === media.key && (
                    <p className="text-xs text-primary animate-pulse">
                      {isAr ? "جاري التحديث..." : "Updating..."}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Partners Section */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <LayoutGrid className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-ink">
                {isAr ? "شركاء النجاح" : "Strategic Partners"}
              </h2>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsAddingPartner(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-void text-white rounded-xl text-sm font-bold hover:bg-magenta transition-colors h-10 w-full sm:w-auto shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isAr ? "إضافة شريك جديد" : "Add New Partner"}
                </span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
            {loading ? (
              <div className="py-12 text-center text-ink/50 flex flex-col items-center">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                {isAr ? "جاري التحميل..." : "Loading..."}
              </div>
            ) : partners.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                  <LayoutGrid className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-void mb-2">
                  {isAr ? "لا توجد بيانات" : "No Data Found"}
                </h3>
                <p className="text-sm text-gray-500 max-w-sm mb-6">
                  {isAr ? "لا يوجد شركاء بعد." : "No partners found."}
                </p>
                <button
                  onClick={() => setIsAddingPartner(true)}
                  className="bg-void/10 text-void hover:bg-void hover:text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {isAr ? "إضافة شريك جديد" : "Add New Partner"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {partners.map((p, index) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-xl border border-ink/10 p-4 flex flex-col items-center text-center relative group hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div
                      className={`absolute top-2 ${isAr ? "right-2" : "left-2"} w-6 h-6 bg-sand text-ink/40 text-xs font-bold rounded-full flex items-center justify-center z-10 border border-ink/5`}
                    >
                      {index + 1}
                    </div>
                    <div className="w-full h-32 bg-sand rounded-lg mb-4 flex items-center justify-center relative overflow-hidden border border-ink/5">
                      <img
                        src={p.src}
                        alt={p.name}
                        className="max-w-full max-h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-void/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 backdrop-blur-sm">
                        <button
                          onClick={() => handleCopyLink(p.src)}
                          className="bg-white text-void p-2 rounded-lg hover:bg-magenta hover:text-white transition-colors shadow-sm"
                          title={isAr ? "نسخ الرابط" : "Copy URL"}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingPartner(p)}
                          className="bg-white text-void p-2 rounded-lg hover:bg-magenta hover:text-white transition-colors shadow-sm"
                          title={isAr ? "تعديل الشريك" : "Edit Partner"}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePartner(p.id)}
                          className="bg-white text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                          title={isAr ? "حذف الشريك" : "Delete Partner"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h3
                      className="font-bold text-ink w-full truncate px-2"
                      title={p.name}
                    >
                      {p.name}
                    </h3>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Partner Modal */}
      {(isAddingPartner || editingPartner) && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-void/40 backdrop-blur-sm"
          dir={isAr ? "rtl" : "ltr"}
        >
          <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => {
                setIsAddingPartner(false);
                setEditingPartner(null);
              }}
              className={`absolute top-6 ${isAr ? "left-6" : "right-6"} p-2 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-void rounded-full transition-colors`}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-serif font-bold text-void">
                {isAddingPartner
                  ? isAr
                    ? "إضافة شريك جديد"
                    : "Add New Partner"
                  : isAr
                    ? "تعديل بيانات الشريك"
                    : "Edit Partner"}
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  {isAr ? "اسم الشريك" : "Partner Name"}
                </label>
                <input
                  type="text"
                  value={
                    isAddingPartner ? newPartner.name : editingPartner.name
                  }
                  onChange={(e) =>
                    isAddingPartner
                      ? setNewPartner({ ...newPartner, name: e.target.value })
                      : setEditingPartner({
                          ...editingPartner,
                          name: e.target.value,
                        })
                  }
                  className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:border-magenta focus:ring-4 focus:ring-magenta/5 outline-none transition-all shadow-sm text-void"
                  placeholder={
                    isAr ? "اسم الشركة / الجهة" : "Company / Entity Name"
                  }
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  {isAr ? "الشعار (Logo)" : "Logo Image"}
                </label>
                
                {/* PREVIEW FIX FOR EDIT */}
                {editingPartner && editingPartner.src && !editingPartner.file && !editingPartner.remove_image && (
                  <div className="mb-4 bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center gap-2 relative">
                    <button
                      onClick={() => setEditingPartner({ ...editingPartner, remove_image: true })}
                      className="absolute top-2 right-2 bg-white text-red-500 hover:bg-red-50 p-1.5 rounded-lg shadow-sm border border-gray-100 transition-colors"
                      title={isAr ? "حذف الشعار الحالي" : "Delete Current Logo"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <p className="text-xs font-bold text-gray-400 uppercase">{isAr ? "الشعار الحالي" : "Current Logo"}</p>
                    <div className="w-32 h-24 flex items-center justify-center">
                        <img src={editingPartner.src} className="max-w-full max-h-full object-contain" alt="Current Logo" />
                    </div>
                  </div>
                )}
                
                <div className="relative group cursor-pointer w-full bg-white hover:bg-gray-50 border-2 border-dashed border-gray-200 hover:border-magenta rounded-xl p-6 text-center transition-all duration-300">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        if (isAddingPartner)
                          setNewPartner({
                            ...newPartner,
                            file: e.target.files[0],
                          });
                        else
                          setEditingPartner({
                            ...editingPartner,
                            file: e.target.files[0],
                          });
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-3 rounded-full bg-gray-50 group-hover:bg-magenta/10 transition-colors duration-300">
                      <Upload className="w-6 h-6 text-gray-400 group-hover:text-magenta transition-colors duration-200" />
                    </div>
                    <span className="text-sm font-bold text-gray-500 group-hover:text-void transition-colors duration-300">
                      {isAddingPartner 
                         ? (newPartner.file ? newPartner.file.name : (isAr ? "اختر صورة الشعار" : "Drop logo here or click"))
                         : (editingPartner.file ? editingPartner.file.name : (isAr ? "اختر صورة جديدة لتغيير الشعار" : "Drop new logo here to replace"))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`flex gap-3 mt-8 pt-6 border-t border-gray-100 justify-end`}
            >
              <button
                onClick={() => {
                  setIsAddingPartner(false);
                  setEditingPartner(null);
                }}
                className="px-8 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors duration-200"
              >
                {isAr ? "إلغاء الأمر" : "Cancel"}
              </button>
              <button
                onClick={handleSavePartner}
                className="px-8 py-3 bg-void text-white rounded-xl text-sm font-bold hover:bg-magenta transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <Save className="w-4 h-4" />
                {isAr ? "حفظ البيانات" : "Save Partner"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
