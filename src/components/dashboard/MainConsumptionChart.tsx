import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceArea,
} from 'recharts';
import { useWater } from '../../context/WaterContext';
import { AlertCircle } from 'lucide-react';

interface MainConsumptionChartProps {
  allowRangeToggle?: boolean;
}

export const MainConsumptionChart: React.FC<MainConsumptionChartProps> = ({
  allowRangeToggle = true,
}) => {
  const { chartRange, setChartRange, chartData, activeIncident } = useWater();

  const isLeakActive = activeIncident.status === 'active';

  // Custom clean tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const actual = payload.find((p: any) => p.dataKey === 'actualConsumption')?.value || 0;
      const baseline = payload.find((p: any) => p.dataKey === 'baselineConsumption')?.value || 0;
      const isAnomalyPoint = actual > baseline * 1.35;
      const delta = actual - baseline;

      return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 text-white shadow-xl backdrop-blur-md text-xs">
          <p className="font-bold text-slate-300 mb-1.5 flex items-center justify-between gap-4">
            <span>Time: {label}</span>
            {isAnomalyPoint && (
              <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.5 rounded font-semibold">
                Anomaly Detected
              </span>
            )}
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                Actual Usage:
              </span>
              <span className="font-extrabold">{actual} L</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2 w-2 rounded-full bg-slate-500" />
                Baseline Target:
              </span>
              <span className="font-medium text-slate-300">{baseline} L</span>
            </div>
            {delta !== 0 && (
              <div className="pt-1 mt-1 border-t border-slate-800 flex items-center justify-between gap-6">
                <span className="text-slate-400">Variance:</span>
                <span className={`font-bold ${delta > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {delta > 0 ? `+${delta} L` : `${delta} L`}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Water Consumption</h3>
            {isLeakActive && chartRange === '24H' && (
              <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-200">
                <AlertCircle className="h-3 w-3" />
                Abnormal flow spike flagged
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">Actual usage compared with your normal baseline.</p>
        </div>

        {/* Range Controls */}
        {allowRangeToggle && (
          <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-semibold text-slate-600">
            {(['24H', '7D', '30D'] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setChartRange(range)}
                className={`rounded-md px-3 py-1 transition-all ${
                  chartRange === range
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="actualFlowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="timeLabel"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tickFormatter={(v) => `${v}L`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Abnormal zone highlight for 24H */}
            {chartRange === '24H' && isLeakActive && (
              <ReferenceArea
                x1="2:30 AM"
                x2="4:30 AM"
                strokeOpacity={0.3}
                fill="#f43f5e"
                fillOpacity={0.12}
                label={{
                  value: 'Abnormal Surge: 02:15 AM - 04:40 AM',
                  position: 'insideTop',
                  fill: '#e11d48',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
            )}

            {/* Baseline reference line */}
            <Area
              type="monotone"
              dataKey="baselineConsumption"
              name="Expected Baseline"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="transparent"
            />

            {/* Actual usage line */}
            <Area
              type="monotone"
              dataKey="actualConsumption"
              name="Actual Consumption"
              stroke="#0284c7"
              strokeWidth={2.5}
              fill="url(#actualFlowGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Summary Info */}
      <div className="mt-4 flex flex-wrap items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-600" />
            <span className="font-medium text-slate-700">Actual Flow</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-5 border-t-2 border-dashed border-slate-400" />
            <span>Normal Baseline</span>
          </div>
          {chartRange === '24H' && isLeakActive && (
            <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
              <span className="h-2.5 w-2.5 rounded-sm bg-rose-200 border border-rose-400" />
              <span>Anomaly Window</span>
            </div>
          )}
        </div>

        <div className="text-slate-500">
          Peak variance: <span className="font-semibold text-slate-800">+55 L/hr</span> at 04:00 AM
        </div>
      </div>
    </div>
  );
};
