import React, { useState } from 'react';
import {
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { useWater } from '../../context/WaterContext';

export const DemoControls: React.FC = () => {
  const { simulateLeak, simulateHighConsumption, simulateNormalReading, resetDemo } = useWater();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-200/90 bg-linear-to-r from-sky-50/90 via-cyan-50/50 to-white p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600 text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-950">
                Demo & Simulation Lab
              </h3>
              <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-semibold text-cyan-800">
                Competition Mode
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Simulate sensor readings and verify distinction between High Consumption, Anomaly, and Leaks.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <span>{isExpanded ? 'Hide Controls' : 'Simulation Controls'}</span>
          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3.5 pt-3 border-t border-cyan-100/80 flex flex-wrap items-center gap-2.5">
          {/* Button 1: Normal */}
          <button
            type="button"
            onClick={simulateNormalReading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-800 shadow-2xs hover:bg-emerald-50 active:scale-98 transition-all focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span>Simulate Normal Reading</span>
          </button>

          {/* Button 2: High Consumption (Non-leak) */}
          <button
            type="button"
            onClick={() => simulateHighConsumption('unit-308')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-sky-300 bg-white px-3 py-2 text-xs font-semibold text-sky-800 shadow-2xs hover:bg-sky-50 active:scale-98 transition-all focus-visible:outline-2 focus-visible:outline-sky-600"
            title="High volume usage without leak characteristics"
          >
            <TrendingUp className="h-3.5 w-3.5 text-sky-600" />
            <span>Simulate High Consumption</span>
          </button>

          {/* Button 3: Leak (Continuous nocturnal anomaly) */}
          <button
            type="button"
            onClick={() => simulateLeak('unit-204')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 active:scale-98 transition-all focus-visible:outline-2 focus-visible:outline-rose-600"
            title="Continuous nocturnal flow anomaly (+300% variance)"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Simulate Leak</span>
          </button>

          {/* Button 4: Reset */}
          <button
            type="button"
            onClick={resetDemo}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 active:scale-98 transition-all"
            title="Restore baseline demonstration state"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
            <span>Reset Demo</span>
          </button>

          <div className="ml-auto hidden xl:flex items-center gap-2 text-[11px] text-slate-500">
            <span className="inline-block h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
            <span>High Consumption ≠ Leak distinction verified</span>
          </div>
        </div>
      )}
    </div>
  );
};
