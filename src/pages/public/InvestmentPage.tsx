import React from "react";
import { motion } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import SEO from "../../components/common/SEO";
import { slideUp, staggerContainer } from "../../lib/animations";


const CHART_DATA = [
  // Section 0: Regulatory Alignment (Required Effort)
  [
    { name: "Entity", value: 40 },
    { name: "MISA", value: 85 },
    { name: "Local", value: 65 },
    { name: "Legal", value: 50 },
  ],
  // Section 1: Governance Balance (Authority Weight)
  [
    { name: "Strategic", value: 95 },
    { name: "Financial", value: 75 },
    { name: "Operational", value: 40 },
    { name: "Compliance", value: 85 },
    { name: "Governance", value: 90 },
  ],
  // Section 2: Establishment Risk Management (Exposure vs Mitigation)
  [
    { stage: "P1", exposure: 95, mitigation: 5 },
    { stage: "P2", exposure: 70, mitigation: 45 },
    { stage: "P3", exposure: 35, mitigation: 80 },
    { stage: "P4", exposure: 10, mitigation: 98 },
  ],
];

/* ── Chart 0: Luxury Bar Chart ─────────────────────────────────────── */
const BarChartLuxury = ({ data }: { data: { name: string; value: number }[] }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="mt-10 w-full">
      <div className="flex items-end justify-around gap-2 h-40 lg:h-52 border-b border-void/10 pb-0">
        {data.map((item, i) => (
          <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              whileInView={{ scaleY: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: `${(item.value / max) * 100}%`,
                originY: 1,
              }}
              className="w-full max-w-[60px] mx-auto bg-gradient-to-t from-magenta to-magenta/40 rounded-t-lg group-hover:from-magenta/80 transition-all duration-300"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-around mt-4">
        {data.map((item, i) => (
          <span key={i} className="micro-label text-magenta/50 flex-1 text-center px-1 break-words leading-tight">
            {item.name}
          </span>
        ))}
      </div>
      <p className="micro-label text-center mt-6 text-void/20">Regulatory Complexity Level</p>
    </div>
  );
};

/* ── Chart 1: Luxury Pentagon Radar (SVG-native) ─────────────────── */
const RadarChartLuxury = ({ data }: { data: { name: string; value: number }[] }) => {
  const cx = 100;
  const cy = 100;
  const r = 70;
  const n = data.length;
  // Pentagon vertex coordinates
  const pts = data.map((_, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  const gridPoints = pts.map((p) => `${p.x},${p.y}`).join(" ");
  // Data polygon
  const dataPts = data.map((d, i) => {
    const ratio = d.value / 100;
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return `${cx + r * ratio * Math.cos(angle)},${cy + r * ratio * Math.sin(angle)}`;
  });
  return (
    <div className="mt-10 flex flex-col items-center w-full">
      <svg viewBox="0 0 200 200" className="w-40 h-40 lg:scale-[1.6] transition-transform duration-700 origin-center">
        {/* Grid polygon */}
        <polygon points={gridPoints} fill="none" stroke="currentColor" strokeOpacity={0.06} strokeWidth={1} className="text-void" />
        {/* Inner grid lines */}
        {pts.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="currentColor" strokeOpacity={0.05} strokeWidth={0.8} className="text-void" />
        ))}
        {/* Data area */}
        <motion.polygon
          points={dataPts.join(" ")}
          fill="var(--color-magenta)"
          fillOpacity={0.15}
          stroke="var(--color-magenta)"
          strokeWidth={1.5}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Vertex dots */}
        {pts.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={2.5}
            fill="var(--color-magenta)"
            fillOpacity={0.4}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 + i * 0.05 }}
            style={{ transformOrigin: `${p.x}px ${p.y}px` }}
          />
        ))}
        {/* Labels */}
        {data.map((d, i) => {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          const lx = cx + (r + 14) * Math.cos(angle);
          const ly = cy + (r + 14) * Math.sin(angle);
          return (
            <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
              fontSize={7} fill="currentColor" fillOpacity={0.4} className="text-void">
              {d.name}
            </text>
          );
        })}
      </svg>
      <p className="micro-label text-center mt-2 text-void/20">Sovereign Authority Weight</p>
    </div>
  );
};

