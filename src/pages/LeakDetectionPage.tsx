import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Droplet,
  Radio,
  RotateCcw,
  Sparkles,
  Info,
  Check,
  Building,
  ChevronRight,
  Waves
} from 'lucide-react';
import { useWater } from '../context/WaterContext';
import { RiskBadge } from '../components/common/RiskBadge';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceArea
} from 'recharts';

export const LeakDetectionPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeIncident,
    resolveActiveIncident,
    setSelectedSensor,
    sensors,
    alerts,
    leakTimelineData,
    simulateLeak,
    kpiStats,
    currentProperty
  } = useWater();

  const isResolved = activeIncident.status === 'resolved';
  const targetSensor = sensors.find((s) => s.id === activeIncident.sensorId) || sensors[0];

  // Secondary active alert if present
  const secondaryAlert = alerts.find(
    (a) => a.status === 'active' && a.id !== 'alt-01' && a.id !== 'alt-apt-01' && a.id !== 'alt-home-01' && (a.severity === 'warning' || a.severity === 'critical')
  );

  const [selectedIncidentKey, setSelectedIncidentKey] = useState<'primary' | 'secondary'>('primary');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Leak Detection
            </h2>
            <RiskBadge level={isResolved ? 'Normal' : activeIncident.riskLevel} size="lg" />
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Find abnormal flow patterns and investigate potential water loss across {currentProperty.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isResolved ? (
            <button
              onClick={() => simulateLeak('unit-204')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
              <span>Simulate New Leak</span>
            </button>
          ) : (
            <button
              onClick={resolveActiveIncident}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-98 transition-all focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              <Check className="h-4 w-4" />
              <span>Mark as Resolved</span>
            </button>
          )}
        </div>
      </div>

      {/* RISK OVERVIEW (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Active Possible Leaks
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {isResolved ? 2 : 3}
          </p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            {isResolved ? '1 Warning' : '1 Critical · 2 Warning'}
          </span>
        </div>

        <div className="rounded-xl border border-rose-200/80 bg-rose-50/20 p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
            Critical
          </span>
          <p className="text-2xl font-black text-rose-600 mt-1">
            {isResolved ? 0 : 1}
          </p>
          <span className="text-[11px] text-rose-700 mt-0.5 block">
            {isResolved ? 'No active critical leaks' : 'Room 204 continuous flow'}
          </span>
        </div>

        <div className="rounded-xl border border-amber-200/80 bg-amber-50/20 p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            Warning
          </span>
          <p className="text-2xl font-black text-amber-600 mt-1">2</p>
          <span className="text-[11px] text-amber-700 mt-0.5 block">Garden & sub-manifold lines</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Estimated Water Loss
          </span>
          <p className="text-2xl font-black text-rose-600 mt-1">
            {isResolved ? '48 L' : '126 L'}
          </p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Across active leak anomalies</span>
        </div>
      </div>

      {/* LEAK INCIDENTS CARDS */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900">Active Leak Incidents</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PRIMARY ACTIVE INCIDENT */}
          <div
            onClick={() => setSelectedIncidentKey('primary')}
            className={`cursor-pointer rounded-xl border p-5 transition-all shadow-xs ${
              selectedIncidentKey === 'primary'
                ? 'border-rose-400 ring-2 ring-rose-500/20 bg-white'
                : 'border-rose-200 bg-rose-50/20 hover:bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 uppercase">
                    {isResolved ? 'Resolved' : activeIncident.riskLevel}
                  </span>
                  <h4 className="text-base font-black text-slate-900">
                    {activeIncident.location}
                  </h4>
                </div>
                <p className="text-xs text-slate-500 mt-1">Detected: {activeIncident.timeAgo} · Sensor {activeIncident.sensorId}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Confidence</span>
                <span className="text-lg font-black text-rose-600">
                  {isResolved ? '0%' : `${activeIncident.leakConfidence}%`}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 rounded-lg p-2.5 border border-slate-200/70">
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Expected</span>
                <p className="font-bold text-slate-800">{activeIncident.expectedFlow} L/min</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Current</span>
                <p className="font-black text-rose-600">{activeIncident.currentFlow} L/min</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Excess</span>
                <p className="font-black text-rose-600">+{activeIncident.anomalyPercentage}%</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Est. Water Loss</span>
                <p className="font-black text-rose-600">{activeIncident.estimatedExcessWater} L</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500 text-[11px]">{activeIncident.pipeline}</span>
              <div className="flex items-center gap-2">
                {!isResolved && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      resolveActiveIncident();
                    }}
                    className="rounded bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
                  >
                    Mark Resolved
                  </button>
                )}
                <span className="text-cyan-700 font-bold inline-flex items-center gap-0.5">
                  Analyze <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* SECONDARY ALERT OR COMPLEMENTARY LEAK */}
          {secondaryAlert ? (
            <div
              onClick={() => setSelectedIncidentKey('secondary')}
              className={`cursor-pointer rounded-xl border p-5 transition-all shadow-xs ${
                selectedIncidentKey === 'secondary'
                  ? 'border-amber-400 ring-2 ring-amber-500/20 bg-white'
                  : 'border-amber-200 bg-amber-50/20 hover:bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 uppercase">
                      {secondaryAlert.severity}
                    </span>
                    <h4 className="text-base font-black text-slate-900">
                      {secondaryAlert.location}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Detected: {secondaryAlert.detectedAt} · Sensor {secondaryAlert.sensorId}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Confidence</span>
                  <span className="text-lg font-black text-amber-600">{secondaryAlert.leakConfidence}%</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 rounded-lg p-2.5 border border-slate-200/70">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Expected</span>
                  <p className="font-bold text-slate-800">{secondaryAlert.expectedFlow} L/min</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Current</span>
                  <p className="font-black text-amber-600">{secondaryAlert.currentFlow} L/min</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Excess</span>
                  <p className="font-black text-amber-600">+{secondaryAlert.percentageAboveBaseline}%</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Est. Water Loss</span>
                  <p className="font-black text-amber-600">{secondaryAlert.estimatedWaterLost} L</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500 text-[11px]">{secondaryAlert.description}</span>
                <span className="text-cyan-700 font-bold inline-flex items-center gap-0.5">
                  Analyze <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 flex flex-col items-center justify-center text-center text-xs text-slate-500">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mb-2" />
              <p className="font-bold text-slate-700">Sub-manifold lines nominal</p>
              <p className="text-slate-400 mt-1">No secondary line anomalies detected in {currentProperty.name}.</p>
            </div>
          )}
        </div>
      </div>

      {/* LEAK ANALYSIS DEEP DIVE SECTION */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Detailed Leak Telemetry Analysis · {selectedIncidentKey === 'primary' ? activeIncident.location : secondaryAlert?.location || activeIncident.location}
              </h3>
              <RiskBadge level={selectedIncidentKey === 'primary' ? (isResolved ? 'Normal' : activeIncident.riskLevel) : 'Warning'} />
            </div>
            <p className="text-xs text-slate-500">
              Expected baseline vs actual continuous flow telemetry for {currentProperty.name}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-600" />
              <span className="font-semibold text-slate-700">Actual Flow</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-5 border-t-2 border-dashed border-slate-400" />
              <span className="text-slate-500">Expected Baseline</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-600 font-bold">
              <span className="h-2.5 w-2.5 rounded-sm bg-rose-200 border border-rose-400" />
              <span>Abnormal Leak Window</span>
            </div>
          </div>
        </div>

        {/* High-Resolution Anomaly Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={leakTimelineData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="leakTimelineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}L/m`} />
              <Tooltip
                formatter={(val: any) => [`${val} L/min`, '']}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />

              {/* Reference abnormal area */}
              <ReferenceArea
                x1="02:15 AM"
                x2="04:40 AM"
                stroke="#f43f5e"
                strokeOpacity={0.3}
                fill="#f43f5e"
                fillOpacity={0.12}
                label={{
                  value: 'Continuous Nocturnal Anomaly Window',
                  position: 'insideTop',
                  fill: '#e11d48',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />

              <Area
                type="monotone"
                dataKey="baseline"
                name="Normal Baseline"
                stroke="#94a3b8"
                strokeDasharray="4 4"
                strokeWidth={2}
                fill="transparent"
              />
              <Area
                type="monotone"
                dataKey="actual"
                name="Actual Flow"
                stroke="#e11d48"
                strokeWidth={2.5}
                fill="url(#leakTimelineGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Telemetry Node: <strong>{activeIncident.sensorId}</strong> · Pipeline: <strong>{activeIncident.pipeline}</strong>
          </span>
          <span className="font-semibold text-rose-600">Continuous {activeIncident.durationMinutes} minutes without drop</span>
        </div>
      </div>

      {/* AI ANALYSIS CARD */}
      <div className="rounded-xl border border-cyan-200 bg-linear-to-r from-sky-50/80 via-white to-sky-50/40 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">AquaGuard AI Analysis</h3>
            <p className="text-xs text-slate-500">Algorithmic pattern evaluation for {currentProperty.name}</p>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 border border-slate-200 shadow-2xs space-y-3 text-xs text-slate-700 leading-relaxed">
          <div className="space-y-1.5">
            {activeIncident.findings?.map((finding, idx) => (
              <p key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>{finding}</span>
              </p>
            )) || (
              <p>Continuous flow telemetry exceeds normal baseline threshold without periodic drops.</p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <strong className="text-slate-900 block mb-1">Recommended Action Protocol:</strong>
            <ul className="space-y-1 text-slate-600">
              {activeIncident.recommendedActions?.map((act, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="font-bold text-cyan-700">{idx + 1}.</span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-3 rounded-lg bg-amber-50/70 border border-amber-200/80 p-3 text-amber-900 text-[11px] flex items-start gap-2">
          <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
          <span>
            <strong>Disclaimer:</strong> Risk score is an analytical estimate and should be verified by physical inspection.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-cyan-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setSelectedSensor(targetSensor)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs inline-flex items-center gap-1.5"
          >
            <Radio className="h-3.5 w-3.5 text-cyan-600" />
            <span>View Sensor</span>
          </button>

          {!isResolved && (
            <button
              type="button"
              onClick={resolveActiveIncident}
              className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 active:scale-98 transition-all shadow-xs inline-flex items-center gap-1.5"
            >
              <Check className="h-4 w-4" />
              <span>Mark as Resolved</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
