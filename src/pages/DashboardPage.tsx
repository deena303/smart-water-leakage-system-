import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Droplet,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Clock,
  Sparkles,
  Waves,
  Eye,
  Building2,
  ChevronRight,
  Info
} from 'lucide-react';
import { useWater } from '../context/WaterContext';
import { KpiCard } from '../components/common/KpiCard';
import { DateRangeSelector } from '../components/common/DateRangeSelector';
import { DemoControls } from '../components/common/DemoControls';
import { MainConsumptionChart } from '../components/dashboard/MainConsumptionChart';
import { ActivityTimeline } from '../components/dashboard/ActivityTimeline';
import { ConsumptionStatusBadge, RiskBadge } from '../components/common/RiskBadge';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    kpiStats,
    activeTimeRange,
    setActiveTimeRange,
    activeIncident,
    unitPeople,
    setSelectedUnit,
    terms,
    currentProperty,
    decisionSection,
    alerts
  } = useWater();

  const isLeakActive = activeIncident.status === 'active';

  // Ranked highest consumers for current property
  const rankedConsumers = [...unitPeople].sort((a, b) => b.todayUsage - a.todayUsage).slice(0, 6);

  // Dynamic units with anomalies (Pattern deviations - NOT structural leaks!)
  const anomalyConsumers = unitPeople.filter((u) => u.status === 'Anomaly');
  const displayUnusual = anomalyConsumers.length > 0
    ? anomalyConsumers.slice(0, 3)
    : unitPeople.filter((u) => u.status !== 'Possible Leak').sort((a, b) => b.differencePercentage - a.differencePercentage).slice(0, 3);

  const highestUnit =
    unitPeople.find((u) => u.id === decisionSection.highestConsumer.unitId) ||
    unitPeople.find((u) => u.status === 'High Consumption') ||
    rankedConsumers[0];

  const anomalyUnit =
    unitPeople.find((u) => u.id === decisionSection.unusualConsumption.unitId) ||
    displayUnusual[0] ||
    rankedConsumers[1];

  const activePossibleLeaks = alerts.filter(
    (a) => a.status === 'active' && (a.severity === 'critical' || a.title.toLowerCase().includes('leak') || (a.leakConfidence ?? 0) > 50)
  );

  return (
    <div className="space-y-6">
      {/* Header & Date Range */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Good morning, Admin
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Here's your water intelligence overview for <strong className="text-slate-800">{currentProperty.name}</strong> ({terms.adminRole}).
          </p>
        </div>

        <DateRangeSelector
          activeRange={activeTimeRange}
          onChange={setActiveTimeRange}
        />
      </div>

      {/* Demo Controls Panel (Essential for Competition Presentation) */}
      <DemoControls />

      {/* TOP 4 KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: TOTAL CONSUMPTION */}
        <KpiCard
          title="Total Water Consumption"
          value={kpiStats.totalConsumption.toLocaleString()}
          unit="L"
          icon={Droplet}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          change={{
            value: `+${kpiStats.todayVsYesterday}%`,
            isPositiveGood: false,
            type: 'increase',
            label: 'vs yesterday',
          }}
        />

        {/* KPI 2: WATER SAVED */}
        <KpiCard
          title="Water Saved"
          value={`${kpiStats.waterSaved.toLocaleString()} L`}
          icon={ShieldCheck}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          change={{
            value: `${kpiStats.waterSavedPercentage}%`,
            isPositiveGood: true,
            type: 'increase',
            label: 'improvement vs baseline',
          }}
        />

        {/* KPI 3: ACTIVE ALERTS */}
        <KpiCard
          title="Active Alerts"
          value={kpiStats.activeAlertsCount}
          icon={AlertCircle}
          iconColor={kpiStats.criticalCount > 0 ? 'text-rose-600' : 'text-amber-600'}
          iconBg={kpiStats.criticalCount > 0 ? 'bg-rose-50' : 'bg-amber-50'}
          subtitle={
            <span className="font-semibold text-rose-700">
              {kpiStats.criticalCount} Critical · {kpiStats.warningCount} Warning
            </span>
          }
          highlight={kpiStats.criticalCount > 0}
        />

        {/* KPI 4: POSSIBLE WATER LOSS */}
        <KpiCard
          title="Possible Water Loss"
          value={kpiStats.possibleWaterLoss}
          unit="L"
          icon={Waves}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
          subtitle={
            <span className="text-slate-500 font-medium">
              Estimated from active anomalies
            </span>
          }
          highlight={kpiStats.possibleWaterLoss > 0}
        />
      </div>

      {/* MAIN DECISION SECTION: "Water Intelligence" */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Water Intelligence</h3>
            <p className="text-xs text-slate-500">Here are the areas that need your attention.</p>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:block">
            Priority Action Matrix · {currentProperty.name}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* CARD 1: HIGHEST CONSUMER */}
          <div className="rounded-xl border border-sky-200 bg-linear-to-b from-sky-50/70 to-white p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-sky-100">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
                  Highest Consumer
                </span>
                <span className="rounded bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5">
                  High Usage
                </span>
              </div>
              <div className="mt-3">
                <h4 className="text-xl font-black text-slate-900">
                  {decisionSection.highestConsumer.name}
                </h4>
                <p className="text-xs text-slate-500">{decisionSection.highestConsumer.subtitle}</p>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-slate-900">
                    {decisionSection.highestConsumer.litres}
                  </span>
                  <span className="text-xs font-bold text-sky-700">today</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-sky-900">
                  {decisionSection.highestConsumer.comparison}
                </p>
                <p className="mt-2 text-[11px] text-slate-600 leading-relaxed">
                  {decisionSection.highestConsumer.desc}
                </p>
              </div>
            </div>

            {highestUnit && (
              <button
                type="button"
                onClick={() => setSelectedUnit(highestUnit)}
                className="mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-sky-300 bg-white py-2 text-xs font-bold text-sky-800 hover:bg-sky-50 transition-colors shadow-2xs"
              >
                <span>View Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* CARD 2: UNUSUAL CONSUMPTION */}
          <div className="rounded-xl border border-amber-200 bg-linear-to-b from-amber-50/70 to-white p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-amber-100">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Unusual Consumption
                </span>
                <span className="rounded bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5">
                  Anomaly Detected
                </span>
              </div>
              <div className="mt-3">
                <h4 className="text-xl font-black text-slate-900">
                  {decisionSection.unusualConsumption.name}
                </h4>
                <p className="text-xs text-slate-500">{decisionSection.unusualConsumption.subtitle}</p>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-slate-900">
                    {decisionSection.unusualConsumption.litres}
                  </span>
                  <span className="text-xs font-bold text-amber-700">measured draw</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-amber-800">
                  {decisionSection.unusualConsumption.comparison}
                </p>
                <p className="mt-2 text-[11px] text-slate-600 leading-relaxed">
                  {decisionSection.unusualConsumption.desc}
                </p>
              </div>
            </div>

            {anomalyUnit && (
              <button
                type="button"
                onClick={() => setSelectedUnit(anomalyUnit)}
                className="mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-300 bg-white py-2 text-xs font-bold text-amber-900 hover:bg-amber-50 transition-colors shadow-2xs"
              >
                <span>Investigate Anomaly</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* CARD 3: POSSIBLE LEAK */}
          <div className="rounded-xl border border-rose-200 bg-linear-to-b from-rose-50/70 to-white p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                  Possible Leak
                </span>
                <span className="rounded bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 animate-pulse">
                  High Confidence
                </span>
              </div>
              <div className="mt-3">
                <h4 className="text-xl font-black text-slate-900">
                  {isLeakActive ? activeIncident.location : decisionSection.possibleLeak.name}
                </h4>
                <p className="text-xs text-slate-500">{decisionSection.possibleLeak.subtitle}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded bg-rose-50 p-2 border border-rose-100">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Confidence</span>
                    <span className="text-lg font-black text-rose-600">
                      {isLeakActive ? activeIncident.leakConfidence : decisionSection.possibleLeak.confidence}%
                    </span>
                  </div>
                  <div className="rounded bg-rose-50 p-2 border border-rose-100">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Estimated Loss</span>
                    <span className="text-lg font-black text-rose-600">
                      {isLeakActive ? `${activeIncident.estimatedExcessWater} L` : decisionSection.possibleLeak.excessLost}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-slate-600 leading-relaxed">
                  {decisionSection.possibleLeak.desc}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/leak-detection')}
              className="mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-rose-600 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-xs"
            >
              <span>Investigate Leak</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* HIGHEST WATER CONSUMERS RANKED TABLE */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Highest Water Consumers</h3>
            <p className="text-xs text-slate-500">
              {terms.unitPlural} with the highest water usage today across {currentProperty.name}.
            </p>
          </div>
          <button
            onClick={() => navigate('/people-units')}
            className="text-xs font-bold text-cyan-600 hover:text-cyan-800 self-start sm:self-auto inline-flex items-center gap-1"
          >
            <span>View All {terms.unitPlural}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">{terms.personLabel} / {terms.unitLabel}</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Consumption</th>
                <th className="py-2.5 px-3">Compared with Average</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rankedConsumers.map((item, index) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedUnit(item)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold ${
                      index === 0 ? 'bg-rose-100 text-rose-800' : index === 1 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-extrabold text-slate-900 block">{item.unitNumber}</span>
                    <span className="text-[11px] text-slate-400">{item.name}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {item.locationName}
                  </td>
                  <td className="py-3 px-3 font-black text-slate-900">
                    {item.todayUsage} L
                  </td>
                  <td className="py-3 px-3">
                    <span className={`font-bold ${item.differencePercentage > 20 ? 'text-rose-600' : item.differencePercentage > 0 ? 'text-amber-600' : 'text-emerald-700'}`}>
                      {item.differencePercentage > 0 ? `+${item.differencePercentage}%` : `${item.differencePercentage}%`}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <ConsumptionStatusBadge status={item.status} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUnit(item);
                      }}
                      className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-cyan-700 hover:bg-slate-50 transition-colors shadow-2xs"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UNUSUAL CONSUMPTION SECTION */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Unusual Consumption</h3>
              <span className="rounded bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 border border-amber-200">
                Pattern Deviations
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Users or areas whose usage differs significantly from their historical baseline.
            </p>
          </div>
          <div className="text-[11px] text-slate-400 italic">
            * High consumption is distinguished from leaks
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayUnusual.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedUnit(item)}
              className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:border-cyan-300 hover:bg-white hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.unitNumber}</h4>
                  <p className="text-[11px] text-slate-500">{item.locationName}</p>
                </div>
                <ConsumptionStatusBadge status={item.status} />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-y border-slate-200/70 py-2.5">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Normal Baseline</span>
                  <p className="font-bold text-slate-800">{item.averageUsage} L/day</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Current Usage</span>
                  <p className="font-black text-rose-600">{item.todayUsage} L/day</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="font-extrabold text-rose-600">
                  {item.differencePercentage > 0 ? `+${item.differencePercentage}%` : `${item.differencePercentage}%`} deviation
                </span>
                <span className="text-cyan-700 font-semibold inline-flex items-center gap-0.5">
                  View Profile <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONSUMPTION TREND CHART */}
      <MainConsumptionChart />

      {/* TWO COLUMN GRID: POSSIBLE LEAKS + RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Possible Leaks (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-rose-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Possible Leaks</h3>
                <span className="rounded bg-rose-100 text-rose-800 px-2 py-0.5 text-[10px] font-bold animate-pulse">
                  Urgent Attention
                </span>
              </div>
              <p className="text-xs text-slate-500">Unusual or continuous flow patterns strongly indicating water loss.</p>
            </div>
            <button
              onClick={() => navigate('/leak-detection')}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
            >
              <span>Detection Lab</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3.5">
            {activePossibleLeaks.length === 0 ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 text-center text-xs text-emerald-800">
                <ShieldCheck className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
                <p className="font-bold">No active leaks detected in {currentProperty.name}</p>
                <p className="text-emerald-700 mt-0.5">All sensor lines operating within normal flow baselines.</p>
              </div>
            ) : (
              activePossibleLeaks.map((alt) => (
                <div
                  key={alt.id}
                  className={`rounded-xl border p-4 transition-all ${
                    alt.severity === 'critical' ? 'border-rose-200 bg-rose-50/40' : 'border-amber-200 bg-amber-50/30'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-extrabold text-white uppercase ${
                            alt.severity === 'critical' ? 'bg-rose-600' : 'bg-amber-600'
                          }`}
                        >
                          {alt.severity}
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-900">
                          {alt.location}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{alt.description}</p>
                    </div>
                    <span className="text-[11px] text-slate-500">Detected {alt.detectedAt}</span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white rounded-lg p-2.5 border border-slate-200/70">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Expected</span>
                      <p className="font-bold text-slate-800">{alt.expectedFlow} L/min</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Current</span>
                      <p className="font-black text-rose-600">{alt.currentFlow} L/min</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Anomaly</span>
                      <p className="font-black text-rose-600">+{alt.percentageAboveBaseline}%</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Confidence</span>
                      <p className="font-black text-rose-600">{alt.leakConfidence}%</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-600 font-medium">
                      Estimated excess: <strong>{alt.estimatedWaterLost} L</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate('/leak-detection')}
                      className={`rounded-lg px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs transition-colors ${
                        alt.severity === 'critical' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-600 hover:bg-amber-700'
                      }`}
                    >
                      Investigate Leak
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity (5 cols) */}
        <div className="lg:col-span-5">
          <ActivityTimeline />
        </div>
      </div>
    </div>
  );
};
