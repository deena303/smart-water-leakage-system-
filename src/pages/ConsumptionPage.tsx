import React, { useState } from 'react';
import {
  Droplets,
  Clock,
  TrendingUp,
  MapPin,
  Sparkles,
  Layers,
  BarChart3,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Gauge,
  Waves,
  ShieldCheck
} from 'lucide-react';
import { useWater } from '../context/WaterContext';
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
  Legend,
  Cell
} from 'recharts';
import { ConsumptionStatusBadge } from '../components/common/RiskBadge';

export const ConsumptionPage: React.FC = () => {
  const {
    chartRange,
    setChartRange,
    chartData,
    kpiStats,
    unitPeople,
    locations,
    setSelectedUnit,
    terms,
    currentProperty
  } = useWater();

  const [activeFilter, setActiveFilter] = useState<'24H' | '7D' | '30D' | 'Custom'>('24H');

  const handleFilterClick = (filter: '24H' | '7D' | '30D' | 'Custom') => {
    setActiveFilter(filter);
    if (filter === '24H') setChartRange('24H');
    else if (filter === '7D') setChartRange('7D');
    else if (filter === '30D') setChartRange('30D');
  };

  const palette = ['#0284c7', '#e11d48', '#06b6d4', '#10b981', '#6366f1', '#f59e0b', '#8b5cf6'];
  const locationBarData = locations.map((loc, idx) => ({
    name: loc.name,
    consumption: loc.dailyConsumption,
    color: palette[idx % palette.length],
    trend: loc.trend,
    riskStatus: loc.riskStatus,
  }));

  const highestLocation = [...locations].sort((a, b) => b.dailyConsumption - a.dailyConsumption)[0] || locations[0];
  const averageDailyZone = Math.round(kpiStats.totalConsumption / (locations.length || 1));
  const peakFlowRate = Math.max(...locations.map((l) => l.currentFlowRate), 12.5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Consumption Analytics
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Understand how water is being used across {currentProperty.name}.
          </p>
        </div>

        {/* Filters */}
        <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 p-1 text-xs font-semibold text-slate-600">
          {(['24H', '7D', '30D', 'Custom'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`rounded-md px-3 py-1.5 transition-all ${
                activeFilter === filter
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 5 Analytics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Consumption
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900">
              {kpiStats.totalConsumption.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">L</span>
          </div>
          <p className="mt-1 text-[11px] text-rose-600 font-semibold">+6.2% vs yesterday</p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Average Per Zone
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900">{averageDailyZone.toLocaleString()}</span>
            <span className="text-xs text-slate-500 font-medium">L/day</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Across {locations.length} tracked zones</p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Peak Flow Rate
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-rose-600">{peakFlowRate.toFixed(1)}</span>
            <span className="text-xs text-slate-500 font-medium">L/min</span>
          </div>
          <p className="mt-1 text-[11px] text-rose-700 font-semibold">{highestLocation.name}</p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Water Saved
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-emerald-600">
              {kpiStats.waterSaved.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">L</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-700 font-semibold">12.4% improvement</p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Estimated Water Loss
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-rose-600">
              {kpiStats.possibleWaterLoss}
            </span>
            <span className="text-xs text-slate-500 font-medium">L</span>
          </div>
          <p className="mt-1 text-[11px] text-rose-600 font-medium">From active anomalies</p>
        </div>
      </div>

      {/* Main Interactive Time-Series Chart */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Actual vs Baseline Telemetry</h3>
            <p className="text-xs text-slate-500">
              Measured volume (Litres) against historical baseline curves
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-600" />
              <span className="font-semibold text-slate-700">Actual Flow</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-5 border-t-2 border-dashed border-slate-400" />
              <span className="text-slate-500">Normal Baseline</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="analyticsGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}L`} />
              <Tooltip
                formatter={(val: any) => [`${val} Litres`, '']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Area
                type="monotone"
                dataKey="baselineConsumption"
                name="Normal Baseline"
                stroke="#94a3b8"
                strokeDasharray="4 4"
                strokeWidth={2}
                fill="transparent"
              />
              <Area
                type="monotone"
                dataKey="actualConsumption"
                name="Actual Consumption"
                stroke="#0891b2"
                strokeWidth={2.5}
                fill="url(#analyticsGrad2)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Grid: Consumption by Location (clean bar chart) & Consumption by Person/Unit Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CONSUMPTION BY LOCATION (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Consumption by Location</h3>
                <p className="text-xs text-slate-500">Distribution across major facility sections</p>
              </div>
              <span className="text-xs font-bold text-slate-400">Total: {kpiStats.totalConsumption.toLocaleString()} L</span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationBarData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v}L`} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} width={85} />
                  <Tooltip
                    formatter={(val: any) => [`${val} Litres`, 'Consumption']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="consumption" radius={[0, 4, 4, 0]}>
                    {locationBarData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Highest draw: <strong>{highestLocation.name} ({highestLocation.dailyConsumption.toLocaleString()} L)</strong></span>
            <span className={`${highestLocation.trend > 0 ? 'text-rose-600' : 'text-emerald-700'} font-bold`}>
              {highestLocation.trend > 0 ? `+${highestLocation.trend}%` : `${highestLocation.trend}%`} vs target
            </span>
          </div>
        </div>

        {/* CONSUMPTION BY PERSON / UNIT (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Consumption by {terms.personLabel} / {terms.unitLabel}</h3>
              <p className="text-xs text-slate-500">Unit-level consumption vs personal averages</p>
            </div>
            <button
              onClick={() => setSelectedUnit(unitPeople[0])}
              className="text-xs font-bold text-cyan-600 hover:text-cyan-800"
            >
              Open Profile
            </button>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">{terms.personLabel} / {terms.unitLabel}</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Today</th>
                  <th className="py-2.5 px-3">Average</th>
                  <th className="py-2.5 px-3">Difference</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {unitPeople.slice(0, 5).map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => setSelectedUnit(u)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3">
                      <span className="font-extrabold text-slate-900 block">{u.name}</span>
                      <span className="text-[11px] text-slate-500">{u.unitNumber}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{u.locationName}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{u.todayUsage} L</td>
                    <td className="py-2.5 px-3 text-slate-500">{u.averageUsage} L</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`font-bold ${
                          u.differencePercentage > 50
                            ? 'text-rose-600'
                            : u.differencePercentage > 0
                            ? 'text-amber-700'
                            : 'text-emerald-700'
                        }`}
                      >
                        {u.differencePercentage > 0 ? `+${u.differencePercentage}%` : `${u.differencePercentage}%`}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <ConsumptionStatusBadge status={u.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
