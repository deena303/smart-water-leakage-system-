import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { locationBreakdown } from '../../data/mockData';

export const LocationUsageCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Water Usage by Location</h3>
          <p className="text-xs text-slate-500">Distribution across facility submeters</p>
        </div>
        <button
          onClick={() => navigate('/locations')}
          className="text-xs font-semibold text-cyan-600 hover:text-cyan-800 inline-flex items-center gap-1"
        >
          <span>All Zones</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Donut Chart */}
        <div className="md:col-span-5 h-44 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={locationBreakdown}
                dataKey="litres"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={68}
                paddingAngle={3}
              >
                {locationBreakdown.map((entry: { color: string }, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`${value} L`, 'Usage']}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs font-medium text-slate-400">Total</span>
            <span className="text-sm font-extrabold text-slate-900">8,420 L</span>
          </div>
        </div>

        {/* Location List with Bars & Stats */}
        <div className="md:col-span-7 space-y-3.5">
          {locationBreakdown.map((item: { name: string; litres: number; percentage: number; trend: number; color: string }) => (
            <div key={item.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-semibold text-slate-800">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">{item.litres} L</span>
                  <span className="text-slate-400 text-[11px] font-medium">({item.percentage}%)</span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
                      item.trend > 0 ? 'text-rose-600' : 'text-emerald-700'
                    }`}
                  >
                    {item.trend > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {item.trend > 0 ? `+${item.trend}%` : `${item.trend}%`}
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
