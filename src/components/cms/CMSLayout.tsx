import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Users,
  LogOut,
  Globe,
  Image,
  ShieldAlert,
  Database,
  Languages,
  Menu,
  X,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { ToastProvider } from "../../context/ToastContext";
import { ConfirmDialogProvider } from "../../context/ConfirmDialogContext";

export default function CMSLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const isAr = language === "ar";

  const userStr = localStorage.getItem("cms_user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === "admin";

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("cms_token");
    localStorage.removeItem("cms_user");
    navigate("/cms/login");
  };

  const toggleCMSLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  // Base navigation menu items with bilingual translations and strict order
  const navItems = [
    {
      name: isAr ? "تعديل المحتوى" : "Page Content",
      path: "/cms/content",
      icon: FileText,
    },
    {
      name: isAr ? "إدارة محركات البحث" : "SEO Management",
      path: "/cms/seo",
      icon: Globe,
    },
    {
      name: isAr ? "إدارة الرؤى والأخبار" : "Insights & News",
      path: "/cms/insights",
      icon: FileText,
    },
    {
      name: isAr ? "إدارة الوسائط" : "Media Management",
      path: "/cms/media",
      icon: Image,
    },
    ...(isAdmin ? [{
      name: isAr ? "إدارة طاقم العمل" : "Staff Management",
      path: "/cms/users",
      icon: Users,
    }] : []),
    {
      name: isAr ? "زوار الرؤى الدراسية" : "Insight Readers",
      path: "/cms/insight-readers",
      icon: Users,
    },
    {
      name: isAr ? "مركز الطلبات" : "Requests Hub",
      path: "/cms/requests",
      icon: MessageSquare,
    },
    ...(isAdmin ? [{
      name: isAr ? "مركز العمليات والرقابة" : "Operations & Control Center",
      path: "/cms/audit-logs",
      icon: ShieldAlert,
    }] : [])
  ];

  const visibleItems = navItems;

  return (
    <ToastProvider>
      <ConfirmDialogProvider>
        <div
          className="min-h-screen bg-gray-50 flex flex-col md:flex-row shadow-inner"
          dir={isAr ? "rtl" : "ltr"}
        >
          {/* Mobile Top Header */}
          <header className="md:hidden sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-void text-parchment shadow-md border-b border-white/10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors focus:outline-none"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-sm font-serif text-magenta tracking-widest uppercase font-bold">
                NORM CMS
              </h1>
            </div>

            <button
              onClick={toggleCMSLanguage}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-parchment hover:text-white hover:bg-white/10 transition-all flex items-center gap-1 text-[10px]"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{isAr ? "EN" : "AR"}</span>
            </button>
          </header>

          {/* Sidebar Overlay (Mobile) */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
              />
            )}
          </AnimatePresence>

          {/* Sidebar */}
          <aside
            className={`fixed md:sticky top-0 h-screen w-[260px] bg-void text-parchment flex flex-col items-center py-8 px-4 border-r border-void/10 text-xs z-[70] transition-transform duration-300 md:translate-x-0 ${
              isMobileMenuOpen
                ? "translate-x-0 shadow-2xl"
                : isAr
                  ? "translate-x-full md:translate-x-0"
                  : "-translate-x-full md:translate-x-0"
            } ${isAr ? "right-0 border-l border-r-0" : "left-0"}`}
          >
            <div className="w-full flex items-center justify-between mb-6 px-1">
              <h1 className="text-lg font-serif text-magenta tracking-widest uppercase hidden md:block">
                NORM CMS
              </h1>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="md:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white mr-auto"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Dashboard Language Quick Toggle - Desktop */}
              <button
                onClick={toggleCMSLanguage}
                className="hidden md:flex p-1.5 rounded-lg bg-white/5 border border-white/10 text-parchment hover:text-white hover:bg-white/10 transition-all items-center gap-1 text-[10px]"
                title={isAr ? "Switch to English" : "تحويل للعربية"}
              >
                <Languages className="w-3.5 h-3.5" />
                <span>{isAr ? "EN" : "AR"}</span>
              </button>
            </div>

            {/* User Identity chip */}
            <div className="w-full bg-white/5 border border-white/10 rounded-xl p-3 mb-8 text-center text-xs">
              <div className="font-semibold text-white/90 truncate">
                {user?.name || "Strategist"}
              </div>
              <div className="text-magenta font-mono uppercase text-[9px] mt-1 tracking-wider px-2 py-0.5 bg-magenta/15 inline-block rounded-full">
                {user?.role === "admin"
                  ? isAr
                    ? "مدير نظام"
                    : "SUPER ADMIN"
                  : isAr
                    ? "محرر محتوى"
                    : "CONTENT EDITOR"}
              </div>
            </div>

            <nav className="w-full flex-1 space-y-1.5 overflow-y-auto">
              {visibleItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? "bg-magenta text-white font-bold"
                        : "text-parchment/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-xs">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/5 hover:text-red-300 w-full rounded-lg transition-all mt-auto pt-6 border-t border-white/5"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs font-bold">
                {isAr ? "تسجيل الخروج" : "Logout"}
              </span>
            </button>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 text-void p-4 md:p-8 min-h-screen w-full">
            <Outlet />
          </main>
        </div>
      </ConfirmDialogProvider>
    </ToastProvider>
  );
}
