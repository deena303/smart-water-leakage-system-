import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../../types';
import { AlertSeverityBadge } from '../common/RiskBadge';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock,
  ArrowRight,
  Check,
  EyeOff,
  User
} from 'lucide-react';
import { useWater } from '../../context/WaterContext';

interface AlertCardProps {
  alert: Alert;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  const navigate = useNavigate();
  const { markAlertResolved, dismissAlert } = useWater();

  const getSeverityIcon = () => {
    switch (alert.severity) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-rose-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-sky-600" />;
      case 'resolved':
      default:
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
    }
  };

  const getBorderColor = () => {
    switch (alert.severity) {
      case 'critical':
        return 'border-rose-200 bg-rose-50/25';
      case 'warning':
        return 'border-amber-200 bg-amber-50/25';
      case 'info':
        return 'border-sky-200 bg-sky-50/25';
      case 'resolved':
      default:
        return 'border-slate-200 bg-white opacity-85';
    }
  };

  const isResolved = alert.status === 'resolved';

  return (
    <div
      className={`rounded-xl border p-5 transition-all duration-200 hover:shadow-sm ${getBorderColor()}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">{getSeverityIcon()}</div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">{alert.title}</h4>
              <AlertSeverityBadge severity={alert.severity} />
            </div>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-xl">
              {alert.description}
            </p>
          </div>
        </div>

        {alert.percentageAboveBaseline > 0 && (
          <div className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-right shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Variance</span>
            <span className="text-xs font-black text-rose-600">
              +{alert.percentageAboveBaseline}% anomaly
            </span>
          </div>
        )}
      </div>

      {/* Telemetry row */}
      <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white/80 rounded-lg p-2.5 border border-slate-200/60">
        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Person / Unit</span>
          <p className="font-extrabold text-slate-900">{alert.personOrUnit}</p>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Location</span>
          <p className="font-medium text-slate-700 truncate">{alert.location}</p>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Current vs Normal</span>
          <p className="font-bold text-slate-900">
            {alert.currentUsage} L <span className="text-slate-400 font-normal">vs {alert.normalUsage} L</span>
          </p>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Status</span>
          <p className={`font-extrabold uppercase text-[11px] ${isResolved ? 'text-emerald-700' : 'text-rose-700'}`}>
            {alert.status}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-3 text-xs">
        <div className="flex items-center gap-2 text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-slate-400" />
            Detected {alert.detectedAt}
          </span>
          {alert.resolvedAt && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-semibold">Resolved {alert.resolvedAt}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isResolved && (
            <>
              <button
                type="button"
                onClick={() => dismissAlert(alert.id)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors inline-flex items-center gap-1 shadow-2xs"
                title="Dismiss from active queue"
              >
                <EyeOff className="h-3.5 w-3.5" />
                <span>Dismiss</span>
              </button>

              <button
                type="button"
                onClick={() => markAlertResolved(alert.id)}
                className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors inline-flex items-center gap-1 shadow-2xs"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Resolve</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => navigate('/leak-detection')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors"
          >
            <span>Investigate</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
