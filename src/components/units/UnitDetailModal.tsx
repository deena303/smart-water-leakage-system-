import React, { useState } from 'react';
import {
  X,
  Droplet,
  AlertTriangle,
  Clock,
  Sparkles,
  Calendar,
  Radio,
  MapPin,
  CheckCircle2,
  TrendingUp,
  Activity,
  User,
  ShieldAlert
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { ConsumptionStatusBadge, RiskBadge } from '../common/RiskBadge';
import { useWater } from '../../context/WaterContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export const UnitDetailModal: React.FC = () => {
  const { selectedUnit, setSelectedUnit, terms, sensors, alerts } = useWater();
  const [chartView, setChartView] = useState<'24h' | '7d'>('24h');

  if (!selectedUnit) return null;

  const unitSensor = sensors.find((s) => s.id === selectedUnit.sensorId || s.assignedUnit === selectedUnit.unitNumber);
  const unitAlerts = alerts.filter(
    (a) => a.personOrUnit === selectedUnit.unitNumber || a.location.includes(selectedUnit.unitNumber)
  );

  const isLeak = selectedUnit.status === 'Possible Leak';

  return (
    <Modal
      isOpen={!!selectedUnit}
      onClose={() => setSelectedUnit(null)}
      title={`${selectedUnit.unitNumber} (${selectedUnit.name})`}
      subtitle={`${selectedUnit.locationName} · ${terms.unitLabel} Telemetry Profile`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Top Summary Banner */}
        <div
          className={`rounded-xl border p-4.5 flex flex-wrap items-center justify-between gap-4 ${
            isLeak
              ? 'border-rose-200 bg-rose-50/40'
              : selectedUnit.status === 'Anomaly'
              ? 'border-amber-200 bg-amber-50/40'
              : 'border-slate-200 bg-slate-50/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-xs ${
                isLeak ? 'bg-rose-600' : selectedUnit.status === 'Anomaly' ? 'bg-amber-600' : 'bg-cyan-600'
              }`}
            >
              <Droplet className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-extrabold text-slate-900">{selectedUnit.unitNumber}</h4>
                <ConsumptionStatusBadge status={selectedUnit.status} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                <User className="h-3 w-3 text-slate-400" />
                <span>{selectedUnit.name}</span>
                <span>·</span>
                <MapPin className="h-3 w-3 text-slate-400" />
                <span>{selectedUnit.locationName}</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Today's Consumption</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {selectedUnit.todayUsage} <span className="text-sm font-semibold text-slate-500">L</span>
            </div>
            <span
              className={`text-xs font-bold ${
                selectedUnit.differencePercentage > 50
                  ? 'text-rose-600'
                  : selectedUnit.differencePercentage > 10
                  ? 'text-amber-700'
                  : 'text-emerald-700'
              }`}
            >
              {selectedUnit.differencePercentage > 0 ? `+${selectedUnit.differencePercentage}%` : `${selectedUnit.differencePercentage}%`} vs normal average ({selectedUnit.averageUsage} L)
            </span>
          </div>
        </div>

        {/* 4 Quick Stat Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <span className="text-[11px] font-medium text-slate-400">Normal Baseline</span>
            <p className="text-base font-extrabold text-slate-900 mt-0.5">{selectedUnit.averageUsage} L/day</p>
            <span className="text-[10px] text-slate-500">Rolling 14-day median</span>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <span className="text-[11px] font-medium text-slate-400">Current Flow Rate</span>
            <p className="text-base font-extrabold text-slate-900 mt-0.5">{selectedUnit.flowRate} L/min</p>
            <span className="text-[10px] text-slate-500">Baseline: {selectedUnit.baselineFlow} L/min</span>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <span className="text-[11px] font-medium text-slate-400">Property Ranking</span>
            <p className="text-base font-extrabold text-slate-900 mt-0.5">#{selectedUnit.rank} Highest</p>
            <span className="text-[10px] text-slate-500">Among 48 monitored units</span>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <span className="text-[11px] font-medium text-slate-400">Assigned Sensor</span>
            <p className="text-base font-extrabold text-slate-900 mt-0.5">{selectedUnit.sensorId}</p>
            <span className="text-[10px] text-emerald-700 font-medium">Ultrasonic node online</span>
          </div>
        </div>

        {/* Consumption History Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-4.5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Consumption History vs Normal Baseline
              </h5>
              <p className="text-[11px] text-slate-500">Compare actual consumption against trained personal baseline</p>
            </div>

            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-semibold">
              <button
                onClick={() => setChartView('24h')}
                className={`rounded px-2.5 py-1 transition-all ${
                  chartView === '24h' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                24 Hours
              </button>
              <button
                onClick={() => setChartView('7d')}
                className={`rounded px-2.5 py-1 transition-all ${
                  chartView === '7d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                7 Days
              </button>
            </div>
          </div>

          <div className="h-56 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === '24h' ? (
                <AreaChart data={selectedUnit.hourlyHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="unitHistGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isLeak ? '#e11d48' : '#0284c7'} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={isLeak ? '#e11d48' : '#0284c7'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}L`} />
                  <Tooltip
                    formatter={(val: any) => [`${val} Litres`, '']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="top" height={30} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                  <Area
                    type="monotone"
                    dataKey="baseline"
                    name="Expected Baseline"
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    fill="transparent"
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    name="Actual Consumption"
                    stroke={isLeak ? '#e11d48' : '#0284c7'}
                    strokeWidth={2.5}
                    fill="url(#unitHistGrad)"
                  />
                </AreaChart>
              ) : (
                <BarChart data={selectedUnit.weeklyHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}L`} />
                  <Tooltip
                    formatter={(val: any) => [`${val} Litres`, '']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="top" height={30} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="baseline" name="Daily Target" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" name="Daily Actual" fill={isLeak ? '#f43f5e' : '#0284c7'} radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Analysis & Recommendation Box */}
        <div className="rounded-xl border border-cyan-200 bg-sky-50/50 p-4.5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-cyan-700" />
            <h5 className="text-xs font-bold uppercase tracking-wider text-cyan-950">
              AquaGuard Analytical Evaluation
            </h5>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {selectedUnit.aiAnalysis}
          </p>
          <div className="mt-3 pt-3 border-t border-cyan-100 flex items-start gap-2 text-xs">
            <strong className="text-cyan-900 font-bold shrink-0">Recommendation:</strong>
            <span className="text-slate-700">{selectedUnit.recommendation}</span>
          </div>
        </div>

        {/* Unit Alerts */}
        {unitAlerts.length > 0 && (
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              Active Alerts for this Unit
            </h5>
            <div className="space-y-2">
              {unitAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className="flex items-center justify-between rounded-lg border border-rose-200 bg-rose-50/30 p-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-rose-600" />
                    <div>
                      <span className="font-bold text-slate-900">{alt.title}</span>
                      <p className="text-[11px] text-slate-600">{alt.description}</p>
                    </div>
                  </div>
                  <span className="text-rose-700 font-extrabold text-xs">+{alt.percentageAboveBaseline}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
