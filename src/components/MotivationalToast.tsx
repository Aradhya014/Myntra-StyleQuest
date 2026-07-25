import React, { useEffect } from "react";
import { Sparkles, CheckCircle2, AlertCircle, UserPlus, X } from "lucide-react";

export interface ToastData {
  id: string;
  message: string;
  countText?: string;
  type?: "info" | "success" | "warning";
}

interface MotivationalToastProps {
  toast: ToastData | null;
  onClose: () => void;
}

export default function MotivationalToast({ toast, onClose }: MotivationalToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />;
      default:
        return <Sparkles className="h-5 w-5 text-myntra-pink shrink-0 animate-pulse" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up max-w-md w-full px-4 pointer-events-none">
      <div className="glass-panel p-4 rounded-2xl shadow-2xl border border-white/80 bg-white/90 backdrop-blur-md flex items-center justify-between space-x-3 pointer-events-auto shadow-[0_16px_36px_rgba(255,63,108,0.18)]">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-pink-50 rounded-xl border border-pink-100/80 shadow-xs">
            {getIcon()}
          </div>
          <div className="space-y-0.5">
            {toast.countText && (
              <span className="bg-gradient-myntra text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {toast.countText}
              </span>
            )}
            <p className="text-xs font-bold text-gray-800 leading-tight">
              {toast.message}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