/* ── Chart 2: Luxury Dual-Line SVG Chart ─────────────────────────── */
const AreaChartLuxury = ({ data }: { data: { stage: string; exposure: number; mitigation: number }[] }) => {
  const w = 400;
  const h = 200;
  const padX = 20;
  const padY = 20;
  const xStep = (w - padX * 2) / (data.length - 1);
  const toY = (v: number) => padY + (h - padY * 2) * (1 - v / 100);

  // Smooth curve generation using bezier control points
  const generateCurve = (points: {x: number, y: number}[]) => {
    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      path += ` C ${cx},${p0.y} ${cx},${p1.y} ${p1.x},${p1.y}`;
    }
    return path;
  };

  const exposurePts = data.map((d, i) => ({ x: padX + i * xStep, y: toY(d.exposure) }));
  const mitigationPts = data.map((d, i) => ({ x: padX + i * xStep, y: toY(d.mitigation) }));
  
  const mitigationCurve = generateCurve(mitigationPts);
  const mitigationArea = `${mitigationCurve} L ${w - padX},${h - padY} L ${padX},${h - padY} Z`;

  return (
    <div className="mt-10 w-full flex flex-col items-center">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full lg:w-[85%] origin-center transition-transform duration-700">
        <defs>
          <linearGradient id="magenta-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-magenta)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-magenta)" stopOpacity={0} />
          </linearGradient>
        </defs>
        
        {/* Mitigation Area Fill */}
        <motion.path
          d={mitigationArea}
          fill="url(#magenta-fade)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />
        
        {/* Mitigation Curve Line */}
        <motion.path
          d={mitigationCurve}
          fill="none"
          stroke="var(--color-magenta)"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
        
        {/* Exposure Curve Line (Dashed / Subtle) */}
        <motion.path
          d={generateCurve(exposurePts)}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.15}
          strokeWidth={1.5}
          strokeDasharray="4 4"
          strokeLinecap="round"
          className="text-void"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
        
        {/* Mitigation Data Dots */}
        {mitigationPts.map((p, i) => (
          <motion.circle
            key={`m-${i}`}
            cx={p.x}
            cy={p.y}
            r={4}
            fill="var(--color-parchment)"
            stroke="var(--color-magenta)"
            strokeWidth={2}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 + i * 0.1 }}
          />
        ))}
      </svg>
      <div className="flex items-center gap-6 justify-center mt-6 lg:mt-12">
        <span className="flex items-center gap-2 micro-label text-void/30">
          <span className="w-4 h-px border-t border-dashed border-void/30 inline-block" />Exposure
        </span>
        <span className="flex items-center gap-2 micro-label text-magenta/50">
          <span className="w-4 h-1 bg-magenta/50 rounded-full inline-block" />Mitigation
        </span>
      </div>
      <p className="micro-label text-center mt-3 text-void/20">Risk vs Mitigation Trend</p>
    </div>
  );
};

/* ── SectionChart Router ─────────────────────────────────────────── */
const SectionChart = ({ idx }: { idx: number }) => {
  if (idx === 0) return <BarChartLuxury data={CHART_DATA[0] as { name: string; value: number }[]} />;
  if (idx === 1) return <RadarChartLuxury data={CHART_DATA[1] as { name: string; value: number }[]} />;
  if (idx === 2) return <AreaChartLuxury data={CHART_DATA[2] as { stage: string; exposure: number; mitigation: number }[]} />;
  return null;
};

export default function InvestmentPage() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const content = t.investmentPage;

  return (
    <div className="bg-parchment min-h-screen" dir={isAr ? "rtl" : "ltr"}>
      <SEO
        title={isAr ? "ØªØ£Ø³ÙŠØ³ Ø§Ù„Ø§Ø³ØªØ«Ù…Ø§Ø±Ø§Øª" : "Investment Setup"}
        description={content.hero.intro}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 md:pt-40 lg:pt-48 pb-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="container-wide"
        >
          <div className="max-w-4xl">
            <motion.span
              variants={slideUp}
              className="micro-label mb-8 block"
            >
              {content.hero.eyebrow}
            </motion.span>
            <motion.h1
              variants={slideUp}
              className="heading-xl mb-12"
            >
              {content.hero.title}
            </motion.h1>
            <motion.p
              variants={slideUp}
              className="body-lg"
            >
              {content.hero.intro}
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Main Content Sections */}
      <section className="pb-32">
        <div className="container-wide space-y-24 lg:space-y-32">
          {content.sections.map((section: any, idx: number) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <div className="w-full h-px bg-gradient-to-r from-transparent via-magenta/10 to-transparent" />
              )}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-10%" }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full"
              >
                {/* Column 1: Content (Title, Desc, Checklist) */}
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <span className="text-4xl font-serif text-magenta/20">
                      0{idx + 1}
                    </span>
                    <div className="h-[1px] flex-grow bg-magenta/10" />
                  </div>
                  <h2 className="heading-lg">
                    {section.title}
                  </h2>
                  <p className="body-lg">
                    {section.desc}
                  </p>
                  
                  <ul className="space-y-6 pt-4">
                    {section.points.map((point: string, pIdx: number) => (
                      <motion.li
                        key={pIdx}
                        initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: pIdx * 0.1 }}
                        className="flex items-start gap-4 group"
                      >
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-magenta flex-shrink-0" />
                        <span className="body-md text-ink">
                          {point}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: Visual (Chart) */}
                <div className="hidden lg:flex lg:flex-col lg:justify-center lg:items-center h-full relative min-h-[300px] w-full lg:pt-24">
                  <SectionChart idx={idx} />
                </div>
              </motion.div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Statement & CTA */}
      <section className="py-16 md:py-20 bg-void/5">
        <div className="container-wide text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <p className="heading-md text-void/90 mb-16 max-w-4xl mx-auto">
              {content.finalStatement}
            </p>

            <div className="space-y-12">
              <h3 className="heading-sm text-magenta">
                {content.cta.title}
              </h3>
              <Link
                to="/norm/contact"
                className="inline-flex items-center gap-6 px-12 py-5 border-2 border-magenta text-magenta rounded-full btn-text hover:bg-magenta hover:text-parchment transition-all duration-500 group"
              >
                {content.cta.button}
                <ArrowRight
                  className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""}`}
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
