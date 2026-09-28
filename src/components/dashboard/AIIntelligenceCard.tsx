import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Cpu, Activity, CheckCircle2 } from 'lucide-react';
import { useWater } from '../../context/WaterContext';

export const AIIntelligenceCard: React.FC = () => {
  const navigate = useNavigate();
  const { kpiStats, activeIncident, sensors } = useWater();

  const isLeakActive = activeIncident.status === 'active';
  const confidence = isLeakActive ? activeIncident.leakConfidence : 98; // 98% nominal confidence if healthy

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-linear-to-br from-slate-900 via-slate-900 to-blue-950 p-6 text-white shadow-md">
      {/* Decorative background grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#38bdf8 1px, #0f172a 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide uppercase text-cyan-300">
                AquaGuard Intelligence
              </h3>
              <p className="text-xs text-slate-400">Continuous telemetry & anomaly engine</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 px-3 py-1 text-xs font-medium text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>AI monitoring active</span>
          </div>
        </div>

        {/* Main metric row */}
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                {confidence}%
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                {isLeakActive ? 'Leak Risk Confidence' : 'System Efficiency Baseline'}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-300 max-w-md leading-relaxed">
              {isLeakActive ? (
                <span className="font-semibold text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0" />
                  1 abnormal consumption pattern detected in {activeIncident.location}.
                </span>
              ) : (
                <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  All 24 flow sensors operating within nominal limits.
                </span>
              )}
            </p>
          </div>

          <button
            onClick={() => navigate('/leak-detection')}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-sm hover:bg-cyan-400 active:scale-98 transition-all focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <span>View Analysis</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Small metadata indicators with typographic separators */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span>{sensors.length} sensors monitored</span>
          </div>
          <span className="text-slate-600">·</span>
          <div className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isLeakActive ? 'bg-rose-400' : 'bg-emerald-400'
              }`}
            />
            <span>{isLeakActive ? '1 anomaly detected' : '0 anomalies'}</span>
          </div>
          <span className="text-slate-600">·</span>
          <div className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-slate-500" />
            <span>{activeIncident.timeAgo} since last analysis</span>
          </div>
        </div>
      </div>
    </div>
  );
};
