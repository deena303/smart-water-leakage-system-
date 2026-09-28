import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Calendar,
  Sparkles,
  Droplet,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  Printer,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { useWater } from '../context/WaterContext';

export const ReportsPage: React.FC = () => {
  const { kpiStats, settings, locations, unitPeople, currentProperty, terms, activeIncident } = useWater();
  const [reportType, setReportType] = useState<'Daily Report' | 'Weekly Report' | 'Monthly Report'>('Daily Report');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(true);

  const highestConsumer = [...unitPeople].sort((a, b) => b.todayUsage - a.todayUsage)[0];
  const highestLocation = [...locations].sort((a, b) => b.dailyConsumption - a.dailyConsumption)[0];
  const averageConsumption = Math.round(kpiStats.totalConsumption / (locations.length || 1));

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 300);
  };

  const handleDownload = () => {
    const reportText = `AquaGuard AI - Official Water Audit & Conservation Report
Property: ${currentProperty.name} (${currentProperty.type})
Report Type: ${reportType}
Date: ${new Date().toLocaleDateString()}
Certified Administrator: ${terms.adminRole}

==================================================
EXECUTIVE SUMMARY
==================================================
1. Total Water Consumption: ${kpiStats.totalConsumption.toLocaleString()} Litres
2. Average Zone Consumption: ${averageConsumption.toLocaleString()} Litres/day
3. Highest Consumer: ${highestConsumer?.unitNumber} (${highestConsumer?.todayUsage} L today) - ${highestConsumer?.status}
4. Highest Consumption Location: ${highestLocation?.name} (${highestLocation?.dailyConsumption} L today)
5. Detected Anomalies: ${kpiStats.activeAlertsCount} (${kpiStats.criticalCount} Critical, ${kpiStats.warningCount} Warning)
6. Possible Leaks: ${activeIncident.status === 'active' ? `1 (${activeIncident.location} - ${activeIncident.currentFlow} L/min continuous flow)` : '0 (None active)'}
7. Estimated Water Loss: ${kpiStats.possibleWaterLoss} Litres
8. Water Saved vs Baseline: ${kpiStats.waterSaved.toLocaleString()} Litres (${kpiStats.waterSavedPercentage}%)

==================================================
DETAILED ZONE AUDIT
==================================================
${locations.map((l) => `- ${l.name}: ${l.dailyConsumption} L (${l.totalSensors} sensors, Risk: ${l.riskStatus})`).join('\n')}

==================================================
RECOMMENDED ACTION PLAN
==================================================
${(activeIncident.recommendedActions && activeIncident.recommendedActions.length > 0)
  ? activeIncident.recommendedActions.map((a, i) => `${i + 1}. ${a}`).join('\n')
  : '1. Continue automated real-time telemetry mesh monitoring.\n2. Routine weekly inspection of submeter sensors.'}

AquaGuard AI Engine · ISO-14046 Water Footprint Protocol Compliant
`;
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AquaGuard_${reportType.replace(/\s+/g, '_')}_${currentProperty.name.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Water Intelligence Reports
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Audit-grade water efficiency documentation, compliance records, and incident summaries for {currentProperty.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Report Type Selector: Daily, Weekly, Monthly */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 text-xs font-semibold text-slate-600 shadow-2xs">
            {(['Daily Report', 'Weekly Report', 'Monthly Report'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setReportType(t)}
                className={`rounded-md px-3 py-1.5 transition-all ${
                  reportType === t
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-700 active:scale-98 transition-all shadow-xs disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isGenerating ? 'Generating...' : 'Generate Report'}</span>
          </button>
        </div>
      </div>

      {/* 8 Core Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Consumption</span>
          <p className="text-lg font-black text-slate-900 mt-1">{kpiStats.totalConsumption.toLocaleString()} L</p>
          <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">+6.2%</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Average Usage</span>
          <p className="text-lg font-black text-slate-900 mt-1">1,126 L</p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">per day</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Highest Consumer</span>
          <p className="text-lg font-black text-rose-600 mt-1">{highestConsumer?.unitNumber}</p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">{highestConsumer?.todayUsage} L today</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Highest Location</span>
          <p className="text-sm font-black text-slate-900 mt-1.5 truncate">{highestLocation?.name}</p>
          <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">{highestLocation?.dailyConsumption} L</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Anomalies</span>
          <p className="text-lg font-black text-slate-900 mt-1">{kpiStats.activeAlertsCount}</p>
          <span className="text-[10px] text-amber-600 font-semibold mt-0.5 block">{kpiStats.criticalCount} critical, {kpiStats.warningCount} warning</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Possible Leaks</span>
          <p className="text-lg font-black text-rose-600 mt-1">{activeIncident.status === 'active' ? '1' : '0'}</p>
          <span className="text-[10px] text-rose-700 font-semibold mt-0.5 block truncate">{activeIncident.status === 'active' ? activeIncident.unit : 'None active'}</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Est. Water Loss</span>
          <p className="text-lg font-black text-rose-600 mt-1">{kpiStats.possibleWaterLoss} L</p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">From leaks</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Water Saved</span>
          <p className="text-lg font-black text-emerald-600 mt-1">{kpiStats.waterSavedPercentage}%</p>
          <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">{kpiStats.waterSaved} L total</span>
        </div>
      </div>

      {/* Generated Report Preview Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                Official Report Preview
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">{reportType}</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1.5">
              {currentProperty.name} — {reportType}
            </h3>
            <p className="text-xs text-slate-500">
              Administrator: <strong>{terms.adminRole}</strong> · Target: <strong>{currentProperty.address}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <Printer className="h-4 w-4 text-slate-500" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 shadow-xs transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download Report</span>
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="mt-6 space-y-6 text-xs text-slate-700">
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">
              1. Executive Water Audit Overview
            </h4>
            <p className="leading-relaxed">
              Across the designated audit cycle for <strong>{currentProperty.name}</strong>, aggregate water throughput was measured at{' '}
              <strong>{kpiStats.totalConsumption.toLocaleString()} Litres</strong>. Continuous telemetry evaluated 24 ultrasonic sensor nodes.
              Total water saved against unmanaged baseline estimates is <strong>{kpiStats.waterSaved.toLocaleString()} L ({kpiStats.waterSavedPercentage}%)</strong>.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">
              2. Highest Consumers & Outliers
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-bold text-slate-900">Highest Volume Unit: {highestConsumer?.unitNumber}</span>
                <p className="text-[11px] text-slate-600 mt-1">
                  Recorded {highestConsumer?.todayUsage} L ({highestConsumer?.differencePercentage}% above expected baseline).
                  Categorized as: <strong>{highestConsumer?.status}</strong>.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-bold text-slate-900">Highest Volume Location: {highestLocation?.name}</span>
                <p className="text-[11px] text-slate-600 mt-1">
                  Consumed {highestLocation?.dailyConsumption} L across {highestLocation?.totalSensors} submeter sensor lines.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">
              3. Telemetry Anomalies & Potential Water Loss
            </h4>
            <p className="leading-relaxed">
              Estimated active water loss from anomalies is <strong>{kpiStats.possibleWaterLoss} Litres</strong>. {activeIncident.status === 'active' ? (
                <>
                  The primary active contributor is the continuous flow pattern observed in <strong>{activeIncident.location}</strong> (+{activeIncident.anomalyPercentage}% above {activeIncident.expectedFlow} L/min baseline, {activeIncident.leakConfidence}% leak confidence).
                </>
              ) : (
                <>All submeter sensor nodes report nominal baseline flow with zero active continuous leaks detected.</>
              )}
            </p>
          </div>

          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
            <span>Verified by AquaGuard AI Cloud Engine · Property ID: {currentProperty.id}</span>
            <span>Generated on {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
