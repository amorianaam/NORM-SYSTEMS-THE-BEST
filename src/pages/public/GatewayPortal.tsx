import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Globe as GlobeIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations, Language } from '../../i18n/translations';
import SEO from '../../components/common/SEO';
import './gateway.css';

const Globe = () => (
  <svg className="globe-svg" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" fill="none">
    <defs>
      <radialGradient id="gGlobe" cx="42%" cy="38%" r="60%">
        <stop offset="0%" stopColor="#C084E8" stopOpacity="0.22" />
        <stop offset="60%" stopColor="#7B3FA0" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#4A1F6B" stopOpacity="0.06" />
      </radialGradient>
      <clipPath id="cCircle">
        <circle cx="300" cy="300" r="285" />
      </clipPath>
    </defs>
    <circle cx="300" cy="300" r="285" fill="url(#gGlobe)" />
    <circle cx="300" cy="300" r="285" stroke="rgba(192,132,232,0.18)" strokeWidth="1.5" />
    <g clipPath="url(#cCircle)" stroke="rgba(192,132,232,0.22)" strokeWidth="1.2">
      {[180, 220, 260, 300, 340, 380, 420].map((e) => (
        <line x1="15" y1={e} x2="585" y2={e} key={`line-${e}`} />
      ))}
      {[-240, -180, -120, -60, 0, 60, 120, 180, 240].map((e, t) => (
        <ellipse cx="300" cy="300" rx={Math.abs(e) || 10} ry="285" stroke="rgba(192,132,232,0.22)" strokeWidth="1.2" fill="none" key={`ellipse-${t}`} />
      ))}
    </g>
    <g clipPath="url(#cCircle)" fill="rgba(155,95,192,0.1)" stroke="rgba(192,132,232,0.25)" strokeWidth="1">
      <rect x="220" y="110" width="70" height="70" rx="12" />
      <rect x="310" y="110" width="70" height="70" rx="12" />
      <rect x="130" y="200" width="70" height="70" rx="12" />
      <rect x="220" y="200" width="70" height="70" rx="12" />
      <rect x="310" y="200" width="70" height="70" rx="12" />
      <rect x="400" y="200" width="70" height="70" rx="12" />
      <rect x="80" y="290" width="70" height="70" rx="12" />
      <rect x="170" y="290" width="70" height="70" rx="12" />
      <rect x="260" y="290" width="70" height="70" rx="12" />
      <rect x="350" y="290" width="70" height="70" rx="12" />
      <rect x="440" y="290" width="70" height="70" rx="12" />
      <rect x="530" y="290" width="70" height="70" rx="12" />
      <rect x="130" y="380" width="70" height="70" rx="12" />
      <rect x="220" y="380" width="70" height="70" rx="12" />
      <rect x="310" y="380" width="70" height="70" rx="12" />
      <rect x="400" y="380" width="70" height="70" rx="12" />
      <rect x="220" y="470" width="70" height="70" rx="12" />
      <rect x="310" y="470" width="70" height="70" rx="12" />
    </g>
  </svg>
);

const Particles = () => (
  <>
    {Array.from({ length: 18 }).map((_, t) => {
      let n = 3 * Math.random() + 1.5,
        r = 100 * Math.random(),
        l = 8 * Math.random(),
        a = 6 + 6 * Math.random();
      return (
        <div
          className="particle"
          style={{
            width: n,
            height: n,
            left: `${r}%`,
            bottom: `${40 * Math.random()}%`,
            animationDelay: `${l}s`,
            animationDuration: `${a}s`
          }}
          key={t}
        />
      );
    })}
  </>
);

