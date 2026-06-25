import React, { createContext, useContext, useState, ReactNode } from "react";
import { useLanguage } from "./LanguageContext";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

interface ConfirmDialogContextType {
  showConfirm: (
    options: ConfirmOptions,
    onConfirm: () => void | Promise<void>,
  ) => void;
}

const ConfirmDialogContext = createContext<
  ConfirmDialogContextType | undefined
>(undefined);

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [onConfirmCallback, setOnConfirmCallback] = useState<
    (() => void | Promise<void>) | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { language } = useLanguage();
  const isAr = language === "ar";

  const showConfirm = (
    opts: ConfirmOptions,
    onConfirm: () => void | Promise<void>,
  ) => {
    setOptions(opts);
    setOnConfirmCallback(() => onConfirm);
    setIsOpen(true);
    setIsProcessing(false);
  };

  const handleClose = () => {
    if (isProcessing) return;
    setIsOpen(false);
    // Add a small delay to clear the callback to avoid weird re-renders during fade out
    setTimeout(() => {
      setOptions(null);
      setOnConfirmCallback(null);
    }, 300);
  };

  const handleConfirm = async () => {
    if (onConfirmCallback) {
      setIsProcessing(true);
      try {
        await onConfirmCallback();
      } finally {
        setIsProcessing(false);
        setIsOpen(false);
      }
    }
  };

  return (
    <ConfirmDialogContext.Provider value={{ showConfirm }}>
      {children}
      {isOpen && options && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm animate-in fade-in duration-200"
          dir={isAr ? "rtl" : "ltr"}
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className={`absolute top-6 ${isAr ? "left-6" : "right-6"} p-2 text-gray-400 hover:text-void rounded-full transition-colors disabled:opacity-50`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mb-8">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${options.isDestructive !== false ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"}`}
              >
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-serif text-void mb-3">
                {options.title || (isAr ? "تأكيد الإجراء" : "Confirm Action")}
              </h2>
              <p className="text-ink/70 leading-relaxed">{options.message}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className={`w-full sm:flex-1 py-3.5 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 ${
                  options.isDestructive !== false
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                {isProcessing ? (
                  <span className="animate-pulse">
                    {isAr ? "جاري التنفيذ..." : "Processing..."}
                  </span>
                ) : (
                  options.confirmLabel || (isAr ? "تأكيد" : "Confirm")
                )}
              </button>
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="w-full sm:flex-1 py-3.5 bg-sand text-ink rounded-xl font-bold hover:bg-ink/5 transition-colors text-center disabled:opacity-50"
              >
                {options.cancelLabel || (isAr ? "إلغاء الأمر" : "Cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmDialogContext);
  if (context === undefined) {
    throw new Error("useConfirm must be used within a ConfirmDialogProvider");
  }
  return context;
}
