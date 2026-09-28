import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  change?: {
    value: string;
    isPositiveGood?: boolean;
    type: 'increase' | 'decrease' | 'neutral';
    label: string;
  };
  subtitle?: React.ReactNode;
  highlight?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  iconColor = 'text-cyan-600',
  iconBg = 'bg-cyan-50',
  change,
  subtitle,
  highlight = false,
}) => {
  const getTrendIcon = () => {
    if (!change) return null;
    if (change.type === 'increase') return <TrendingUp className="h-3.5 w-3.5" />;
    if (change.type === 'decrease') return <TrendingDown className="h-3.5 w-3.5" />;
    return <Minus className="h-3.5 w-3.5" />;
  };

  const getTrendColor = () => {
    if (!change) return 'text-slate-500';
    if (change.type === 'neutral') return 'text-slate-500';

    // In water monitoring, usually decrease in waste or usage is good, increase can be bad
    if (change.isPositiveGood) {
      return change.type === 'increase' ? 'text-emerald-700' : 'text-rose-600';
    } else {
      return change.type === 'increase' ? 'text-rose-600' : 'text-emerald-700';
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-5 transition-all duration-200 hover:shadow-md ${
        highlight
          ? 'border-rose-300 bg-rose-50/20'
          : 'border-slate-200/80 bg-white shadow-xs'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              {value}
            </span>
            {unit && <span className="text-sm font-medium text-slate-500">{unit}</span>}
          </div>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-100 ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-1.5 pt-1 text-xs">
        {change && (
          <div className={`flex items-center gap-1 font-semibold ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{change.value}</span>
          </div>
        )}
        {change && <span className="text-slate-400">·</span>}
        {change && <span className="text-slate-500">{change.label}</span>}
        {subtitle && !change && <div className="text-slate-500">{subtitle}</div>}
      </div>
    </div>
  );
};
