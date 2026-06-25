import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import React, { useLayoutEffect } from "react";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import BackToTop from "./components/common/BackToTop";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import MethodologyPage from "./pages/public/MethodologyPage";
import ServicesPage from "./pages/public/ServicesPage";
import InvestmentPage from "./pages/public/InvestmentPage";
import StrategicRelationsPage from "./pages/public/StrategicRelationsPage";
import WorkWithNorm from "./pages/public/WorkWithNorm";
import InsightsPage from "./pages/public/InsightsPage";
import MethodologicalQA from "./pages/public/MethodologicalQA";
import ClientPortal from "./pages/public/ClientPortal";
import PrivacyPolicy from "./pages/public/PrivacyPolicy";
import TermsConditions from "./pages/public/TermsConditions";
import Disclaimer from "./pages/public/Disclaimer";
import HospitalityConsultant from "./pages/public/HospitalityConsultant";
import { useLanguage } from "./context/LanguageContext";

import GatewayPortal from "./pages/public/GatewayPortal";

// CMS Pages
import CMSLogin from "./pages/cms/CMSLogin";
import CMSRequestsHub from "./pages/cms/CMSRequestsHub";
import CMSInsights from "./pages/cms/CMSInsights";
import CMSInsightReaders from "./pages/cms/CMSInsightReaders";
import CMSContent from "./pages/cms/CMSContent";
import CMSSeoManagement from "./pages/cms/CMSSeoManagement";
import CMSAuditLogs from "./pages/cms/CMSAuditLogs";
import CMSUsers from "./pages/cms/CMSUsers";
import CMSLayout from "./components/cms/CMSLayout";
import CMSMedia from "./pages/cms/CMSMedia";
import ProtectedRoute from "./components/cms/ProtectedRoute";

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useLayoutEffect(() => {
    // Disable smooth scrolling temporarily to allow instant jump
    document.documentElement.style.setProperty("scroll-behavior", "auto", "important");
    
    // Jump instantly to top
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    
    // Fallback if behavior: instant is ignored by some browsers
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    
    // Re-enable smooth scrolling after the layout is painted
    const timeout = setTimeout(() => {
      document.documentElement.style.removeProperty("scroll-behavior");
    }, 50);

    return () => clearTimeout(timeout);
  }, [pathname]);
  
  return null;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}

export default function App() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <Router>
      <div className="relative" dir={isAr ? "rtl" : "ltr"}>
        <ScrollToTop />
        <Routes>
          {/* CMS Routes */}
          <Route path="/cms/login" element={<CMSLogin />} />
          <Route
            path="/cms"
            element={
              <ProtectedRoute>
                <CMSLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/cms/content" replace />} />
            <Route path="content" element={<CMSContent />} />
            <Route path="requests" element={<CMSRequestsHub />} />
            <Route path="insights" element={<CMSInsights />} />
            <Route path="insight-readers" element={<CMSInsightReaders />} />
            <Route path="seo" element={<CMSSeoManagement />} />
            <Route path="audit-logs" element={<CMSAuditLogs />} />
            <Route path="media" element={<CMSMedia />} />
            <Route path="users" element={<CMSUsers />} />
          </Route>

          {/* Gateway Portal */}
          <Route path="/" element={<GatewayPortal />} />

          {/* Public Routes */}
          <Route
            path="/norm/*"
            element={
              <PublicLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/methodology" element={<MethodologyPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/investment" element={<InvestmentPage />} />
                  <Route
                    path="/strategic-relations"
                    element={<StrategicRelationsPage />}
                  />
                  <Route path="/work-with-norm" element={<WorkWithNorm />} />
                  <Route path="/insights" element={<InsightsPage />} />
                  <Route path="/qa" element={<MethodologicalQA />} />
                  <Route path="/portal" element={<ClientPortal />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsConditions />} />
                  <Route path="/disclaimer" element={<Disclaimer />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route
                    path="/hospitality-consultant"
                    element={<HospitalityConsultant />}
                  />
                </Routes>
              </PublicLayout>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
