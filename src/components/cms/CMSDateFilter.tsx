import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Calendar, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

type Preset = "all" | "today" | "week" | "month" | "custom";

interface CMSDateFilterProps {
  onFilterChange: (range: DateRange) => void;
}

export default function CMSDateFilter({ onFilterChange }: CMSDateFilterProps) {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const [isOpen, setIsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<Preset>("all");

  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const presets = [
    { id: "all", en: "All Time", ar: "كل الوقت" },
    { id: "today", en: "Today", ar: "اليوم" },
    { id: "week", en: "Last 7 Days", ar: "آخر 7 أيام" },
    { id: "month", en: "Last 30 Days", ar: "آخر 30 يوم" },
    { id: "custom", en: "Custom Range...", ar: "تخصيص الفترة..." },
  ];

  const applyPreset = (preset: Preset) => {
    setActivePreset(preset);

    if (preset === "custom") {
      // Don't close, wait for user to enter dates
      return;
    }

    setIsOpen(false);

    const now = new Date();
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    let startDate: Date | null = null;
    let endDate: Date | null = endOfDay;

    if (preset === "all") {
      startDate = null;
      endDate = null;
    } else if (preset === "today") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (preset === "week") {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 7,
      );
    } else if (preset === "month") {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 30,
      );
    }

    onFilterChange({ startDate, endDate });
  };

  const applyCustom = () => {
    if (!customStart || !customEnd) return;

    const start = new Date(customStart);
    const end = new Date(customEnd);
    end.setHours(23, 59, 59, 999);

    if (start > end) {
      alert(
        isAr
          ? "تاريخ البداية يجب أن يكون قبل تاريخ النهاية"
          : "Start date must be before end date",
      );
      return;
    }

    setActivePreset("custom");
    setIsOpen(false);
    onFilterChange({ startDate: start, endDate: end });
  };

  const currentLabel = isAr
    ? presets.find((p) => p.id === activePreset)?.ar
    : presets.find((p) => p.id === activePreset)?.en;

  return (
    <div className="relative" dir={isAr ? "rtl" : "ltr"}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-void hover:border-magenta hover:bg-magenta/5 transition-colors focus:outline-none focus:ring-2 focus:ring-magenta focus:ring-offset-1"
      >
        <Calendar className="w-4 h-4 text-magenta" />
        <span>{currentLabel}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute z-50 top-full mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl p-2 ${isAr ? "right-0 origin-top-right" : "left-0 origin-top-left"}`}
            >
              <div className="flex flex-col gap-1">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p.id as Preset)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      activePreset === p.id
                        ? "bg-magenta/5 text-magenta"
                        : "text-gray-600 hover:bg-gray-50 hover:text-void"
                    }`}
                  >
                    <span>{isAr ? p.ar : p.en}</span>
                    {activePreset === p.id && p.id !== "custom" && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                ))}

                <AnimatePresence>
                  {activePreset === "custom" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 mt-2 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
                        <div>
                          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">
                            {isAr ? "من" : "From"}
                          </label>
                          <input
                            type="date"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className="w-full text-xs p-2 border border-gray-200 rounded-lg outline-none focus:border-magenta"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">
                            {isAr ? "إلى" : "To"}
                          </label>
                          <input
                            type="date"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className="w-full text-xs p-2 border border-gray-200 rounded-lg outline-none focus:border-magenta"
                          />
                        </div>
                        <button
                          onClick={applyCustom}
                          disabled={!customStart || !customEnd}
                          className="w-full py-2 bg-void text-white rounded-lg text-xs font-bold hover:bg-magenta transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isAr ? "تطبيق" : "Apply"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
