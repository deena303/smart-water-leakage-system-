import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { useWater } from '../../context/WaterContext';

export const Toast: React.FC = () => {
  const { toast, clearToast } = useWater();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-rose-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-cyan-600" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'critical':
        return 'border-rose-300 bg-white shadow-rose-100/50';
      case 'warning':
        return 'border-amber-300 bg-white shadow-amber-100/50';
      case 'success':
        return 'border-emerald-300 bg-white shadow-emerald-100/50';
      case 'info':
      default:
        return 'border-cyan-300 bg-white shadow-cyan-100/50';
    }
  };

  return (
    <div
      role="alert"
      className={`fixed bottom-5 right-5 z-50 flex max-w-md items-start gap-3 rounded-xl border p-4 shadow-xl transition-all duration-300 ${getBorderColor()}`}
    >
      <div className="shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1 pr-2">
        <h4 className="text-sm font-semibold text-slate-900">{toast.title}</h4>
        <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={clearToast}
        className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
