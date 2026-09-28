import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Battery,
  Sliders,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useWater } from '../../context/WaterContext';
import { useNavigate } from 'react-router-dom';

export const ActivityTimeline: React.FC = () => {
  const { activities } = useWater();
  const navigate = useNavigate();

  const getIcon = (type: string, severity?: string) => {
    switch (type) {
      case 'alert':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
            <AlertTriangle className="h-4 w-4" />
          </div>
        );
      case 'resolution':
      case 'normal':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        );
      case 'battery':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
            <Battery className="h-4 w-4" />
          </div>
        );
      case 'system':
      default:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
            <TrendingDown className="h-4 w-4" />
          </div>
        );
    }
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
          <p className="text-xs text-slate-500">Live operational events & anomaly logs</p>
        </div>
        <button
          onClick={() => navigate('/alerts')}
          className="text-xs font-semibold text-cyan-600 hover:text-cyan-800 inline-flex items-center gap-1"
        >
          <span>Alerts Hub</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-4 divide-y divide-slate-100">
        {activities.slice(0, 5).map((activity) => (
          <div key={activity.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
            <div className="shrink-0">{getIcon(activity.type, activity.severity)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 leading-tight truncate">
                {activity.title}
              </p>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">{activity.location}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-400" />
                  {activity.timeAgo}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
