import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Lock, ArrowRight, ShieldCheck, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import SEO from "../../components/common/SEO";

export default function CMSLogin() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect to dashboard immediately if token is already cached
  useEffect(() => {
    const token = localStorage.getItem("cms_token");
    if (token) {
      navigate("/cms");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("cms_token", data.token);
        localStorage.setItem("cms_user", JSON.stringify(data.user));
        navigate("/cms");
      } else {
        setError(
          data.error ||
            (isAr ? "بيانات الدخول غير صحيحة" : "Invalid credentials"),
        );
      }
    } catch (err) {
      setError(
        isAr
          ? "حدث خطأ أثناء الاتصال بالخادم."
          : "An error occurred while connecting to the server.",
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4">
      <SEO
        title={
          isAr
            ? "دخول بوابة القيادة - NORM CMS"
            : "Command Portal Login - NORM CMS"
        }
        description="NORM CMS Login Portal"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl"
        dir={isAr ? "rtl" : "ltr"}
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-magenta/10 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-magenta" />
          </div>
        </div>

        <h1 className="text-2xl font-serif text-white text-center mb-2 tracking-wide">
          {isAr ? "نظام إدارة المحتوى NORM" : "NORM CMS Authentication"}
        </h1>
        <p className="text-parchment/60 text-center text-sm mb-6">
          {isAr
            ? "بوابة آمنة لمديري النظام والمحررين."
            : "Secure portal for system administrators and editors."}
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-parchment/60 mb-2 block">
              {isAr ? "البريد الإلكتروني" : "Email Address"}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-parchment/5 border border-parchment/10 rounded-xl px-4 py-3 text-white focus:border-magenta focus:bg-parchment/10 focus:outline-none transition-all text-start"
              dir="ltr"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-parchment/60 mb-2 block">
              {isAr ? "كلمة المرور" : "Password"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-parchment/5 border border-parchment/10 rounded-xl px-4 py-3 text-white focus:border-magenta focus:bg-parchment/10 focus:outline-none transition-all text-start"
              dir="ltr"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full bg-magenta text-white py-4 rounded-xl flex items-center justify-center gap-3 text-xs uppercase tracking-widest font-bold glow-magenta hover:bg-magenta/90 transition-all disabled:opacity-50"
          >
            {isAuthenticating ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isAr ? "تسجيل الدخول" : "Authenticate"}
                <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
