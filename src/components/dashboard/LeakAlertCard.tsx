import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, X, Gauge, ShieldAlert } from 'lucide-react';
import { useWater } from '../../context/WaterContext';
import { RiskBadge } from '../common/RiskBadge';

export const LeakAlertCard: React.FC = () => {
  const navigate = useNavigate();
  const { activeIncident, activeAlertBannerDismissed, dismissAlertBanner } = useWater();

  // If dismissed or resolved, do not show active banner
  if (activeAlertBannerDismissed || activeIncident.status !== 'active') {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-rose-200/90 bg-linear-to-r from-rose-50/90 via-red-50/40 to-white p-5 shadow-sm transition-all duration-200">
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
            <AlertTriangle className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Possible leak detected</h3>
              <RiskBadge level={activeIncident.riskLevel} />
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Location: <span className="font-semibold text-slate-900">{activeIncident.location}</span>
              <span className="mx-2 text-slate-400">·</span>
              Detected {activeIncident.timeAgo}
            </p>
          </div>
        </div>

        <button
          onClick={dismissAlertBanner}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-100/60 hover:text-slate-700 transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Message */}
      <p className="mt-3 text-xs text-slate-700 leading-relaxed font-medium">
        Continuous water flow was detected outside the expected usage pattern. Flow differential has persisted continuously without normal night-time decay.
      </p>

      {/* Telemetry Metrics Grid */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-lg border border-rose-100 bg-white/80 p-3 text-xs">
        <div>
          <span className="text-[11px] font-medium text-slate-500">Expected flow</span>
          <p className="text-base font-bold text-slate-900">{activeIncident.expectedFlow} L/min</p>
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-500">Current flow</span>
          <p className="text-base font-extrabold text-rose-600">{activeIncident.currentFlow} L/min</p>
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-500">Difference</span>
          <p className="text-base font-bold text-rose-600">+{activeIncident.anomalyPercentage}%</p>
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-500">Leak confidence</span>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-extrabold text-slate-900">{activeIncident.leakConfidence}%</span>
            <span className="h-2 w-2 rounded-full bg-rose-500" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={dismissAlertBanner}
          className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Dismiss
        </button>
        <button
          type="button"
          onClick={() => navigate('/leak-detection')}
          className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 active:scale-98 transition-all focus-visible:outline-2 focus-visible:outline-rose-600"
        >
          <span>Investigate Leak</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