const GatewayPortal = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const isAr = language === 'ar';
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<any>({});
  const [cacheBuster, setCacheBuster] = useState(Date.now());

  useEffect(() => {
    fetch('/api/settings/tourism-media')
      .then(res => {
        if (!res.ok) throw new Error('API route not found');
        return res.json();
      })
      .then(data => {
        setSettings(data);
        setCacheBuster(Date.now());
      })
      .catch(console.error);

    const handleMouseMove = (e: MouseEvent) => {
      const globeContainer = document.querySelector(".globe-container") as HTMLElement;
      if (!globeContainer) return;
      const n = (e.clientX / window.innerWidth - 0.5) * 18;
      const r = (e.clientY / window.innerHeight - 0.5) * 10;
      globeContainer.style.transform = `translateX(calc(-50% + ${n}px)) translateY(${r}px)`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="gateway-portal-root">
      <SEO 
        title={isAr ? "Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©" : "Gateway Portal"} 
        description={isAr ? "Ù†Ø¸Ø§Ù… Ù†ÙˆØ±Ù… Ø§Ù„Ø§Ø³ØªØ´Ø§Ø±ÙŠ - Ø§Ø®ØªØ± Ù‚Ø·Ø§Ø¹ Ø§Ù„Ø£Ø¹Ù…Ø§Ù„ Ù„Ù„Ù…ØªØ§Ø¨Ø¹Ø©" : "NORM Consulting System - Select a business sector to continue"} 
      />
      <div className="page-wrapper" ref={wrapperRef}>
      <div className="noise" />
      <Particles />
      <div className="globe-container">
        <Globe />
      </div>

      {/* Language Switcher */}
      <button
        onClick={toggleLanguage}
        className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50 flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/15 backdrop-blur-md rounded-full text-white transition-all border border-white/10 shadow-lg cursor-pointer"
      >
        <GlobeIcon size={18} className="opacity-90" />
        <span className="btn-text">{isAr ? 'EN' : 'AR'}</span>
      </button>

      <div className="content-stack w-full px-4">
        {/* Main top text replacing logo */}
        {/* Main top text replacing logo */}
          <div className="fade-up relative translate-y-2 z-10 w-full max-w-lg mx-auto px-4">
            <div className="text-center flex justify-center">
              <img 
                src={`${settings.gateway_logo_path || "/logo-gate.png"}?v=${cacheBuster}`} 
                alt="NORM SYSTEMS" 
                className="w-full max-w-[280px] sm:max-w-[400px] h-auto drop-shadow-lg object-contain"
              />
            </div>
          </div>
        


        {/* Horizontal Responsive Logos */}
        <div className="fade-up w-full max-w-lg sm:max-w-4xl mx-auto flex flex-row gap-4 sm:gap-8 justify-center items-stretch mt-6 px-2">
          
          {/* Engineering Link */}
          <Link to="/norm" className="group flex flex-1 flex-col items-center gap-4 sm:gap-5 cursor-pointer transition-all duration-300 hover:-translate-y-2 no-underline">
            <div className="bg-white p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] w-full max-w-[130px] aspect-square sm:max-w-none sm:w-44 sm:h-44 flex justify-center items-center shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all duration-300 group-hover:shadow-[0_8px_40px_rgba(192,132,232,0.5)] group-hover:scale-105 mx-auto">
              <img src={`/logo.png?v=${cacheBuster}`} alt="Decision Engineering House" className="w-10/12 h-10/12 max-w-full max-h-full object-contain drop-shadow-sm" />
            </div>
            <div className="text-center transition-colors duration-300 group-hover:text-[#c084e8] px-1 w-full max-w-[150px] sm:max-w-none mx-auto">
              <h2 className="text-sm sm:text-lg md:text-xl font-bold text-white leading-tight">
                {/* @ts-ignore */}
                {t.gatewayPage?.engineeringTitle || 'Decision Engineering House'}
              </h2>
            </div>
          </Link>

          {/* Tourism Link */}
          <Link to="/norm/hospitality-consultant" className="group flex flex-1 flex-col items-center gap-4 sm:gap-5 cursor-pointer transition-all duration-300 hover:-translate-y-2 no-underline">
            <div className="bg-white p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] w-full max-w-[130px] aspect-square sm:max-w-none sm:w-44 sm:h-44 flex justify-center items-center shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all duration-300 group-hover:shadow-[0_8px_40px_rgba(192,132,232,0.5)] group-hover:scale-105 mx-auto">
              <img src={`${settings.tourism_logo_path || "/Tourism & Hospitality Sector Consulting.png"}?v=${cacheBuster}`} alt="Tourism & Hospitality Consulting" className="w-10/12 h-10/12 max-w-full max-h-full object-contain drop-shadow-sm" />
            </div>
            <div className="text-center transition-colors duration-300 group-hover:text-[#c084e8] px-1 w-full max-w-[150px] sm:max-w-none mx-auto">
              <h2 className="text-sm sm:text-lg md:text-xl font-bold text-white leading-tight">
                {/* @ts-ignore */}
                {t.gatewayPage?.tourismTitle || 'Tourism & Hospitality Consulting'}
              </h2>
            </div>
          </Link>

        </div>

        <div className="fade-up heading-sm text-[#9ca3af] mt-6 text-center">
          {/* @ts-ignore */}
          {t.gatewayPage?.bottomPrompt || (isAr ? 'Ø§Ø®ØªØ± Ù‚Ø·Ø§Ø¹ Ø§Ù„Ø£Ø¹Ù…Ø§Ù„ Ù„Ù„Ù…ØªØ§Ø¨Ø¹Ø©' : 'Select a business sector to continue')}
        </div>
      </div>
    </div>
    </div>
  );
};

export default GatewayPortal;
